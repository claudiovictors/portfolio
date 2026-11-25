import { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react';
import { PROFILE_CONFIG, TECH_STACK_ITEMS } from '../../data/profile';
import type {
  GitHubOverviewResponse,
  GitHubRepo,
  LanguageCode,
  NavSection,
} from '../../types/portfolio';

interface TerminalLine {
  id: string;
  type: 'cmd' | 'output' | 'error' | 'accent';
  text: string;
}

interface InteractiveTerminalProps {
  githubData: GitHubOverviewResponse;
  lang: LanguageCode;
  onNavigate: (section: NavSection) => void;
  onOpenRepo: (repo: GitHubRepo) => void;
  onLaunchGame?: () => void;
}

const COMMAND_LIST = [
  'help',
  'about',
  'projects',
  'skills',
  'github',
  'activity',
  'contact',
  'whoami',
  'ls',
  'cat README.md',
  'game',
  'clear',
];

export function InteractiveTerminal({
  githubData,
  lang,
  onNavigate,
  onOpenRepo,
  onLaunchGame,
}: InteractiveTerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'boot-1',
      type: 'accent',
      text: 'claudio@luanda — interactive shell (Linux x86_64)',
    },
    {
      id: 'boot-2',
      type: 'output',
      text:
        lang === 'pt'
          ? 'Escreve "help" para listar os comandos disponíveis ou usa os atalhos abaixo.'
          : 'Type "help" to list available commands or use the quick shortcuts below.',
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const pushLines = (entries: Omit<TerminalLine, 'id'>[]) => {
    setLines((prev) => [
      ...prev,
      ...entries.map((e, i) => ({
        ...e,
        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      })),
    ]);
  };

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    setHistory((prev) => [trimmed, ...prev].slice(0, 30));
    setHistoryIdx(-1);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const echo: Omit<TerminalLine, 'id'> = {
      type: 'cmd',
      text: `claudio@luanda:~$ ${trimmed}`,
    };

    if (cmd === 'clear') {
      setLines([]);
      setInput('');
      return;
    }

    const out: Omit<TerminalLine, 'id'>[] = [echo];

    switch (cmd) {
      case 'help':
        out.push(
          { type: 'accent', text: 'Available commands:' },
          { type: 'output', text: '  about               Who Cláudio is & engineering focus' },
          { type: 'output', text: '  projects [--lang X] List real GitHub repositories (e.g. --lang go)' },
          { type: 'output', text: '  open <repo>         Inspect a repository (e.g. open kite)' },
          { type: 'output', text: '  skills              Categorized programming stack' },
          { type: 'output', text: '  github              Live GitHub telemetry & stats' },
          { type: 'output', text: '  activity            Recent GitHub public events' },
          { type: 'output', text: '  contact             Links & availability' },
          { type: 'output', text: '  cat README.md       Read profile manifesto' },
          { type: 'output', text: '  game                Switch to ByteSnake arcade game' },
          { type: 'output', text: '  clear               Clear terminal buffer' },
        );
        break;

      case 'whoami':
        out.push({
          type: 'output',
          text: `${PROFILE_CONFIG.name} (@${PROFILE_CONFIG.username}) — ${PROFILE_CONFIG.role} · ${PROFILE_CONFIG.location}`,
        });
        break;

      case 'ls':
        out.push({
          type: 'output',
          text: 'README.md   kite/   slenix/   stash/   oche/   sos-mobile/   clinic-api/   netpos/',
        });
        break;

      case 'cat':
        if (args[0]?.toLowerCase() === 'readme.md') {
          out.push(
            { type: 'accent', text: '# Cláudio Victor (@claudiovictors)' },
            {
              type: 'output',
              text: 'Building zero-dependency frameworks (Kite in Go, Slenix in PHP, Oche in Dart), REST APIs, and full-stack software from Luanda, Angola.',
            },
            {
              type: 'output',
              text: `Status: ${PROFILE_CONFIG.availability[lang]}`,
            },
          );
        } else {
          out.push({
            type: 'error',
            text: `cat: ${args[0] ?? ''}: No such file. Try "cat README.md"`,
          });
        }
        break;

      case 'about':
        out.push(
          { type: 'accent', text: `${PROFILE_CONFIG.name} · ${PROFILE_CONFIG.location}` },
          {
            type: 'output',
            text: 'Software developer focused on backend architecture, web frameworks, REST APIs, and open-source developer tools.',
          },
          {
            type: 'output',
            text: 'Creator of Kite (Go), Slenix (PHP MVC), Stash (Go HTTP sessions), and Oche (Dart).',
          },
          {
            type: 'output',
            text: `Availability: ${PROFILE_CONFIG.availability.en}`,
          },
        );
        break;

      case 'projects': {
        const langIdx = args.indexOf('--lang');
        const filterLang =
          langIdx !== -1 && args[langIdx + 1]
            ? args[langIdx + 1].toLowerCase()
            : null;
        const matched = githubData.repos
          .filter((r) => !r.fork)
          .filter((r) =>
            filterLang ? (r.language ?? '').toLowerCase() === filterLang : true,
          )
          .slice(0, 10);

        if (matched.length === 0) {
          out.push({
            type: 'error',
            text: `No repositories matched filter "${filterLang}".`,
          });
        } else {
          out.push({
            type: 'accent',
            text: `Showing ${matched.length} repositories${filterLang ? ` (${filterLang})` : ''} — type "open <name>" to inspect:`,
          });
          matched.forEach((r) => {
            out.push({
              type: 'output',
              text: `  ${r.name.padEnd(16, ' ')} ${(r.language ?? 'Text').padEnd(11, ' ')} ★ ${String(r.stargazers_count).padEnd(3, ' ')} ${r.description ? r.description.slice(0, 56) : ''}`,
            });
          });
        }
        break;
      }

      case 'open': {
        const target = args[0]?.toLowerCase();
        if (!target) {
          out.push({
            type: 'error',
            text: 'Usage: open <repo-name> (e.g. open kite, open slenix, open stash)',
          });
          break;
        }
        const found = githubData.repos.find(
          (r) => r.name.toLowerCase() === target,
        );
        if (found) {
          out.push({
            type: 'accent',
            text: `Opening ${found.full_name} (${found.language ?? 'Multi'})...`,
          });
          onOpenRepo(found);
        } else {
          out.push({
            type: 'error',
            text: `Repository "${target}" not found. Run "projects" to see names.`,
          });
        }
        break;
      }

      case 'skills': {
        const groups = {
          Languages: TECH_STACK_ITEMS.filter((i) => i.category === 'languages')
            .map((i) => i.name)
            .join(', '),
          Frameworks: TECH_STACK_ITEMS.filter((i) => i.category === 'frameworks')
            .map((i) => i.name)
            .join(', '),
          Databases: TECH_STACK_ITEMS.filter((i) => i.category === 'databases')
            .map((i) => i.name)
            .join(', '),
          Tools: TECH_STACK_ITEMS.filter((i) => i.category === 'tools')
            .map((i) => i.name)
            .join(', '),
          OS: TECH_STACK_ITEMS.filter((i) => i.category === 'os')
            .map((i) => i.name)
            .join(', '),
        };
        out.push({ type: 'accent', text: 'Technical Stack:' });
        Object.entries(groups).forEach(([k, v]) => {
          out.push({ type: 'output', text: `  ${k.padEnd(12, ' ')} ${v}` });
        });
        break;
      }

      case 'github':
        out.push(
          {
            type: 'accent',
            text: `GitHub @${githubData.profile.login} (${githubData.source === 'live' ? 'Live API' : 'Verified Snapshot'})`,
          },
          {
            type: 'output',
            text: `  Public repos: ${githubData.profile.public_repos}   Followers: ${githubData.profile.followers}   Following: ${githubData.profile.following}   Total stars: ${githubData.stats.totalStars}`,
          },
          {
            type: 'output',
            text: `  Top languages: ${githubData.stats.languages.slice(0, 4).map((l) => `${l.language} (${l.count})`).join(' · ')}`,
          },
          {
            type: 'output',
            text: `  URL: ${githubData.profile.html_url}`,
          },
        );
        break;

      case 'activity':
        out.push({ type: 'accent', text: 'Recent GitHub public events:' });
        githubData.events.slice(0, 5).forEach((ev) => {
          out.push({
            type: 'output',
            text: `  ${ev.created_at.slice(0, 10)}  ${ev.type.replace('Event', '').padEnd(8, ' ')}  ${ev.repo}`,
          });
        });
        break;

      case 'contact':
        out.push(
          { type: 'accent', text: 'Connect with Cláudio Victor:' },
          { type: 'output', text: `  GitHub:    ${PROFILE_CONFIG.links.github}` },
          { type: 'output', text: `  LinkedIn:  ${PROFILE_CONFIG.links.linkedin}` },
          { type: 'output', text: `  X:         ${PROFILE_CONFIG.links.x}` },
          { type: 'output', text: `  Portfolio: ${PROFILE_CONFIG.links.legacyPortfolio}` },
          { type: 'output', text: '  Navigating to Contact composer...' },
        );
        onNavigate('contact');
        break;

      case 'game':
        if (onLaunchGame) {
          out.push({ type: 'accent', text: 'Launching ByteSnake arcade...' });
          onLaunchGame();
        } else {
          out.push({
            type: 'output',
            text: 'Use the ByteSnake tab to play the arcade game.',
          });
        }
        break;

      default:
        out.push({
          type: 'error',
          text: `bash: ${cmd}: command not found. Type "help" for available commands.`,
        });
    }

    pushLines(out);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx <= 0) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = input.trim().toLowerCase();
      if (!val) return;
      const match = COMMAND_LIST.find((c) => c.startsWith(val));
      if (match) setInput(match);
    }
  };

  return (
    <div
      className="rounded-xl border border-zinc-800/90 bg-[#0b0b0f] overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Linux Window Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-950">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>claudio@luanda: ~</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLines([]);
          }}
          className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 cursor-pointer"
          aria-label="Clear terminal"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>clear</span>
        </button>
      </div>

      {/* Output Log */}
      <div
        ref={scrollRef}
        className="h-72 sm:h-80 overflow-y-auto p-4 font-mono text-xs sm:text-[13px] leading-relaxed space-y-1"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={`whitespace-pre-wrap break-words ${
              line.type === 'cmd'
                ? 'text-zinc-100 font-medium mt-1.5'
                : line.type === 'accent'
                  ? 'text-emerald-400'
                  : line.type === 'error'
                    ? 'text-rose-400'
                    : 'text-zinc-400'
            }`}
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* Prompt Input */}
      <div className="border-t border-zinc-800/70 px-4 py-2.5 flex items-center gap-2 font-mono text-xs sm:text-[13px] bg-zinc-950/60">
        <span className="text-emerald-400 shrink-0 select-none">
          claudio@luanda:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type a command (help, projects, open kite)..."
          aria-label="Terminal command input"
          spellCheck={false}
          autoComplete="off"
          className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
        />
      </div>

      {/* Quick Command Bar (Mobile & Discovery Friendly) */}
      <div className="border-t border-zinc-800/70 px-3 py-2 flex items-center gap-1.5 overflow-x-auto bg-zinc-950">
        {['help', 'about', 'projects', 'open kite', 'skills', 'github', 'activity', 'contact'].map(
          (shortcut) => (
            <button
              key={shortcut}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                runCommand(shortcut);
              }}
              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-emerald-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {shortcut}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
