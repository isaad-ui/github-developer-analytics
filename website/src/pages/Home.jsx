import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEMO_INSIGHTS = [
  "Your recent activity shows a stronger level of consistency compared with earlier periods.",
  "GitHub activity suggests you are actively working across multiple repositories.",
  "Reviewing which projects generated the most activity helps identify areas of greatest progress.",
];

export default function Home() {
  const [username, setUsername] = useState("");
  const [demoIdx,  setDemoIdx]  = useState(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const u = username.trim();
    if (u) navigate(`/analytics/${u}`);
  }

  return (
    <div className="page-home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />

        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="badge badge-accent">
                <span className="badge-dot" /> Developer intelligence platform
              </span>
            </div>

            <h1>
              Turn your GitHub{" "}
              <span className="gradient-text">activity</span>{" "}
              into real insights.
            </h1>

            <p className="hero-desc">
              GitHub Developer Analytics transforms your public GitHub profile
              into clear, actionable developer intelligence — instantly.
            </p>

            {/* Inline search */}
            <form className="hero-search" onSubmit={handleSubmit}>
              <div className="hero-search-inner">
                <span className="hero-search-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="hero-search-input"
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
                  Analyze →
                </button>
              </div>
              <p className="hero-note">
                Free · No signup · Works with any public GitHub account
              </p>
            </form>
          </div>

          {/* ── Mock Dashboard ── */}
          <div className="dashboard-wrapper">
            <div className="dashboard">
              <div className="dashboard-header">
                <div>
                  <div className="small-label">Developer overview</div>
                  <div className="dashboard-title">GitHub Activity</div>
                </div>
                <div className="status-indicator">
                  <span className="status-dot" /> Live
                </div>
              </div>

              <div className="dash-stats">
                {[["Repositories","19"],["Total Stars","11"],["Languages","4"],["Followers","29"]].map(([l, v]) => (
                  <div key={l} className="dash-stat-card">
                    <span>{l}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>

              {/* Mini language bars */}
              <div className="dash-lang-bars">
                {[["HTML","58%","var(--color-data-1)"],["Python","14%","var(--color-accent)"],["TypeScript","14%","var(--color-data-2)"],["JavaScript","14%","var(--color-data-3)"]].map(([l, w, c]) => (
                  <div key={l} className="dash-lang-row">
                    <span className="dash-lang-name">{l}</span>
                    <div className="dash-lang-track">
                      <div className="dash-lang-fill" style={{ width: w, background: c }} />
                    </div>
                    <span className="dash-lang-pct">{w}</span>
                  </div>
                ))}
              </div>

              <div className="dash-insight">
                <div className="insight-icon-sm">✦</div>
                <div>
                  <div className="small-label" style={{ marginBottom: 2 }}>Insight</div>
                  <p>HTML dominates at 66.7% of repositories.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS TICKER ── */}
      <div className="stats-ticker">
        <div className="container ticker-inner">
          {[["10K+","Profiles Analyzed"],["50+","Languages Tracked"],["100%","Open Source"],["0","Signups Required"]].map(([n, l]) => (
            <div key={l} className="ticker-item">
              <strong>{n}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-label">Features</span>
            <h2>Everything you need to understand your GitHub presence.</h2>
            <p>Built on the GitHub REST API. No backend server. No data stored.</p>
          </div>

          <div className="features-grid-3">
            {[
              { icon: "👤", title: "Profile Analytics",    desc: "Full profile breakdown — followers, following, repositories, bio, and location." },
              { icon: "📊", title: "Language Analysis",    desc: "Percentage breakdown of every programming language across all your repositories." },
              { icon: "⭐", title: "Repository Stats",     desc: "Total stars, forks, largest repo, most starred, and most recently updated." },
              { icon: "🏆", title: "Top Repositories",     desc: "Your top 5 repositories ranked by stars with descriptions and metadata." },
              { icon: "💡", title: "Developer Insights",   desc: "Human-readable insights generated directly from your real GitHub data." },
              { icon: "🔒", title: "Privacy First",        desc: "No account needed. Your data stays between you and GitHub's public API." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="feature-card-v2">
                <div className="feature-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section section-dark" id="how-it-works">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-label">How it works</span>
            <h2>From username to insights in seconds.</h2>
          </div>

          <div className="steps-v2">
            {[
              { n:"01", title:"Enter username",   desc:"Type any public GitHub username into the search field on the homepage." },
              { n:"02", title:"API fetches data",  desc:"JavaScript calls the GitHub REST API directly with pagination for all repositories." },
              { n:"03", title:"Analytics run",     desc:"Language analysis, statistics, insights, and top repository ranking all compute instantly." },
              { n:"04", title:"View your results", desc:"A full analytics dashboard appears — profile, charts, stats, repos, and insights." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="step-v2">
                <div className="step-num-v2">{n}</div>
                <div className="step-body">
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI DEMO ── */}
      <section className="section" id="insights-demo">
        <div className="container">
          <div className="ai-grid">
            <div>
              <span className="section-label">Developer Insights</span>
              <h2>Don't just see the numbers. Understand them.</h2>
              <p>
                The analytics engine generates human-readable insights from your
                real repository data — not generic advice.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setDemoIdx(Math.floor(Math.random() * DEMO_INSIGHTS.length))}
              >
                Generate Example Insight →
              </button>
            </div>

            <div className="ai-panel">
              <div className="ai-panel-header">
                <span className="ai-dot" /> AI Developer Analysis
              </div>
              <div className="ai-result">
                {demoIdx !== null ? (
                  <div className="ai-result-text">
                    <div className="insight-dot" style={{ marginTop: 7, flexShrink: 0 }} />
                    <p>{DEMO_INSIGHTS[demoIdx]}</p>
                  </div>
                ) : (
                  <p className="ai-placeholder">
                    Click the button to generate a sample developer insight.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-glow" />
            <span className="section-label">Get started</span>
            <h2>Ready to analyze your GitHub profile?</h2>
            <p>Enter your username above or click below — no account needed.</p>
            <form className="cta-search" onSubmit={handleSubmit}>
              <input
                type="text"
                className="search-input"
                placeholder="Enter GitHub username…"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="btn btn-primary" disabled={!username.trim()}>
                Analyze Profile →
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
