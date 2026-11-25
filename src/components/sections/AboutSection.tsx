import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ENGINEERING_TIMELINE, PROFILE_CONFIG } from '../../data/profile';
import type {
  GitHubOverviewResponse,
  GitHubRepo,
  LanguageCode,
} from '../../types/portfolio';

interface AboutSectionProps {
  githubData: GitHubOverviewResponse;
  lang: LanguageCode;
  onOpenRepo: (repo: GitHubRepo) => void;
}

const FOCUS_LENSES = [
  {
    id: 'systems',
    label: { en: 'Systems & Frameworks', pt: 'Sistemas & Frameworks' },
    copy: {
      en: 'Instead of treating frameworks as black boxes, I design routers, middleware chains, session stores, and ORMs directly on top of language standard libraries.',
      pt: 'Em vez de tratar frameworks como caixas pretas, desenho routers, cadeias de middleware, sessões e ORMs diretamente sobre a biblioteca padrão das linguagens.',
    },
  },
  {
    id: 'apis',
    label: { en: 'Backend & APIs', pt: 'Backend & APIs' },
    copy: {
      en: 'Designing predictable REST contracts, stateless JWT authentication, signed HTTP cookies, and clean relational schemas across MySQL, PostgreSQL, and SQLite.',
      pt: 'Desenho de contratos REST previsíveis, autenticação JWT stateless, cookies assinados e esquemas relacionais sólidos em MySQL, PostgreSQL e SQLite.',
    },
  },
  {
    id: 'products',
    label: { en: 'Full-Stack Delivery', pt: 'Entrega Full-Stack' },
    copy: {
      en: 'Translating backend foundations into real-world products — from multi-tenant POS software to mobile emergency response tooling tailored for Angola.',
      pt: 'Transformação de bases backend em produtos reais — de plataformas POS multi-tenant a aplicações móveis de emergência cívica para Angola.',
    },
  },
] as const;

export function AboutSection({
  githubData,
  lang,
  onOpenRepo,
}: AboutSectionProps) {
  const [lensId, setLensId] = useState<'systems' | 'apis' | 'products'>('systems');
  const activeLens =
    FOCUS_LENSES.find((l) => l.id === lensId) ?? FOCUS_LENSES[0];

  return (
    <section
      id="about"
      className="py-20 sm:py-28 border-b border-white/[0.08] bg-[#080808]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left Sticky Editorial Narrative (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="text-xs font-mono text-[#22d3a6]">
              01. {lang === 'pt' ? 'Sobre o Engenheiro' : 'About & Philosophy'}
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-[1.1]">
              {lang === 'pt' ? (
                <>
                  Curiosidade aplicada à{' '}
                  <span className="font-editorial font-normal text-zinc-300">
                    arquitetura
                  </span>{' '}
                  e ferramentas.
                </>
              ) : (
                <>
                  Driven by how software works{' '}
                  <span className="font-editorial font-normal text-zinc-300">
                    underneath
                  </span>
                  .
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              {lang === 'pt'
                ? 'Sou desenvolvedor de software em Luanda, Angola. Gosto de explorar linguagens de programação construindo frameworks, APIs, bibliotecas e aplicações web completas.'
                : 'Based in Luanda, Angola, I build software by exploring languages deeply—creating frameworks, REST APIs, CLI utilities, and full-stack applications from first principles.'}
            </p>

            {/* Interactive Lens Switcher */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {FOCUS_LENSES.map((lens) => (
                  <button
                    key={lens.id}
                    type="button"
                    onClick={() => setLensId(lens.id)}
                    className={`px-3 py-1.5 text-xs font-mono border transition-colors cursor-pointer whitespace-nowrap ${
                      lensId === lens.id
                        ? 'border-[#22d3a6] text-[#22d3a6] bg-[#22d3a6]/10'
                        : 'border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {lens.label[lang]}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-[#0d0d10] border border-white/[0.08] text-sm text-zinc-300 leading-relaxed">
                {activeLens.copy[lang]}
              </div>
            </div>

            <div className="pt-2 text-xs font-mono text-zinc-500 flex flex-wrap items-center gap-2">
              <span>{PROFILE_CONFIG.location}</span>
              <span aria-hidden="true">·</span>
              <span>{PROFILE_CONFIG.availability[lang]}</span>
            </div>
          </div>

          {/* Right Interactive GitHub Chronology (7 cols) */}
          <div className="lg:col-span-7 space-y-1">
            <div className="pb-4 border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>
                {lang === 'pt'
                  ? 'Trajetória Pública no GitHub'
                  : 'Public GitHub Engineering Timeline'}
              </span>
              <span className="tabular-nums">2024 — 2026</span>
            </div>

            <div className="divide-y divide-white/[0.08]">
              {ENGINEERING_TIMELINE.map((step) => (
                <div
                  key={step.period}
                  className="py-6 sm:py-7 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start group"
                >
                  <div className="sm:col-span-3 flex items-center gap-2.5">
                    <span
                      className="w-2 h-2 bg-[#22d3a6] inline-block shrink-0"
                      aria-hidden="true"
                    />
                    <span className="font-mono text-xs font-medium text-zinc-200 tabular-nums">
                      {step.period}
                    </span>
                  </div>

                  <div className="sm:col-span-9 space-y-2.5">
                    <h3 className="font-display text-lg font-semibold text-white">
                      {step.label[lang]}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {step.summary[lang]}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {step.repos.map((repoName) => {
                        const match = githubData.repos.find(
                          (r) => r.name.toLowerCase() === repoName.toLowerCase(),
                        );
                        if (!match) {
                          return (
                            <span
                              key={repoName}
                              className="text-xs font-mono text-zinc-500"
                            >
                              {repoName}
                            </span>
                          );
                        }
                        return (
                          <button
                            key={repoName}
                            type="button"
                            onClick={() => onOpenRepo(match)}
                            className="inline-flex items-center gap-1 text-xs font-mono text-[#22d3a6] hover:text-white transition-colors cursor-pointer"
                          >
                            <span>{match.name}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
