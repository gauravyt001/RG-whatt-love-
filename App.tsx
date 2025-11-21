
import React, { useState } from 'react';
import { LoveCalculator } from './components/LoveCalculator';
import { AboutUs } from './components/AboutUs';
import { playClickSound } from './utils/audio';

const App: React.FC = () => {
  const [view, setView] = useState<'calculator' | 'about'>('calculator');

  const handleViewChange = (newView: 'calculator' | 'about') => {
    playClickSound();
    setView(newView);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-400 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4 overflow-hidden">
      {view === 'calculator' ? (
        <>
          <LoveCalculator />
          <button 
            onClick={() => handleViewChange('about')}
            className="mt-8 px-4 py-2 text-white/70 hover:text-white text-sm font-medium border-b border-transparent hover:border-pink-200 transition-all duration-300 animate-fade-in"
          >
            About & Disclaimer
          </button>
        </>
      ) : (
        <AboutUs onBack={() => handleViewChange('calculator')} />
      )}
    </div>
  );
};

export default App;
