import { useState } from "react";

export default function SearchForm({ onSearch, loading }) {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const u = username.trim();
    if (!u) return;
    onSearch(u, token.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Enter GitHub username (e.g. isaad-ui)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className="primary-button"
          disabled={loading || !username.trim()}
        >
          {loading ? "Analyzing…" : "Analyze Profile →"}
        </button>
      </div>

      <div className="token-toggle">
        <button
          type="button"
          className="token-toggle-btn"
          onClick={() => setShowToken((v) => !v)}
        >
          {showToken ? "▲" : "▼"} Optional: GitHub token for higher rate limits
        </button>

        {showToken && (
          <div className="token-row">
            <input
              type="password"
              className="token-input"
              placeholder="ghp_yourtoken..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="off"
            />
            <p className="token-note">
              Used only in requests to GitHub. Never stored or sent anywhere else.
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
