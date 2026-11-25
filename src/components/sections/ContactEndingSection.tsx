import { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  Send,
  Terminal,
} from 'lucide-react';
import { PROFILE_CONFIG } from '../../data/profile';
import type { GitHubOverviewResponse, LanguageCode } from '../../types/portfolio';
import { MagneticButton } from '../common/MagneticButton';

interface ContactEndingSectionProps {
  githubData: GitHubOverviewResponse;
  lang: LanguageCode;
  onOpenLab: () => void;
}

export function ContactEndingSection({
  githubData,
  lang,
  onOpenLab,
}: ContactEndingSectionProps) {
  const resolvedEmail =
    githubData.profile.email || PROFILE_CONFIG.contactEmail || null;

  const [composerOpen, setComposerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: 'ok' | 'err';
    text: string;
  } | null>(null);

  const handleCopyEmail = () => {
    if (!resolvedEmail) return;
    navigator.clipboard
      ?.writeText(resolvedEmail)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: 'Portfolio Collaboration',
          message,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatusMsg({
          type: 'err',
          text: data.error || 'Could not deliver message.',
        });
      } else {
        setStatusMsg({
          type: 'ok',
          text:
            lang === 'pt'
              ? 'Mensagem enviada com sucesso. Obrigado pelo contacto!'
              : 'Note delivered. Thanks for reaching out!',
        });
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch {
      setStatusMsg({
        type: 'err',
        text: 'Network error while sending note.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 sm:py-32 bg-[#080808] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          {/* Expressive Typographic Ending */}
          <div className="lg:col-span-8 space-y-5">
            <div className="text-xs font-mono text-[#22d3a6]">
              05. {lang === 'pt' ? 'Colaboração' : 'Next Chapter'}
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.03em] leading-[1.03]">
              {lang === 'pt' ? (
                <>
                  Tens uma ideia que merece ser{' '}
                  <span className="font-editorial font-normal text-[#22d3a6]">
                    construída
                  </span>
                  ?
                </>
              ) : (
                <>
                  Have an idea worth{' '}
                  <span className="font-editorial font-normal text-[#22d3a6]">
                    building
                  </span>
                  ?
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
              {PROFILE_CONFIG.location} · {PROFILE_CONFIG.availability[lang]}.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <MagneticButton
                href={PROFILE_CONFIG.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#22d3a6] hover:bg-[#3ee4b9] text-[#080808] text-xs sm:text-sm font-semibold rounded-[3px] transition-colors whitespace-nowrap"
              >
                <span>
                  {lang === 'pt' ? 'Conversar no LinkedIn' : 'Connect on LinkedIn'}
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>

              <button
                type="button"
                onClick={() => setComposerOpen((v) => !v)}
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/15 hover:border-white/40 text-xs sm:text-sm font-mono text-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5 text-[#22d3a6]" />
                <span>
                  {composerOpen
                    ? lang === 'pt'
                      ? 'Fechar formulário'
                      : 'Hide quick note'
                    : lang === 'pt'
                      ? 'Enviar nota direta'
                      : 'Send a direct note'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Quick Channel Links */}
          <div className="lg:col-span-4 space-y-2 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-6 lg:pt-0 lg:pl-8 text-sm">
            <a
              href={PROFILE_CONFIG.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2 text-zinc-300 hover:text-white border-b border-white/[0.06]"
            >
              <span className="font-mono">github.com/claudiovictors</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </a>
            <a
              href={PROFILE_CONFIG.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2 text-zinc-300 hover:text-white border-b border-white/[0.06]"
            >
              <span className="font-mono">LinkedIn / Cláudio Victor</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </a>
            <a
              href={PROFILE_CONFIG.links.legacyPortfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2 text-zinc-300 hover:text-white border-b border-white/[0.06]"
            >
              <span className="font-mono">claudiovictordev.vercel.app</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </a>

            {resolvedEmail ? (
              <div className="flex items-center justify-between py-2 text-zinc-300">
                <span className="inline-flex items-center gap-2 font-mono text-xs truncate">
                  <Mail className="w-3.5 h-3.5 text-[#22d3a6]" />
                  <span>{resolvedEmail}</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#22d3a6] hover:text-white cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ) : (
              <div className="py-2 text-xs font-mono text-zinc-500">
                Email configurable in src/data/profile.ts
              </div>
            )}
          </div>
        </div>

        {/* Optional Inline Direct Note Composer */}
        {composerOpen && (
          <form
            onSubmit={handleSubmit}
            className="border border-white/12 bg-[#0b0b0e] p-5 sm:p-6 max-w-2xl space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-mono text-zinc-400">Name</span>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080808] border border-white/10 text-sm text-white focus:outline-none focus:border-[#22d3a6]"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-mono text-zinc-400">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080808] border border-white/10 text-sm text-white focus:outline-none focus:border-[#22d3a6]"
                />
              </label>
            </div>
            <label className="block space-y-1.5">
              <span className="text-xs font-mono text-zinc-400">Message</span>
              <textarea
                required
                minLength={10}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-[#080808] border border-white/10 text-sm text-white focus:outline-none focus:border-[#22d3a6]"
              />
            </label>

            {statusMsg && (
              <div
                className={`text-xs font-mono p-2.5 border ${
                  statusMsg.type === 'ok'
                    ? 'border-[#22d3a6]/50 text-[#22d3a6] bg-[#22d3a6]/10'
                    : 'border-rose-500/50 text-rose-300 bg-rose-500/10'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-[#22d3a6] hover:bg-[#3ee4b9] text-[#080808] text-xs font-mono font-semibold cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Note'}
            </button>
          </form>
        )}

        {/* Quiet Editorial Footer */}
        <footer className="pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>Cláudio Victor · Luanda, Angola</div>
          <button
            type="button"
            onClick={onOpenLab}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-[#22d3a6] transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Press ⌘K for Terminal & Arcade</span>
          </button>
        </footer>
      </div>
    </section>
  );
}
