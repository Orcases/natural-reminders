import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReminderProvider } from '@natural/context/ReminderContext';
import { SettingsProvider } from '@natural/context/SettingsContext';
import { SearchProvider } from '@natural/context/SearchContext';
import { OnboardingProvider } from '@natural/context/OnboardingContext';
import { CategoryProvider } from '@natural/context/CategoryContext';
import Popup from './Popup';
import './index.css';

const container = document.getElementById('app-container');
if (!container) {
  throw new Error('Failed to find app container');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <CategoryProvider>
        <ReminderProvider>
          <SearchProvider>
            <OnboardingProvider>
              <Popup />
            </OnboardingProvider>
          </SearchProvider>
        </ReminderProvider>
      </CategoryProvider>
    </SettingsProvider>
  </React.StrictMode>
);
