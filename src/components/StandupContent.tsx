/** @jsxImportSource react */
import React from 'react';
import {
  ClockIcon,
  StarIcon,
  DocumentIcon,
  HomeIcon,
  BriefcaseIcon,
  ShoppingCartIcon,
  HeartIcon,
  BookmarkIcon,
  CalendarIcon,
  GlobeAltIcon,
  LightBulbIcon,
  CogIcon,
  CodeBracketIcon,
  CloudIcon,
  BuildingLibraryIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { IoNotifications, IoNotificationsOff } from "react-icons/io5";
import { parse } from 'chrono-node';
import { useReminders } from '@natural/context/ReminderContext';
import type { Category } from '@natural/components/CategorySelector';
import type { NewReminder, Reminder } from '@natural/types/reminder';
import { storageService } from '@natural/services/storage';

interface EditingReminder {
  id: string;
  title: string;
  categoryId: string | null;
  date: string;
  time: string;
}

interface IconOption {
  id: string;
  icon: React.ReactElement;
}

const iconOptions: IconOption[] = [
  { id: 'clock', icon: <ClockIcon className="text-2xl" /> },
  { id: 'star', icon: <StarIcon className="text-2xl" /> },
  { id: 'document', icon: <DocumentIcon className="text-2xl" /> },
  { id: 'home', icon: <HomeIcon className="text-2xl" /> },
  { id: 'briefcase', icon: <BriefcaseIcon className="text-2xl" /> },
  { id: 'shopping', icon: <ShoppingCartIcon className="text-2xl" /> },
  { id: 'heart', icon: <HeartIcon className="text-2xl" /> },
  { id: 'bookmark', icon: <BookmarkIcon className="text-2xl" /> },
  { id: 'calendar', icon: <CalendarIcon className="text-2xl" /> },
  { id: 'globe', icon: <GlobeAltIcon className="text-2xl" /> },
  { id: 'bulb', icon: <LightBulbIcon className="text-2xl" /> },
  { id: 'settings', icon: <CogIcon className="text-2xl" /> },
  { id: 'code', icon: <CodeBracketIcon className="text-2xl" /> },
  { id: 'cloud', icon: <CloudIcon className="text-2xl" /> },
  { id: 'library', icon: <BuildingLibraryIcon className="text-2xl" /> },
  { id: 'office', icon: <BuildingOfficeIcon className="text-2xl" /> }
];

const colorOptions = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#FBBF24' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Brown', value: '#92400E' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Slate', value: '#475569' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Crimson', value: '#DC2626' },
  { name: 'Gold', value: '#B45309' }
];

const StandupContent: React.FC = () => {
  const [input, setInput] = React.useState<string>('');
  const [showCategories, setShowCategories] = React.useState<boolean>(false);
  const [showAddCategory, setShowAddCategory] = React.useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = React.useState<string>('');
  const [newCategoryColor, setNewCategoryColor] = React.useState<string>('#6B7280');
  const [newCategoryIcon, setNewCategoryIcon] = React.useState<string>('clock');
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(() => {
    return localStorage.getItem('selectedCategoryId');
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = React.useState<string | null>(null);
  const [editingReminder, setEditingReminder] = React.useState<EditingReminder | null>(null);
  const [showAllReminders, setShowAllReminders] = React.useState<boolean>(() => {
    const saved = localStorage.getItem('showAllReminders');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showAllItems, setShowAllItems] = React.useState<boolean>(false);

  const { reminders, loading, error, addReminder, updateReminder, deleteReminder } = useReminders();
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    const loadCategories = async () => {
      const savedCategories = await storageService.getAllCategories();
      setCategories(savedCategories);
    };
    loadCategories();
  }, []);

  const handleAddReminder = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (!input.trim()) return;

    try {
      const parsedDate = parse(input);
      const date = new Date();
      let reminderDate = date;

      if (parsedDate && parsedDate[0]?.start) {
        const start = parsedDate[0].start;
        reminderDate = new Date(
          start.get('year') ?? date.getFullYear(),
          (start.get('month') ?? date.getMonth() + 1) - 1,
          start.get('day') ?? date.getDate(),
          start.get('hour') ?? date.getHours(),
          start.get('minute') ?? date.getMinutes()
        );
      }

      const newReminder: NewReminder = {
        title: input,
        description: '',
        date: reminderDate.toISOString().split('T')[0],
        time: reminderDate.toLocaleTimeString('en-US', { hour12: false }),
        categoryId: selectedCategoryId,
        completed: false,
        priority: 'medium',
        tags: [],
        recurring: null,
        notification: true
      };

      await addReminder(newReminder);
      setInput('');
      setSelectedCategoryId(null);
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleAddReminder} className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="Add a reminder..."
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </form>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div className="space-y-2">
            {reminders.map((reminder: Reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg shadow"
              >
                <span className="dark:text-white">{reminder.title}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-1 text-red-500 hover:bg-red-100 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StandupContent; 