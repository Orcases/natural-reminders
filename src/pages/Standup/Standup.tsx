/** @jsxImportSource react */
import './Standup.css';
import React from 'react';
import {
  HiHome,
  HiBriefcase,
  HiPlus,
  HiTrash,
  HiCheck,
  HiXMark,
  HiDocument,
  HiShoppingCart,
  HiHeart,
  HiStar,
  HiBookmark,
  HiCalendar,
  HiGlobeAlt,
  HiLightBulb,
  HiCog,
  HiCodeBracket,
  HiCloud,
  HiBuildingLibrary,
  HiBuildingOffice,
  HiSun,
  HiMoon,
  HiCog8Tooth,
  HiChevronDown,
  HiOutlineClock
} from 'react-icons/hi2';
import { IoMdArrowDropdown } from 'react-icons/io';
import { parse } from 'chrono-node';
import { useReminders } from '@natural/context/ReminderContext';
import type { Category } from '@natural/components/CategorySelector';
import type { NewReminder, Reminder } from '@natural/types/reminder';
import { storageService } from '@natural/services/storage';
import { FaLeaf } from "react-icons/fa";
import { IoNotificationsOutline, IoNotificationsOffOutline } from "react-icons/io5";

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
  { id: 'clock', icon: <HiOutlineClock className="text-2xl" /> },
  { id: 'star', icon: <HiStar className="text-2xl" /> },
  { id: 'document', icon: <HiDocument className="text-2xl" /> },
  { id: 'home', icon: <HiHome className="text-2xl" /> },
  { id: 'briefcase', icon: <HiBriefcase className="text-2xl" /> },
  { id: 'shopping', icon: <HiShoppingCart className="text-2xl" /> },
  { id: 'heart', icon: <HiHeart className="text-2xl" /> },
  { id: 'bookmark', icon: <HiBookmark className="text-2xl" /> },
  { id: 'calendar', icon: <HiCalendar className="text-2xl" /> },
  { id: 'globe', icon: <HiGlobeAlt className="text-2xl" /> },
  { id: 'bulb', icon: <HiLightBulb className="text-2xl" /> },
  { id: 'settings', icon: <HiCog className="text-2xl" /> },
  { id: 'code', icon: <HiCodeBracket className="text-2xl" /> },
  { id: 'cloud', icon: <HiCloud className="text-2xl" /> },
  { id: 'library', icon: <HiBuildingLibrary className="text-2xl" /> },
  { id: 'office', icon: <HiBuildingOffice className="text-2xl" /> }
];

interface ColorOption {
  name: string;
  value: string;
}

