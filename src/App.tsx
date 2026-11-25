import { lazy, Suspense, useEffect, useState } from 'react';
import { CustomCursor } from './components/common/CustomCursor';
import { ProjectDetailModal } from './components/feed/ProjectDetailModal';
import { EditorialHeader } from './components/layout/EditorialHeader';
import { AboutSection } from './components/sections/AboutSection';
import { ContactEndingSection } from './components/sections/ContactEndingSection';
import { EcosystemShowcaseSection } from './components/sections/EcosystemShowcaseSection';
import { HeroSection } from './components/sections/HeroSection';
import { ProjectsExhibitionSection } from './components/sections/ProjectsExhibitionSection';
import { SkillsConstellationSection } from './components/sections/SkillsConstellationSection';
import { useGitHubData } from './hooks/useGitHubData';
import type { GitHubRepo, LanguageCode } from './types/portfolio';

const LabModal = lazy(() =>
  import('./components/lab/LabModal').then((m) => ({ default: m.LabModal })),
);

export default function App() {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [activeLangFilter, setActiveLangFilter] = useState<string>('All');
  const [inspectedRepo, setInspectedRepo] = useState<GitHubRepo | null>(null);
  const [labOpen, setLabOpen] = useState(false);
  const [labMode, setLabMode] = useState<'terminal' | 'game'>('terminal');

  const { data: githubData } = useGitHubData();

  // Keyboard shortcut: Cmd+K / Ctrl+K opens Interactive Terminal & Arcade
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setLabMode('terminal');
        setLabOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const openTerminal = () => {
    setLabMode('terminal');
    setLabOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#22d3a6] focus:text-[#080808] focus:font-mono focus:text-xs focus:font-semibold"
      >
        Skip to main content
      </a>

      <CustomCursor />

      <EditorialHeader lang={lang} onOpenLab={openTerminal} />

      <main id="main-content">
        <HeroSection
          githubData={githubData}
          lang={lang}
          onToggleLang={setLang}
        />

        <AboutSection
          githubData={githubData}
          lang={lang}
          onOpenRepo={(repo) => setInspectedRepo(repo)}
        />

        <SkillsConstellationSection
          lang={lang}
          onFilterProjectsByLang={(language) => setActiveLangFilter(language)}
        />

        <ProjectsExhibitionSection
          githubData={githubData}
          lang={lang}
          onOpenRepo={(repo) => setInspectedRepo(repo)}
          activeLangFilter={activeLangFilter}
          onChangeLangFilter={setActiveLangFilter}
        />

        <EcosystemShowcaseSection lang={lang} />

        <ContactEndingSection
          githubData={githubData}
          lang={lang}
          onOpenLab={openTerminal}
        />
      </main>

      <ProjectDetailModal
        repo={inspectedRepo}
        lang={lang}
        onClose={() => setInspectedRepo(null)}
      />

      <Suspense fallback={null}>
        <LabModal
          open={labOpen}
          initialMode={labMode}
          githubData={githubData}
          lang={lang}
          onClose={() => setLabOpen(false)}
          onOpenRepo={(repo) => setInspectedRepo(repo)}
        />
      </Suspense>
    </div>
  );
}
