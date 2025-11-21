import React, { useState, useEffect, useRef } from 'react';
import { calculateLoveScore, getLoveMessage } from '../utils/calculator';
import { getRelationshipAdvice } from '../services/geminiService';
import { HeartIcon } from './HeartIcon';
import { playClickSound, playHeartbeatSound, playSuccessSound } from '../utils/audio';

export const LoveCalculator: React.FC = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  // Effect for counting up animation
  useEffect(() => {
    if (score !== null && displayScore !== score) {
      const duration = 1500; // Animation duration in ms
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = Math.ceil(score / steps);

      const timer = setInterval(() => {
        setDisplayScore((prev) => {
          if (prev + increment >= score) {
            clearInterval(timer);
            return score;
          }
          return prev + increment;
        });
      }, stepTime);

      return () => clearInterval(timer);
    } else if (score !== null && displayScore === score && !isCalculating) {
      // Play success sound when counting finishes
      playSuccessSound();
    }
  }, [score, displayScore, isCalculating]);

  const handleCalculate = () => {
    if (!name1.trim() || !name2.trim()) return;
    
    playClickSound();
    setIsCalculating(true);
    setScore(null);
    setDisplayScore(0);
    setAiAdvice(null);

    // Play heartbeat sounds during calculation
    playHeartbeatSound();
    const beatInterval = setInterval(() => {
      playHeartbeatSound();
    }, 800); // Roughly sync with animation

    // Simulate a "processing" delay for the beating heart effect
    setTimeout(() => {
      clearInterval(beatInterval);
      const result = calculateLoveScore(name1, name2);
      setScore(result);
      setIsCalculating(false);
    }, 1600);
  };

  const handleReset = () => {
    playClickSound();
    setName1('');
    setName2('');
    setScore(null);
    setDisplayScore(0);
    setAiAdvice(null);
  };

  const handleGetAdvice = async () => {
    playClickSound();
    if (score === null) return;
    setIsLoadingAdvice(true);
    const advice = await getRelationshipAdvice(name1, name2, score);
    setAiAdvice(advice);
    setIsLoadingAdvice(false);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Glassmorphism Card */}
      <div className="bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 md:p-10 text-center relative z-10 overflow-hidden">
        
        {/* Decorative background blurs */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        <h1 className="font-script text-5xl text-white drop-shadow-md mb-2">
          RG Love Calculator
        </h1>
        <p className="text-white/90 text-sm mb-8 font-light">
          Discover your destiny with deterministic love logic.
        </p>

        {score === null && !isCalculating ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-left text-white text-sm font-semibold ml-1">Name 1</label>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder="Romeo"
                className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/80 transition-all"
              />
            </div>

            <div className="flex justify-center items-center text-white/80">
              <HeartIcon className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <label className="block text-left text-white text-sm font-semibold ml-1">Name 2</label>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="Juliet"
                className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/80 transition-all"
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={!name1.trim() || !name2.trim()}
              className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95"
            >
              Calculate Love
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            {isCalculating ? (
              <div className="flex flex-col items-center">
                <HeartIcon className="w-24 h-24 text-white animate-ping absolute opacity-20" />
                <HeartIcon className="w-24 h-24 text-red-500 animate-pulse drop-shadow-lg" />
                <p className="mt-6 text-white font-script text-2xl animate-bounce">Consulting the stars...</p>
              </div>
            ) : (
              <div className="animate-fade-in-up w-full">
                <div className="text-white/90 text-lg mb-2 font-medium">
                  {name1} & {name2}
                </div>
                
                <div className="relative flex items-center justify-center my-6">
                   <HeartIcon className="w-40 h-40 text-red-500/20 absolute blur-sm" />
                   <HeartIcon className="w-32 h-32 text-white drop-shadow-2xl" />
                   <span className="absolute text-5xl font-bold text-pink-600">
                     {displayScore}%
                   </span>
                </div>

                <div className="text-2xl font-script text-white mb-6 drop-shadow-md">
                  {getLoveMessage(score!)}
                </div>

                {/* AI Advice Section */}
                {aiAdvice ? (
                  <div className="bg-white/40 rounded-xl p-4 mb-6 text-gray-800 text-sm border border-white/50 shadow-inner">
                    <p className="italic">"{aiAdvice}"</p>
                  </div>
                ) : (
                   <button
                    onClick={handleGetAdvice}
                    disabled={isLoadingAdvice}
                    className="mb-6 text-xs text-white underline decoration-pink-300 underline-offset-4 hover:text-pink-100 transition-colors"
                  >
                    {isLoadingAdvice ? "Asking Gemini..." : "✨ Ask AI for relationship advice ✨"}
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/40 font-semibold py-2 px-8 rounded-full transition-all backdrop-blur-sm active:scale-95"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};