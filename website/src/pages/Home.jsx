import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserData, getRepositories,
  analyzeLanguages, calcStats, calcInsights,
} from "../api.js";

const DEMO_INSIGHTS = [
  "Your top language is HTML across 56% of repositories. Diversifying into backend languages could open new project types.",
  "11 of your 19 repositories have at least one star — a strong signal that your work is discoverable.",
  "Your most recently updated repository was modified today, showing consistent development activity.",
];

export default function Home() {
  const [username, setUsername] = useState("");
  const [demoIdx,  setDemoIdx]  = useState(null);
  const navigate = useNavigate();

  // Live demo data — fetches real isaad-ui profile
  const [demo, setDemo] = useState(null);

  useEffect(() => {
    async function loadDemo() {
      try {
        const [user, repos] = await Promise.all([
          getUserData("isaad-ui", ""),
          getRepositories("isaad-ui", ""),
        ]);
        const languages = analyzeLanguages(repos);
        const stats     = calcStats(repos);
        const insights  = calcInsights(repos);
        // Top 3 repos by stars
        const top3 = [...repos]
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 3);
        setDemo({ user, languages, stats, insights, top3 });
      } catch {
        // silently fall back — no demo data shown if API fails
      }
    }
    loadDemo();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const u = username.trim();
    if (u) navigate(`/analytics/${u}`);
  }

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="hero">
        <div className="container hero-grid">

          {/* Left */}
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="hero-product-label">
                GitHub Developer Analytics
              </span>
            </div>

            <h1>
              Understand your GitHub activity with real data.
            </h1>

            <p className="hero-desc">
              Analyze any public GitHub profile instantly. Get language
              breakdowns, repository statistics, contribution insights,
              and developer intelligence — all in one place.
            </p>

            <form className="hero-search" onSubmit={handleSubmit}>
              <div className="hero-search-row">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter a GitHub username…"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!username.trim()}
                >
                  Analyze
                </button>
              </div>
              <p className="hero-note">
                No account required · Works with any public GitHub profile
              </p>
            </form>
          </div>

          {/* Right — live dashboard preview */}
          <div className="dashboard-wrapper">
            <div className="dashboard">

              {/* Title bar */}
              <div className="db-titlebar">
                <span className="db-title">Developer Overview</span>
                <div className="db-live">
                  <span className="db-live-dot" />
                  {demo ? "Live data" : "Loading…"}
                </div>
              </div>

              {demo ? (
                <>
                  {/* Profile */}
                  <div className="db-profile">
                    <img
                      src={demo.user.avatar_url}
                      alt=""
                      className="db-avatar-img"
                    />
                    <div>
                      <div className="db-profile-name">{demo.user.login}</div>
                      <div className="db-profile-handle">{demo.user.name || ""}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="db-stats">
                    {[
                      ["Repositories", demo.user.public_repos, false],
                      ["Total Stars",  demo.stats.totalStars,  true ],
                      ["Followers",    demo.user.followers,    false],
                      ["Languages",    Object.keys(demo.languages).length, false],
                    ].map(([label, val, accent]) => (
                      <div key={label} className="db-stat">
                        <div className="db-stat-label">{label}</div>
                        <div className={`db-stat-val${accent ? " green" : ""}`}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Language bars */}
                  <div className="db-section">
                    <div className="db-section-title">Language Distribution</div>
                    <div className="db-lang-bars">
                      {Object.entries(demo.languages).slice(0, 4).map(([lang, pct], i) => (
                        <div key={lang} className="db-lang-row">
                          <span className="db-lang-name">{lang}</span>
                          <div className="db-lang-track">
                            <div
                              className={`db-lang-fill${i > 0 ? " muted" : ""}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="db-lang-pct">{pct.toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top repos */}
                  <div className="db-section">
                    <div className="db-section-title">Top Repositories</div>
                    <div className="db-repo-list">
                      {demo.top3.map(repo => (
                        <div key={repo.id} className="db-repo-item">
                          <span className="db-repo-name">{repo.name}</span>
                          <div className="db-repo-meta">
                            {repo.language && (
                              <span className="db-repo-lang">{repo.language}</span>
                            )}
                            <span>★ {repo.stargazers_count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insight */}
                  <div className="db-insight">
                    <div className="db-insight-icon">✦</div>
                    <p>
                      {Object.keys(demo.languages)[0]
                        ? `${Object.keys(demo.languages)[0]} is the top language at ${Object.values(demo.languages)[0].toFixed(0)}% of repositories.`
                        : "Analyzing language distribution across repositories."}
                    </p>
                  </div>
                </>
              ) : (
                /* Loading skeleton */
                <div className="db-skeleton">
                  <div className="db-skeleton-profile">
                    <div className="skeleton-circle" />
                    <div className="skeleton-lines">
                      <div className="skeleton-line w60" />
                      <div className="skeleton-line w40" />
                    </div>
                  </div>
                  <div className="db-stats">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="db-stat">
                        <div className="skeleton-line w50 mb1" />
                        <div className="skeleton-line w30 tall" />
                      </div>
                    ))}
                  </div>
                  <div className="db-section">
                    <div className="skeleton-line w40 mb2" />
                    {[80,60,45,35].map(w => (
                      <div key={w} className="db-lang-row">
                        <div className="skeleton-line" style={{ width: 60 }} />
                        <div className="skeleton-line" style={{ flex:1 }} />
                        <div className="skeleton-line" style={{ width: 28 }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════ */}
      <div className="stats-strip">
        <div className="container stats-strip-inner">
          {[
            ["GitHub REST API", "Data source"],
            [null],
            ["0",              "Signups required"],
            [null],
            ["Public",         "Open source"],
            [null],
            ["Real-time",      "Data fetching"],
          ].map((item, i) =>
            item[0] === null ? (
              <div key={i} className="strip-divider" />
            ) : (
              <div key={i} className="strip-item">
                <span className="strip-val">{item[0]}</span>
                <span className="strip-label">{item[1]}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-heading">
            <span className="section-label">Features</span>
            <h2>Everything you need to understand your GitHub presence.</h2>
            <p>
              Built directly on the GitHub REST API. No backend server,
              no data stored, no account required.
            </p>
          </div>

          <div className="features-grid">
            {[
              ["👤", "Profile Analytics",    "Full profile breakdown including followers, following, public repositories, bio, and account metadata."],
              ["📊", "Language Analysis",    "Percentage breakdown of every programming language used across all your public repositories."],
              ["⭐", "Repository Stats",     "Total stars, forks, largest repository, most starred project, and most recently updated repository."],
              ["🏆", "Top Repositories",     "Your top repositories ranked by star count with descriptions, languages, and activity metadata."],
              ["💡", "Developer Insights",   "Human-readable observations generated directly from your repository data — not generic advice."],
              ["🔍", "All Repositories",     "Browse every repository with full-text search, sort by stars, forks, size or date, and filter by language."],
            ].map(({ 0: icon, 1: title, 2: desc }) => (
              <div key={title} className="feature-item">
                <div className="feature-icon-wrap">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="section section-dark" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <span className="section-label">How it works</span>
            <h2>From username to full analytics in seconds.</h2>
          </div>

          <div className="steps-grid">
            {[
              { n:"01", title:"Enter a GitHub username", desc:"Type any public GitHub username into the search field. No authentication required for public profiles.", active:true },
              { n:"02", title:"Data is fetched live",    desc:"The application calls the GitHub REST API directly from your browser, with automatic pagination to retrieve all repositories." },
              { n:"03", title:"Analytics are computed",  desc:"Language percentages, statistics, insights, and repository rankings are calculated immediately from the raw API data." },
            ].map(({ n, title, desc, active }) => (
              <div key={n} className={`step-item${active ? " active" : ""}`}>
                <span className="step-num">{n}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          AI INSIGHTS DEMO
      ══════════════════════════════════════════ */}
      <section className="section" id="insights-demo">
        <div className="container">
          <div className="ai-grid">
            <div>
              <span className="section-label">Developer Insights</span>
              <h2>Data you can act on, not just numbers to look at.</h2>
              <p>
                The analytics engine generates practical observations
                from your real repository data — helping you understand
                what your GitHub activity actually means.
              </p>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setDemoIdx(i =>
                    i === null ? 0 : (i + 1) % DEMO_INSIGHTS.length
                  )
                }
              >
                Show example insight
              </button>
            </div>

            <div className="ai-panel">
              <div className="ai-panel-header">
                <span className="ai-status-dot" />
                Developer Analysis
              </div>
              <div className="ai-result">
                {demoIdx !== null ? (
                  <div className="ai-result-text">
                    <span className="ai-result-dot" />
                    <p>{DEMO_INSIGHTS[demoIdx]}</p>
                  </div>
                ) : (
                  <p className="ai-placeholder">
                    Click "Show example insight" to see how analytics
                    translate into actionable developer observations.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <span className="section-label">Get started</span>
            <h2>Analyze any GitHub profile.</h2>
            <p>
              Enter any public GitHub username below. No signup, no API key,
              no configuration required.
            </p>
            <form className="cta-search" onSubmit={handleSubmit}>
              <input
                type="text"
                className="search-input"
                placeholder="Enter a GitHub username…"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="off"
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!username.trim()}
              >
                Analyze →
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
