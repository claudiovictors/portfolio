import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { PROFILE_CONFIG } from '../../data/profile';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { GitHubOverviewResponse, LanguageCode } from '../../types/portfolio';
import { DevTechIcon } from '../common/DevTechIcon';
import { MagneticButton } from '../common/MagneticButton';
import { HeroUniverse3D } from '../three/HeroUniverse3D';

interface HeroSectionProps {
  githubData: GitHubOverviewResponse;
  lang: LanguageCode;
  onToggleLang: (lang: LanguageCode) => void;
}

export function HeroSection({
  githubData,
  lang,
  onToggleLang,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    const targets = containerRef.current.querySelectorAll('.hero-reveal');
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform',
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const avatarSrc = githubData.profile.avatar_url || PROFILE_CONFIG.avatarUrl;

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden border-b border-white/[0.08]"
    >
      {/* 3D Interactive Universe Backdrop */}
      <div className="absolute inset-0 z-0 opacity-85 pointer-events-none lg:pointer-events-auto">
        <HeroUniverse3D />
      </div>

      {/* Subtle architectural vignette scrim so foreground typography always maintains WCAG AA contrast */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#080808] via-[#080808]/85 to-[#080808]/35"
        aria-hidden="true"
      />

      {/* Main Asymmetric Hero Stage */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-8 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
          {/* Left Typography & Introduction (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="hero-reveal flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-zinc-400">
                <span className="text-[#22d3a6]">{PROFILE_CONFIG.location}</span>
                <span aria-hidden="true" className="text-zinc-700">/</span>
                <span>{PROFILE_CONFIG.availability[lang]}</span>
              </div>

              <div className="inline-flex items-center border border-white/10 bg-[#0d0d10] p-0.5 rounded-[3px]">
                <button
                  type="button"
                  onClick={() => onToggleLang('en')}
                  className={`px-2 py-0.5 text-[11px] font-mono cursor-pointer transition-colors ${
                    lang === 'en' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => onToggleLang('pt')}
                  className={`px-2 py-0.5 text-[11px] font-mono cursor-pointer transition-colors ${
                    lang === 'pt' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  PT
                </button>
              </div>
            </div>

            <div className="hero-reveal space-y-2">
              <p className="text-sm sm:text-base font-medium text-zinc-300 tracking-wide">
                Cláudio Victor <span className="text-zinc-600 mx-1.5">—</span>{' '}
                <span className="font-mono text-xs sm:text-sm text-[#22d3a6]">
                  Software Developer
                </span>
              </p>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] font-bold text-white tracking-[-0.03em] leading-[1.05] max-w-2xl">
                {lang === 'pt' ? (
                  <>
                    A construir software que vive{' '}
                    <span className="font-editorial font-normal text-[#22d3a6]">
                      além
                    </span>{' '}
                    do código.
                  </>
                ) : (
                  <>
                    Building systems that live{' '}
                    <span className="font-editorial font-normal text-[#22d3a6]">
                      beyond
                    </span>{' '}
                    the code.
                  </>
                )}
              </h1>
            </div>

            <p className="hero-reveal text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
              {lang === 'pt'
                ? 'Desenvolvedor de software focado em arquitetura backend, frameworks sem dependências externas, APIs REST e sistemas web — criador do Kite (Go), Slenix (PHP), Stash e Oche.'
                : 'Software developer crafting zero-dependency web frameworks, REST APIs, and resilient full-stack systems across Go, PHP, Dart, and TypeScript.'}
            </p>

            {/* Primary CTAs */}
            <div className="hero-reveal flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton
                href="#work"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#22d3a6] hover:bg-[#3de6bc] text-[#080808] text-xs sm:text-sm font-semibold rounded-[3px] transition-colors whitespace-nowrap"
              >
                <span>
                  {lang === 'pt' ? 'Explorar projetos' : 'Explore selected work'}
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>

              <MagneticButton
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 hover:border-white/40 bg-[#0d0d10]/80 text-zinc-100 text-xs sm:text-sm font-medium rounded-[3px] transition-colors whitespace-nowrap"
              >
                <span>
                  {lang === 'pt' ? 'Iniciar conversa' : 'Start a conversation'}
                </span>
              </MagneticButton>
            </div>
          </div>

          {/* Right Centerpiece: Avatar Architectural Frame + Floating Language Satellites (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="hero-reveal relative w-full max-w-[340px] sm:max-w-[360px]">
              {/* Pixel-art corner brackets around avatar */}
              <div
                className="absolute -top-2.5 -left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#22d3a6]"
                aria-hidden="true"
              />
              <div
                className="absolute -top-2.5 -right-2.5 w-4 h-4 border-t-2 border-r-2 border-white/40"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-2.5 -left-2.5 w-4 h-4 border-b-2 border-l-2 border-white/40"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-2.5 -right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#f59e0b]"
                aria-hidden="true"
              />

              {/* Subtle Floating Language Artifacts */}
              <div
                className="hidden sm:flex items-center gap-2 absolute -left-10 top-8 px-2.5 py-1.5 bg-[#0e0e12] border border-white/10 text-[11px] font-mono text-zinc-200 z-20"
                aria-hidden="true"
              >
                <DevTechIcon iconKey="go" className="w-4 h-4" />
                <span>Go · stdlib</span>
              </div>

              <div
                className="hidden sm:flex items-center gap-2 absolute -right-7 bottom-14 px-2.5 py-1.5 bg-[#0e0e12] border border-white/10 text-[11px] font-mono text-zinc-200 z-20"
                aria-hidden="true"
              >
                <DevTechIcon iconKey="php" className="w-4 h-4" />
                <span>PHP · MVC</span>
              </div>

              <div
                className="hidden sm:flex items-center gap-2 absolute -left-6 bottom-6 px-2.5 py-1.5 bg-[#0e0e12] border border-white/10 text-[11px] font-mono text-zinc-200 z-20"
                aria-hidden="true"
              >
                <DevTechIcon iconKey="typescript" className="w-4 h-4" />
                <span>TS · React</span>
              </div>

              {/* Avatar Portrait Frame */}
              <div className="relative bg-[#0d0d10] border border-white/12 p-3">
                <div className="aspect-square w-full overflow-hidden bg-zinc-900 relative">
                  <img
                    src={avatarSrc}
                    alt="Cláudio Victor portrait"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover contrast-[1.04]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#080808]/70 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-zinc-200">
                    <span>@{githubData.profile.login}</span>
                    <span className="text-[#22d3a6]">
                      {PROFILE_CONFIG.coordinates}
                    </span>
                  </div>
                </div>

                {/* Editorial Spec Footer beneath Avatar */}
                <div className="pt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400 tabular-nums">
                  <span>{githubData.profile.public_repos} public repos</span>
                  <span className="text-zinc-600">·</span>
                  <span>{githubData.stats.totalStars} stars</span>
                  <span className="text-zinc-600">·</span>
                  <span>{githubData.profile.followers} followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue Strip */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-5 sm:px-8 py-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500">
        <a
          href="#about"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowDown className="w-3.5 h-3.5 text-[#22d3a6]" />
          <span>{lang === 'pt' ? 'Desliza para explorar' : 'Scroll to explore'}</span>
        </a>

        <div className="hidden sm:flex items-center gap-3 tabular-nums">
          <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>Kite · Slenix · Stash · Oche · SOS Mobile</span>
        </div>
      </div>
    </section>
  );
}
