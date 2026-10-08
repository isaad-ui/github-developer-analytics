import { useState } from "react";
import {
  getUserData,
  getRepositories,
  analyzeLanguages,
  calcStats,
  calcInsights,
  topRepos,
  buildInsights,
  GitHubError,
} from "./api.js";

import SearchForm     from "./components/SearchForm.jsx";
import UserProfile    from "./components/UserProfile.jsx";
import StatsGrid      from "./components/StatsGrid.jsx";
import LanguageBars   from "./components/LanguageBars.jsx";
import RepoHighlights from "./components/RepoHighlights.jsx";
import TopRepos       from "./components/TopRepos.jsx";
import Insights       from "./components/Insights.jsx";

// ─── Static demo insights for the landing section ─────────────────────────
const DEMO_INSIGHTS = [
  "Your recent activity shows a stronger level of consistency compared with earlier periods.",
  "Your GitHub activity suggests you are actively working across multiple repositories.",
  "Reviewing which projects generated the most activity could help you identify areas of greatest progress.",
];

export default function App() {
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [results,  setResults]  = useState(null);   // null = no search yet
  const [demoIdx,  setDemoIdx]  = useState(null);

  // ── Search handler ────────────────────────────────────────────────────
  async function handleSearch(username, token) {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const [user, repos] = await Promise.all([
        getUserData(username, token),
        getRepositories(username, token),
      ]);

      const languages     = analyzeLanguages(repos);
      const stats         = calcStats(repos);
      const insights      = calcInsights(repos);
      const top           = topRepos(repos, 5);
      const insightMsgs   = buildInsights(user, insights, languages, stats);

      setResults({ user, repos, languages, stats, insights, top, insightMsgs });
    } catch (err) {
      setError(
        err instanceof GitHubError
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="app">

      {/* ── NAVBAR ── */}
      <header className="navbar">
        <div className="container nav-content">
          <a href="#" className="logo">
            <span className="logo-icon">⌘</span>
            GitHub Analytics
          </a>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#search">Analyze</a>
          </nav>
          <a href="#search" className="nav-button">Try it</a>
        </div>
      </header>

      <main>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="container hero-grid">

            <div className="hero-content">
              <div className="badge">Developer intelligence platform</div>
              <h1>
                Understand your{" "}
                <span className="hero-muted">GitHub activity.</span>
              </h1>
              <p className="hero-desc">
                GitHub Developer Analytics transforms your GitHub activity into
                clear insights about your coding habits, productivity,
                consistency, and development progress.
              </p>
              <div className="hero-buttons">
                <a href="#search" className="primary-button">
                  Explore Analytics →
                </a>
                <a href="#features" className="secondary-button">
                  Learn More
                </a>
              </div>
              <p className="hero-note">
                Built for developers who want to understand their work.
              </p>
            </div>

            {/* Mock dashboard */}
            <div className="dashboard-wrapper">
              <div className="dashboard">
                <div className="dashboard-top">
                  <div>
                    <div className="small-label">Developer overview</div>
                    <h3>GitHub Activity</h3>
                  </div>
                  <div className="status">
                    <span className="status-dot" /> Active
                  </div>
                </div>

                <div className="dash-stats">
                  {[
                    ["Repositories", "19"],
                    ["Total Stars",  "11"],
                    ["Languages",    "4"],
                    ["Followers",    "29"],
                  ].map(([label, val]) => (
                    <div key={label} className="dash-stat-card">
                      <span>{label}</span>
                      <strong>{val}</strong>
                    </div>
                  ))}
                </div>

                <div className="dash-insight">
                  <div className="insight-icon">✦</div>
                  <div>
                    <span className="small-label">Developer insight</span>
                    <p>
                      HTML is the dominant language at 66.67% of repositories.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="section" id="features">
          <div className="container">
            <div className="section-heading">
              <span className="section-label">FEATURES</span>
              <h2>Turn GitHub activity into useful intelligence.</h2>
              <p>
                Instead of simply showing contribution graphs, GitHub Developer
                Analytics helps you understand what your activity actually means.
              </p>
            </div>
            <div className="features-grid">
              {[
                ["01", "Profile Analytics",    "Retrieve followers, following, public repositories, and account info."],
                ["02", "Language Analysis",    "See exactly which languages you use and their percentage breakdown."],
                ["03", "Repository Statistics","Total stars, forks, largest repo, and most recently updated project."],
                ["04", "Developer Insights",   "Human-readable explanations generated directly from your real data."],
              ].map(([num, title, desc]) => (
                <article key={num} className="feature-card">
                  <div className="feature-number">{num}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="section dark-section" id="how-it-works">
          <div className="container">
            <div className="section-heading">
              <span className="section-label">HOW IT WORKS</span>
              <h2>From GitHub activity to actionable insight.</h2>
            </div>
            <div className="steps">
              {[
                ["01", "Enter Username",   "Type any GitHub username into the search field below."],
                ["02", "Analyze Activity", "The app calls the GitHub REST API and processes all repository data."],
                ["03", "Get Insights",     "Real analytics are displayed instantly — no signup required."],
              ].map(([num, title, desc]) => (
                <div key={num} className="step">
                  <div className="step-number">{num}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI INSIGHTS DEMO ── */}
        <section className="section" id="insights-demo">
          <div className="container">
            <div className="ai-grid">
              <div>
                <span className="section-label">AI INSIGHTS</span>
                <h2>Don't just see the numbers. Understand them.</h2>
                <p>
                  Raw GitHub statistics only tell part of the story. The
                  analytics engine turns your real data into readable developer
                  insights.
                </p>
                <button
                  className="primary-button"
                  onClick={() =>
                    setDemoIdx(Math.floor(Math.random() * DEMO_INSIGHTS.length))
                  }
                >
                  Generate Example Insight →
                </button>
              </div>

              <div className="ai-panel">
                <div className="ai-panel-header">
                  <span className="ai-dot" /> AI Developer Analysis
                </div>
                <div className="ai-result">
                  <p>
                    {demoIdx !== null
                      ? DEMO_INSIGHTS[demoIdx]
                      : "Generate an example insight to see how developer analytics become readable explanations."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SEARCH ── */}
        <section className="search-section" id="search">
          <div className="container">
            <div className="search-box">
              <span className="section-label">GET STARTED</span>
              <h2>Understand your development activity.</h2>
              <p>
                Enter any GitHub username to get a full analytics breakdown —
                profile, repositories, languages, statistics, and insights.
              </p>

              <SearchForm onSearch={handleSearch} loading={loading} />

              {/* Loading */}
              {loading && (
                <div className="loading-row">
                  <div className="spinner" />
                  <p>Fetching GitHub data…</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="error-msg" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── RESULTS ── */}
        {results && (
          <section className="results-section">
            <div className="container results-container">

              <UserProfile    user={results.user}                               />
              <StatsGrid      stats={results.stats}    insights={results.insights} />
              <LanguageBars   languages={results.languages}                     />
              <RepoHighlights stats={results.stats}                             />
              <TopRepos       repos={results.top}                               />
              <Insights       messages={results.insightMsgs}                   />

            </div>
          </section>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer>
        <div className="container footer-content">
          <div>
            <a href="#" className="logo">
              <span className="logo-icon">⌘</span>
              GitHub Analytics
            </a>
            <p>Developer intelligence built from GitHub activity.</p>
          </div>
          <div className="footer-right">
            © {new Date().getFullYear()} GitHub Developer Analytics
          </div>
        </div>
      </footer>

    </div>
  );
}
