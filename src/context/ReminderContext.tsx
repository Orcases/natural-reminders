import React from 'react';
import type { Reminder, NewReminder } from '@natural/types/reminder';
import { storageService } from '@natural/services/storage';

interface ReminderContextType {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  addReminder: (reminder: NewReminder) => Promise<void>;
  updateReminder: (id: string, update: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
}

const ReminderContext = React.createContext<ReminderContextType | null>(null);

export const useReminders = () => {
  const context = React.useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};

type ReminderProviderProps = {
  children: React.ReactNode;
};

export function ReminderProvider({ children }: ReminderProviderProps) {
  const [reminders, setReminders] = React.useState<Reminder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadReminders = async () => {
      try {
        const loadedReminders = await storageService.getReminders();
        setReminders(loadedReminders);
      } catch (err) {
        setError('Failed to load reminders');
        console.error('Error loading reminders:', err);
      } finally {
        setLoading(false);
      }
    };
    loadReminders();
  }, []);

  const addReminder = async (newReminder: NewReminder) => {
    try {
      const now = new Date();
      const reminder: Reminder = {
        ...newReminder,
        id: Date.now().toString(),
        created: now,
        lastModified: now
      };
      const updatedReminders = [...reminders, reminder];
      await storageService.saveReminders(updatedReminders);
      setReminders(updatedReminders);
    } catch (err) {
      setError('Failed to add reminder');
      console.error('Error adding reminder:', err);
    }
  };

  const updateReminder = async (id: string, update: Partial<Reminder>) => {
    try {
      const updatedReminders = reminders.map((reminder: Reminder) =>
        reminder.id === id
          ? { ...reminder, ...update, lastModified: new Date().toISOString() }
          : reminder
      );
      await storageService.saveReminders(updatedReminders);
      setReminders(updatedReminders);
    } catch (err) {
      setError('Failed to update reminder');
      console.error('Error updating reminder:', err);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const updatedReminders = reminders.filter((reminder: Reminder) => reminder.id !== id);
      await storageService.saveReminders(updatedReminders);
      setReminders(updatedReminders);
    } catch (err) {
      setError('Failed to delete reminder');
      console.error('Error deleting reminder:', err);
    }
  };

  const value = {
    reminders,
    loading,
    error,
    addReminder,
    updateReminder,
    deleteReminder
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
}
