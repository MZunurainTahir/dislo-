import React, { useState, useEffect } from 'react';
import { GenerationType } from '../../types';
import { ISLAMABAD_SLANGS_BY_GEN } from '../../data/islamabadData';

interface Props {
  generation: GenerationType;
  isUrdu: boolean;
}

export const FlyingBirdQuote: React.FC<Props> = ({ generation, isUrdu }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [currentQuote, setCurrentQuote] = useState<string>('');
  const [flightY, setFlightY] = useState<number>(25); // percentage from top

  const slangs = ISLAMABAD_SLANGS_BY_GEN[generation] || ISLAMABAD_SLANGS_BY_GEN['Gen Z'];

  const triggerBird = () => {
    const randomQuote = slangs[Math.floor(Math.random() * slangs.length)];
    const randomY = Math.floor(15 + Math.random() * 55);
    setCurrentQuote(randomQuote);
    setFlightY(randomY);
    setVisible(true);

    // Hide after 7 seconds
    setTimeout(() => {
      setVisible(false);
    }, 7000);
  };

  useEffect(() => {
    // Initial bird after 3 seconds
    const initialTimer = setTimeout(() => {
      triggerBird();
    }, 3000);

    // Then repeats every 14 seconds
    const interval = setInterval(() => {
      triggerBird();
    }, 14000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [generation]);

  if (!visible) return null;

  return (
    <div
      style={{ top: `${flightY}%` }}
      className="fixed left-0 z-50 pointer-events-auto flex items-center gap-2 animate-fly-across"
      onClick={() => triggerBird()}
      title="Click me for another Islamabad quote!"
    >
      {/* Animated Margalla Flying Bird */}
      <div className="relative text-3xl select-none filter drop-shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-bounce cursor-pointer">
        🕊️
      </div>

      {/* Speech Bubble */}
      <div className="bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 text-slate-100 text-xs px-3.5 py-2 rounded-2xl shadow-2xl max-w-xs transition-all relative">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            {isUrdu ? 'مارگلہ پرندہ وائب' : `${generation} Vibe Dropped`}
          </span>
        </div>
        <p className="text-xs font-semibold leading-snug text-white">
          "{currentQuote}"
        </p>

        {/* Bubble arrow */}
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-6 border-r-emerald-500/50" />
      </div>
    </div>
  );
};

