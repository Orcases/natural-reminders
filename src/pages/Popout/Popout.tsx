import React from 'react';
import { Popup } from '../Popup/Popup';

export const Popout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex items-start justify-center">
      <Popup />
    </div>
  );
};
