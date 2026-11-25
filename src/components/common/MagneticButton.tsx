import { useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  target,
  rel,
  type = 'button',
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    setOffset({
      x: Math.max(-8, Math.min(8, dx)),
      y: Math.max(-8, Math.min(8, dy)),
    });
  };

  const handleLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const style = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition:
      offset.x === 0 && offset.y === 0
        ? 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1)'
        : 'transform 80ms linear',
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={style}
      className="inline-block"
    >
      {href ? (
        <a
          href={href}
          target={target}
          rel={rel}
          aria-label={ariaLabel}
          className={className}
        >
          {children}
        </a>
      ) : (
        <button
          type={type}
          onClick={onClick}
          aria-label={ariaLabel}
          className={className}
        >
          {children}
        </button>
      )}
    </div>
  );
}
