// ============================================================
// GitHub API + Analytics
// Mirrors all functions in main.py
// ============================================================

const BASE = "https://api.github.com";

// Custom error — mirrors requests.exceptions.HTTPError handling
export class GitHubError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// mirrors main.py headers setup
function buildHeaders(token) {
  const headers = { Accept: "application/vnd.github+json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// mirrors requests.get() + raise_for_status()
async function ghFetch(url, token) {
  const res = await fetch(url, { headers: buildHeaders(token) });

  if (res.status === 404) throw new GitHubError("User not found.", 404);
  if (res.status === 401)
    throw new GitHubError(
      "Invalid or expired token. Clear the token field and try again.",
      401
    );
  if (res.status === 403) {
    const body = await res.json().catch(() => ({}));
    const isRate = body.message?.includes("rate limit");
    throw new GitHubError(
      isRate
        ? "GitHub API rate limit exceeded. Add a personal access token for higher limits."
        : "Access forbidden (403).",
      403
    );
  }
  if (!res.ok)
    throw new GitHubError(
      `GitHub API error: ${res.status} ${res.statusText}`,
      res.status
    );

  return res.json();
}

// mirrors get_user_data()
export async function getUserData(username, token) {
  return ghFetch(`${BASE}/users/${username}`, token);
}

// mirrors get_repositories() with pagination
export async function getRepositories(username, token) {
  const repos = [];
  let page = 1;
  while (true) {
    const url = `${BASE}/users/${username}/repos?per_page=100&page=${page}`;
    const data = await ghFetch(url, token);
    if (!data || data.length === 0) break;
    repos.push(...data);
    page++;
  }
  return repos;
}

// mirrors analyze_languages() + calculate_language_percentages()
export function analyzeLanguages(repos) {
  const counts = {};
  for (const repo of repos) {
    if (repo.language) counts[repo.language] = (counts[repo.language] || 0) + 1;
  }
  const total = Object.values(counts).reduce((s, n) => s + n, 0);
  if (total === 0) return {};
  const pct = {};
  for (const [lang, n] of Object.entries(counts)) pct[lang] = (n / total) * 100;
  return Object.fromEntries(
    Object.entries(pct).sort(([, a], [, b]) => b - a)
  );
}

// mirrors calculate_repository_statistics()
export function calcStats(repos) {
  let totalStars = 0,
    totalForks = 0,
    mostStarredRepo = null,
    highestStars = 0,
    mostForkedRepo = null,
    highestForks = 0,
    largestRepo = null,
    largestSize = -1,
    recentRepo = null,
    recentTime = null;

  for (const r of repos) {
    totalStars += r.stargazers_count;
    totalForks += r.forks_count;

    if (r.stargazers_count > highestStars) {
      highestStars = r.stargazers_count;
      mostStarredRepo = r.name;
    }
    if (r.forks_count > highestForks) {
      highestForks = r.forks_count;
      mostForkedRepo = r.name;
    }
    if (r.size > largestSize) {
      largestSize = r.size;
      largestRepo = r.name;
    }
    if (!recentTime || r.updated_at > recentTime) {
      recentTime = r.updated_at;
      recentRepo = r.name;
    }
  }

  return {
    totalStars,
    totalForks,
    mostStarredRepo,
    highestStars,
    mostForkedRepo,
    highestForks,
    largestRepo,
    largestSize,
    recentRepo,
    recentTime,
  };
}

// mirrors calculate_repository_insights()
export function calcInsights(repos) {
  let withLang = 0,
    withoutLang = 0,
    withStars = 0,
    forked = 0,
    archived = 0,
    totalStars = 0;

  for (const r of repos) {
    if (r.language) withLang++;
    else withoutLang++;
    if (r.stargazers_count > 0) withStars++;
    if (r.fork) forked++;
    if (r.archived) archived++;
    totalStars += r.stargazers_count;
  }

  return {
    total: repos.length,
    withLang,
    withoutLang,
    withStars,
    forked,
    archived,
    avgStars: repos.length > 0 ? totalStars / repos.length : 0,
  };
}

// mirrors get_top_repositories()
export function topRepos(repos, limit = 5) {
  return [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit);
}

// Generate human-readable insight bullets from real data
export function buildInsights(user, insights, languages, stats) {
  const msgs = [];
  const topLang = Object.keys(languages)[0];
  if (topLang)
    msgs.push(
      `Most used language is <strong>${topLang}</strong> (${languages[topLang].toFixed(1)}% of repos).`
    );
  if (insights.withStars > 0)
    msgs.push(
      `<strong>${insights.withStars}</strong> of ${insights.total} repositories have received stars.`
    );
  if (insights.forked > 0)
    msgs.push(
      `You have forked <strong>${insights.forked}</strong> repositories, showing active exploration of other projects.`
    );
  if (insights.withoutLang > insights.withLang)
    msgs.push(
      `${insights.withoutLang} repositories have no detected language — likely docs, configs, or templates.`
    );
  if (stats.largestRepo)
    msgs.push(
      `Largest repository: <strong>${stats.largestRepo}</strong> (${(stats.largestSize / 1024).toFixed(1)} MB).`
    );
  if (msgs.length === 0)
    msgs.push("Keep building — your analytics will grow with your activity.");
  return msgs;
}

export function formatDate(iso) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
