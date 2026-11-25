import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GITHUB_FALLBACK_SNAPSHOT } from './src/data/githubFallback.js';
import { LANGUAGE_COLORS } from './src/data/profile.js';
import type {
  GitHubEventItem,
  GitHubOverviewResponse,
  GitHubRepo,
  LanguageStat,
} from './src/types/portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_USER = 'claudiovictors';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

let cachedOverview: { data: GitHubOverviewResponse; expiresAt: number } | null =
  null;

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
}

const recentMessages: ContactMessage[] = [];

function computeLanguageStats(repos: GitHubRepo[]): LanguageStat[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language || repo.fork) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const total = Array.from(counts.values()).reduce((sum, n) => sum + n, 0) || 1;
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / total) * 100),
      color: LANGUAGE_COLORS[language] ?? '#71717a',
    }));
}

async function fetchLiveGitHubOverview(): Promise<GitHubOverviewResponse> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'claudiovictors-portfolio-app',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const [userRes, reposRes, eventsRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers }),
    fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
      { headers },
    ),
    fetch(
      `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=20`,
      { headers },
    ),
  ]);

  if (!userRes.ok || !reposRes.ok) {
    throw new Error(
      `GitHub API responded with ${userRes.status}/${reposRes.status}`,
    );
  }

  const rawUser = (await userRes.json()) as Record<string, unknown>;
  const rawRepos = (await reposRes.json()) as Array<Record<string, unknown>>;
  const rawEvents = eventsRes.ok
    ? ((await eventsRes.json()) as Array<Record<string, unknown>>)
    : [];

  const repos: GitHubRepo[] = rawRepos.map((r) => {
    const lic = r.license as { spdx_id?: string } | null;
    return {
      id: Number(r.id),
      name: String(r.name),
      full_name: String(r.full_name),
      description: r.description ? String(r.description) : null,
      html_url: String(r.html_url),
      homepage: r.homepage ? String(r.homepage) : null,
      language: r.language ? String(r.language) : null,
      stargazers_count: Number(r.stargazers_count ?? 0),
      forks_count: Number(r.forks_count ?? 0),
      watchers_count: Number(r.watchers_count ?? 0),
      fork: Boolean(r.fork),
      topics: Array.isArray(r.topics) ? r.topics.map(String) : [],
      license: lic?.spdx_id ?? null,
      created_at: String(r.created_at),
      updated_at: String(r.updated_at),
      pushed_at: String(r.pushed_at),
    };
  });

  const events: GitHubEventItem[] = Array.isArray(rawEvents)
    ? rawEvents.slice(0, 12).map((e) => {
        const repoObj = e.repo as { name?: string } | undefined;
        const type = String(e.type ?? 'Event');
        let detail = 'Activity on GitHub';
        if (type === 'PushEvent') detail = 'Pushed commits';
        else if (type === 'CreateEvent') detail = 'Created repository or branch';
        else if (type === 'WatchEvent') detail = 'Starred repository';
        else if (type === 'ForkEvent') detail = 'Forked repository';
        return {
          id: String(e.id),
          type,
          repo: repoObj?.name ?? `${GITHUB_USER}`,
          created_at: String(e.created_at),
          detail,
        };
      })
    : [];

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const originalRepos = repos.filter((r) => !r.fork).length;

  return {
    source: 'live',
    fetchedAt: new Date().toISOString(),
    profile: {
      login: String(rawUser.login ?? GITHUB_USER),
      name: String(rawUser.name ?? 'Cláudio Victor'),
      avatar_url: String(
        rawUser.avatar_url ?? GITHUB_FALLBACK_SNAPSHOT.profile.avatar_url,
      ),
      html_url: String(
        rawUser.html_url ?? GITHUB_FALLBACK_SNAPSHOT.profile.html_url,
      ),
      bio: rawUser.bio ? String(rawUser.bio) : null,
      location: rawUser.location ? String(rawUser.location) : null,
      blog: rawUser.blog ? String(rawUser.blog) : null,
      email: rawUser.email ? String(rawUser.email) : null,
      twitter_username: rawUser.twitter_username
        ? String(rawUser.twitter_username)
        : null,
      public_repos: Number(rawUser.public_repos ?? repos.length),
      followers: Number(rawUser.followers ?? 0),
      following: Number(rawUser.following ?? 0),
      created_at: String(rawUser.created_at ?? ''),
      updated_at: String(rawUser.updated_at ?? ''),
    },
    repos,
    events,
    stats: {
      totalStars,
      totalForks,
      originalRepos,
      languages: computeLanguageStats(repos),
    },
  };
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '64kb' }));

  app.get('/api/github/overview', async (req, res) => {
    const force = req.query.force === 'true';
    const now = Date.now();

    if (!force && cachedOverview && cachedOverview.expiresAt > now) {
      res.setHeader('Cache-Control', 'public, max-age=120');
      res.json(cachedOverview.data);
      return;
    }

    try {
      const liveData = await fetchLiveGitHubOverview();
      cachedOverview = {
        data: liveData,
        expiresAt: now + CACHE_TTL_MS,
      };
      res.setHeader('Cache-Control', 'public, max-age=120');
      res.json(liveData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'GitHub API unavailable';
      res.json({
        ...GITHUB_FALLBACK_SNAPSHOT,
        note: `Fallback active (${message}). Data source: src/data/githubFallback.ts.`,
      });
    }
  });

  app.post('/api/contact', (req, res) => {
    const body = req.body as Record<string, unknown>;
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const subject =
      typeof body?.subject === 'string' ? body.subject.trim() : 'Portfolio Inquiry';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    if (name.length < 2 || name.length > 80) {
      res.status(400).json({ ok: false, error: 'Please enter a valid name (2-80 chars).' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
      return;
    }
    if (message.length < 10 || message.length > 2000) {
      res.status(400).json({
        ok: false,
        error: 'Message must be between 10 and 2000 characters.',
      });
      return;
    }

    const entry: ContactMessage = {
      id: `msg_${Date.now().toString(36)}`,
      name,
      email,
      subject: subject.slice(0, 120) || 'Portfolio Inquiry',
      message,
      receivedAt: new Date().toISOString(),
    };

    recentMessages.unshift(entry);
    if (recentMessages.length > 50) recentMessages.pop();

    res.status(201).json({
      ok: true,
      id: entry.id,
      receivedAt: entry.receivedAt,
    });
  });

  if (!isProd) {
    app.use(express.static(path.resolve(__dirname, 'public')));
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
