import {
  Braces,
  Database,
  GitBranch,
  Globe,
  Laptop,
  Monitor,
  Send,
  Terminal,
} from 'lucide-react';

interface DevTechIconProps {
  iconKey: string;
  className?: string;
}

export function DevTechIcon({
  iconKey,
  className = 'w-5 h-5',
}: DevTechIconProps) {
  switch (iconKey) {
    case 'go':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect x="2" y="5" width="20" height="14" rx="4" fill="#00ADD8" fillOpacity="0.16" stroke="#00ADD8" strokeWidth="1.5" />
          <path d="M9.5 10.5C8.5 9.8 7 10.3 6.5 11.5C6 12.7 6.7 14 8 14C9.2 14 9.8 13.2 9.8 12.3H8.3M14.5 10.2C13.2 10.2 12.3 11.1 12.3 12.1C12.3 13.2 13.2 14.1 14.5 14.1C15.8 14.1 16.7 13.2 16.7 12.1C16.7 11.1 15.8 10.2 14.5 10.2Z" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'php':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <ellipse cx="12" cy="12" rx="10" ry="6.5" fill="#8892BF" fillOpacity="0.16" stroke="#8892BF" strokeWidth="1.5" />
          <path d="M6.8 14V10H8.6C9.4 10 9.8 10.4 9.8 11C9.8 11.7 9.4 12.1 8.6 12.1H6.8M11.4 9V14M11.4 11.2H13.4V14M15.2 14V10H17C17.8 10 18.2 10.4 18.2 11C18.2 11.7 17.8 12.1 17 12.1H15.2" stroke="#A5B4FC" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'typescript':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="#3178C6" fillOpacity="0.2" stroke="#3178C6" strokeWidth="1.5" />
          <path d="M7.5 11.5H12M9.75 11.5V16.5M16.5 12.2C15.9 11.5 14.4 11.4 14 12.3C13.6 13.3 16.6 13.4 16.5 15.1C16.4 16.4 14.6 16.6 13.6 15.9" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'javascript':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="#F7DF1E" fillOpacity="0.16" stroke="#EAB308" strokeWidth="1.5" />
          <path d="M10.5 11.5V15.2C10.5 16.1 9.8 16.6 8.9 16.5C8.3 16.4 8 16.1 7.8 15.8M16.5 12.2C15.9 11.5 14.4 11.4 14 12.3C13.6 13.3 16.6 13.4 16.5 15.1C16.4 16.4 14.6 16.6 13.6 15.9" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'python':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M11.8 3.5C8.6 3.5 8.8 4.9 8.8 4.9V6.8H12.2V7.5H7.2C7.2 7.5 4.5 7.2 4.5 10.8C4.5 14.4 6.8 14.2 6.8 14.2H8.2V12.5C8.2 12.5 8.1 10.2 10.5 10.2H13.8C13.8 10.2 15.8 10.2 15.8 8.3V5.2C15.8 5.2 16 3.5 11.8 3.5Z" stroke="#60A5FA" strokeWidth="1.4" />
          <path d="M12.2 20.5C15.4 20.5 15.2 19.1 15.2 19.1V17.2H11.8V16.5H16.8C16.8 16.5 19.5 16.8 19.5 13.2C19.5 9.6 17.2 9.8 17.2 9.8H15.8V11.5C15.8 11.5 15.9 13.8 13.5 13.8H10.2C10.2 13.8 8.2 13.8 8.2 15.7V18.8C8.2 18.8 8 20.5 12.2 20.5Z" stroke="#FACC15" strokeWidth="1.4" />
        </svg>
      );
    case 'html5':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4.5 4L6 18.5L12 20.5L18 18.5L19.5 4H4.5Z" fill="#E34C26" fillOpacity="0.16" stroke="#F97316" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8.5 8.5H15.5M9 12H15L14.5 15.5L12 16.5L9.5 15.5" stroke="#FB923C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'css3':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4.5 4L6 18.5L12 20.5L18 18.5L19.5 4H4.5Z" fill="#264DE4" fillOpacity="0.18" stroke="#60A5FA" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8.5 8.5H15.5L14.8 15.5L12 16.5L9.2 15.5M9 12H15" stroke="#93C5FD" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'laravel':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4 7.5L8 5.5L12 7.5V12.5L16 10.5L20 12.5V16.5L12 20.5L4 16.5V7.5Z" stroke="#F43F5E" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8 5.5V14.5L12 16.5M12 12.5L16 14.5" stroke="#FB7185" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      );
    case 'react':
    case 'react-native':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <circle cx="12" cy="12" r="1.8" fill={iconKey === 'react-native' ? '#10B981' : '#38BDF8'} />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke={iconKey === 'react-native' ? '#10B981' : '#38BDF8'} strokeWidth="1.3" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" stroke={iconKey === 'react-native' ? '#10B981' : '#38BDF8'} strokeWidth="1.3" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" stroke={iconKey === 'react-native' ? '#10B981' : '#38BDF8'} strokeWidth="1.3" />
        </svg>
      );
    case 'mysql':
    case 'postgresql':
    case 'sqlite':
      return <Database className={`${className} text-sky-400`} />;
    case 'git':
      return <GitBranch className={`${className} text-orange-400`} />;
    case 'github':
      return <Braces className={`${className} text-zinc-200`} />;
    case 'postman':
      return <Send className={`${className} text-orange-400`} />;
    case 'rest':
      return <Globe className={`${className} text-emerald-400`} />;
    case 'linux':
      return <Terminal className={`${className} text-emerald-400`} />;
    case 'windows':
      return <Monitor className={`${className} text-sky-400`} />;
    case 'macos':
      return <Laptop className={`${className} text-zinc-200`} />;
    default:
      return <Braces className={`${className} text-zinc-400`} />;
  }
}
