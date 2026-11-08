import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Volume2, Trophy, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Ghost {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}

export const PacmanGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('isb_pacman_highscore') || 1200);
  });
  const [lives, setLives] = useState<number>(3);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Board dimensions (19x15 grid)
  const TILE_SIZE = 24;
  const COLS = 19;
  const ROWS = 15;

  // 1 = wall, 0 = dot, 2 = empty, 3 = energizer
  const initialMap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,2,2,2,1,1,1,0,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
    [1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,1],
    [1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  const mapState = useRef<number[][]>(JSON.parse(JSON.stringify(initialMap)));
  const pacman = useRef({ x: 9, y: 12, dx: 0, dy: 0, nextDx: 0, nextDy: 0, mouth: 0.2, mouthDir: 0.05 });
  const ghosts = useRef<Ghost[]>([
    { x: 8, y: 7, dx: 1, dy: 0, color: '#ef4444' }, // Blinky Red
    { x: 9, y: 7, dx: -1, dy: 0, color: '#ec4899' }, // Pinky Pink
    { x: 10, y: 7, dx: 0, dy: -1, color: '#06b6d4' } // Inky Cyan
  ]);

  const resetGame = useCallback(() => {
    mapState.current = JSON.parse(JSON.stringify(initialMap));
    pacman.current = { x: 9, y: 12, dx: 0, dy: 0, nextDx: 0, nextDy: 0, mouth: 0.2, mouthDir: 0.05 };
    ghosts.current = [
      { x: 8, y: 7, dx: 1, dy: 0, color: '#ef4444' },
      { x: 9, y: 7, dx: -1, dy: 0, color: '#ec4899' },
      { x: 10, y: 7, dx: 0, dy: -1, color: '#06b6d4' }
    ];
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setIsPlaying(true);
  }, []);

  const movePacman = (dx: number, dy: number) => {
    pacman.current.nextDx = dx;
    pacman.current.nextDy = dy;
    if (!isPlaying && !gameOver) setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        e.preventDefault();
        movePacman(0, -1);
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        e.preventDefault();
        movePacman(0, 1);
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        e.preventDefault();
        movePacman(-1, 0);
      } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
        movePacman(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  // Main Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = 0;
    const speedMs = 150; // step speed

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameStep = (time: number) => {
      if (!isPlaying || gameOver || gameWon) {
        draw();
        return;
      }

      if (time - lastTime > speedMs) {
        lastTime = time;
        update();
      }
      draw();
      animId = requestAnimationFrame(gameStep);
    };

    const update = () => {
      const p = pacman.current;
      const m = mapState.current;

      // Try turning to requested next direction
      const nextX = p.x + p.nextDx;
      const nextY = p.y + p.nextDy;
      if (m[nextY]?.[nextX] !== 1) {
        p.dx = p.nextDx;
        p.dy = p.nextDy;
      }

      // Move pacman in current direction
      const targetX = p.x + p.dx;
      const targetY = p.y + p.dy;
      if (m[targetY]?.[targetX] !== 1) {
        p.x = targetX;
        p.y = targetY;

        // Eat dot or energizer
        if (m[p.y][p.x] === 0) {
          m[p.y][p.x] = 2;
          setScore(s => {
            const next = s + 10;
            if (next > highScore) {
              setHighScore(next);
              localStorage.setItem('isb_pacman_highscore', String(next));
            }
            return next;
          });
        } else if (m[p.y][p.x] === 3) {
          m[p.y][p.x] = 2;
          setScore(s => s + 50);
        }
      }

      // Check win condition
      const dotsRemaining = m.flat().filter(tile => tile === 0 || tile === 3).length;
      if (dotsRemaining === 0) {
        setGameWon(true);
        setIsPlaying(false);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        return;
      }

      // Move ghosts
      ghosts.current.forEach(g => {
        const dirs = [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 }
        ].filter(d => m[g.y + d.dy]?.[g.x + d.dx] !== 1);

        // Pick direction heading closer to pacman occasionally or random
        if (Math.random() > 0.4 && dirs.length > 0) {
          dirs.sort((a, b) => {
            const distA = Math.hypot(g.x + a.dx - p.x, g.y + a.dy - p.y);
            const distB = Math.hypot(g.x + b.dx - p.x, g.y + b.dy - p.y);
            return distA - distB;
          });
        }
        const chosen = dirs[0] || { dx: 0, dy: 0 };
        g.dx = chosen.dx;
        g.dy = chosen.dy;
        g.x += g.dx;
        g.y += g.dy;

        // Check collision with pacman
        if (g.x === p.x && g.y === p.y) {
          setLives(l => {
            const left = l - 1;
            if (left <= 0) {
              setGameOver(true);
              setIsPlaying(false);
            } else {
              // reset positions
              p.x = 9; p.y = 12; p.dx = 0; p.dy = 0;
            }
            return left;
          });
        }
      });
    };

    const draw = () => {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const m = mapState.current;

      // Draw Maze
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const tile = m[r][c];
          const px = c * TILE_SIZE;
          const py = r * TILE_SIZE;

          if (tile === 1) {
            ctx.fillStyle = '#1e3a8a';
            ctx.beginPath();
            ctx.roundRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4, 4);
            ctx.fill();
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else if (tile === 0) {
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 3, 0, Math.PI * 2);
            ctx.fill();
          } else if (tile === 3) {
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.stroke();
          }
        }
      }

      // Draw Pacman
      const p = pacman.current;
      const pacPx = p.x * TILE_SIZE + TILE_SIZE / 2;
      const pacPy = p.y * TILE_SIZE + TILE_SIZE / 2;
      
      let angle = 0;
      if (p.dx === 1) angle = 0;
      else if (p.dx === -1) angle = Math.PI;
      else if (p.dy === 1) angle = Math.PI / 2;
      else if (p.dy === -1) angle = -Math.PI / 2;

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(pacPx, pacPy, TILE_SIZE / 2 - 2, angle + 0.25 * Math.PI, angle + 1.75 * Math.PI);
      ctx.lineTo(pacPx, pacPy);
      ctx.fill();

      // Draw Ghosts
      ghosts.current.forEach(g => {
        const gx = g.x * TILE_SIZE + 3;
        const gy = g.y * TILE_SIZE + 3;
        const gw = TILE_SIZE - 6;

        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(gx + gw / 2, gy + gw / 2, gw / 2, Math.PI, 0, false);
        ctx.lineTo(gx + gw, gy + gw);
        ctx.lineTo(gx + (gw * 3) / 4, gy + (gw * 3) / 4);
        ctx.lineTo(gx + gw / 2, gy + gw);
        ctx.lineTo(gx + gw / 4, gy + (gw * 3) / 4);
        ctx.lineTo(gx, gy + gw);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(gx + gw / 3, gy + gw / 2.5, 3, 0, Math.PI * 2);
        ctx.arc(gx + (gw * 2) / 3, gy + gw / 2.5, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.arc(gx + gw / 3 + g.dx, gy + gw / 2.5 + g.dy, 1.5, 0, Math.PI * 2);
        ctx.arc(gx + (gw * 2) / 3 + g.dx, gy + gw / 2.5 + g.dy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    animId = requestAnimationFrame(gameStep);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, gameOver, gameWon, highScore]);

  return (
    <div className="flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      {/* Header telemetry */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-lg">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-yellow-300 font-semibold">High: {highScore}</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Score:</span>
            <span className="text-sm font-black text-white">{score}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 transition-all ${i < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-700 scale-75'}`}
            />
          ))}
        </div>
      </div>

      {/* Canvas view with overlay */}
      <div className="relative border-4 border-blue-600/40 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.25)] bg-slate-950">
        <canvas
          ref={canvasRef}
          width={COLS * TILE_SIZE}
          height={ROWS * TILE_SIZE}
          className="block"
        />

        {(!isPlaying && !gameOver && !gameWon) && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
            <p className="text-yellow-400 font-bold text-lg mb-2">PACMAN - ISLAMABAD ARCADE</p>
            <p className="text-xs text-slate-300 mb-4 max-w-xs">Use Keyboard Arrow keys or On-screen controls below to collect all food pellets and avoid ghosts!</p>
            <button
              onClick={() => setIsPlaying(true)}
              className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Start Pacman
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-red-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
            <p className="text-2xl font-black text-red-400 mb-1">GAME OVER</p>
            <p className="text-sm text-slate-200 mb-4">Ghosts got you! Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {gameWon && (
          <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
            <p className="text-2xl font-black text-yellow-400 mb-1">VICTORY!</p>
            <p className="text-sm text-slate-200 mb-4">You cleared all pellets in Islamabad! Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-screen Mobile & Touch controls */}
      <div className="mt-5 grid grid-cols-3 gap-2 w-48">
        <div />
        <button
          onClick={() => movePacman(0, -1)}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-yellow-500 active:text-slate-900 border border-slate-700 rounded-xl text-slate-100 flex items-center justify-center font-bold text-lg shadow-md transition-colors"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => movePacman(-1, 0)}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-yellow-500 active:text-slate-900 border border-slate-700 rounded-xl text-slate-100 flex items-center justify-center font-bold text-lg shadow-md transition-colors"
        >
          ◄
        </button>
        <button
          onClick={() => movePacman(0, 1)}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-yellow-500 active:text-slate-900 border border-slate-700 rounded-xl text-slate-100 flex items-center justify-center font-bold text-lg shadow-md transition-colors"
        >
          ▼
        </button>
        <button
          onClick={() => movePacman(1, 0)}
          className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-yellow-500 active:text-slate-900 border border-slate-700 rounded-xl text-slate-100 flex items-center justify-center font-bold text-lg shadow-md transition-colors"
        >
          ►
        </button>
      </div>
    </div>
  );
};

