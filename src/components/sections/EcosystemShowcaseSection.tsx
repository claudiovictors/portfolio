import { useState } from 'react';
import { DevTechIcon } from '../common/DevTechIcon';
import type { LanguageCode } from '../../types/portfolio';

interface EcosystemShowcaseSectionProps {
  lang: LanguageCode;
}

const ECOSYSTEM_RINGS = [
  {
    id: 'backend',
    label: { en: 'Backend & Frameworks', pt: 'Backend & Frameworks' },
    accent: '#22d3a6',
    nodes: [
      { name: 'Go', icon: 'go' },
      { name: 'PHP', icon: 'php' },
      { name: 'Laravel', icon: 'laravel' },
      { name: 'Python', icon: 'python' },
    ],
    summary: {
      en: 'Custom HTTP routers, MVC architecture, JWT & HMAC sessions, and CLI tools.',
      pt: 'Routers HTTP próprios, arquitetura MVC, sessões JWT/HMAC e ferramentas CLI.',
    },
  },
  {
    id: 'frontend',
    label: { en: 'Frontend & Mobile', pt: 'Frontend & Mobile' },
    accent: '#38bdf8',
    nodes: [
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'React', icon: 'react' },
      { name: 'React Native', icon: 'react-native' },
      { name: 'JavaScript', icon: 'javascript' },
    ],
    summary: {
      en: 'Responsive web applications, interactive interfaces, and Expo mobile experiences.',
      pt: 'Aplicações web responsivas, interfaces interativas e apps móveis em Expo.',
    },
  },
  {
    id: 'data',
    label: { en: 'Databases & APIs', pt: 'Bases de Dados & APIs' },
    accent: '#f59e0b',
    nodes: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'SQLite', icon: 'sqlite' },
      { name: 'REST APIs', icon: 'rest' },
    ],
    summary: {
      en: 'Relational schema design, SQL query builders, and Postman-verified REST contracts.',
      pt: 'Esquemas relacionais, query builders SQL e contratos REST validados com Postman.',
    },
  },
  {
    id: 'env',
    label: { en: 'Tooling & OS', pt: 'Ferramentas & SO' },
    accent: '#e4e4e7',
    nodes: [
      { name: 'Linux', icon: 'linux' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'Postman', icon: 'postman' },
    ],
    summary: {
      en: 'Unix-first workflows across Linux, macOS, and Windows with disciplined Git history.',
      pt: 'Fluxos Unix em Linux, macOS e Windows com versionamento disciplinado em Git.',
    },
  },
];

export function EcosystemShowcaseSection({
  lang,
}: EcosystemShowcaseSectionProps) {
  const [selectedLayer, setSelectedLayer] = useState(ECOSYSTEM_RINGS[0].id);
  const current =
    ECOSYSTEM_RINGS.find((r) => r.id === selectedLayer) ?? ECOSYSTEM_RINGS[0];

  return (
    <section
      id="ecosystem"
      className="py-20 sm:py-28 border-b border-white/[0.08] bg-[#080808]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Narrative & Layer Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono text-[#22d3a6]">
              04. {lang === 'pt' ? 'Ecossistema Integrado' : 'Full-Stack Ecosystem'}
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {lang === 'pt'
                ? 'Do kernel backend à interface final.'
                : 'From backend kernel to user surface.'}
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed">
              {lang === 'pt'
                ? 'Cada projeto combina camadas complementares: servidores rápidos, contratos REST claros, persistência relacional e interfaces objetivas.'
                : 'Every system bridges complementary layers: fast servers, clean REST contracts, relational persistence, and responsive interfaces.'}
            </p>

            <div className="space-y-2 pt-2">
              {ECOSYSTEM_RINGS.map((ring) => {
                const active = ring.id === selectedLayer;
                return (
                  <button
                    key={ring.id}
                    type="button"
                    onClick={() => setSelectedLayer(ring.id)}
                    className={`w-full text-left px-4 py-3 border transition-colors cursor-pointer flex items-center justify-between ${
                      active
                        ? 'border-white/30 bg-[#0e0e12] text-white'
                        : 'border-white/[0.07] bg-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="font-display text-sm font-semibold">
                      {ring.label[lang]}
                    </span>
                    <span
                      className="w-2 h-2"
                      style={{ backgroundColor: ring.accent }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Dynamic Orbital Hub Composition (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative border border-white/10 bg-[#0b0b0e] bg-architectural-grid p-6 sm:p-10 overflow-hidden">
              <div className="relative flex flex-col items-center justify-center min-h-[320px] sm:min-h-[360px]">
                {/* Concentric Architectural Rings */}
                <div
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-white/[0.08] flex items-center justify-center relative"
                  aria-hidden="false"
                >
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-dashed border-white/15 flex items-center justify-center">
                    {/* Central Core */}
                    <div className="text-center px-4">
                      <div
                        className="text-[11px] font-mono uppercase tracking-wider"
                        style={{ color: current.accent }}
                      >
                        {current.label[lang]}
                      </div>
                      <div className="font-display text-base sm:text-lg font-bold text-white mt-0.5">
                        Full-Stack Core
                      </div>
                    </div>
                  </div>

                  {/* 4 Orbiting Nodes positioned cleanly around the ring */}
                  {current.nodes.map((node, idx) => {
                    const positions = [
                      '-top-5 left-1/2 -translate-x-1/2',
                      'top-1/2 -right-5 -translate-y-1/2',
                      '-bottom-5 left-1/2 -translate-x-1/2',
                      'top-1/2 -left-5 -translate-y-1/2',
                    ];
                    return (
                      <div
                        key={node.name}
                        className={`absolute ${positions[idx]} px-3 py-2 bg-[#080808] border border-white/15 flex items-center gap-2 transition-transform duration-300 hover:scale-105`}
                      >
                        <DevTechIcon iconKey={node.icon} className="w-4 h-4" />
                        <span className="text-xs font-mono text-zinc-100 whitespace-nowrap">
                          {node.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Active Layer Caption */}
                <p className="mt-8 text-center text-xs sm:text-sm text-zinc-300 max-w-md">
                  {current.summary[lang]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
