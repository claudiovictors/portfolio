import { useState } from 'react';
import { Menu, Terminal, X } from 'lucide-react';
import type { LanguageCode } from '../../types/portfolio';

interface EditorialHeaderProps {
  lang: LanguageCode;
  onOpenLab: () => void;
}

export function EditorialHeader({ lang, onOpenLab }: EditorialHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '#about', label: lang === 'pt' ? 'Sobre' : 'About' },
    { href: '#skills', label: lang === 'pt' ? 'Stack' : 'Stack' },
    { href: '#work', label: lang === 'pt' ? 'Projetos' : 'Work' },
    { href: '#ecosystem', label: lang === 'pt' ? 'Ecossistema' : 'Ecosystem' },
    { href: '#contact', label: lang === 'pt' ? 'Contacto' : 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#080808]/90">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          Cláudio Victor
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 relative py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-[#22d3a6] hover:after:w-full after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenLab}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium text-[#080808] bg-[#22d3a6] hover:bg-[#3ee4b9] rounded-[3px] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal ⌘K</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-11 h-11 flex items-center justify-center border border-white/10 text-zinc-200 hover:text-white cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#080808] px-5 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-medium text-zinc-300 hover:text-white border-b border-white/[0.05]"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenLab();
            }}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-mono font-semibold text-[#080808] bg-[#22d3a6] rounded-[3px] cursor-pointer"
          >
            <Terminal className="w-4 h-4" />
            <span>Open Terminal & Arcade</span>
          </button>
        </div>
      )}
    </header>
  );
}
