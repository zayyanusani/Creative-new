
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700/50">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
          Creative News Studio
        </h1>
      </div>
    </header>
  );
};

export default Header;
