import { useState } from 'react';
import { Code2, MapPin, ShieldCheck, Terminal } from 'lucide-react';
import type { EditorialProjectSpec } from '../../data/profile';

interface ProjectVisualStageProps {
  spec: EditorialProjectSpec;
}

export function ProjectVisualStage({ spec }: ProjectVisualStageProps) {
  const [tab, setTab] = useState<'visual' | 'code'>('visual');

  return (
    <div className="border border-white/10 bg-[#0b0b0e] overflow-hidden">
      {/* Minimal Visual Switcher Top Strip */}
      <div className="px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between bg-[#080808] text-[11px] font-mono">
        <div className="flex items-center gap-2 text-zinc-400">
          <span
            className="w-2 h-2 inline-block"
            style={{ backgroundColor: spec.accentHex }}
          />
          <span>
            {spec.visualKind === 'sos-mobile'
              ? 'UI Mockup · Expo / React Native'
              : `Architecture · ${spec.codePreview.filename}`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTab('visual')}
            className={`px-2 py-0.5 cursor-pointer transition-colors ${
              tab === 'visual' ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setTab('code')}
            className={`px-2 py-0.5 cursor-pointer transition-colors ${
              tab === 'code' ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {tab === 'code' ? (
        <div className="p-4 sm:p-5 bg-[#080808] min-h-[250px] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 mb-3">
            <Code2 className="w-3.5 h-3.5" style={{ color: spec.accentHex }} />
            <span>{spec.codePreview.filename}</span>
          </div>
          <pre className="overflow-x-auto text-xs font-mono text-zinc-200 leading-relaxed flex-1">
            <code>{spec.codePreview.snippet}</code>
          </pre>
        </div>
      ) : (
        <div className="p-5 sm:p-6 min-h-[250px] flex items-center justify-center bg-pixel-matrix relative">
          {spec.visualKind === 'kite-router' && (
            <div className="w-full max-w-md border border-white/12 bg-[#080808] p-4 font-mono text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-zinc-400 border-b border-white/[0.08] pb-2">
                <Terminal className="w-3.5 h-3.5 text-[#00ADD8]" />
                <span>kite-runtime · zero external deps</span>
              </div>
              <div className="text-zinc-300 space-y-1">
                <div>
                  <span className="text-[#00ADD8]">GET</span>{' '}
                  <span className="text-zinc-200">/api/v1/health</span>{' '}
                  <span className="text-zinc-500">→ 200 OK (0.14ms)</span>
                </div>
                <div>
                  <span className="text-[#00ADD8]">ORM</span>{' '}
                  <span className="text-zinc-200">database/sql · Eloquent builder</span>
                </div>
                <div>
                  <span className="text-[#00ADD8]">AUTH</span>{' '}
                  <span className="text-zinc-200">crypto/hmac · JWT & session</span>
                </div>
              </div>
              <div className="pt-2 border-t border-white/[0.08] text-[11px] text-zinc-500">
                go.mod: require 0 third-party packages
              </div>
            </div>
          )}

          {spec.visualKind === 'slenix-mvc' && (
            <div className="w-full max-w-md space-y-2.5 font-mono text-xs">
              {[
                ['01', 'HTTP Request', 'Isolated request & response abstraction'],
                ['02', 'Middleware', 'Lifecycle pipeline & Veil auth guard'],
                ['03', 'Controller + ORM', 'HasManyThrough / MorphMany queries'],
                ['04', 'Luna Engine', 'Compiled server-rendered view or JSON'],
              ].map(([idx, title, desc]) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-[#080808] border border-white/10"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#818CF8]">{idx}</span>
                    <span className="text-zinc-100 font-medium">{title}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 truncate">{desc}</span>
                </div>
              ))}
            </div>
          )}

          {spec.visualKind === 'sos-mobile' && (
            <div className="w-56 border-2 border-white/20 bg-[#080808] p-3.5 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>SOS ANGOLA</span>
                <span className="text-[#F59E0B]">115</span>
              </div>
              <div className="p-3 border border-[#F59E0B]/40 bg-[#F59E0B]/10 space-y-1">
                <div className="text-xs font-semibold text-white">
                  Emergency Dispatch
                </div>
                <div className="text-[10px] font-mono text-zinc-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#F59E0B]" />
                  <span>Luanda · GPS Ready</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-zinc-300">
                <div className="p-2 border border-white/10 bg-[#101014]">Fire</div>
                <div className="p-2 border border-white/10 bg-[#101014]">Rescue</div>
                <div className="p-2 border border-white/10 bg-[#101014]">Traffic</div>
                <div className="p-2 border border-white/10 bg-[#101014]">Other</div>
              </div>
              <div className="text-[9px] font-mono text-zinc-500 text-center pt-1 border-t border-white/[0.06]">
                Architectural UI Mockup
              </div>
            </div>
          )}

          {spec.visualKind === 'stash-crypto' && (
            <div className="w-full max-w-md border border-white/12 bg-[#080808] p-4 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="inline-flex items-center gap-1.5 text-[#22d3a6]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>stash.CookieStore</span>
                </span>
                <span className="text-[11px] text-zinc-500">Go stdlib</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 border border-white/10 text-zinc-200">
                  Request
                </div>
                <div className="p-2 border border-[#22d3a6]/50 text-[#22d3a6]">
                  HMAC Verify
                </div>
                <div className="p-2 border border-white/10 text-zinc-200">
                  ctx.Value
                </div>
              </div>
              <div className="text-[11px] text-zinc-400">
                Set-Cookie: sid=...; HttpOnly; SameSite=Lax
              </div>
            </div>
          )}

          {spec.visualKind === 'oche-dart' && (
            <div className="w-full max-w-md border border-white/12 bg-[#080808] p-4 font-mono text-xs space-y-2">
              <div className="text-[#38BDF8]">package:oche_web/oche_web.dart</div>
              <div className="text-zinc-300">
                Oche() → Oche.json() → Oche.cors() → Oche.jwt()
              </div>
              <div className="pt-2 border-t border-white/[0.08] text-[11px] text-zinc-400">
                Handler signature: (Request req, Response res) =&gt; res.json(...)
              </div>
            </div>
          )}

          {spec.visualKind === 'clinic-rest' && (
            <div className="w-full max-w-md border border-white/12 bg-[#080808] p-4 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="text-[#10B981]">POST /api/patients</span>
                <span className="text-zinc-400">Bearer JWT</span>
              </div>
              <pre className="text-[11px] text-zinc-300 leading-relaxed overflow-x-auto">
{`{
  "lgpd_consent": true,
  "audit_logged": true,
  "engine": "kite/go"
}`}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
