import React, { useState } from 'react';
import { RotateCcw, Bot, Users, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
type PieceColor = 'w' | 'b';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type BoardState = (Piece | null)[][];

const PIECE_SYMBOLS: Record<string, string> = {
  'wp': '♙', 'wr': '♖', 'wn': '♘', 'wb': '♗', 'wq': '♕', 'wk': '♔',
  'bp': '♟', 'br': '♜', 'bn': '♞', 'bb': '♝', 'bq': '♛', 'bk': '♚'
};

const getInitialBoard = (): BoardState => {
  const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null));

  const backRank: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: backRank[c], color: 'b' };
    board[1][c] = { type: 'p', color: 'b' };
    board[6][c] = { type: 'p', color: 'w' };
    board[7][c] = { type: backRank[c], color: 'w' };
  }
  return board;
};

export const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(getInitialBoard);
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [turn, setTurn] = useState<PieceColor>('w');
  const [mode, setMode] = useState<'ai' | 'pvp'>('ai');
  const [capturedByWhite, setCapturedByWhite] = useState<Piece[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<Piece[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);

  // Compute legal candidate moves for standard pieces
  const getMovesForPiece = (r: number, c: number, currentBoard: BoardState): [number, number][] => {
    const piece = currentBoard[r][c];
    if (!piece) return [];
    const moves: [number, number][] = [];
    const color = piece.color;
    const opponent = color === 'w' ? 'b' : 'w';

    const addIfValid = (nr: number, nc: number) => {
      if (nr < 0 || nr > 7 || nc < 0 || nc > 7) return false;
      const target = currentBoard[nr][nc];
      if (!target) {
        moves.push([nr, nc]);
        return true; // continue sliding
      } else if (target.color === opponent) {
        moves.push([nr, nc]);
        return false; // hit enemy, stop sliding
      }
      return false; // hit friend, stop sliding
    };

    if (piece.type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      const startRank = color === 'w' ? 6 : 1;
      // Forward 1
      if (r + dir >= 0 && r + dir <= 7 && !currentBoard[r + dir][c]) {
        moves.push([r + dir, c]);
        // Forward 2
        if (r === startRank && !currentBoard[r + 2 * dir][c]) {
          moves.push([r + 2 * dir, c]);
        }
      }
      // Diagonal captures
      [-1, 1].forEach(dc => {
        const nr = r + dir;
        const nc = c + dc;
        if (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
          const target = currentBoard[nr][nc];
          if (target && target.color === opponent) {
            moves.push([nr, nc]);
          }
        }
      });
    }

    if (piece.type === 'n') {
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      knightOffsets.forEach(([dr, dc]) => addIfValid(r + dr, c + dc));
    }

    if (piece.type === 'b' || piece.type === 'q') {
      const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      diagDirs.forEach(([dr, dc]) => {
        let step = 1;
        while (addIfValid(r + dr * step, c + dc * step)) step++;
      });
    }

    if (piece.type === 'r' || piece.type === 'q') {
      const orthoDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      orthoDirs.forEach(([dr, dc]) => {
        let step = 1;
        while (addIfValid(r + dr * step, c + dc * step)) step++;
      });
    }

    if (piece.type === 'k') {
      const kingDirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];
      kingDirs.forEach(([dr, dc]) => addIfValid(r + dr, c + dc));
    }

    return moves;
  };

  const handleSquareClick = (r: number, c: number) => {
    if (winner) return;
    if (turn === 'b' && mode === 'ai') return; // wait for AI turn

    // If square already selected and clicked a legal move destination
    if (selectedSquare) {
      const [sr, sc] = selectedSquare;
      const isLegal = validMoves.some(([vr, vc]) => vr === r && vc === c);

      if (isLegal) {
        executeMove(sr, sc, r, c);
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }
    }

    // Select piece
    const piece = board[r][c];
    if (piece && piece.color === turn) {
      setSelectedSquare([r, c]);
      setValidMoves(getMovesForPiece(r, c, board));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const executeMove = (sr: number, sc: number, tr: number, tc: number) => {
    const piece = board[sr][sc];
    if (!piece) return;

    const targetPiece = board[tr][tc];
    const newBoard = board.map(row => [...row]);

    // Handle captures
    if (targetPiece) {
      if (piece.color === 'w') {
        setCapturedByWhite(prev => [...prev, targetPiece]);
        if (targetPiece.type === 'k') {
          setWinner('White (You) won by capturing King!');
          confetti({ particleCount: 120, spread: 70 });
        }
      } else {
        setCapturedByBlack(prev => [...prev, targetPiece]);
        if (targetPiece.type === 'k') {
          setWinner('Black (AI) won by capturing King!');
        }
      }
    }

    // Move piece
    newBoard[tr][tc] = piece;
    newBoard[sr][sc] = null;

    // Pawn Promotion to Queen
    if (piece.type === 'p') {
      if (piece.color === 'w' && tr === 0) newBoard[tr][tc] = { type: 'q', color: 'w' };
      if (piece.color === 'b' && tr === 7) newBoard[tr][tc] = { type: 'q', color: 'b' };
    }

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const notation = `${piece.type.toUpperCase()}${files[sc]}${8 - sr} → ${files[tc]}${8 - tr}`;
    setMoveHistory(prev => [notation, ...prev.slice(0, 7)]);
    setBoard(newBoard);

    const nextTurn = piece.color === 'w' ? 'b' : 'w';
    setTurn(nextTurn);

    // AI Response if playing vs AI
    if (nextTurn === 'b' && mode === 'ai' && !winner) {
      setTimeout(() => triggerAiMove(newBoard), 450);
    }
  };

  const triggerAiMove = (currentBoard: BoardState) => {
    const blackPieces: { r: number; c: number; moves: [number, number][] }[] = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c];
        if (p && p.color === 'b') {
          const moves = getMovesForPiece(r, c, currentBoard);
          if (moves.length > 0) blackPieces.push({ r, c, moves });
        }
      }
    }

    if (blackPieces.length === 0) {
      setWinner('Stalemate or Checkmate! White Wins!');
      confetti({ particleCount: 150 });
      return;
    }

    // Prioritize captures or advancing pieces
    let chosenPiece = blackPieces[0];
    let chosenTarget = chosenPiece.moves[0];

    let foundCapture = false;
    for (const item of blackPieces) {
      for (const [tr, tc] of item.moves) {
        const dest = currentBoard[tr][tc];
        if (dest && dest.color === 'w') {
          chosenPiece = item;
          chosenTarget = [tr, tc];
          foundCapture = true;
          break;
        }
      }
      if (foundCapture) break;
    }

    if (!foundCapture) {
      // Pick random black piece
      chosenPiece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
      chosenTarget = chosenPiece.moves[Math.floor(Math.random() * chosenPiece.moves.length)];
    }

    // Execute AI move
    const [sr, sc] = [chosenPiece.r, chosenPiece.c];
    const [tr, tc] = chosenTarget;
    const aiPiece = currentBoard[sr][sc]!;
    const destPiece = currentBoard[tr][tc];

    const updated = currentBoard.map(row => [...row]);
    if (destPiece) {
      setCapturedByBlack(prev => [...prev, destPiece]);
      if (destPiece.type === 'k') {
        setWinner('Black AI won by capturing King!');
      }
    }

    updated[tr][tc] = aiPiece;
    updated[sr][sc] = null;
    if (aiPiece.type === 'p' && tr === 7) updated[tr][tc] = { type: 'q', color: 'b' };

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    setMoveHistory(prev => [`AI: ${aiPiece.type.toUpperCase()}${files[sc]}${8 - sr} → ${files[tc]}${8 - tr}`, ...prev.slice(0, 7)]);
    setBoard(updated);
    setTurn('w');
  };

  const resetGame = () => {
    setBoard(getInitialBoard());
    setSelectedSquare(null);
    setValidMoves([]);
    setTurn('w');
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setMoveHistory([]);
    setWinner(null);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      {/* Left panel: Chessboard */}
      <div className="flex flex-col items-center">
        {/* Header telemetry */}
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-slate-400">Turn:</span>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              turn === 'w' 
                ? 'bg-amber-100 text-slate-950 border-amber-300' 
                : 'bg-slate-800 text-amber-300 border-amber-500/40'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {turn === 'w' ? 'White (You)' : (mode === 'ai' ? 'Black (Islamabad AI)' : 'Black')}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setMode('ai'); resetGame(); }}
              className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 border transition-colors ${
                mode === 'ai' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Bot className="w-3.5 h-3.5" /> vs AI
            </button>
            <button
              onClick={() => { setMode('pvp'); resetGame(); }}
              className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 border transition-colors ${
                mode === 'pvp' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> 2 Players
            </button>
            <button
              onClick={resetGame}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
              title="Reset Board"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 8x8 Board Container */}
        <div className="relative border-4 border-amber-950/60 rounded-xl overflow-hidden shadow-2xl bg-amber-950/20">
          <div className="grid grid-cols-8 w-[320px] sm:w-[380px] h-[320px] sm:h-[380px]">
            {board.map((row, r) =>
              row.map((piece, c) => {
                const isDark = (r + c) % 2 === 1;
                const isSelected = selectedSquare?.[0] === r && selectedSquare?.[1] === c;
                const isValidDest = validMoves.some(([vr, vc]) => vr === r && vc === c);

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleSquareClick(r, c)}
                    className={`relative flex items-center justify-center text-3xl sm:text-4xl select-none transition-colors ${
                      isSelected
                        ? 'bg-amber-400/70'
                        : isValidDest
                        ? (isDark ? 'bg-emerald-700/60' : 'bg-emerald-500/50')
                        : isDark
                        ? 'bg-amber-900/60'
                        : 'bg-amber-100/80'
                    }`}
                  >
                    {piece && (
                      <span
                        className={`transition-transform hover:scale-110 drop-shadow-md ${
                          piece.color === 'w' ? 'text-amber-50' : 'text-slate-900'
                        }`}
                      >
                        {PIECE_SYMBOLS[`${piece.color}${piece.type}`]}
                      </span>
                    )}

                    {isValidDest && !piece && (
                      <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {winner && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
              <Award className="w-12 h-12 text-yellow-400 mb-2" />
              <p className="text-xl font-bold text-yellow-300 mb-2">{winner}</p>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> New Chess Match
              </button>
            </div>
          )}
        </div>

        {/* Captured Tray */}
        <div className="w-full flex justify-between mt-3 text-sm px-1">
          <div className="flex items-center gap-1 text-slate-300">
            <span className="text-xs text-slate-500">Captured:</span>
            {capturedByWhite.map((p, i) => (
              <span key={i} className="text-base text-slate-800">{PIECE_SYMBOLS[`${p.color}${p.type}`]}</span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            {capturedByBlack.map((p, i) => (
              <span key={i} className="text-base text-amber-200">{PIECE_SYMBOLS[`${p.color}${p.type}`]}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel: Move history & Islamabad Grandmaster tips */}
      <div className="w-full lg:w-56 flex flex-col gap-3">
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Recent Moves
          </h4>
          <div className="space-y-1 font-mono text-xs text-slate-400 max-h-36 overflow-y-auto pr-1">
            {moveHistory.length === 0 ? (
              <p className="text-slate-600 text-[11px] italic">No moves played yet</p>
            ) : (
              moveHistory.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-800/50 py-0.5">
                  <span className="text-slate-500">#{idx + 1}</span>
                  <span className="text-emerald-400 font-semibold">{m}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1.5">
          <p className="font-bold text-yellow-400">💡 Mind Refresh Strategy:</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Chess stimulates neuroplasticity. Control the center squares (d4, e4, d5, e5) and stay patient just like climbing Margalla Trail 3!
          </p>
        </div>
      </div>
    </div>
  );
};

