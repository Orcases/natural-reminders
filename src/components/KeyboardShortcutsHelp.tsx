import React from 'react';

export interface ShortcutInfo {
  key: string;
  description: string;
}

interface Props {
  shortcuts: ShortcutInfo[];
  onClose: () => void;
}

export const KeyboardShortcutsHelp: React.FC<Props> = ({
  shortcuts,
  onClose,
}: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <table className="w-full">
            <tbody>
              {shortcuts.map((shortcut: ShortcutInfo, index: number) => (
                <tr
                  key={index}
                  className={index !== 0 ? 'border-t border-gray-200 dark:border-gray-700' : ''}
                >
                  <td className="py-2 pr-4">
                    <kbd className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded font-mono">
                      {shortcut.key}
                    </kbd>
                  </td>
                  <td className="py-2 text-gray-600 dark:text-gray-300">
                    {shortcut.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
