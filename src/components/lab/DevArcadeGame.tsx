import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { LanguageCode } from '../../types/portfolio';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const COLS = 20;
const ROWS = 14;
const CELL = 22;

const PACKETS = [
  { label: 'GO', color: '#00ADD8', points: 10 },
  { label: 'PHP', color: '#8892BF', points: 10 },
  { label: 'TS', color: '#3178C6', points: 15 },
  { label: 'SQL', color: '#10B981', points: 15 },
  { label: 'API', color: '#F59E0B', points: 25 },
];

const HIGH_SCORE_KEY = 'cv_bytesnake_highscore_v1';

function playTone(freq: number, duration: number, enabled: boolean) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
    osc.onended = () => ctx.close().catch(() => undefined);
  } catch {
    // Audio blocked or unavailable
  }
}

interface DevArcadeGameProps {
  lang: LanguageCode;
}

export function DevArcadeGame({ lang }: DevArcadeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused' | 'gameover'>(
    'idle',
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
    } catch {
      return 0;
    }
  });
  const [wrapWalls, setWrapWalls] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lastPacket, setLastPacket] = useState<string>('GO');

  const snakeRef = useRef<Point[]>([
    { x: 8, y: 7 },
    { x: 7, y: 7 },
    { x: 6, y: 7 },
  ]);
  const dirRef = useRef<Direction>('RIGHT');
  const nextDirRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<{ pos: Point; packetIdx: number }>({
    pos: { x: 14, y: 7 },
    packetIdx: 0,
  });
  const scoreRef = useRef(0);
  const wrapRef = useRef(wrapWalls);
  const soundRef = useRef(soundEnabled);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    wrapRef.current = wrapWalls;
  }, [wrapWalls]);

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

  const spawnFood = useCallback((occupied: Point[]) => {
    let candidate: Point;
    let guard = 0;
    do {
      candidate = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
      guard++;
    } while (
      guard < 200 &&
      occupied.some((p) => p.x === candidate.x && p.y === candidate.y)
    );
    foodRef.current = {
      pos: candidate,
      packetIdx: Math.floor(Math.random() * PACKETS.length),
    };
  }, []);

  const resetGame = useCallback(
    (startImmediately = true) => {
      const initial: Point[] = [
        { x: 8, y: 7 },
        { x: 7, y: 7 },
        { x: 6, y: 7 },
      ];
      snakeRef.current = initial;
      dirRef.current = 'RIGHT';
      nextDirRef.current = 'RIGHT';
      scoreRef.current = 0;
      setScore(0);
      spawnFood(initial);
      setLastPacket(PACKETS[foodRef.current.packetIdx].label);
      setStatus(startImmediately ? 'playing' : 'idle');
    },
    [spawnFood],
  );

  const changeDirection = useCallback((dir: Direction) => {
    const cur = dirRef.current;
    if (
      (dir === 'UP' && cur === 'DOWN') ||
      (dir === 'DOWN' && cur === 'UP') ||
      (dir === 'LEFT' && cur === 'RIGHT') ||
      (dir === 'RIGHT' && cur === 'LEFT')
    ) {
      return;
    }
    nextDirRef.current = dir;
  }, []);

  // Draw board
  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = COLS * CELL;
    const h = ROWS * CELL;

    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, w, h);

    // Subtle circuit grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, h);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(w, y * CELL);
      ctx.stroke();
    }

    // Draw food packet
    const food = foodRef.current;
    const pkt = PACKETS[food.packetIdx];
    const fx = food.pos.x * CELL;
    const fy = food.pos.y * CELL;
    ctx.fillStyle = pkt.color;
    ctx.beginPath();
    ctx.roundRect(fx + 2, fy + 2, CELL - 4, CELL - 4, 4);
    ctx.fill();

    ctx.fillStyle = '#09090b';
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pkt.label, fx + CELL / 2, fy + CELL / 2 + 0.5);

    // Draw snake segments
    const snake = snakeRef.current;
    snake.forEach((seg, idx) => {
      const sx = seg.x * CELL;
      const sy = seg.y * CELL;
      const isHead = idx === 0;
      ctx.fillStyle = isHead
        ? '#10b981'
        : idx % 2 === 0
          ? '#059669'
          : '#047857';
      ctx.beginPath();
      ctx.roundRect(sx + 2, sy + 2, CELL - 4, CELL - 4, isHead ? 5 : 3);
      ctx.fill();

      if (isHead) {
        ctx.fillStyle = '#09090b';
        ctx.fillRect(sx + CELL / 2 - 2, sy + CELL / 2 - 2, 4, 4);
      }
    });
  }, []);

  // Initial render
  useEffect(() => {
    drawBoard();
  }, [drawBoard]);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing' && status !== 'paused') return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          setStatus((s) => (s === 'playing' ? 'paused' : 'playing'));
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [status, changeDirection]);

  // Game loop
  useEffect(() => {
    if (status !== 'playing') return;

    const speedMs = Math.max(75, 135 - Math.floor(scoreRef.current / 30) * 8);
    const timer = window.setInterval(() => {
      const snake = [...snakeRef.current];
      dirRef.current = nextDirRef.current;
      const head = { ...snake[0] };

      if (dirRef.current === 'UP') head.y -= 1;
      if (dirRef.current === 'DOWN') head.y += 1;
      if (dirRef.current === 'LEFT') head.x -= 1;
      if (dirRef.current === 'RIGHT') head.x += 1;

      if (wrapRef.current) {
        head.x = (head.x + COLS) % COLS;
        head.y = (head.y + ROWS) % ROWS;
      } else if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        playTone(180, 0.22, soundRef.current);
        setStatus('gameover');
        return;
      }

      const willEat =
        head.x === foodRef.current.pos.x && head.y === foodRef.current.pos.y;

      const bodyToCheck = willEat ? snake : snake.slice(0, -1);
      if (bodyToCheck.some((p) => p.x === head.x && p.y === head.y)) {
        playTone(180, 0.22, soundRef.current);
        setStatus('gameover');
        return;
      }

      snake.unshift(head);
      if (willEat) {
        const pkt = PACKETS[foodRef.current.packetIdx];
        const newScore = scoreRef.current + pkt.points;
        scoreRef.current = newScore;
        setScore(newScore);
        setLastPacket(pkt.label);
        playTone(540 + (newScore % 240), 0.08, soundRef.current);

        setHighScore((prev) => {
          const next = Math.max(prev, newScore);
          try {
            localStorage.setItem(HIGH_SCORE_KEY, String(next));
          } catch {
            // ignore storage errors
          }
          return next;
        });

        spawnFood(snake);
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
      drawBoard();
    }, speedMs);

    return () => window.clearInterval(timer);
  }, [status, drawBoard, spawnFood]);

  return (
    <div className="rounded-xl border border-zinc-800/90 bg-[#0b0b0f] overflow-hidden">
      {/* Top Score & Controls Strip */}
      <div className="px-4 py-3 border-b border-zinc-800/80 bg-zinc-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
          <div>
            <span className="text-zinc-500">SCORE </span>
            <span className="text-emerald-400 font-semibold">{score}</span>
          </div>
          <div>
            <span className="text-zinc-500">BEST </span>
            <span className="text-zinc-200 font-semibold">{highScore}</span>
          </div>
          <div className="hidden sm:block text-zinc-500">
            PKT: <span className="text-sky-400">{lastPacket}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWrapWalls((v) => !v)}
            className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-white cursor-pointer"
          >
            {wrapWalls ? 'Wrap: ON' : 'Walls: SOLID'}
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled((v) => !v)}
            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            title={soundEnabled ? 'Sound on' : 'Sound muted'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          {status === 'playing' ? (
            <button
              type="button"
              onClick={() => setStatus('paused')}
              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200 inline-flex items-center gap-1 cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                status === 'paused' ? setStatus('playing') : resetGame(true)
              }
              className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{status === 'paused' ? 'Resume' : 'Play'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Canvas Container */}
      <div
        className="relative flex items-center justify-center p-3 sm:p-4 bg-[#09090b]"
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchStartRef.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          if (!touchStartRef.current) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - touchStartRef.current.x;
          const dy = t.clientY - touchStartRef.current.y;
          touchStartRef.current = null;
          if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
          if (Math.abs(dx) > Math.abs(dy)) {
            changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
          } else {
            changeDirection(dy > 0 ? 'DOWN' : 'UP');
          }
        }}
      >
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="w-full max-w-[440px] aspect-[20/14] rounded-lg border border-zinc-800/90"
        />

        {status !== 'playing' && (
          <div className="absolute inset-0 bg-zinc-950/80 flex flex-col items-center justify-center p-4 text-center">
            <h4 className="font-display text-lg font-semibold text-white">
              {status === 'gameover'
                ? lang === 'pt'
                  ? 'Fim de jogo'
                  : 'Game over'
                : status === 'paused'
                  ? lang === 'pt'
                    ? 'Em pausa'
                    : 'Paused'
                  : 'ByteSnake — Packet Router'}
            </h4>
            <p className="mt-1 text-xs text-zinc-400 max-w-xs">
              {status === 'gameover'
                ? `${lang === 'pt' ? 'Pontuação final' : 'Final score'}: ${score}`
                : lang === 'pt'
                  ? 'Recolhe pacotes GO, PHP, TS, SQL e API usando WASD, setas ou swipe.'
                  : 'Collect GO, PHP, TS, SQL and API packets using WASD, arrow keys, or touch controls.'}
            </p>
            <button
              type="button"
              onClick={() =>
                status === 'paused' ? setStatus('playing') : resetGame(true)
              }
              className="mt-3 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              {status === 'gameover' ? (
                <RotateCcw className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              <span>
                {status === 'gameover'
                  ? lang === 'pt'
                    ? 'Jogar novamente'
                    : 'Play again'
                  : status === 'paused'
                    ? lang === 'pt'
                      ? 'Continuar'
                      : 'Resume'
                    : lang === 'pt'
                      ? 'Iniciar jogo'
                      : 'Start game'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch D-Pad + Desktop Hint */}
      <div className="border-t border-zinc-800/80 px-4 py-3 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[11px] font-mono text-zinc-500">
          {lang === 'pt'
            ? 'Teclado: WASD / Setas · Espaço para pausar'
            : 'Keyboard: WASD / Arrows · Space to pause'}
        </span>

        {/* Touch D-Pad (44px+ buttons) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => changeDirection('LEFT')}
            className="w-11 h-11 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-200 cursor-pointer active:bg-emerald-500/20"
            aria-label="Move left"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => changeDirection('UP')}
            className="w-11 h-11 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-200 cursor-pointer active:bg-emerald-500/20"
            aria-label="Move up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => changeDirection('DOWN')}
            className="w-11 h-11 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-200 cursor-pointer active:bg-emerald-500/20"
            aria-label="Move down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => changeDirection('RIGHT')}
            className="w-11 h-11 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-200 cursor-pointer active:bg-emerald-500/20"
            aria-label="Move right"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
