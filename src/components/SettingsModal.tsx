import React from 'react';
import { AppSettings } from '../types';
import { X, Moon, Sun } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onUpdateSettings }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-bold text-gray-900 dark:text-white">App Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</h3>
            <div className="flex gap-3">
              <button
                onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 transition-colors ${
                  settings.theme === 'light'
                    ? 'border-[#E31E24] bg-red-50 text-[#E31E24] dark:bg-red-900/20'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50'
                }`}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 transition-colors ${
                  settings.theme === 'dark'
                    ? 'border-[#E31E24] bg-red-50 text-[#E31E24] dark:bg-red-900/20'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50'
                }`}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-white transition-colors text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
