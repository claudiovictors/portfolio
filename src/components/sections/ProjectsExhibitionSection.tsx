import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GitFork,
  Search,
  Star,
} from 'lucide-react';
import { FEATURED_EXHIBITION, LANGUAGE_COLORS } from '../../data/profile';
import type {
  GitHubOverviewResponse,
  GitHubRepo,
  LanguageCode,
} from '../../types/portfolio';
import { ProjectVisualStage } from './ProjectVisualStage';

interface ProjectsExhibitionSectionProps {
  githubData: GitHubOverviewResponse;
  lang: LanguageCode;
  onOpenRepo: (repo: GitHubRepo) => void;
  activeLangFilter: string;
  onChangeLangFilter: (langFilter: string) => void;
}

export function ProjectsExhibitionSection({
  githubData,
  lang,
  onOpenRepo,
  activeLangFilter,
  onChangeLangFilter,
}: ProjectsExhibitionSectionProps) {
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'framework' | 'api' | 'mobile'
  >('all');
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const featuredItems = useMemo(() => {
    return FEATURED_EXHIBITION.map((spec) => {
      const repo = githubData.repos.find(
        (r) => r.name.toLowerCase() === spec.repoName.toLowerCase(),
      );
      return repo ? { spec, repo } : null;
    })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .filter(({ spec, repo }) => {
        if (categoryFilter !== 'all' && spec.category !== categoryFilter) {
          return false;
        }
        if (
          activeLangFilter !== 'All' &&
          repo.language?.toLowerCase() !== activeLangFilter.toLowerCase()
        ) {
          return false;
        }
        return true;
      });
  }, [githubData.repos, categoryFilter, activeLangFilter]);

  const archiveRepos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return githubData.repos
      .filter((r) => {
        if (
          activeLangFilter !== 'All' &&
          r.language?.toLowerCase() !== activeLangFilter.toLowerCase()
        ) {
          return false;
        }
        if (!q) return true;
        return (
          r.name.toLowerCase().includes(q) ||
          (r.description ?? '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.stargazers_count - a.stargazers_count);
  }, [githubData.repos, activeLangFilter, searchQuery]);

  return (
    <section
      id="work"
      className="py-20 sm:py-28 border-b border-white/[0.08] bg-[#080808]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-14">
        {/* Editorial Section Header + Elegant Filter Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono text-[#22d3a6]">
              03. {lang === 'pt' ? 'Exposição de Engenharia' : 'Selected Work'}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {lang === 'pt'
                ? 'Frameworks, APIs e sistemas reais.'
                : 'Frameworks, APIs & shipped systems.'}
            </h2>
            <p className="text-sm text-zinc-400">
              {lang === 'pt'
                ? 'Projetos selecionados diretamente do GitHub (@claudiovictors) — sem estatísticas inventadas.'
                : 'Curated directly from public GitHub repositories (@claudiovictors) with live repository metrics.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                ['all', lang === 'pt' ? 'Todos' : 'All'],
                ['framework', 'Frameworks'],
                ['api', 'APIs & Systems'],
                ['mobile', 'Mobile'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setCategoryFilter(key);
                  onChangeLangFilter('All');
                }}
                className={`px-3 py-1.5 text-xs font-mono border transition-colors cursor-pointer whitespace-nowrap ${
                  categoryFilter === key && activeLangFilter === 'All'
                    ? 'border-[#22d3a6] text-[#22d3a6] bg-[#22d3a6]/10'
                    : 'border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}

            {activeLangFilter !== 'All' && (
              <button
                type="button"
                onClick={() => onChangeLangFilter('All')}
                className="px-3 py-1.5 text-xs font-mono border border-[#f59e0b]/60 text-[#f59e0b] bg-[#f59e0b]/10 cursor-pointer whitespace-nowrap"
              >
                {activeLangFilter} ×
              </button>
            )}
          </div>
        </div>

        {/* Asymmetrical Alternating Project Exhibition */}
        {featuredItems.length === 0 ? (
          <div className="py-12 border border-white/10 bg-[#0b0b0e] text-center space-y-3">
            <p className="text-sm text-zinc-400">
              {lang === 'pt'
                ? 'Nenhum projeto em destaque corresponde ao filtro selecionado.'
                : 'No featured project matches that filter. Check the full GitHub archive below.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('all');
                onChangeLangFilter('All');
                setShowAllRepos(true);
              }}
              className="px-4 py-2 text-xs font-mono bg-[#22d3a6] text-[#080808] font-semibold cursor-pointer"
            >
              {lang === 'pt' ? 'Mostrar todos os projetos' : 'Reset filters & open archive'}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.08]">
            {featuredItems.map(({ spec, repo }, idx) => {
              const reversed = idx % 2 === 1;
              return (
                <article
                  key={repo.id}
                  className="py-12 first:pt-0 last:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                  {/* Editorial Copy Column (5 cols) */}
                  <div
                    className={`lg:col-span-5 space-y-4 ${
                      reversed ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div
                      className="text-xs font-mono font-medium"
                      style={{ color: spec.accentHex }}
                    >
                      {spec.roleLabel[lang]}
                    </div>

                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {repo.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400" />
                          <span>{repo.stargazers_count}</span>
                        </span>
                        {repo.forks_count > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <GitFork className="w-3.5 h-3.5" />
                            <span>{repo.forks_count}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-zinc-200 font-medium leading-snug">
                      {spec.tagline[lang]}
                    </p>

                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {repo.description || spec.architectureSummary[lang]}
                    </p>

                    <ul className="space-y-1.5 text-xs text-zinc-300 pt-1">
                      {spec.highlights[lang].map((line) => (
                        <li key={line} className="flex items-start gap-2">
                          <span
                            className="mt-1.5 w-1.5 h-1.5 shrink-0"
                            style={{ backgroundColor: spec.accentHex }}
                          />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Unboxed tech line */}
                    <div className="pt-2 text-xs font-mono text-zinc-500">
                      {spec.verifiedTech.join(' · ')}
                    </div>

                    {/* Links */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onOpenRepo(repo)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold text-[#080808] bg-white hover:bg-zinc-200 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>
                          {lang === 'pt' ? 'Abrir dossiê' : 'Inspect project'}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-white/15 hover:border-white/40 text-xs font-mono text-zinc-200 transition-colors whitespace-nowrap"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#22d3a6] hover:text-white transition-colors whitespace-nowrap"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Interactive Visual Stage Column (7 cols) */}
                  <div
                    className={`lg:col-span-7 ${
                      reversed ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <ProjectVisualStage spec={spec} />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Expandable Complete GitHub Archive Index */}
        <div className="pt-6 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={() => setShowAllRepos((v) => !v)}
            className="w-full py-4 px-5 border border-white/10 bg-[#0b0b0e] hover:border-white/25 transition-colors flex items-center justify-between text-left cursor-pointer"
          >
            <div>
              <div className="font-display text-base font-semibold text-white">
                {lang === 'pt'
                  ? `Arquivo Completo do GitHub (${githubData.repos.length} repositórios)`
                  : `Complete GitHub Archive (${githubData.repos.length} repositories)`}
              </div>
              <div className="text-xs font-mono text-zinc-500 mt-0.5">
                {githubData.source === 'live'
                  ? 'Synced live from api.github.com/users/claudiovictors'
                  : 'Verified snapshot · src/data/githubFallback.ts'}
              </div>
            </div>
            {showAllRepos ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {showAllRepos && (
            <div className="mt-4 border border-white/10 bg-[#0b0b0e] p-4 sm:p-5 space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search all public repositories..."
                  className="w-full pl-9 pr-3 py-2 bg-[#080808] border border-white/10 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#22d3a6]"
                />
              </div>

              <div className="divide-y divide-white/[0.06]">
                {archiveRepos.map((repo) => {
                  const color = repo.language
                    ? LANGUAGE_COLORS[repo.language] ?? '#71717a'
                    : '#71717a';
                  return (
                    <div
                      key={repo.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenRepo(repo)}
                            className="font-mono font-semibold text-zinc-100 hover:text-[#22d3a6] cursor-pointer"
                          >
                            {repo.name}
                          </button>
                          {repo.language && (
                            <span className="inline-flex items-center gap-1 text-zinc-400">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              <span>{repo.language}</span>
                            </span>
                          )}
                          <span className="text-amber-400 font-mono tabular-nums">
                            ★ {repo.stargazers_count}
                          </span>
                        </div>
                        {repo.description && (
                          <p className="text-zinc-400 mt-0.5 line-clamp-1">
                            {repo.description}
                          </p>
                        )}
                      </div>

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-zinc-400 hover:text-white shrink-0"
                      >
                        <span>Source</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
