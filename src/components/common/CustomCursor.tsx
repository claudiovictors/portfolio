import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function CustomCursor() {
  const reducedMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') {
      setEnabled(false);
      return;
    }
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: target.x, y: target.y };
    let rafId = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x - 2}px, ${target.y - 2}px, 0)`;
      }
      const el = e.target as HTMLElement | null;
      const interactive = Boolean(
        el?.closest('a, button, input, textarea, [data-cursor="expand"]'),
      );
      setActive(interactive);
    };

    const tick = () => {
      ringPos.x += (target.x - ringPos.x) * 0.16;
      ringPos.y += (target.y - ringPos.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.x - 16}px, ${ringPos.y - 16}px, 0) scale(${active ? 1.45 : 1})`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reducedMotion, active]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 hidden lg:block"
      aria-hidden="true"
    >
      <div
        ref={ringRef}
        className={`w-8 h-8 rounded-full border transition-colors duration-200 ${
          active
            ? 'border-[#22d3a6]/80 bg-[#22d3a6]/5'
            : 'border-white/20'
        }`}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1 h-1 bg-[#22d3a6]"
      />
    </div>
  );
}
