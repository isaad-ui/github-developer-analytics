import { formatDate } from "../api.js";

export default function RepoHighlights({ stats }) {
  const cards = [
    {
      label: "Most Starred",
      value: stats.mostStarredRepo || "None",
      sub: `${stats.highestStars} star${stats.highestStars !== 1 ? "s" : ""}`,
    },
    {
      label: "Most Forked",
      value: stats.mostForkedRepo || "None",
      sub: `${stats.highestForks} fork${stats.highestForks !== 1 ? "s" : ""}`,
    },
    {
      label: "Largest",
      value: stats.largestRepo || "None",
      sub: `${(stats.largestSize / 1024).toFixed(1)} MB`,
    },
    {
      label: "Recently Updated",
      value: stats.recentRepo || "None",
      sub: formatDate(stats.recentTime),
    },
  ];

  return (
    <div className="section-block">
      <h3 className="section-title">Repository Highlights</h3>
      <div className="highlights-grid">
        {cards.map(({ label, value, sub }) => (
          <div key={label} className="highlight-card">
            <span className="highlight-label">{label}</span>
            <strong className="highlight-value">{value}</strong>
            <small>{sub}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
