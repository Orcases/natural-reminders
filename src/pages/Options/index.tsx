import React from 'react';
import { createRoot } from 'react-dom/client';
import { SettingsProvider } from '../../context/SettingsContext';
import { CategoryProvider } from '../../context/CategoryContext';
import Options from './Options';
import '../../index.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <SettingsProvider>
      <CategoryProvider>
        <Options />
      </CategoryProvider>
    </SettingsProvider>
  </React.StrictMode>
);
