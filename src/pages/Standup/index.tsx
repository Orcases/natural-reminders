import '@natural/assets/css/tailwind.css';
import { createRoot } from 'react-dom/client';
import { ReminderProvider } from '@natural/context/ReminderContext';
import { CategoryProvider } from '@natural/context/CategoryContext';
import React from 'react';
import Standup from './Standup';

const container = document.getElementById('app');
if (!container) {
  throw new Error('Could not find app container');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <CategoryProvider>
      <ReminderProvider>
        <Standup />
      </ReminderProvider>
    </CategoryProvider>
  </React.StrictMode>
);