const colorOptions: ColorOption[] = [
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

const Standup: React.FC = () => {
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
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [showAllReminders, setShowAllReminders] = React.useState<boolean>(() => {
    const saved = localStorage.getItem('showAllReminders');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [defaultNotification, setDefaultNotification] = React.useState<boolean>(() => {
    const saved = localStorage.getItem('defaultNotification');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showAllItems, setShowAllItems] = React.useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = React.useState<string | null>(null);
  const timePickerRef = React.useRef<HTMLDivElement>(null);
  const datePickerRef = React.useRef<HTMLDivElement>(null);

  const categoryDropdownRef = React.useRef<HTMLDivElement>(null);
  const editCategoryDropdownRef = React.useRef<HTMLDivElement>(null);
  const editingInputRef = React.useRef<HTMLInputElement>(null);
  const dateInputRef = React.useRef<HTMLInputElement>(null);
  const timeInputRef = React.useRef<HTMLInputElement>(null);

  const { reminders, loading, error, addReminder, updateReminder, deleteReminder } = useReminders();
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    const loadCategories = async () => {
      const savedCategories = await storageService.getAllCategories();
      setCategories(savedCategories);
    };
    loadCategories();
  }, []);

  const toggleCategoryDropdown = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setShowCategories(!showCategories);
    if (showCategories) {
      setShowAddCategory(false);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdownButton = document.querySelector('.category-button');
      const isClickOnButton = dropdownButton?.contains(target);
      const isClickInsideDropdown = categoryDropdownRef.current?.contains(target);
      
      if (!isClickOnButton && !isClickInsideDropdown) {
        setShowCategories(false);
        setShowAddCategory(false);
      }
      
      if (editCategoryDropdownRef.current && !editCategoryDropdownRef.current.contains(target)) {
        setShowCategoryDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  React.useEffect(() => {
    localStorage.setItem('showAllReminders', JSON.stringify(showAllReminders));
  }, [showAllReminders]);

  React.useEffect(() => {
    if (selectedCategoryId) {
      localStorage.setItem('selectedCategoryId', selectedCategoryId);
    } else {
      localStorage.removeItem('selectedCategoryId');
    }
  }, [selectedCategoryId]);

  React.useEffect(() => {
    localStorage.setItem('defaultNotification', JSON.stringify(defaultNotification));
  }, [defaultNotification]);

  const handleInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleAddReminder();
    }
  };

  const handleStartEdit = (reminder: Reminder): void => {
    setEditingReminder({
      id: reminder.id,
      title: reminder.title,
      categoryId: reminder.categoryId,
      date: reminder.date,
      time: reminder.time
    });
  };

  const handleAddReminder = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
        notification: defaultNotification
      };

      await addReminder(newReminder);
      setInput('');
      setSelectedCategoryId(null);
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  const handleNewCategoryKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleAddCategory();
    }
  };

  const handleAddCategory = async (): Promise<void> => {
    if (!newCategoryName.trim()) return;

    try {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName,
        color: newCategoryColor,
        icon: newCategoryIcon
      };

      const updatedCategories = [...categories, newCategory];
      await storageService.saveCategories(updatedCategories);
      setCategories(updatedCategories);
      setNewCategoryName('');
      setNewCategoryColor('#6B7280');
      setNewCategoryIcon('clock');
      setShowAddCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const updatedCategories = categories.filter((category: Category) => category.id !== categoryId);
      await storageService.saveCategories(updatedCategories);
      setCategories(updatedCategories);
      setShowCategories(false);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const findCategoryById = (categories: Category[], id: string | null | undefined): Category | undefined => {
    return categories.find(c => c.id === id);
  };

  const getCategoryIcon = (categoryId: string | null | undefined, categories: Category[]): React.ReactElement => {
    const category = findCategoryById(categories, categoryId);
    if (!category) return iconOptions[0].icon;
    const iconOption = iconOptions.find(opt => opt.id === category.icon);
    return iconOption ? iconOption.icon : iconOptions[0].icon;
  };

  const getCategoryColor = (categoryId: string | null | undefined, categories: Category[]): string => {
    const category = findCategoryById(categories, categoryId);
    return category?.color || '#6B7280';
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time: string): string => {
    if (!time) return '';
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (e) {
      return time;
    }
  };

  const handleReminderFilter = (r: Reminder): boolean => {
    if (!showAllReminders && r.completed) return false;
    if (selectedCategoryId && r.categoryId !== selectedCategoryId) return false;
    return true;
  };

  const handleReminderClick = (reminder: Reminder): void => {
    setEditingReminder({
      id: reminder.id,
      title: reminder.title,
      categoryId: reminder.categoryId,
      date: reminder.date,
      time: reminder.time
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (editingReminder) {
      setEditingReminder({ ...editingReminder, date: e.target.value });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (editingReminder) {
      setEditingReminder({ ...editingReminder, time: e.target.value });
    }
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingReminder) return;

    try {
      await updateReminder(editingReminder.id, {
        title: editingReminder.title,
        categoryId: editingReminder.categoryId,
        date: editingReminder.date,
        time: editingReminder.time
      });
      setEditingReminder(null);
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  const handleCancelEdit = (): void => {
    setEditingReminder(null);
    setShowCategoryDropdown(null);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteReminder(id);
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewCategoryName(e.target.value);
  };

  const toggleDarkMode = (): void => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!editingReminder) return;

    let input = e.target.value;
    
    // Allow backspace/delete to work
    if (input === '') {
      setEditingReminder({ ...editingReminder, time: '' });
      return;
    }

    // Keep only numbers and colon
    input = input.replace(/[^0-9:]/g, '');
    
    // Split into hours and minutes
    const [hoursStr = '', minutesStr = ''] = input.split(':');
    
    // Convert to numbers for validation
    let hours = parseInt(hoursStr);
    let minutes = parseInt(minutesStr);

    // Validate hours
    if (!isNaN(hours)) {
      if (hours > 23) hours = 23;
      if (hoursStr.length > 2) hours = parseInt(hoursStr.slice(0, 2));
    }

    // Validate minutes
    if (!isNaN(minutes)) {
      if (minutes > 59) minutes = 59;
      if (minutesStr.length > 2) minutes = parseInt(minutesStr.slice(0, 2));
    }

    // Format the time string
    let formattedTime = '';
    
    if (!isNaN(hours)) {
      formattedTime = hours.toString().padStart(2, '0');
      if (input.includes(':') || (!isNaN(minutes) && hoursStr.length >= 2)) {
        formattedTime += ':' + (isNaN(minutes) ? '00' : minutes.toString().padStart(2, '0'));
      }
    } else {
      formattedTime = input;
    }

    // Add seconds if we have a complete time
    if (formattedTime.length === 5) {
      formattedTime += ':00';
    }

    setEditingReminder({ ...editingReminder, time: formattedTime });
  };

  const handleTimeInputFocus = (reminder: Reminder): void => {
    if (!editingReminder) {
      handleStartEdit(reminder);
    }
    // Select all text on focus
    setTimeout(() => {
      const input = document.activeElement as HTMLInputElement;
      if (input) {
        input.select();
        // Move cursor to start if empty
        if (!input.value) {
          input.setSelectionRange(0, 0);
        }
      }
    }, 0);
  };

  const handleDateInputFocus = (reminder: Reminder): void => {
    if (!editingReminder) {
      handleStartEdit(reminder);
    }
    // Select all text on focus
    setTimeout(() => {
      const input = document.activeElement as HTMLInputElement;
      input?.select();
    }, 0);
  };

  // Sort reminders by date and time
  const sortedReminders = [...reminders].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const handleTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    }
  };

  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    }
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!editingReminder) return;

    const input = e.target.value;
    
    // Allow backspace/delete to work
    if (input === '') {
      setEditingReminder({ ...editingReminder, date: '' });
      return;
    }

    const digitsOnly = input.replace(/\D/g, '');
    
    if (digitsOnly.length <= 8) {
      let formattedDate = '';
      if (digitsOnly.length >= 4) {
        formattedDate = digitsOnly.slice(0, 4) + '-' + digitsOnly.slice(4);
        if (digitsOnly.length >= 6) {
          formattedDate = formattedDate.slice(0, 7) + '-' + digitsOnly.slice(6);
        }
      } else {
        formattedDate = digitsOnly;
      }
      
      setEditingReminder({ ...editingReminder, date: formattedDate });
    }
  };

  // Close time picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(null);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTimeClick = (reminderId: string, hour: number, minute: number) => {
    if (!editingReminder) return;
    
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    const newTime = `${formattedHour}:${formattedMinute}:00`;
    
    setEditingReminder({ ...editingReminder, time: newTime });
    setShowTimePicker(null);
    handleSaveEdit();
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        options.push({ hour, minute });
      }
    }
    return options;
  };

  const renderTimePicker = (reminder: Reminder) => {
    const isEditing = editingReminder?.id === reminder.id;
    const currentTime = isEditing ? editingReminder.time : reminder.time;
    const [hours, minutes] = currentTime.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return (
      <div className="relative">
        <input
          type="text"
          value={formatTime(currentTime)}
          readOnly
          onClick={() => {
            if (!editingReminder) handleStartEdit(reminder);
            setShowTimePicker(reminder.id);
          }}
          className="w-20 text-xs text-gray-500 dark:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1"
        />
        
        {showTimePicker === reminder.id && (
          <div ref={timePickerRef} className="absolute left-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50 flex gap-2">
            {/* Hour */}
            <select 
              value={hour12}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                if (!editingReminder) return;
                let newHour = parseInt(e.target.value);
                if (period === 'PM' && newHour !== 12) newHour += 12;
                if (period === 'AM' && newHour === 12) newHour = 0;
                const newTime = `${newHour.toString().padStart(2, '0')}:${minutes}:00`;
                setEditingReminder({ ...editingReminder, time: newTime });
              }}
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded p-1"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
              ))}
            </select>

            {/* Minute */}
            <select
              value={minute}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                if (!editingReminder) return;
                const newMinute = e.target.value.padStart(2, '0');
                const newTime = `${hours}:${newMinute}:00`;
                setEditingReminder({ ...editingReminder, time: newTime });
              }}
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded p-1"
            >
              {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
              ))}
            </select>

            {/* AM/PM */}
            <select
              value={period}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                if (!editingReminder) return;
                const newPeriod = e.target.value;
                let newHour = hour % 12;
                if (newPeriod === 'PM' && newHour !== 12) newHour += 12;
                if (newPeriod === 'AM' && newHour === 12) newHour = 0;
                const newTime = `${newHour.toString().padStart(2, '0')}:${minutes}:00`;
                setEditingReminder({ ...editingReminder, time: newTime });
              }}
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded p-1"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>

            <button
              onClick={() => {
                setShowTimePicker(null);
                handleSaveEdit();
              }}
              className="bg-blue-500 text-white rounded p-1 text-sm hover:bg-blue-600"
            >
              <HiCheck className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderDatePicker = (reminder: Reminder) => {
    const isEditing = editingReminder?.id === reminder.id;
    const currentDate = isEditing ? editingReminder.date : reminder.date;
    const [year, month, day] = currentDate.split('-').map((num: string) => parseInt(num));
    
    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month, 0).getDate();
    };
    
    return (
      <div className="relative">
        <input
          type="text"
          value={formatDate(currentDate)}
          readOnly
          onClick={() => {
            if (!editingReminder) handleStartEdit(reminder);
            setShowDatePicker(reminder.id);
          }}
          className="w-24 text-xs text-gray-500 dark:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1"
        />
        
        {showDatePicker === reminder.id && (
          <div ref={datePickerRef} className="absolute left-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50 flex gap-2">
            {/* Day */}
            <select
              value={day}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                if (!editingReminder) return;
                const newDay = e.target.value.padStart(2, '0');
                const newDate = `${year}-${month.toString().padStart(2, '0')}-${newDay}`;
                setEditingReminder({ ...editingReminder, date: newDate });
              }}
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded p-1"
            >
              {Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d.toString().padStart(2, '0')}</option>
              ))}
            </select>

            {/* Month */}
            <select
              value={month}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                if (!editingReminder) return;
                const newMonth = parseInt(e.target.value);
                const daysInMonth = getDaysInMonth(year, newMonth);
                const newDay = day > daysInMonth ? daysInMonth : day;
                const newDate = `${year}-${newMonth.toString().padStart(2, '0')}-${newDay.toString().padStart(2, '0')}`;
                setEditingReminder({ ...editingReminder, date: newDate });
              }}
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded p-1"
            >
              {[
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
              ].map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>

            {/* Year */}
            <select 
              value={year}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                if (!editingReminder) return;
                const newYear = e.target.value.padStart(4, '0');
                const daysInMonth = getDaysInMonth(parseInt(newYear), month);
                const newDay = day > daysInMonth ? daysInMonth : day;
                const newDate = `${newYear}-${month.toString().padStart(2, '0')}-${newDay.toString().padStart(2, '0')}`;
                setEditingReminder({ ...editingReminder, date: newDate });
              }}
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded p-1"
            >
              {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setShowDatePicker(null);
                handleSaveEdit();
              }}
              className="bg-blue-500 text-white rounded p-1 text-sm hover:bg-blue-600"
            >
              <HiCheck className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Add state for date picker
  const [showDatePicker, setShowDatePicker] = React.useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-[25px] shadow-lg p-6">
          <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-[25px] shadow-lg p-6">
          <div className="text-center text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-[25px] shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <FaLeaf className="text-2xl text-green-500 dark:text-green-400" />
            <h1 className="text-2xl text-gray-600 dark:text-gray-300 font-semibold">Natural Reminders</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative inline-block w-10 align-middle select-none">
              <input
                type="checkbox"
                name="show-completed"
                id="show-completed"
                checked={showAllReminders}
                onChange={() => setShowAllReminders(!showAllReminders)}
                className="sr-only peer"
              />
              <label
                htmlFor="show-completed"
                className="block h-5 overflow-hidden bg-gray-200 dark:bg-gray-600 peer-checked:bg-blue-500 rounded-full cursor-pointer transition-all duration-200"
              >
                <div 
                  className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out"
                  style={{
                    transform: showAllReminders ? 'translateX(20px)' : 'translateX(0)'
                  }}
                />
              </label>
            </div>
            <button
              onClick={() => setDefaultNotification(!defaultNotification)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              title="Default notification setting for new reminders"
            >
              {defaultNotification ? (
                <IoNotificationsOutline className="text-xl text-gray-600 dark:text-gray-300" />
              ) : (
                <IoNotificationsOffOutline className="text-xl text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {isDarkMode ? (
                <HiSun className="text-xl text-gray-600 dark:text-gray-300" />
              ) : (
                <HiMoon className="text-xl text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <HiCog8Tooth className="text-xl text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <form onSubmit={handleAddReminder} className="flex items-center space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="Add a reminder naturally..."
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <button
                type="button"
                className="category-button flex items-center space-x-1"
                onClick={toggleCategoryDropdown}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-gray-900">
                  <span style={{ color: getCategoryColor(selectedCategoryId, categories) || '#6B7280' }}>
                    {getCategoryIcon(selectedCategoryId, categories)}
                  </span>
                </div>
                <HiChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCategories ? 'transform rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <HiPlus className="w-5 h-5" />
          </button>
        </form>

        {showCategories && (
          <div
            ref={categoryDropdownRef}
            className="absolute right-6 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4 space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                {categories.map((category: Category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2"
                  >
                    <button
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setShowCategories(false);
                      }}
                      className="flex items-center space-x-2 flex-1"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-gray-900"
                      >
                        <span style={{ color: category.color }}>{getCategoryIcon(category.id, categories)}</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                    </button>
                    {category.id !== 'default' && (
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                + Add new category
              </button>

              {showAddCategory && (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewCategoryColor(color.value)}
                        className={`w-6 h-6 rounded-full border-2 ${
                          newCategoryColor === color.value ? 'border-blue-500' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon.id}
                        onClick={() => setNewCategoryIcon(icon.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          newCategoryIcon === icon.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {icon.icon}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={handleCategoryInputChange}
                      onKeyDown={handleNewCategoryKeyDown}
                      placeholder="New category name..."
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <HiPlus className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {sortedReminders
            .filter((reminder: Reminder) => showAllReminders || !reminder.completed)
            .slice(0, showAllItems ? undefined : 8)
            .map((reminder: Reminder) => (
              <div
                key={reminder.id}
                className={`p-2.5 bg-white dark:bg-gray-800 rounded-xl border ${
                  reminder.completed
                    ? 'border-gray-200 dark:border-gray-700'
                    : ''
                }`}
                style={{ 
                  borderColor: reminder.completed 
                    ? undefined 
                    : getCategoryColor(reminder.categoryId, categories),
                  boxShadow: reminder.completed 
                    ? undefined 
                    : `0 2px 4px ${getCategoryColor(reminder.categoryId, categories)}40`
                }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateReminder(reminder.id, { completed: !reminder.completed })}
                    className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border ${
                      reminder.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {reminder.completed && <HiCheck className="w-2.5 h-2.5 text-white" />}
                  </button>

                  <button
                    onClick={() => setShowCategoryDropdown(reminder.id)}
                    className="category-button w-3 h-3 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 flex-shrink-0"
                  >
                    <span style={{ color: getCategoryColor(reminder.categoryId, categories) || '#6B7280' }}>
                      {getCategoryIcon(reminder.categoryId, categories)}
                    </span>
                  </button>

                  {showCategoryDropdown === reminder.id && (
                    <div
                      ref={editCategoryDropdownRef}
                      className="absolute left-10 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="p-4">
                        {categories.map((category: Category) => (
                          <div
                            key={category.id}
                            className="flex items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2"
                          >
                            <button
                              onClick={() => {
                                updateReminder(reminder.id, { categoryId: category.id });
                                setShowCategoryDropdown(null);
                              }}
                              className="flex items-center space-x-2 flex-1"
                            >
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-gray-900"
                              >
                                <span style={{ color: category.color }}>{getCategoryIcon(category.id, categories)}</span>
                              </div>
                              <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {renderTimePicker(reminder)}

                  {renderDatePicker(reminder)}

                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={editingReminder?.id === reminder.id ? editingReminder.title : reminder.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => editingReminder && setEditingReminder({ ...editingReminder, title: e.target.value })}
                      onFocus={() => !editingReminder && handleStartEdit(reminder)}
                      className={`text-base bg-transparent border-none focus:outline-none focus:ring-0 w-full ${
                        reminder.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    />
                  </div>

                  <button
                    onClick={() => updateReminder(reminder.id, { notification: !reminder.notification })}
                    className="p-0.5 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 flex-shrink-0"
                  >
                    {reminder.notification ? (
                      <IoNotificationsOutline className="w-4 h-4" />
                    ) : (
                      <IoNotificationsOffOutline className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="p-0.5 text-gray-500 hover:text-red-500 dark:hover:text-red-400 flex-shrink-0"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            {sortedReminders.filter((r: Reminder) => r.completed).length}/{sortedReminders.length} completed
          </div>
          
          {sortedReminders.filter((reminder: Reminder) => showAllReminders || !reminder.completed).length > 8 && (
            <button
              onClick={() => setShowAllItems(!showAllItems)}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {showAllItems ? 'Show Less ↑' : 'Show More ↓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Standup;
