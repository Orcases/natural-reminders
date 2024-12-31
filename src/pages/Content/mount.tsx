import React from 'react';
import { createRoot } from 'react-dom/client';
import { SlidePanel } from '@natural/pages/Content/SlidePanel';
import { ReminderProvider } from '@natural/context/ReminderContext';
import { CategoryProvider } from '@natural/context/CategoryContext';

let root: ReturnType<typeof createRoot> | null = null;
let container: HTMLDivElement | null = null;

export function mountSlidePanel(isVisible: boolean): void {
  if (!container) {
    container = document.createElement('div');
    container.id = 'natural-reminders-root';
    document.body.appendChild(container);
  }

  if (!root) {
    root = createRoot(container);
  }

  root.render(
    <React.StrictMode>
      <ReminderProvider>
        <CategoryProvider>
          <SlidePanel 
            isVisible={isVisible} 
            onClose={() => {
              root?.render(
                <React.StrictMode>
                  <ReminderProvider>
                    <CategoryProvider>
                      <SlidePanel isVisible={false} onClose={() => {}} />
                    </CategoryProvider>
                  </ReminderProvider>
                </React.StrictMode>
              );
            }} 
          />
        </CategoryProvider>
      </ReminderProvider>
    </React.StrictMode>
  );
} 