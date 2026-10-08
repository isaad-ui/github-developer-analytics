import "dotenv/config";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

const app  = express();
const PORT = process.env.PORT || 3001;

// ── CORS ────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

// Always allow localhost in development
if (!allowedOrigins.some(o => o.includes("localhost"))) {
  allowedOrigins.push("http://localhost:5173", "http://localhost:4173");
}

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, same-origin)
    if (!origin) return cb(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
}));

app.use(express.json({ limit: "128kb" }));

// ── Anthropic client ────────────────────────────────────────
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ── System prompt ───────────────────────────────────────────
const SYSTEM_PROMPT = `You are a GitHub Developer Analytics Assistant.

Your job is to analyze a developer's GitHub activity data and provide concise, practical insights.

STRICT RULES:
1. Only use information explicitly provided in the GitHub data context.
2. Never fabricate statistics, repository names, languages, or activity.
3. If data is insufficient to answer, say so clearly — do not guess.
4. Clearly distinguish observed facts from recommendations.
5. Keep responses focused and practical — avoid generic motivational statements.
6. Reference actual repository names, languages, and numbers when relevant.
7. If a question cannot be answered from the available data, say: "The available GitHub data doesn't contain enough information to answer this reliably."

RESPONSE STYLE:
- Use clear headings with ## for sections
- Use bullet points for lists
- Keep paragraphs short (2-3 sentences max)
- Highlight key findings
- Be direct and specific
- Avoid phrases like "revolutionary", "game-changing", "cutting-edge"
- Write like a senior engineer giving a code review, not a marketing pitch`;

// ── Build structured GitHub context ─────────────────────────
function buildGitHubContext(data) {
  const { user, repos, languages, stats, insights } = data;

  const topReposList = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map(r => `  - ${r.name}: ${r.language || "no language"}, ★${r.stargazers_count}, ⑂${r.forks_count}${r.description ? `, "${r.description}"` : ""}`)
    .join("\n");

  const recentRepos = [...repos]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 5)
    .map(r => `  - ${r.name} (updated ${r.updated_at.slice(0, 10)})`)
    .join("\n");

  const langList = Object.entries(languages)
    .map(([l, p]) => `  - ${l}: ${p.toFixed(1)}%`)
    .join("\n");

  return `
=== GITHUB PROFILE DATA ===

USERNAME: ${user.login}
NAME: ${user.name || "not set"}
BIO: ${user.bio || "none"}
LOCATION: ${user.location || "not set"}
PUBLIC REPOS: ${user.public_repos}
FOLLOWERS: ${user.followers}
FOLLOWING: ${user.following}
ACCOUNT CREATED: ${user.created_at?.slice(0, 10) || "unknown"}

=== REPOSITORY STATISTICS ===

TOTAL REPOSITORIES ANALYZED: ${repos.length}
TOTAL STARS: ${stats.totalStars}
TOTAL FORKS: ${stats.totalForks}
REPOS WITH STARS: ${insights.withStars}
REPOS WITH DETECTED LANGUAGE: ${insights.withLang}
REPOS WITHOUT LANGUAGE: ${insights.withoutLang}
FORKED REPOS: ${insights.forked}
ARCHIVED REPOS: ${insights.archived}
AVERAGE STARS PER REPO: ${insights.avgStars.toFixed(2)}
MOST STARRED REPO: ${stats.mostStarredRepo || "none"} (${stats.highestStars} stars)
MOST FORKED REPO: ${stats.mostForkedRepo || "none"} (${stats.highestForks} forks)
LARGEST REPO: ${stats.largestRepo || "none"} (${(stats.largestSize / 1024).toFixed(1)} MB)
MOST RECENTLY UPDATED: ${stats.recentRepo || "none"} (${stats.recentTime?.slice(0, 10) || "unknown"})

=== LANGUAGE DISTRIBUTION ===
${langList || "  No languages detected"}

=== TOP REPOSITORIES BY STARS ===
${topReposList || "  No repositories"}

=== RECENTLY UPDATED REPOSITORIES ===
${recentRepos || "  No repositories"}
`.trim();
}

// ── POST /api/insights ───────────────────────────────────────
// Generates the full AI Developer Insights analysis
app.post("/api/insights", async (req, res) => {
  const { data } = req.body;

  if (!data?.user || !data?.repos) {
    return res.status(400).json({ error: "Missing required GitHub data." });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: "AI service is not configured." });
  }

  const context = buildGitHubContext(data);

  const prompt = `${context}

=== TASK ===

Analyze this developer's GitHub profile and generate a structured Developer Insights report.

Respond with exactly these five sections:

## Developer Summary
A 2-3 sentence description of who this developer appears to be based on their GitHub activity. Be specific — reference actual data.

## Technical Strengths
What technologies and areas does this developer appear strongest in? Reference actual languages and repositories.

## Development Patterns
What patterns are visible in their repository activity, language use, and project types? Be specific and factual.

## Areas to Improve
Based only on visible gaps or patterns in the data, what areas could this developer focus on? Be constructive and realistic.

## Recommended Next Steps
3-5 concrete, practical next steps this developer could take. Base them on the actual data provided.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0]?.text || "";
    res.json({ insights: text });
  } catch (err) {
    console.error("Claude API error (insights):", err.message);

    if (err.status === 401) {
      return res.status(503).json({ error: "AI service authentication failed. Check the API key." });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: "AI service rate limit reached. Please try again shortly." });
    }

    res.status(503).json({ error: "AI service is temporarily unavailable. GitHub analytics still works normally." });
  }
});

// ── POST /api/ask ─────────────────────────────────────────────
// Interactive Q&A — answers a single question about GitHub data
app.post("/api/ask", async (req, res) => {
  const { data, question } = req.body;

  if (!data?.user || !data?.repos) {
    return res.status(400).json({ error: "Missing required GitHub data." });
  }
  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return res.status(400).json({ error: "A question is required." });
  }
  if (question.trim().length > 500) {
    return res.status(400).json({ error: "Question must be under 500 characters." });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: "AI service is not configured." });
  }

  const context = buildGitHubContext(data);

  const prompt = `${context}

=== QUESTION ===

${question.trim()}

Answer based only on the GitHub data provided above. If the data doesn't contain enough information to answer reliably, say so clearly. Keep the answer concise and practical.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0]?.text || "";
    res.json({ answer: text });
  } catch (err) {
    console.error("Claude API error (ask):", err.message);

    if (err.status === 429) {
      return res.status(429).json({ error: "AI service rate limit reached. Please try again shortly." });
    }

    res.status(503).json({ error: "AI service is temporarily unavailable." });
  }
});

// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    ai: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`GitHub Analytics API running on http://localhost:${PORT}`);
  console.log(`AI enabled: ${!!process.env.ANTHROPIC_API_KEY}`);
});
