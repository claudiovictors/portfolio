import { useCallback, useEffect, useState } from 'react';
import { GITHUB_FALLBACK_SNAPSHOT } from '../data/githubFallback';
import type { GitHubOverviewResponse } from '../types/portfolio';

export function useGitHubData() {
  const [data, setData] = useState<GitHubOverviewResponse>(
    GITHUB_FALLBACK_SNAPSHOT,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/github/overview${force ? '?force=true' : ''}`,
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const payload = (await res.json()) as GitHubOverviewResponse;
      setData(payload);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to reach GitHub endpoint',
      );
      setData(GITHUB_FALLBACK_SNAPSHOT);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  return {
    data,
    loading,
    error,
    refresh: () => load(true),
  };
}
