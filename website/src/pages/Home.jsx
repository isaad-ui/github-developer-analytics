import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserData, getRepositories,
  analyzeLanguages, calcStats, calcInsights, extractUsername,
} from "../api.js";

/* ── Inline SVG icons — no library needed ─────────────────── */
const icons = {
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  barChart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="12" rx="1"/><rect x="17" y="4" width="4" height="16" rx="1"/>
    </svg>
  ),
  star: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  trophy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4H4a1 1 0 0 0-1 1v3a4 4 0 0 0 4 4h1"/><path d="M17 4h3a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4h-1"/><path d="M7 4h10v7a5 5 0 0 1-10 0V4z"/>
    </svg>
  ),
  lightbulb: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21h6M12 3a6 6 0 0 1 4.33 10.22c-.61.6-1.33 1.33-1.33 2.28V17H9v-1.5c0-.95-.72-1.68-1.33-2.28A6 6 0 0 1 12 3z"/>
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
};

const FEATURES = [
  { icon: "user",      title: "Profile Analytics",   desc: "Followers, following, public repositories, bio, location, and account metadata — all in one view." },
  { icon: "barChart",  title: "Language Analysis",   desc: "Percentage breakdown of every language across all public repositories, sorted by usage." },
  { icon: "star",      title: "Repository Stats",    desc: "Total stars, forks, largest repository, most starred project, and most recently updated." },
  { icon: "trophy",    title: "Top Repositories",    desc: "Repositories ranked by star count with descriptions, primary language, and activity." },
  { icon: "lightbulb", title: "Developer Insights",  desc: "Observations derived directly from repository data — language spread, activity patterns, and more." },
  { icon: "search",    title: "Repository Browser",  desc: "Full-text search across all repositories with sort and language filter." },
];

