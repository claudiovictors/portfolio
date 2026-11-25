import { useState } from 'react';
import { BrandLogo } from './BrandLogo';

interface AvatarProps {
  src: string;
  alt: string;
  sizeClass?: string;
}

export function Avatar({
  src,
  alt,
  sizeClass = 'w-20 h-20 sm:w-24 sm:h-24',
}: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`${sizeClass} rounded-full overflow-hidden bg-zinc-900 border-4 border-[#09090b] flex items-center justify-center shrink-0`}
        aria-label={alt}
      >
        <BrandLogo className="w-full h-full" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full overflow-hidden bg-zinc-900 border-4 border-[#09090b] shrink-0`}
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
