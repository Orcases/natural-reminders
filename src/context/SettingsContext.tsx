import React from 'react';
import { z } from 'zod';

// Settings Schema
const SettingsSchema = z.object({
  notificationSound: z.boolean().default(true),
  defaultReminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('09:00'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  snoozeTime: z.number().min(1).max(60).default(5),
  defaultTags: z.array(z.string()).default([]),
  defaultPriority: z.enum(['low', 'medium', 'high']).default('medium'),
  timeFormat: z.enum(['12h', '24h']).default('12h'),
  weekStartsOn: z.number().min(0).max(6).default(0), // 0 = Sunday
  showWeekNumbers: z.boolean().default(false),
  enableKeyboardShortcuts: z.boolean().default(true),
  hasCompletedOnboarding: z.boolean().default(false),
});

type Settings = z.infer<typeof SettingsSchema>;

// Action types
type SettingsAction =
  | { type: 'SET_SETTINGS'; payload: Partial<Settings> }
  | { type: 'RESET_SETTINGS' };

// Initial state
const initialSettings: Settings = {
  notificationSound: true,
  defaultReminderTime: '09:00',
  theme: 'system',
  snoozeTime: 5,
  defaultTags: [],
  defaultPriority: 'medium',
  timeFormat: '12h',
  weekStartsOn: 0,
  showWeekNumbers: false,
  enableKeyboardShortcuts: true,
  hasCompletedOnboarding: false,
};

// Reducer
function settingsReducer(state: Settings, action: SettingsAction): Settings {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...state, ...action.payload };
    case 'RESET_SETTINGS':
      return initialSettings;
    default:
      return state;
  }
}

// Context
interface SettingsContextType {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

interface SettingsProviderProps {
  children: React.ReactNode;
}

const SettingsContext = React.createContext<SettingsContextType | null>(null);

// Provider component
export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, dispatch] = React.useReducer(settingsReducer, initialSettings);

  // Load settings from storage on mount
  React.useEffect(() => {
    chrome.storage.sync.get('settings').then((result: { settings?: unknown }) => {
      if (result.settings) {
        try {
          const parsedSettings = SettingsSchema.parse(result.settings);
          dispatch({ type: 'SET_SETTINGS', payload: parsedSettings });
        } catch (error) {
          console.error('Invalid settings in storage:', error);
        }
      }
    });
  }, []);

  // Update settings
  const updateSettings = React.useCallback(async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      const validatedSettings = SettingsSchema.parse(updatedSettings);
      
      await chrome.storage.sync.set({ settings: validatedSettings });
      dispatch({ type: 'SET_SETTINGS', payload: newSettings });

      // Apply theme
      if (newSettings.theme) {
        applyTheme(newSettings.theme);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }, [settings]);

  // Reset settings
  const resetSettings = React.useCallback(async () => {
    try {
      await chrome.storage.sync.set({ settings: initialSettings });
      dispatch({ type: 'RESET_SETTINGS' });
      applyTheme(initialSettings.theme);
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  }, []);

  // Apply theme helper
  const applyTheme = React.useCallback((theme: Settings['theme']) => {
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // Apply theme on mount and when system theme changes
  React.useEffect(() => {
    applyTheme(settings.theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme, applyTheme]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use settings
export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
