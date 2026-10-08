import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRepositories, getUserData, GitHubError, formatDate } from "../api.js";

const SORT_OPTIONS = [
  { value: "stars",   label: "Most Stars"   },
  { value: "forks",   label: "Most Forks"   },
  { value: "updated", label: "Recently Updated" },
  { value: "name",    label: "Name A–Z"     },
  { value: "size",    label: "Largest"      },
];

export default function Repositories() {
  const { username } = useParams();
  const [repos,   setRepos]   = useState([]);
  const [user,    setUser]    = useState(null);
  const [status,  setStatus]  = useState("loading");
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [sort,    setSort]    = useState("stars");
  const [langFilter, setLangFilter] = useState("All");

  useEffect(() => {
    setStatus("loading");
    const token = sessionStorage.getItem("gh_token") || "";

    Promise.all([getUserData(username, token), getRepositories(username, token)])
      .then(([u, r]) => { setUser(u); setRepos(r); setStatus("done"); })
      .catch(err => {
        setError(err instanceof GitHubError ? err.message : "Failed to load repositories.");
        setStatus("error");
      });
  }, [username]);

  // Unique languages for filter
  const languages = ["All", ...Array.from(new Set(repos.map(r => r.language).filter(Boolean))).sort()];

  // Filter + sort
  const visible = repos
    .filter(r => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.description || "").toLowerCase().includes(search.toLowerCase());
      const matchLang = langFilter === "All" || r.language === langFilter;
      return matchSearch && matchLang;
    })
    .sort((a, b) => {
      if (sort === "stars")   return b.stargazers_count - a.stargazers_count;
      if (sort === "forks")   return b.forks_count - a.forks_count;
      if (sort === "updated") return b.updated_at.localeCompare(a.updated_at);
      if (sort === "name")    return a.name.localeCompare(b.name);
      if (sort === "size")    return b.size - a.size;
      return 0;
    });

  return (
    <div className="page-repos">
      <div className="container">

        {/* Header */}
        <div className="repos-page-header">
          <Link to={`/analytics/${username}`} className="btn btn-ghost back-btn">
            ← Back to Analytics
          </Link>

          <div className="repos-page-title">
            <h1>
              Repositories for{" "}
              <span className="gradient-text">@{username}</span>
            </h1>
            {user && (
              <div className="repos-page-meta">
                <img src={user.avatar_url} alt="" className="repos-avatar" />
                <span>{user.public_repos} public repositories</span>
              </div>
            )}
          </div>
        </div>

        {status === "loading" && (
          <div className="analytics-loading">
            <div className="loading-card">
              <div className="spinner spinner-lg" />
              <h3>Loading repositories…</h3>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="analytics-error">
            <div className="error-card">
              <div className="error-icon">⚠️</div>
              <h3>Failed to load</h3>
              <p>{error}</p>
              <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
          </div>
        )}

        {status === "done" && (
          <>
            {/* Filters */}
            <div className="repos-filters">
              <div className="repos-search-wrap">
                <svg className="repos-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  className="repos-search"
                  placeholder="Search repositories…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <select className="repos-select" value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <select className="repos-select" value={langFilter} onChange={e => setLangFilter(e.target.value)}>
                {languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>

              <span className="repos-count">{visible.length} repos</span>
            </div>

            {/* Repo list */}
            {visible.length === 0 ? (
              <div className="repos-empty">
                <p>No repositories match your search.</p>
              </div>
            ) : (
              <div className="repos-full-list">
                {visible.map(repo => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="repo-full-card"
                  >
                    <div className="repo-full-top">
                      <span className="repo-full-name">{repo.name}</span>
                      <div className="repo-full-badges">
                        {repo.fork     && <span className="repo-badge">Fork</span>}
                        {repo.archived && <span className="repo-badge repo-badge-warn">Archived</span>}
                        {repo.private  && <span className="repo-badge">Private</span>}
                      </div>
                    </div>

                    {repo.description && (
                      <p className="repo-full-desc">{repo.description}</p>
                    )}

                    <div className="repo-full-meta">
                      {repo.language && (
                        <span className="repo-lang">{repo.language}</span>
                      )}
                      <span className="repo-meta-item">★ {repo.stargazers_count}</span>
                      <span className="repo-meta-item">⑂ {repo.forks_count}</span>
                      <span className="repo-meta-item">{(repo.size / 1024).toFixed(1)} MB</span>
                      <span className="repo-meta-updated">Updated {formatDate(repo.updated_at)}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
