import { useEffect, useState } from 'react';
import { Gamepad2, Terminal, X } from 'lucide-react';
import type {
  GitHubOverviewResponse,
  GitHubRepo,
  LanguageCode,
} from '../../types/portfolio';
import { DevArcadeGame } from './DevArcadeGame';
import { InteractiveTerminal } from './InteractiveTerminal';

interface LabModalProps {
  open: boolean;
  initialMode: 'terminal' | 'game';
  githubData: GitHubOverviewResponse;
  lang: LanguageCode;
  onClose: () => void;
  onOpenRepo: (repo: GitHubRepo) => void;
}

export function LabModal({
  open,
  initialMode,
  githubData,
  lang,
  onClose,
  onOpenRepo,
}: LabModalProps) {
  const [mode, setMode] = useState<'terminal' | 'game'>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Developer Terminal and Arcade"
    >
      <div
        className="w-full max-w-2xl border border-white/15 bg-[#080808] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMode('terminal')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors ${
                mode === 'terminal'
                  ? 'bg-[#22d3a6] text-[#080808] font-semibold'
                  : 'text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('game')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors ${
                mode === 'game'
                  ? 'bg-[#22d3a6] text-[#080808] font-semibold'
                  : 'text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>ByteSnake</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
            aria-label="Close developer lab"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          {mode === 'terminal' ? (
            <InteractiveTerminal
              githubData={githubData}
              lang={lang}
              onNavigate={() => {
                onClose();
                document
                  .getElementById('contact')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenRepo={(repo) => {
                onClose();
                onOpenRepo(repo);
              }}
              onLaunchGame={() => setMode('game')}
            />
          ) : (
            <DevArcadeGame lang={lang} />
          )}
        </div>
      </div>
    </div>
  );
}
