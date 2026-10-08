import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Parse Claude's markdown-ish response into structured sections
function parseSections(text) {
  const sectionOrder = [
    "Developer Summary",
    "Technical Strengths",
    "Development Patterns",
    "Areas to Improve",
    "Recommended Next Steps",
  ];

  const sections = [];
  const lines = text.split("\n");
  let current = null;

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)/);
    if (headingMatch) {
      if (current) sections.push(current);
      current = { heading: headingMatch[1].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);

  // Sort by expected order, append any extras at the end
  const ordered = sectionOrder
    .map(title => sections.find(s => s.heading.toLowerCase().includes(title.toLowerCase())))
    .filter(Boolean);
  const extras = sections.filter(
    s => !sectionOrder.some(t => s.heading.toLowerCase().includes(t.toLowerCase()))
  );

  return [...ordered, ...extras];
}

// Render section body — handles bullet lines and paragraphs
function SectionBody({ lines }) {
  const content = lines.join("\n").trim();
  if (!content) return null;

  const parts = content.split("\n").filter(l => l.trim());
  return (
    <div className="ai-section-body">
      {parts.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={i} className="ai-bullet">
              <span className="ai-bullet-dot" />
              <span>{trimmed.slice(2)}</span>
            </div>
          );
        }
        if (/^\d+\.\s/.test(trimmed)) {
          const num   = trimmed.match(/^(\d+)\./)[1];
          const rest  = trimmed.replace(/^\d+\.\s/, "");
          return (
            <div key={i} className="ai-numbered">
              <span className="ai-num">{num}</span>
              <span>{rest}</span>
            </div>
          );
        }
        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return <p key={i} className="ai-bold-line">{trimmed.slice(2, -2)}</p>;
        }
        return <p key={i} className="ai-paragraph">{trimmed}</p>;
      })}
    </div>
  );
}

const SECTION_ICONS = {
  "Developer Summary":      "◈",
  "Technical Strengths":    "◆",
  "Development Patterns":   "◇",
  "Areas to Improve":       "▷",
  "Recommended Next Steps": "→",
};

export default function AIInsights({ data }) {
  const [status,   setStatus]   = useState("idle"); // idle | loading | done | error | unavailable
  const [sections, setSections] = useState([]);
  const [errMsg,   setErrMsg]   = useState("");

  // Simple session cache — keyed by username
  const cacheKey = `ai_insights_${data?.user?.login}`;

  async function generate() {
    // Check session cache first
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setSections(parseSections(cached));
      setStatus("done");
      return;
    }

    setStatus("loading");
    setErrMsg("");

    try {
      const res = await fetch(`${API_BASE}/api/insights`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ data }),
        signal:  AbortSignal.timeout(30000),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 503) {
          setStatus("unavailable");
          setErrMsg(json.error || "AI service is temporarily unavailable.");
        } else {
          setStatus("error");
          setErrMsg(json.error || "Failed to generate insights.");
        }
        return;
      }

      const text = json.insights || "";
      sessionStorage.setItem(cacheKey, text);
      setSections(parseSections(text));
      setStatus("done");
    } catch (err) {
      if (err.name === "TimeoutError") {
        setStatus("error");
        setErrMsg("Request timed out. The AI service may be slow — please try again.");
      } else {
        setStatus("unavailable");
        setErrMsg("Could not reach the AI service. GitHub analytics above still work normally.");
      }
    }
  }

  return (
    <div className="section-block ai-insights-block">

      {/* Header */}
      <div className="ai-block-header">
        <div className="ai-block-title-row">
          <div className="ai-block-label">
            <span className="ai-spark">✦</span>
            AI Developer Insights
          </div>
          <span className="ai-powered-by">Powered by Claude</span>
        </div>
        <p className="ai-block-desc">
          Analyze your GitHub activity and get a structured report covering
          your technical profile, development patterns, and practical next steps.
        </p>
      </div>

      {/* Idle — prompt to generate */}
      {status === "idle" && (
        <div className="ai-idle">
          <button className="btn btn-primary" onClick={generate}>
            Generate AI Insights
          </button>
          <p className="ai-idle-note">
            Sends your GitHub data to Claude for analysis. Takes 5–15 seconds.
          </p>
        </div>
      )}

      {/* Loading */}
      {status === "loading" && (
        <div className="ai-loading-state">
          <div className="ai-loading-inner">
            <div className="spinner" />
            <div>
              <p className="ai-loading-title">Analyzing your GitHub activity…</p>
              <p className="ai-loading-sub">Claude is reviewing your repositories, languages, and activity patterns.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="ai-error-state">
          <p className="ai-error-msg">{errMsg}</p>
          <button className="btn btn-secondary" onClick={generate}>Try Again</button>
        </div>
      )}

      {/* Unavailable — AI down, not a user error */}
      {status === "unavailable" && (
        <div className="ai-unavailable-state">
          <div className="ai-unavailable-icon">◌</div>
          <p className="ai-unavailable-title">AI insights unavailable</p>
          <p className="ai-unavailable-msg">{errMsg}</p>
          <button className="btn btn-ghost" onClick={generate}>Retry</button>
        </div>
      )}

      {/* Done — render sections */}
      {status === "done" && sections.length > 0 && (
        <div className="ai-sections">
          {sections.map(section => (
            <div key={section.heading} className="ai-section">
              <div className="ai-section-heading">
                <span className="ai-section-icon">
                  {SECTION_ICONS[section.heading] || "·"}
                </span>
                <h3>{section.heading}</h3>
              </div>
              <SectionBody lines={section.lines} />
            </div>
          ))}
          <div className="ai-footer">
            <p>Analysis based on {data.repos.length} public repositories.</p>
            <button className="btn btn-ghost ai-regen-btn" onClick={() => {
              sessionStorage.removeItem(cacheKey);
              setStatus("idle");
              setSections([]);
            }}>
              Regenerate
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
