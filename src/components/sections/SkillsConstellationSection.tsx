import { useState } from 'react';
import { TECH_STACK_ITEMS } from '../../data/profile';
import type { LanguageCode, TechItem } from '../../types/portfolio';
import { DevTechIcon } from '../common/DevTechIcon';
import { ThreeStackOrbit } from '../three/ThreeStackOrbit';

interface SkillsConstellationSectionProps {
  lang: LanguageCode;
  onFilterProjectsByLang: (language: string) => void;
}

const SCHEMATIC_GROUPS: {
  id: string;
  title: { en: string; pt: string };
  filterFn: (item: TechItem) => boolean;
}[] = [
  {
    id: 'languages',
    title: { en: 'Languages', pt: 'Linguagens' },
    filterFn: (t) => t.category === 'languages',
  },
  {
    id: 'frameworks',
    title: { en: 'Frameworks', pt: 'Frameworks' },
    filterFn: (t) => t.category === 'frameworks',
  },
  {
    id: 'databases',
    title: { en: 'Databases', pt: 'Bases de Dados' },
    filterFn: (t) => t.category === 'databases',
  },
  {
    id: 'tools',
    title: { en: 'Tools', pt: 'Ferramentas' },
    filterFn: (t) => t.category === 'tools' && t.id !== 'rest-apis',
  },
  {
    id: 'apis',
    title: { en: 'APIs', pt: 'APIs' },
    filterFn: (t) => t.id === 'rest-apis',
  },
  {
    id: 'os',
    title: { en: 'Operating Systems', pt: 'Sistemas Operativos' },
    filterFn: (t) => t.category === 'os',
  },
];

export function SkillsConstellationSection({
  lang,
  onFilterProjectsByLang,
}: SkillsConstellationSectionProps) {
  const [activeId, setActiveId] = useState<string>('go');
  const [viewMode, setViewMode] = useState<'schematic' | 'orbit3d'>('schematic');

  const activeItem =
    TECH_STACK_ITEMS.find((t) => t.id === activeId) ?? TECH_STACK_ITEMS[0];

  return (
    <section
      id="skills"
      className="py-20 sm:py-28 border-b border-white/[0.08] bg-[#080808]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono text-[#22d3a6]">
              02. {lang === 'pt' ? 'Constelação Técnica' : 'Interactive Stack'}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {lang === 'pt'
                ? 'Linguagens, frameworks e infraestrutura.'
                : 'Tools, runtimes & data layers.'}
            </h2>
            <p className="text-sm text-zinc-400">
              {lang === 'pt'
                ? 'Explora qualquer tecnologia abaixo para ver como a utilizo nos projetos.'
                : 'Hover or select any technology to inspect how it fits into my engineering workflow.'}
            </p>
          </div>

          <div className="inline-flex border border-white/10 bg-[#0d0d10] p-0.5 rounded-[3px]">
            <button
              type="button"
              onClick={() => setViewMode('schematic')}
              className={`px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors whitespace-nowrap ${
                viewMode === 'schematic'
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              Schematic Map
            </button>
            <button
              type="button"
              onClick={() => setViewMode('orbit3d')}
              className={`px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors whitespace-nowrap ${
                viewMode === 'orbit3d'
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              3D Constellation
            </button>
          </div>
        </div>

        {/* Visual Explorer Stage */}
        {viewMode === 'orbit3d' ? (
          <ThreeStackOrbit
            selectedId={activeId}
            onSelectTech={(id) => setActiveId(id)}
          />
        ) : (
          <div className="border border-white/[0.08] bg-[#0b0b0e] bg-architectural-grid p-5 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: 6 Logical Schematic Rows (No progress bars, no generic grids) */}
              <div className="lg:col-span-8 divide-y divide-white/[0.07]">
                {SCHEMATIC_GROUPS.map((group) => {
                  const items = TECH_STACK_ITEMS.filter(group.filterFn);
                  return (
                    <div
                      key={group.id}
                      className="py-4 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-4 text-xs font-mono text-zinc-500">
                        {group.title[lang]}
                      </div>
                      <div className="sm:col-span-8 flex flex-wrap items-center gap-2">
                        {items.map((item) => {
                          const selected = item.id === activeId;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onMouseEnter={() => setActiveId(item.id)}
                              onClick={() => setActiveId(item.id)}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                                selected
                                  ? 'border-[#22d3a6] bg-[#22d3a6]/10 text-white'
                                  : 'border-white/10 bg-[#080808] text-zinc-300 hover:border-white/30 hover:text-white'
                              }`}
                            >
                              <DevTechIcon
                                iconKey={item.iconKey}
                                className="w-4 h-4"
                              />
                              <span>{item.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Live Technical Brief Inspector */}
              <div className="lg:col-span-4 border border-white/10 bg-[#080808] p-5 space-y-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>ACTIVE NODE</span>
                  <span className="text-[#22d3a6]">
                    {activeItem.category.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 border border-white/10 bg-[#0d0d10] flex items-center justify-center shrink-0">
                    <DevTechIcon
                      iconKey={activeItem.iconKey}
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      {activeItem.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed min-h-[4.5rem]">
                  {activeItem.context[lang]}
                </p>

                {activeItem.category === 'languages' && (
                  <a
                    href="#work"
                    onClick={() => onFilterProjectsByLang(activeItem.name)}
                    className="inline-block text-xs font-mono text-[#22d3a6] hover:text-white transition-colors"
                  >
                    {lang === 'pt'
                      ? `Filtrar projetos em ${activeItem.name} →`
                      : `Filter ${activeItem.name} projects →`}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
