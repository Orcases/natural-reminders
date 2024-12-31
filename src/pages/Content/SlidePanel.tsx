import React from 'react';
import { Panel, PanelHeader, PanelContent } from '@natural/ui/layouts/Panel';
import { FaLeaf } from 'react-icons/fa';
import { HiXMark } from '@heroicons/react/24/outline';

export interface SlidePanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SlidePanel = (props: SlidePanelProps): JSX.Element => {
  const { isVisible, onClose } = props;
  
  return (
    <Panel style={{ transform: isVisible ? 'translateX(0)' : 'translateX(100%)' }}>
      <PanelHeader>
        <div className="flex items-center space-x-2">
          <FaLeaf className="text-2xl text-green-500" />
          <h1 className="text-2xl font-semibold">Natural Reminders</h1>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <HiXMark className="h-6 w-6" />
        </button>
      </PanelHeader>
      <PanelContent>
        {/* Panel content goes here */}
      </PanelContent>
    </Panel>
  );
}; 
