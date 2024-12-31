import { z } from 'zod';

// Category Schema
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string(),
  description: z.string().optional(),
});

// Recurring Pattern Schema
export const RecurringSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number().min(1),
  endDate: z.string().nullable(),
  endAfterOccurrences: z.number().nullable(),
});

// Reminder Schema
export const ReminderSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string(), // ISO date string
  time: z.string(), // HH:mm:ss
  created: z.date().default(() => new Date()),
  lastModified: z.date().default(() => new Date()),
  completed: z.boolean().default(false),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  tags: z.array(z.string()).default([]),
  categoryId: z.string().nullable().default(null),
  recurring: RecurringSchema.nullable().default(null),
  notification: z.boolean().default(true),
});

// Types
export type Category = z.infer<typeof CategorySchema>;
export type NewCategory = Omit<Category, 'id'>;
export type RecurringConfig = z.infer<typeof RecurringSchema>;
export type Reminder = z.infer<typeof ReminderSchema>;
export type NewReminder = Omit<Reminder, 'id' | 'created' | 'lastModified'>;

// Helper type for updating a reminder
export type ReminderUpdate = Partial<Omit<Reminder, 'id' | 'created' | 'lastModified'>>;

// Helper functions
export const isRecurring = (reminder: Reminder): reminder is Reminder & { recurring: RecurringConfig } => {
  return reminder.recurring !== null;
};

export const getNextOccurrence = (reminder: Reminder): Date | null => {
  if (!reminder.recurring) return null;

  const date = new Date(`${reminder.date}T${reminder.time}`);
  const now = new Date();

  // If the reminder hasn't occurred yet, return its original date
  if (date > now) return date;

  const { type, interval } = reminder.recurring;

  switch (type) {
    case 'daily':
      date.setDate(date.getDate() + interval);
      break;
    case 'weekly':
      date.setDate(date.getDate() + interval * 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + interval);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + interval);
      break;
  }

  // If an end date is set and we've passed it, return null
  if (reminder.recurring.endDate) {
    const endDate = new Date(reminder.recurring.endDate);
    if (date > endDate) return null;
  }

  return date;
};
