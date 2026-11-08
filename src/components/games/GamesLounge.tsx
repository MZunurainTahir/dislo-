import React, { useState } from 'react';
import { PacmanGame } from './PacmanGame';
import { SnakeGame } from './SnakeGame';
import { ChessGame } from './ChessGame';
import { Gamepad2, Sparkles, Smile, Trophy } from 'lucide-react';

interface Props {
  isUrdu: boolean;
}

export const GamesLounge: React.FC<Props> = ({ isUrdu }) => {
  const [activeGame, setActiveGame] = useState<'pacman' | 'snake' | 'chess'>('pacman');

  return (
    <div className={`space-y-6 ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Lounge Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-2xl">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                {isUrdu ? 'اسلام آباد گیم لاؤنج (دماغ کو تروتازہ کریں)' : 'Islamabad Mind Refresh Game Lounge'}
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </h2>
              <p className="text-xs text-slate-400">
                {isUrdu 
                  ? 'پڑھائی یا کام کے بعد کلاسک پیک مین، مارگلہ سانپ اور شطرنج کھیل کر موڈ فریش کریں'
                  : 'Take a cognitive break with retro arcade Pacman, Margalla Snake & Grandmaster Chess vs AI'
                }
              </p>
            </div>
          </div>

          {/* Game Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveGame('pacman')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeGame === 'pacman'
                  ? 'bg-yellow-400 text-slate-950 shadow-md shadow-yellow-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🟡</span>
              <span>Pacman</span>
            </button>
            <button
              onClick={() => setActiveGame('snake')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeGame === 'snake'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🐍</span>
              <span>Snake</span>
            </button>
            <button
              onClick={() => setActiveGame('chess')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeGame === 'chess'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>♟️</span>
              <span>Chess</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Game Canvas / Board */}
      <div className="flex justify-center">
        {activeGame === 'pacman' && <PacmanGame />}
        {activeGame === 'snake' && <SnakeGame />}
        {activeGame === 'chess' && <ChessGame />}
      </div>
    </div>
  );
};

