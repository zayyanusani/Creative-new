
import React, { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import ContentStudio from './components/ContentStudio';
import NarrationStudio from './components/NarrationStudio';
import LiveReport from './components/LiveReport';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('video');

  const renderContent = () => {
    switch (activeTab) {
      case 'image':
        return <ImageGenerator />;
      case 'video':
        return <VideoGenerator />;
      case 'content':
        return <ContentStudio />;
      case 'narration':
        return <NarrationStudio />;
      case 'live':
        return <LiveReport />;
      default:
        return <VideoGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6 bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700/50">
          {renderContent()}
        </div>
      </main>
       <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by Gemini. For informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
