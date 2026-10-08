import { useState, useRef, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const SUGGESTED_QUESTIONS = [
  "What is my strongest programming language?",
  "What kind of developer am I based on my repositories?",
  "Which repositories should I improve or finish?",
  "What should I learn next based on my current projects?",
  "Which project should I highlight on my portfolio?",
  "What are the biggest gaps in my current GitHub profile?",
  "How active have I been recently?",
  "What do my stars and forks say about my work?",
];

// Parse answer text — handles bullets and paragraphs
function AnswerText({ text }) {
  const lines = text.split("\n").filter(l => l.trim());
  return (
    <div className="ask-answer-body">
      {lines.map((line, i) => {
        const t = line.trim();
        if (t.startsWith("## ")) {
          return <h4 key={i} className="ask-answer-heading">{t.slice(3)}</h4>;
        }
        if (t.startsWith("- ") || t.startsWith("* ")) {
          return (
            <div key={i} className="ai-bullet">
              <span className="ai-bullet-dot" />
              <span>{t.slice(2)}</span>
            </div>
          );
        }
        if (/^\d+\.\s/.test(t)) {
          const num  = t.match(/^(\d+)\./)[1];
          const rest = t.replace(/^\d+\.\s/, "");
          return (
            <div key={i} className="ai-numbered">
              <span className="ai-num">{num}</span>
              <span>{rest}</span>
            </div>
          );
        }
        if (t.startsWith("**") && t.endsWith("**")) {
          return <p key={i} className="ai-bold-line">{t.slice(2, -2)}</p>;
        }
        return <p key={i} className="ai-paragraph">{t}</p>;
      })}
    </div>
  );
}

export default function AskGitHub({ data }) {
  const [question,  setQuestion]  = useState("");
  const [status,    setStatus]    = useState("idle"); // idle | loading | done | error
  const [answer,    setAnswer]    = useState("");
  const [errMsg,    setErrMsg]    = useState("");
  const [history,   setHistory]   = useState([]); // [{q, a}]
  const inputRef    = useRef(null);
  const answerRef   = useRef(null);

  useEffect(() => {
    if (status === "done" && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [status]);

  async function ask(q) {
    const trimmed = (q || question).trim();
    if (!trimmed || status === "loading") return;

    setStatus("loading");
    setErrMsg("");
    setAnswer("");

    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ data, question: trimmed }),
        signal:  AbortSignal.timeout(20000),
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrMsg(json.error || "Failed to get an answer.");
        return;
      }

      const text = json.answer || "";
      setAnswer(text);
      setHistory(prev => [{ q: trimmed, a: text }, ...prev].slice(0, 10));
      setStatus("done");
      setQuestion("");
    } catch (err) {
      setStatus("error");
      if (err.name === "TimeoutError") {
        setErrMsg("Request timed out. Please try again.");
      } else {
        setErrMsg("Could not reach the AI service. Please check your connection.");
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    ask(question);
  }

  function useSuggestion(q) {
    setQuestion(q);
    ask(q);
    inputRef.current?.focus();
  }

  return (
    <div className="section-block ask-github-block">

      {/* Header */}
      <div className="ai-block-header">
        <div className="ai-block-title-row">
          <div className="ai-block-label">
            <span className="ai-spark">◈</span>
            Ask Your GitHub
          </div>
          <span className="ai-powered-by">Powered by Claude</span>
        </div>
        <p className="ai-block-desc">
          Ask any question about your GitHub activity. Claude answers using
          only the data from your profile — no guessing.
        </p>
      </div>

      {/* Suggested questions */}
      <div className="ask-suggestions">
        <p className="ask-suggestions-label">Suggested questions</p>
        <div className="ask-suggestions-grid">
          {SUGGESTED_QUESTIONS.map(q => (
            <button
              key={q}
              className="ask-suggestion-btn"
              onClick={() => useSuggestion(q)}
              disabled={status === "loading"}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input form */}
      <form className="ask-form" onSubmit={handleSubmit}>
        <div className="ask-input-row">
          <input
            ref={inputRef}
            type="text"
            className="ask-input"
            placeholder="Ask anything about your GitHub activity…"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            maxLength={500}
            disabled={status === "loading"}
            autoComplete="off"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!question.trim() || status === "loading"}
          >
            {status === "loading" ? (
              <><div className="spinner" style={{ width:14, height:14, borderWidth:2 }} /> Asking…</>
            ) : "Ask"}
          </button>
        </div>
        {question.length > 400 && (
          <p className="ask-char-count">{500 - question.length} characters remaining</p>
        )}
      </form>

      {/* Error */}
      {status === "error" && (
        <div className="ai-error-state">
          <p className="ai-error-msg">{errMsg}</p>
          <button className="btn btn-ghost" onClick={() => setStatus("idle")}>Dismiss</button>
        </div>
      )}

      {/* Answer */}
      {status === "done" && answer && (
        <div className="ask-answer" ref={answerRef}>
          <div className="ask-answer-header">
            <span className="ask-answer-label">Answer</span>
          </div>
          <AnswerText text={answer} />
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div className="ask-history">
          <p className="ask-history-label">Previous questions</p>
          {history.slice(1).map((item, i) => (
            <details key={i} className="ask-history-item">
              <summary className="ask-history-q">{item.q}</summary>
              <div className="ask-history-a">
                <AnswerText text={item.a} />
              </div>
            </details>
          ))}
        </div>
      )}

    </div>
  );
}
