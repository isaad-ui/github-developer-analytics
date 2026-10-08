import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getUserData, getRepositories, analyzeLanguages,
  calcStats, calcInsights, topRepos, buildInsights, GitHubError,
} from "../api.js";
import UserProfile    from "../components/UserProfile.jsx";
import StatsGrid      from "../components/StatsGrid.jsx";
import LanguageBars   from "../components/LanguageBars.jsx";
import RepoHighlights from "../components/RepoHighlights.jsx";
import TopRepos       from "../components/TopRepos.jsx";
import Insights       from "../components/Insights.jsx";

export default function Analytics() {
  const { username } = useParams();
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [token] = useState(() => sessionStorage.getItem("gh_token") || "");

  useEffect(() => {
    setState({ status: "loading", data: null, error: null });

    async function load() {
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
        setState({ status: "done", data: { user, repos, languages, stats, insights, top, insightMsgs }, error: null });
      } catch (err) {
        setState({ status: "error", data: null,
          error: err instanceof GitHubError ? err.message : "An unexpected error occurred." });
      }
    }

    load();
  }, [username, token]);

  return (
    <div className="page-analytics">

      {/* ── Header bar ── */}
      <div className="analytics-header">
        <div className="container analytics-header-inner">
          <Link to="/" className="btn btn-ghost back-btn">
            ← Back
          </Link>
          <div className="analytics-breadcrumb">
            <span>Analytics</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-user">@{username}</span>
          </div>
          <Link to={`/repos/${username}`} className="btn btn-secondary">
            View All Repos →
          </Link>
        </div>
      </div>

      <div className="container analytics-container">

        {/* LOADING */}
        {state.status === "loading" && (
          <div className="analytics-loading">
            <div className="loading-card">
              <div className="spinner spinner-lg" />
              <h3>Analyzing @{username}</h3>
              <p>Fetching profile and repository data from GitHub…</p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {state.status === "error" && (
          <div className="analytics-error">
            <div className="error-card">
              <div className="error-icon">⚠️</div>
              <h3>Something went wrong</h3>
              <p>{state.error}</p>
              <div className="error-actions">
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Try Again
                </button>
                <Link to="/" className="btn btn-secondary">Back to Home</Link>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {state.status === "done" && state.data && (
          <div className="results-container">
            {/* Page title */}
            <div className="analytics-page-title">
              <h1>
                Analytics for{" "}
                <span className="gradient-text">@{username}</span>
              </h1>
              <p className="analytics-subtitle">
                Based on {state.data.repos.length} public repositories
              </p>
            </div>

            <UserProfile    user={state.data.user} />
            <StatsGrid      stats={state.data.stats} insights={state.data.insights} />
            <LanguageBars   languages={state.data.languages} />
            <RepoHighlights stats={state.data.stats} />
            <TopRepos       repos={state.data.top} username={username} />
            <Insights       messages={state.data.insightMsgs} />

            {/* Footer CTA */}
            <div className="analytics-footer-cta">
              <Link to={`/repos/${username}`} className="btn btn-primary">
                View All {state.data.repos.length} Repositories →
              </Link>
              <Link to="/" className="btn btn-secondary"
                onClick={() => setTimeout(() => {
                  const el = document.getElementById("search");
                  if (el) { el.scrollIntoView({ behavior: "smooth" }); el.querySelector("input")?.focus(); }
                }, 100)}
              >
                Analyze Another Profile
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
