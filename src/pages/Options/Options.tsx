import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { SettingsSection } from '../../components/SettingsSection';
import { TagInput } from '../../components/TagInput';
import { CategoryManager } from '../../components/CategoryManager';
import './Options.css';

const Options: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(settings);
      showMessage('success', 'Settings saved successfully!');
    } catch (error) {
      showMessage('error', 'Failed to save settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setIsSaving(true);
      try {
        await resetSettings();
        showMessage('success', 'Settings reset to default!');
      } catch (error) {
        showMessage('error', 'Failed to reset settings');
        console.error(error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Customize your Natural Reminders experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SettingsSection
          title="Categories"
          description="Manage your reminder categories"
        >
          <CategoryManager />
        </SettingsSection>

        <SettingsSection
          title="Appearance"
          description="Customize how Natural Reminders looks"
        >
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                updateSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })}
              className="ml-3 block w-48 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Format
            </label>
            <select
              value={settings.timeFormat}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                updateSettings({ timeFormat: e.target.value as '12h' | '24h' })}
              className="ml-3 block w-48 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="12h">12-hour (1:00 PM)</option>
              <option value="24h">24-hour (13:00)</option>
            </select>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Notifications"
          description="Configure how you want to be notified"
        >
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Notification Sound
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Play a sound when reminders are due
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationSound}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateSettings({ notificationSound: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Snooze Time
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Minutes to snooze when clicking the snooze button
              </p>
            </div>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.snoozeTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                updateSettings({ snoozeTime: parseInt(e.target.value) })}
              className="ml-3 block w-24 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Defaults"
          description="Set default values for new reminders"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Tags
              </label>
              <TagInput
                tags={settings.defaultTags}
                onChange={(tags: string[]) => updateSettings({ defaultTags: tags })}
                placeholder="Add default tags..."
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Priority
              </label>
              <select
                value={settings.defaultPriority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  updateSettings({ defaultPriority: e.target.value as 'low' | 'medium' | 'high' })}
                className="ml-3 block w-48 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Reminder Time
              </label>
              <input
                type="time"
                value={settings.defaultReminderTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateSettings({ defaultReminderTime: e.target.value })}
                className="ml-3 block w-48 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </SettingsSection>

        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            disabled={isSaving}
          >
            Reset to Default
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {message && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Options;
