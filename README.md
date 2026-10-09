# GitHub Developer Analytics

A developer intelligence platform that analyzes any public GitHub profile and transforms the data into actionable insights — powered by the GitHub REST API and Claude AI.

---

## Live Site

**[https://github-developer-analytics.netlify.app](https://github-developer-analytics.netlify.app)**

---

## What It Does

Enter any public GitHub username and get an instant analytics dashboard covering:

- **Profile** — avatar, bio, followers, following, public repository count
- **Language distribution** — percentage breakdown of every language used across all repositories
- **Repository statistics** — total stars, forks, largest repo, most starred, most recently updated
- **Top repositories** — ranked by stars with descriptions, languages, and activity
- **Developer insights** — data-driven observations generated from real repository data
- **All repositories** — full browser with search, sort (stars, forks, size, date), and language filter
- **AI Developer Insights** — Claude analyzes your GitHub activity and produces a structured report covering technical strengths, development patterns, areas to improve, and recommended next steps
- **Ask Your GitHub** — ask any question about your GitHub activity and get an answer grounded in your real data

---

## Project Structure

```
github-developer-analytics/
│
├── .github/
│   └── workflows/
│       └── deploy-site.yml       # GitHub Actions — builds and deploys frontend
│
├── api/
│   ├── server.js                 # Express API server — proxies Claude AI requests
│   ├── package.json
│   ├── .env.example              # Environment variable template
│   ├── .gitignore
│   └── README.md                 # Full API setup and deployment guide
│
├── website/
│   ├── public/
│   │   ├── logo.svg              # App logo
│   │   └── _redirects            # Netlify SPA routing
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── AIInsights.jsx    # Claude-powered developer analysis
│   │   │   ├── AskGitHub.jsx     # Interactive Q&A
│   │   │   ├── Insights.jsx      # Data-driven insight bullets
│   │   │   ├── LanguageBars.jsx  # Language distribution chart
│   │   │   ├── RepoHighlights.jsx
│   │   │   ├── SearchForm.jsx
│   │   │   ├── StatsGrid.jsx
│   │   │   ├── TopRepos.jsx
│   │   │   └── UserProfile.jsx
│   │   ├── pages/
│   │   │   ├── Analytics.jsx     # Full analytics dashboard
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── NotFound.jsx      # 404 page
│   │   │   └── Repositories.jsx  # All repositories browser
│   │   ├── App.jsx               # Router + navbar + footer
│   │   ├── api.js                # GitHub API calls + analytics logic
│   │   ├── index.css             # Design system + all styles
│   │   └── main.jsx              # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── main.py                       # Python terminal version
├── netlify.toml                  # Netlify build configuration
└── README.md
```

---

## Architecture

```
Browser
  │
  ├── GitHub REST API (direct)
  │     └── Profile, repositories, languages, stats
  │
  └── API Server (api/)
        └── POST /api/insights  →  Claude AI analysis
        └── POST /api/ask       →  Claude AI Q&A
```

The frontend calls the GitHub REST API directly from the browser.
All Claude AI requests go through the Express API server to keep the Anthropic API key server-side.

---

## Running Locally

### Frontend

```bash
cd website
npm install
npm run dev
```

Opens at `http://localhost:5173`. GitHub analytics work immediately without any configuration.

### API Server (for AI features)

```bash
cd api
npm install
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
npm start
```

Runs on `http://localhost:3001`. The frontend automatically connects to it.

See `api/README.md` for full setup instructions.

### Python Terminal Version

```bash
pip install requests
python main.py
```

Enter any GitHub username when prompted.

---

## Deployment

### Frontend — Netlify

Deployed automatically via `netlify.toml` when changes are pushed to `main`.

Build settings (defined in `netlify.toml`):
- Base: `website`
- Build command: `npm run build`
- Publish: `dist`

Set the `VITE_API_URL` environment variable in Netlify to point to your deployed API server.

### API Server — Render

The `api/` folder is deployed as a Node.js web service on Render.

Required environment variables:
- `ANTHROPIC_API_KEY` — your Anthropic API key
- `ALLOWED_ORIGINS` — `https://github-developer-analytics.netlify.app`

See `api/README.md` for step-by-step Render deployment instructions.

---

## Environment Variables

| Variable | Location | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | `api/.env` / Render | Anthropic Claude API key |
| `ALLOWED_ORIGINS` | `api/.env` / Render | Allowed frontend origins for CORS |
| `VITE_API_URL` | Netlify env vars | URL of the deployed API server |

**Never commit API keys to the repository.**

---

## Technologies

| Technology | Purpose |
|---|---|
| React 18 | Frontend framework |
| Vite | Build tool |
| React Router | Client-side routing |
| GitHub REST API | Developer data source |
| Anthropic Claude | AI developer analysis |
| Express | API server |
| Netlify | Frontend hosting |
| Render | API server hosting |
| GitHub Actions | CI/CD pipeline |
| Python + requests | Terminal analytics tool |

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, features, how it works, about, roadmap |
| `/analytics/:username` | Full analytics dashboard + AI insights |
| `/repos/:username` | All repositories with search and filters |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/insights` | Generate full AI developer analysis |
| `POST` | `/api/ask` | Answer a question about GitHub data |
| `GET` | `/api/health` | Health check + AI availability status |

---

## Security

- Anthropic API key is never exposed to the browser
- GitHub tokens are optional and stored only in the browser session
- User questions are validated and limited to 500 characters
- CORS is restricted to allowed origins
- If the AI service is unavailable, all GitHub analytics continue working normally

---

## Project Status

| Feature | Status |
|---|---|
| GitHub profile analytics | ✅ Live |
| Language distribution | ✅ Live |
| Repository statistics | ✅ Live |
| Top repositories | ✅ Live |
| All repositories browser | ✅ Live |
| Multi-page React app | ✅ Live |
| Netlify deployment | ✅ Live |
| API server (Render) | ✅ Live |
| AI Developer Insights (Claude) | ⏳ Requires Anthropic credits |
| Ask Your GitHub (Claude) | ⏳ Requires Anthropic credits |
| Python terminal tool | ✅ Working |
