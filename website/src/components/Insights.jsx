export default function Insights({ messages }) {
  return (
    <div className="section-block">
      <h3 className="section-title">Developer Insights</h3>
      <div className="insights-list">
        {messages.map((msg, i) => (
          <div key={i} className="insight-item">
            <div className="insight-dot" />
            {/* messages may contain <strong> tags */}
            <p dangerouslySetInnerHTML={{ __html: msg }} />
          </div>
        ))}
      </div>
    </div>
  );
}
