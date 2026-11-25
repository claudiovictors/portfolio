import { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, GitFork, Star, X } from 'lucide-react';
import { FEATURED_PROJECTS_META, LANGUAGE_COLORS } from '../../data/profile';
import type { GitHubRepo, LanguageCode } from '../../types/portfolio';

interface ProjectDetailModalProps {
  repo: GitHubRepo | null;
  lang: LanguageCode;
  onClose: () => void;
}

export function ProjectDetailModal({
  repo,
  lang,
  onClose,
}: ProjectDetailModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!repo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [repo, onClose]);

  if (!repo) return null;

  const meta = FEATURED_PROJECTS_META.find(
    (m) => m.repoName.toLowerCase() === repo.name.toLowerCase(),
  );
  const langColor = repo.language
    ? LANGUAGE_COLORS[repo.language] ?? '#71717a'
    : '#71717a';

  const handleCopyClone = () => {
    navigator.clipboard
      ?.writeText(`git clone ${repo.html_url}.git`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => undefined);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${repo.name} repository details`}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-zinc-800 bg-[#0d0d11] overflow-hidden max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
              <span>{repo.full_name}</span>
              {repo.license && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{repo.license}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>Updated {repo.updated_at.slice(0, 10)}</span>
            </div>
            <h3 className="mt-1 font-display text-xl font-bold text-white">
              {repo.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer shrink-0"
            aria-label="Close repository modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {meta && (
            <div className="text-xs font-medium text-emerald-400">
              {meta.roleLabel[lang]}
            </div>
          )}

          <p className="text-sm text-zinc-200 leading-relaxed">
            {repo.description ||
              (lang === 'pt'
                ? 'Repositório público no GitHub sem descrição adicional.'
                : 'Public GitHub repository.')}
          </p>

          {meta && (
            <div className="p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800/80 text-xs sm:text-[13px] text-zinc-300 leading-relaxed">
              {meta.architectureSummary[lang]}
            </div>
          )}

          {/* Real GitHub Stats + Metadata */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-300 tabular-nums">
            {repo.language && (
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: langColor }}
                />
                <span>{repo.language}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>{repo.stargazers_count} stars</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-zinc-400" />
              <span>{repo.forks_count} forks</span>
            </span>
          </div>

          {/* Unboxed topic list */}
          {(meta?.verifiedTech.length || repo.topics.length > 0) && (
            <div className="text-xs font-mono text-zinc-400 flex flex-wrap items-center gap-x-2 gap-y-1">
              {(meta?.verifiedTech ?? repo.topics).map((tag, idx, arr) => (
                <span key={tag} className="inline-flex items-center gap-2">
                  <span>{tag}</span>
                  {idx < arr.length - 1 && (
                    <span aria-hidden="true" className="text-zinc-700">·</span>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Code preview if available */}
          {meta?.codePreview && (
            <div className="rounded-lg border border-zinc-800 bg-[#09090b] overflow-hidden">
              <div className="px-3.5 py-2 border-b border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>{meta.codePreview.filename}</span>
                <span>{meta.codePreview.language}</span>
              </div>
              <pre className="p-3.5 overflow-x-auto text-xs font-mono text-zinc-200 leading-relaxed">
                <code>{meta.codePreview.snippet}</code>
              </pre>
            </div>
          )}

          {/* Clone Command */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300">
            <span className="truncate">git clone {repo.html_url}.git</span>
            <button
              type="button"
              onClick={handleCopyClone}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-200 cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-end gap-2.5">
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
            >
              <span>Live demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-colors"
          >
            <span>Open on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
