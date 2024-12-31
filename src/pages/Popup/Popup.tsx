import React from 'react';
import { parse } from 'chrono-node';
import { useReminders } from '@natural/context/ReminderContext';
import { useCategories } from '@natural/context/CategoryContext';
import { useKeyboardShortcuts } from '@natural/hooks/useKeyboardShortcuts';
import { NewReminder } from '@natural/types/reminder';
import { SmartInput } from '@natural/components/SmartInput';
import { ReminderSearch } from '@natural/components/ReminderSearch';
import { KeyboardShortcutsHelp, type ShortcutInfo } from '@natural/components/KeyboardShortcutsHelp';
import { CategorySelector } from '@natural/components/CategorySelector';
import { Onboarding } from '@natural/components/Onboarding';
import { HiMagnifyingGlass, HiKey, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import './Popup.css';

interface ChronoParseResult {
  start: {
    get: (unit: string) => number | undefined;
    date: () => Date;
  };
}

interface ChromeWindow {
  url: string;
  type: 'popup';
  width: number;
  height: number;
  left: number;
  top: number;
}

export const Popup: React.FC = () => {
  const [input, setInput] = React.useState('');
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('default');
  const { addReminder } = useReminders();
  const { loadCategories } = useCategories();
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  const [showShortcuts, setShowShortcuts] = React.useState(false);

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAddReminder = async (e?: React.FormEvent): Promise<void> => {
    if (e) {
      e.preventDefault();
    }

    if (!input?.trim()) {
      return;
    }

    const now = new Date();
    const reminder: NewReminder = {
      title: input.trim(),
      description: '',
      date: now.toISOString().split('T')[0] ?? '',
      time: now.toISOString().split('T')[1]?.substring(0, 8) ?? '00:00:00',
      completed: false,
      priority: 'medium' as const,
      tags: [],
      categoryId: selectedCategoryId,
      notification: true,
      recurring: null
    };

    try {
      const results = parse(input.trim()) as ChronoParseResult[];
      const start = results?.[0]?.start;
      
      if (start) {
        const parsedDate = start.date();
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          const isoString = parsedDate.toISOString();
          reminder.date = isoString.split('T')[0] ?? '';
          reminder.time = isoString.split('T')[1]?.substring(0, 8) ?? '00:00:00';
        }
      }
    } catch (error) {
      console.error('Error parsing date:', error);
    }

    await addReminder(reminder);
    setInput('');
    setSelectedCategoryId('default');
  };

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleShortcutsToggle = () => {
    setShowShortcuts(!showShortcuts);
  };

  const handlePopout = () => {
    const width = 400;
    const height = 600;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    chrome.windows.create({
      url: chrome.runtime.getURL('src/pages/Popout/index.html'),
      type: 'popup',
      width,
      height,
      left: Math.floor(left),
      top: Math.floor(top),
    } as ChromeWindow);

    // Close the popup
    window.close();
  };

  const shortcuts: ShortcutInfo[] = [
    {
      key: '⌘ + /',
      description: 'Toggle keyboard shortcuts help'
    },
    {
      key: '⌘ + F',
      description: 'Toggle search'
    },
    {
      key: 'Escape',
      description: 'Close active dialog'
    }
  ];

  useKeyboardShortcuts([
    {
      key: '/',
      ctrl: true,
      handler: handleShortcutsToggle,
      description: 'Toggle keyboard shortcuts help'
    },
    {
      key: 'f',
      ctrl: true,
      handler: handleSearchToggle,
      description: 'Toggle search'
    },
    {
      key: 'Escape',
      handler: () => {
        if (showShortcuts) setShowShortcuts(false);
        if (isSearchVisible) setIsSearchVisible(false);
      },
      description: 'Close active dialog'
    }
  ]);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  return (
    <div className="w-96 min-h-[24rem] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Popout button in top-right corner */}
      <button
        onClick={handlePopout}
        className="absolute top-2 right-2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        title="Open in new window"
      >
        <HiArrowTopRightOnSquare className="w-5 h-5" />
      </button>

      <div className="p-6 space-y-6">
        <Onboarding onClose={() => {}} />
        
        <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleAddReminder(e); }} className="space-y-4">
          <SmartInput
            value={input}
            onChange={handleInputChange}
            onSubmit={() => handleAddReminder()}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a reminder naturally..."
          />
          
          <CategorySelector
            selectedCategoryId={selectedCategoryId}
            onChange={(id: string) => setSelectedCategoryId(id)}
            className="w-full"
          />
        </form>

        {/* Action buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleSearchToggle}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <HiMagnifyingGlass className="w-5 h-5" />
          </button>
          <button
            onClick={handleShortcutsToggle}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <HiKey className="w-5 h-5" />
          </button>
        </div>

        {isSearchVisible && (
          <ReminderSearch onClose={handleSearchToggle} />
        )}

        {showShortcuts && (
          <KeyboardShortcutsHelp 
            shortcuts={shortcuts}
            onClose={handleShortcutsToggle} 
          />
        )}
      </div>
    </div>
  );
};

export default Popup;
