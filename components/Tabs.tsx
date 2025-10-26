
import React from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { FilmIcon } from './icons/FilmIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { BoltIcon } from './icons/BoltIcon';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: 'video', label: 'Scene Generation', icon: <FilmIcon /> },
  { id: 'image', label: 'Storyboard', icon: <CameraIcon /> },
  { id: 'content', label: 'Script & Analysis', icon: <DocumentTextIcon /> },
  { id: 'narration', label: 'Narration', icon: <SpeakerWaveIcon /> },
  { id: 'live', label: 'Live Report', icon: <BoltIcon /> },
];

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center border-b border-gray-700">
      <div className="flex space-x-2 md:space-x-4 overflow-x-auto pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-3 py-3 text-sm md:text-base font-medium rounded-t-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500
              ${
                activeTab === tab.id
                  ? 'border-b-2 border-sky-400 text-sky-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }
            `}
          >
            {tab.icon}
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