export default function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
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
        const top3 = [...repos]
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 3);
        setDemo({ user, languages, stats, insights, top3 });
      } catch { /* silent fallback */ }
    }
    loadDemo();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const u = extractUsername(username);
    if (u) navigate(`/analytics/${u}`);
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero">
        <div className="container hero-grid">

          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="hero-label">GitHub Developer Analytics</span>
            </div>

            <h1>Understand your GitHub activity.</h1>

            <p className="hero-desc">
              Analyze any public GitHub profile instantly. Language
              breakdowns, repository statistics, and developer
              insights — powered by the GitHub REST API.
            </p>

            <form className="hero-search" onSubmit={handleSubmit} id="search">
              <div className="hero-search-row">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Username or github.com/username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                />
                <button type="submit" className="btn btn-primary" disabled={!username.trim()}>
                  Analyze
                </button>
              </div>
              <p className="hero-note">No account required · Any public GitHub profile</p>
            </form>
          </div>

          {/* Live dashboard preview */}
          <div className="dashboard-wrapper">
            <div className="dashboard">
              <div className="db-titlebar">
                <span className="db-title">Developer Overview</span>
                <div className="db-live">
                  <span className="db-live-dot" />
                  {demo ? "Live" : "Loading"}
                </div>
              </div>

              {demo ? (
                <>
                  <div className="db-profile">
                    <img src={demo.user.avatar_url} alt="" className="db-avatar-img" />
                    <div>
                      <div className="db-profile-name">{demo.user.login}</div>
                      <div className="db-profile-handle">{demo.user.name || ""}</div>
                    </div>
                  </div>

                  <div className="db-stats">
                    {[
                      ["Repos",      demo.user.public_repos, false],
                      ["Stars",      demo.stats.totalStars,  true],
                      ["Followers",  demo.user.followers,    false],
                      ["Languages",  Object.keys(demo.languages).length, false],
                    ].map(([label, val, ac]) => (
                      <div key={label} className="db-stat">
                        <div className="db-stat-label">{label}</div>
                        <div className={`db-stat-val${ac ? " ac" : ""}`}>{val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="db-section">
                    <div className="db-section-title">Languages</div>
                    <div className="db-lang-bars">
                      {Object.entries(demo.languages).slice(0, 4).map(([lang, pct], i) => (
                        <div key={lang} className="db-lang-row">
                          <span className="db-lang-name">{lang}</span>
                          <div className="db-lang-track">
                            <div className={`db-lang-fill${i > 0 ? " dim" : ""}`} style={{ width:`${pct}%` }} />
                          </div>
                          <span className="db-lang-pct">{pct.toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="db-section">
                    <div className="db-section-title">Top Repositories</div>
                    <div className="db-repo-list">
                      {demo.top3.map(repo => (
                        <div key={repo.id} className="db-repo-item">
                          <span className="db-repo-name">{repo.name}</span>
                          <div className="db-repo-meta">
                            {repo.language && <span className="db-repo-lang">{repo.language}</span>}
                            <span>★ {repo.stargazers_count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="db-insight">
                    <div className="db-insight-dot" />
                    <p>
                      {Object.keys(demo.languages)[0]
                        ? `${Object.keys(demo.languages)[0]} is the primary language at ${Object.values(demo.languages)[0].toFixed(0)}% of repositories.`
                        : "Analyzing language distribution."}
                    </p>
                  </div>
                </>
              ) : (
                /* skeleton */
                <div className="db-skeleton">
                  <div className="db-skeleton-profile">
                    <div className="skeleton sk-circle" />
                    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5 }}>
                      <div className="skeleton sk-line" style={{ width:"55%" }} />
                      <div className="skeleton sk-line" style={{ width:"35%" }} />
                    </div>
                  </div>
                  <div className="db-stats">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="db-stat">
                        <div className="skeleton sk-line" style={{ width:"60%", marginBottom:5 }} />
                        <div className="skeleton sk-tall" style={{ width:"40%" }} />
                      </div>
                    ))}
                  </div>
                  <div className="db-section">
                    <div className="skeleton sk-line" style={{ width:"40%", marginBottom:10 }} />
                    {[70,55,40,30].map(w => (
                      <div key={w} className="db-lang-row" style={{ marginBottom:6 }}>
                        <div className="skeleton sk-line" style={{ width:60 }} />
                        <div className="skeleton sk-line" style={{ flex:1 }} />
                        <div className="skeleton sk-line" style={{ width:24 }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────── */}
      <div className="stats-strip">
        <div className="container stats-strip-inner">
          {[
            ["GitHub REST API", "Data source"],
            null,
            ["0", "Signups required"],
            null,
            ["Public", "Open source"],
            null,
            ["Real-time", "Data fetching"],
          ].map((item, i) =>
            item === null ? (
              <div key={i} className="strip-div" />
            ) : (
              <div key={i} className="strip-item">
                <span className="strip-val">{item[0]}</span>
                <span className="strip-label">{item[1]}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────────── */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-heading">
            <span className="label" style={{ marginBottom: "var(--sp-3)" }}>Features</span>
            <h2>Everything you need to understand your GitHub presence.</h2>
            <p>Built on the GitHub REST API. No backend, no data stored, no account needed.</p>
          </div>

          <div className="features-list">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="feature-item">
                <div className="feature-icon">{icons[icon]}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="section section-dark" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <span className="label" style={{ marginBottom: "var(--sp-3)" }}>How it works</span>
            <h2>From username to analytics in seconds.</h2>
          </div>

          <div className="steps-row">
            {[
              { n:"01", title:"Enter a username", desc:"Type any public GitHub username or paste a github.com profile URL directly into the search field." },
              { n:"02", title:"Data is fetched",  desc:"The browser calls the GitHub REST API with automatic pagination to retrieve the full repository list." },
              { n:"03", title:"Analytics render", desc:"Language percentages, statistics, repository rankings, and insights are computed and displayed instantly." },
            ].map(({ n, title, desc }, i, arr) => (
              <div key={n} className="step" style={{ position:"relative" }}>
                <span className="step-num">{n}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
                {i < arr.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────── */}
      <section className="section" id="about">
        <div className="container">
          <div className="section-heading">
            <span className="label" style={{ marginBottom: "var(--sp-3)" }}>About</span>
            <h2>What is GitHub Developer Analytics?</h2>
            <p>
              A lightweight analytics tool that transforms public GitHub data
              into structured developer intelligence — with no backend server and no configuration.
            </p>
          </div>

          <div className="about-cols">
            <div className="about-col">
              <h3>What it does</h3>
              <p>
                Retrieves public profile and repository data from the GitHub REST API
                and presents language distribution, repository statistics, contribution
                patterns, and developer insights in a single dashboard.
              </p>
            </div>
            <div className="about-col">
              <h3>Who it is for</h3>
              <ul className="about-list">
                <li>Developers reviewing their own progress</li>
                <li>Students building a portfolio</li>
                <li>Recruiters evaluating a candidate</li>
                <li>Teams reviewing a developer's public work</li>
                <li>Anyone curious about a GitHub profile</li>
              </ul>
            </div>
            <div className="about-col">
              <h3>Current status</h3>
              <p>
                Early-stage open source project. All GitHub analytics features are
                fully functional. See the{" "}
                <a
                  href="https://github.com/isaad-ui/github-developer-analytics"
                  target="_blank" rel="noopener noreferrer"
                  className="about-link"
                >
                  GitHub repository
                </a>{" "}
                for source code and contribution guide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROADMAP ──────────────────────────────── */}
      <section className="section section-dark" id="roadmap">
        <div className="container">
          <div className="section-heading">
            <span className="label" style={{ marginBottom: "var(--sp-3)" }}>Roadmap</span>
            <h2>What's built, what's next.</h2>
          </div>

          <div className="roadmap-cols">
            <div className="roadmap-col">
              <div className="roadmap-col-label">
                <span className="rd-dot live" />
                <span className="rd-label-live">Available</span>
              </div>
              <ul className="roadmap-list">
                {[
                  "GitHub profile analytics",
                  "Language distribution analysis",
                  "Repository statistics and highlights",
                  "Top repository ranking",
                  "Developer insight bullets",
                  "Repository browser with search and filters",
                  "Multi-page app with client-side routing",
                  "GitHub URL input support",
                ].map(item => (
                  <li key={item} className="roadmap-item">
                    <span className="rd-check">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="roadmap-col">
              <div className="roadmap-col-label">
                <span className="rd-dot wip" />
                <span className="rd-label-wip">In Development</span>
              </div>
              <ul className="roadmap-list">
                {[
                  "Commit activity analysis",
                  "Contribution heatmap",
                  "Repository activity trends",
                  "Language analysis by lines of code",
                  "Shareable analytics reports",
                ].map(item => (
                  <li key={item} className="roadmap-item">
                    <span className="rd-dash">–</span>{item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="roadmap-col">
              <div className="roadmap-col-label">
                <span className="rd-dot future" />
                <span className="rd-label-future">Planned</span>
              </div>
              <ul className="roadmap-list">
                {[
                  "Developer growth tracking over time",
                  "Portfolio analysis",
                  "Stars and forks over time",
                  "Compare two GitHub profiles",
                  "Personalized project recommendations",
                ].map(item => (
                  <li key={item} className="roadmap-item">
                    <span className="rd-dash">–</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className="cta-box">
            <span className="label" style={{ marginBottom: "var(--sp-3)" }}>Get started</span>
            <h2>Analyze any GitHub profile.</h2>
            <p>Enter any public GitHub username. No signup, no configuration required.</p>
            <form className="cta-row" onSubmit={handleSubmit}>
              <input
                type="text"
                className="search-input"
                placeholder="Username or github.com/username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="btn btn-primary" disabled={!username.trim()}>
                Analyze →
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
