export type NavSection =
  | 'home'
  | 'about'
  | 'projects'
  | 'stack'
  | 'github'
  | 'lab'
  | 'contact';

export type LanguageCode = 'en' | 'pt';

export interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  email: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  fork: boolean;
  topics: string[];
  license: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubEventItem {
  id: string;
  type: string;
  repo: string;
  created_at: string;
  detail?: string;
}

export interface LanguageStat {
  language: string;
  count: number;
  percentage: number;
  color: string;
}

export interface GitHubOverviewResponse {
  source: 'live' | 'fallback';
  fetchedAt: string;
  note?: string;
  profile: GitHubProfile;
  repos: GitHubRepo[];
  events: GitHubEventItem[];
  stats: {
    totalStars: number;
    totalForks: number;
    originalRepos: number;
    languages: LanguageStat[];
  };
}

export interface FeaturedProjectMeta {
  repoName: string;
  category: 'framework' | 'api' | 'mobile' | 'system' | 'ai';
  roleLabel: {
    en: string;
    pt: string;
  };
  architectureSummary: {
    en: string;
    pt: string;
  };
  verifiedTech: string[];
  codePreview: {
    filename: string;
    language: string;
    snippet: string;
  };
}

export interface TechItem {
  id: string;
  name: string;
  iconKey: string;
  category:
    | 'languages'
    | 'frameworks'
    | 'databases'
    | 'tools'
    | 'os';
  context: {
    en: string;
    pt: string;
  };
}

export interface FeedEntry {
  id: string;
  kind: 'framework' | 'system' | 'open-source' | 'learning';
  date: string;
  repoRef?: string;
  title: {
    en: string;
    pt: string;
  };
  body: {
    en: string;
    pt: string;
  };
  tags: string[];
  codeSnippet?: {
    filename: string;
    code: string;
  };
}
