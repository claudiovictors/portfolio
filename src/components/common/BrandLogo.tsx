interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = 'w-9 h-9' }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-label="CV Logo"
      className={className}
    >
      <rect width="64" height="64" rx="14" fill="#111115" />
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        rx="12.5"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="2"
      />
      <path
        d="M27.5 21.5C24.2 19.5 19.5 20.5 17 24C14.5 27.5 14.5 36.5 17 40C19.5 43.5 24.2 44.5 27.5 42.5"
        stroke="#F4F4F5"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path
        d="M33 21L40.5 43L48 21"
        stroke="#10B981"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
