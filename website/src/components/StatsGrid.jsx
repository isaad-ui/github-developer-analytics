export default function StatsGrid({ stats, insights }) {
  const items = [
    { label: "Total Stars", value: stats.totalStars },
    { label: "Total Forks", value: stats.totalForks },
    { label: "Total Repos", value: insights.total },
    { label: "Repos With Languages", value: insights.withLang },
    { label: "Repos With Stars", value: insights.withStars },
    { label: "Avg Stars / Repo", value: insights.avgStars.toFixed(2) },
    { label: "Forked Repos", value: insights.forked },
    { label: "Archived Repos", value: insights.archived },
  ];

  return (
    <div className="section-block">
      <h3 className="section-title">Repository Statistics</h3>
      <div className="stats-grid">
        {items.map(({ label, value }) => (
          <div key={label} className="stat-card">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
