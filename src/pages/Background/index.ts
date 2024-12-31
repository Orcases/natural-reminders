/// <reference types="chrome"/>

import { storageService } from '@natural/services/storage';
import { isRecurring, getNextOccurrence, type Reminder } from '@natural/types/reminder';
import { isBefore } from 'date-fns';

interface ChromeAlarm {
  name?: string;
  scheduledTime: number;
  periodInMinutes?: number;
}

interface ChromeTab {
  id?: number;
  url?: string;
}

// Handle alarm events
chrome.alarms.onAlarm.addListener(async (alarm: ChromeAlarm) => {
  if (!alarm.name) return;
  
  const reminderId = String(alarm.name);
  const reminder = await storageService.getReminder(reminderId);
  if (!reminder) return;

  // Create notification
  await chrome.notifications.create(`reminder-${reminder.id}`, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('src/assets/img/icon-34.png'),
    title: reminder.title,
    message: reminder.description || '',
    priority: 2,
    buttons: [
      { title: 'Complete' },
      { title: 'Snooze (5 min)' }
    ],
  });

  // Handle recurring reminders
  if (isRecurring(reminder)) {
    const nextDate = getNextOccurrence(reminder);
    if (nextDate) {
      // Schedule next occurrence
      chrome.alarms.create(reminder.id, {
        when: nextDate.getTime(),
      });

      // Update reminder with next date
      await storageService.updateReminder(reminder.id, {
        date: nextDate.toISOString().split('T')[0],
        time: nextDate.toTimeString().split(' ')[0],
      });
    }
  } else {
    // Mark non-recurring reminder as completed
    await storageService.updateReminder(reminder.id, {
      completed: true,
    });
  }
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener(async (notificationId: string, buttonIndex: number) => {
  const reminderId = notificationId.split('-')[1];
  if (!reminderId) return;

  const reminder = await storageService.getReminder(reminderId);
  if (!reminder) return;

  if (buttonIndex === 0) {
    // Complete
    await storageService.updateReminder(reminder.id, { completed: true });
  } else if (buttonIndex === 1) {
    // Snooze for 5 minutes
    const snoozeTime = new Date(Date.now() + 5 * 60 * 1000);
    await storageService.updateReminder(reminder.id, {
      date: snoozeTime.toISOString().split('T')[0],
      time: snoozeTime.toTimeString().split(' ')[0],
    });
    chrome.alarms.create(reminder.id, {
      when: snoozeTime.getTime(),
    });
  }

  chrome.notifications.clear(notificationId);
});

// Function to reschedule missed reminders
async function rescheduleMissedReminders() {
  const reminders = await storageService.getReminders();
  const now = new Date();

  for (const reminder of reminders) {
    if (reminder.completed) continue;

    const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
    if (isBefore(reminderDate, now)) {
      if (isRecurring(reminder)) {
        const nextDate = getNextOccurrence(reminder);
        if (nextDate) {
          await storageService.updateReminder(reminder.id, {
            date: nextDate.toISOString().split('T')[0],
            time: nextDate.toTimeString().split(' ')[0],
          });
          chrome.alarms.create(reminder.id, {
            when: nextDate.getTime(),
          });
        }
      } else {
        await storageService.updateReminder(reminder.id, { completed: true });
      }
    } else {
      chrome.alarms.create(reminder.id, {
        when: reminderDate.getTime(),
      });
    }
  }
}

// Reschedule missed reminders
rescheduleMissedReminders();

// Listen for chrome startup to reschedule reminders
chrome.runtime.onStartup.addListener(async () => {
  await rescheduleMissedReminders();
});

chrome.action.onClicked.addListener((tab: ChromeTab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_PANEL' });
  }
});
