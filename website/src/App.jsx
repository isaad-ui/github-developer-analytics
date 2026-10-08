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

const DEMO_INSIGHTS = [
  "Your recent activity shows a stronger level of consistency compared with earlier periods.",
  "Your GitHub activity suggests you are actively working across multiple repositories.",
  "Reviewing which projects generated the most activity could help you identify areas of greatest progress.",
];

export default function App() {
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [results,  setResults]  = useState(null);
  const [demoIdx,  setDemoIdx]  = useState(null);

  async function handleSearch(username, token) {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const [user, repos] = await Promise.all([
        getUserData(username, token),
        getRepositories(username, token),
      ]);

      const languages   = analyzeLanguages(repos);
      const stats       = calcStats(repos);
      const insights    = calcInsights(repos);
      const top         = topRepos(repos, 5);
      const insightMsgs = buildInsights(user, insights, languages, stats);

      setResults({ user, repos, languages, stats, insights, top, insightMsgs });

      // Scroll results into view after render
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
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

  return (
    <div className="app">

      {/* ── NAVBAR ── */}
      <header className="navbar">
        <div className="container nav-content">
          <a href="#" className="logo">
            <span className="logo-icon">GH</span>
            GitHub Analytics
          </a>

          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#search">Analyze</a>
          </nav>

          <a href="#search" className="nav-cta">Try it free</a>
        </div>
      </header>

      <main>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="container hero-grid">

            <div className="hero-content">
              <div className="hero-eyebrow">
                <span className="badge badge-accent">Developer intelligence platform</span>
              </div>

              <h1>
                Understand your{" "}
                <span className="hero-muted">GitHub activity.</span>
              </h1>

              <p className="hero-desc">
                GitHub Developer Analytics transforms your GitHub activity into
                clear insights about your coding habits, productivity, and
                development progress.
              </p>

              <div className="hero-buttons">
                <a href="#search" className="btn btn-primary">
                  Analyze Your Profile →
                </a>
                <a href="#features" className="btn btn-secondary">
                  Learn More
                </a>
              </div>

              <p className="hero-note">
                No signup required — works with any public GitHub account.
              </p>
            </div>

            {/* ── Mock Dashboard ── */}
            <div className="dashboard-wrapper">
              <div className="dashboard">
                <div className="dashboard-header">
                  <div>
                    <div className="section-label" style={{ marginBottom: "4px" }}>
                      Developer overview
                    </div>
                    <div className="dashboard-title">GitHub Activity</div>
                  </div>
                  <div className="status-indicator">
                    <span className="status-dot" />
                    Live
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
                  <div className="insight-icon-sm">✦</div>
                  <div>
                    <div className="section-label" style={{ marginBottom: "4px" }}>
                      Insight
                    </div>
                    <p>HTML dominates at 66.7% of repositories.</p>
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
              <span className="section-label">Features</span>
              <h2>Turn GitHub activity into useful intelligence.</h2>
              <p>
                Instead of simply showing contribution graphs, GitHub Developer
                Analytics helps you understand what your activity actually means.
              </p>
            </div>

            <div className="features-grid">
              {[
                ["01", "Profile Analytics",
                  "Retrieve followers, following, public repositories, and full account information."],
                ["02", "Language Analysis",
                  "See exactly which languages you use across your repositories with a percentage breakdown."],
                ["03", "Repository Statistics",
                  "Total stars, forks, largest repository, and your most recently updated project."],
                ["04", "Developer Insights",
                  "Human-readable explanations generated directly from your real GitHub data."],
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
        <section className="section section-dark" id="how-it-works">
          <div className="container">
            <div className="section-heading">
              <span className="section-label">How it works</span>
              <h2>From username to insights in seconds.</h2>
            </div>

            <div className="steps">
              {[
                ["01", "Enter Username",    "Type any public GitHub username into the search field."],
                ["02", "Analyze Activity",  "The app calls the GitHub REST API and processes all repository data."],
                ["03", "Get Insights",      "Real analytics are displayed instantly — no signup required."],
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
                <span className="section-label">Developer Insights</span>
                <h2>Don't just see the numbers. Understand them.</h2>
                <p>
                  Raw GitHub statistics only tell part of the story. The
                  analytics engine turns your real data into readable developer
                  insights.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setDemoIdx(Math.floor(Math.random() * DEMO_INSIGHTS.length))
                  }
                >
                  Generate Example Insight
                </button>
              </div>

              <div className="ai-panel">
                <div className="ai-panel-header">
                  <span className="ai-dot" />
                  AI Developer Analysis
                </div>
                <div className="ai-result">
                  <p>
                    {demoIdx !== null
                      ? DEMO_INSIGHTS[demoIdx]
                      : "Click the button to see how developer analytics become readable explanations."}
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
              <span className="section-label">Get started</span>
              <h2>Analyze any GitHub profile.</h2>
              <p>
                Enter any public GitHub username to get a full breakdown of
                profile, repositories, languages, statistics, and insights.
              </p>

              <SearchForm onSearch={handleSearch} loading={loading} />

              {loading && (
                <div className="loading-row">
                  <div className="spinner" />
                  <span>Fetching GitHub data…</span>
                </div>
              )}

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
          <section className="results-section" id="results">
            <div className="container results-container">
              <UserProfile    user={results.user} />
              <StatsGrid      stats={results.stats} insights={results.insights} />
              <LanguageBars   languages={results.languages} />
              <RepoHighlights stats={results.stats} />
              <TopRepos       repos={results.top} />
              <Insights       messages={results.insightMsgs} />
            </div>
          </section>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer>
        <div className="container footer-content">
          <div>
            <a href="#" className="logo">
              <span className="logo-icon">GH</span>
              GitHub Analytics
            </a>
            <p className="footer-tagline">
              Developer intelligence built from GitHub activity.
            </p>
          </div>
          <div className="footer-right">
            © {new Date().getFullYear()} GitHub Developer Analytics
          </div>
        </div>
      </footer>

    </div>
  );
}
