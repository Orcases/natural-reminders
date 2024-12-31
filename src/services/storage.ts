/// <reference types="chrome"/>

import type { Category } from '@natural/components/CategorySelector';
import type { Reminder } from '@natural/types/reminder';

declare global {
  interface Window {
    chrome: typeof chrome;
  }
}

interface StorageResult {
  categories?: Category[];
  reminders?: Reminder[];
}

export interface StorageService {
  getAllCategories(): Promise<Category[]>;
  saveCategories(categories: Category[]): Promise<void>;
  getReminders(): Promise<Reminder[]>;
  saveReminders(reminders: Reminder[]): Promise<void>;
  getReminder(id: string): Promise<Reminder | null>;
  updateReminder(id: string, reminder: Partial<Reminder>): Promise<void>;
}

class ChromeStorageService implements StorageService {
  private isExtension = typeof window !== 'undefined' && window.chrome && window.chrome.storage && window.chrome.storage.local;

  private async getFromStorage<T>(key: string): Promise<T | null> {
    if (this.isExtension) {
      const result = await window.chrome.storage.local.get(key);
      return result[key] as T;
    } else {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
  }

  private async saveToStorage<T>(key: string, value: T): Promise<void> {
    if (this.isExtension) {
      await window.chrome.storage.local.set({ [key]: value });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const categories = await this.getFromStorage<Category[]>('categories');
      return categories || [];
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  async saveCategories(categories: Category[]): Promise<void> {
    try {
      await this.saveToStorage('categories', categories);
    } catch (error) {
      console.error('Error saving categories:', error);
      throw error;
    }
  }

  async getReminders(): Promise<Reminder[]> {
    try {
      const reminders = await this.getFromStorage<Reminder[]>('reminders');
      return reminders || [];
    } catch (error) {
      console.error('Error getting reminders:', error);
      return [];
    }
  }

  async saveReminders(reminders: Reminder[]): Promise<void> {
    try {
      await this.saveToStorage('reminders', reminders);
    } catch (error) {
      console.error('Error saving reminders:', error);
      throw error;
    }
  }

  async getReminder(id: string): Promise<Reminder | null> {
    try {
      const reminders = await this.getReminders();
      return reminders.find(r => r.id === id) || null;
    } catch (error) {
      console.error('Error getting reminder:', error);
      return null;
    }
  }

  async updateReminder(id: string, update: Partial<Reminder>): Promise<void> {
    try {
      const reminders = await this.getReminders();
      const index = reminders.findIndex(r => r.id === id);
      if (index !== -1) {
        reminders[index] = { ...reminders[index], ...update };
        await this.saveReminders(reminders);
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  }
}

// Initialize with default categories if needed
const defaultCategories: Category[] = [
  {
    id: 'default',
    name: 'Default',
    color: '#6B7280',
    icon: 'star'
  },
  {
    id: 'home',
    name: 'Home',
    color: '#10B981',
    icon: 'home'
  },
  {
    id: 'work',
    name: 'Work',
    color: '#3B82F6',
    icon: 'briefcase'
  }
];

const storageService = new ChromeStorageService();

// Initialize default categories if none exist
(async () => {
  try {
    const categories = await storageService.getAllCategories();
    if (categories.length === 0) {
      await storageService.saveCategories(defaultCategories);
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
})();

export { storageService };
