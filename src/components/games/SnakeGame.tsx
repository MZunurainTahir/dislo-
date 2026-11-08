import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Point {
  x: number;
  y: number;
}

const FOOD_ICONS = ['🍗', '🍕', '☕', '🍔', '🥟'];

export const SnakeGame: React.FC = () => {
  const GRID_SIZE = 20;
  const CELL_COUNT = 18; // 18x18

  const [snake, setSnake] = useState<Point[]>([
    { x: 8, y: 9 },
    { x: 7, y: 9 },
    { x: 6, y: 9 }
  ]);
  const [food, setFood] = useState<Point>({ x: 12, y: 9 });
  const [foodIconIndex, setFoodIconIndex] = useState<number>(0);
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [nextDir, setNextDir] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('isb_snake_highscore') || 180);
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let collision: boolean;
    do {
      newFood = {
        x: Math.floor(Math.random() * CELL_COUNT),
        y: Math.floor(Math.random() * CELL_COUNT)
      };
      // eslint-disable-next-line no-loop-func
      collision = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
    } while (collision);
    return newFood;
  }, [CELL_COUNT]);

  const resetGame = () => {
    const initSnake: Point[] = [
      { x: 8, y: 9 },
      { x: 7, y: 9 },
      { x: 6, y: 9 }
    ];
    setSnake(initSnake);
    setDirection('RIGHT');
    setNextDir('RIGHT');
    setFood(spawnFood(initSnake));
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const changeDirection = (newDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (newDir === 'UP' && direction !== 'DOWN') setNextDir('UP');
    if (newDir === 'DOWN' && direction !== 'UP') setNextDir('DOWN');
    if (newDir === 'LEFT' && direction !== 'RIGHT') setNextDir('LEFT');
    if (newDir === 'RIGHT' && direction !== 'LEFT') setNextDir('RIGHT');
    if (!isPlaying && !gameOver) setIsPlaying(true);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        e.preventDefault();
        changeDirection('UP');
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        e.preventDefault();
        changeDirection('DOWN');
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        e.preventDefault();
        changeDirection('LEFT');
      } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
        changeDirection('RIGHT');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [direction, isPlaying, gameOver]);

  // Game tick
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setDirection(nextDir);
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };

        if (nextDir === 'UP') head.y -= 1;
        if (nextDir === 'DOWN') head.y += 1;
        if (nextDir === 'LEFT') head.x -= 1;
        if (nextDir === 'RIGHT') head.x += 1;

        // Wall collision
        if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const next = s + 10;
            if (next > highScore) {
              setHighScore(next);
              localStorage.setItem('isb_snake_highscore', String(next));
            }
            if (next % 100 === 0) {
              confetti({ particleCount: 70, spread: 60 });
            }
            return next;
          });
          setFood(spawnFood(newSnake));
          setFoodIconIndex(i => (i + 1) % FOOD_ICONS.length);
        } else {
          newSnake.pop(); // remove tail
        }

        return newSnake;
      });
    }, 130);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, nextDir, food, highScore, spawnFood, CELL_COUNT]);

  return (
    <div className="flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      {/* Header telemetry */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-lg">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-yellow-300 font-semibold">High: {highScore}</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Score:</span>
            <span className="text-sm font-black text-white">{score}</span>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Snake Board */}
      <div 
        className="relative border-4 border-emerald-600/40 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.2)] bg-slate-950"
        style={{ width: CELL_COUNT * GRID_SIZE, height: CELL_COUNT * GRID_SIZE }}
      >
        {/* Snake body */}
        {snake.map((seg, idx) => (
          <div
            key={idx}
            className={`absolute rounded-xs transition-all ${
              idx === 0
                ? 'bg-emerald-400 shadow-[0_0_10px_#10b981] z-10'
                : 'bg-emerald-600/90'
            }`}
            style={{
              left: seg.x * GRID_SIZE,
              top: seg.y * GRID_SIZE,
              width: GRID_SIZE - 2,
              height: GRID_SIZE - 2,
              borderRadius: idx === 0 ? '6px' : '3px'
            }}
          />
        ))}

        {/* Food item */}
        <div
          className="absolute flex items-center justify-center text-sm animate-bounce"
          style={{
            left: food.x * GRID_SIZE,
            top: food.y * GRID_SIZE,
            width: GRID_SIZE,
            height: GRID_SIZE
          }}
        >
          {FOOD_ICONS[foodIconIndex]}
        </div>

        {/* Start Overlay */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
            <p className="text-emerald-400 font-bold text-lg mb-2">MARGALLA RETRO SNAKE</p>
            <p className="text-xs text-slate-300 mb-4 max-w-xs">Eat Savour Shami, Cheezious slices & Karak Chai cups to grow your score!</p>
            <button
              onClick={() => setIsPlaying(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Start Snake
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-red-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
            <p className="text-2xl font-black text-red-400 mb-1">CRASHED!</p>
            <p className="text-sm text-slate-200 mb-4">You scored {score} points in Margalla Trail!</p>
            <button
              onClick={resetGame}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-screen controls */}
      <div className="mt-5 grid grid-cols-3 gap-2 w-48">
        <div />
        <button
          onClick={() => changeDirection('UP')}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-emerald-500 active:text-slate-900 border border-slate-700 rounded-xl text-slate-100 flex items-center justify-center font-bold text-lg shadow-md transition-colors"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => changeDirection('LEFT')}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-emerald-500 active:text-slate-900 border border-slate-700 rounded-xl text-slate-100 flex items-center justify-center font-bold text-lg shadow-md transition-colors"
        >
          ◄
        </button>
        <button
          onClick={() => changeDirection('DOWN')}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-emerald-500 active:text-slate-900 border border-slate-700 rounded-xl text-slate-100 flex items-center justify-center font-bold text-lg shadow-md transition-colors"
        >
          ▼
        </button>
        <button
          onClick={() => changeDirection('RIGHT')}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-emerald-500 active:text-slate-900 border border-slate-700 rounded-xl text-slate-100 flex items-center justify-center font-bold text-lg shadow-md transition-colors"
        >
          ►
        </button>
      </div>
    </div>
  );
};

