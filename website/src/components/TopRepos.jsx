import { formatDate } from "../api.js";
import { Link } from "react-router-dom";

export default function TopRepos({ repos, username }) {
  if (repos.length === 0) {
    return (
      <div className="section-block">
        <h3 className="section-title">Top Repositories</h3>
        <p className="empty-msg">No repositories found.</p>
      </div>
    );
  }

  return (
    <div className="section-block">
      <div className="section-block-header">
        <h3 className="section-title">Top Repositories</h3>
        {username && (
          <Link to={`/repos/${username}`} className="btn btn-ghost view-all-btn">
            View all →
          </Link>
        )}
      </div>
      <div className="repo-list">
        {repos.map((repo, i) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="repo-card"
          >
            <div className="repo-card-top">
              <span className="repo-rank">{String(i + 1).padStart(2, "0")}</span>
              <span className="repo-name">{repo.name}</span>
            </div>

            <p className={`repo-desc ${!repo.description ? "repo-no-desc" : ""}`}>
              {repo.description || "No description"}
            </p>

            <div className="repo-meta">
              {repo.language && (
                <span className="repo-lang">{repo.language}</span>
              )}
              <span className="repo-stars">★ {repo.stargazers_count}</span>
              <span className="repo-forks">⑂ {repo.forks_count}</span>
              <span className="repo-updated">
                Updated {formatDate(repo.updated_at)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
