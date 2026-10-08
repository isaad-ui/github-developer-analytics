export default function LanguageBars({ languages }) {
  const entries = Object.entries(languages);

  if (entries.length === 0) {
    return (
      <div className="section-block">
        <h3 className="section-title">Language Usage</h3>
        <p className="empty-msg">No programming languages detected.</p>
      </div>
    );
  }

  return (
    <div className="section-block">
      <h3 className="section-title">Language Usage</h3>
      <div className="lang-list">
        {entries.map(([lang, pct]) => (
          <div key={lang} className="lang-row">
            <div className="lang-label">
              <span className="lang-name">{lang}</span>
              <span className="lang-pct">{pct.toFixed(1)}%</span>
            </div>
            <div className="lang-track">
              <div
                className="lang-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
