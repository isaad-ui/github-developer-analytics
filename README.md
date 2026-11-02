# GitHub Developer Analytics

A developer analytics platform that analyzes any public GitHub profile and transforms the data into actionable insights — powered by the GitHub REST API.

---

## Live Site

**[https://github-developer-analytics.netlify.app](https://github-developer-analytics.netlify.app)**

---

## What It Does

Enter any public GitHub username or profile URL and get an instant analytics dashboard:

- **Profile** — avatar, bio, followers, following, public repository count
- **Language distribution** — percentage breakdown of every language across all repositories
- **Repository statistics** — total stars, forks, largest repo, most starred, most recently updated
- **Top repositories** — ranked by stars with descriptions, languages, and activity
- **Developer insights** — data-driven observations from real repository data
- **All repositories** — full browser with search, sort, and language filter

---

## Project Structure

```
github-developer-analytics/
│
├── .github/
│   └── workflows/
│       └── deploy-site.yml       # GitHub Actions — builds and deploys frontend
│
├── website/
│   ├── public/
│   │   ├── logo.svg              # App logo
│   │   └── _redirects            # Netlify SPA routing
│   ├── src/
│   │   ├── components/
│   │   │   ├── Insights.jsx
│   │   │   ├── LanguageBars.jsx
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
│   │   ├── App.jsx
│   │   ├── api.js                # GitHub API calls + analytics logic
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── main.py                       # Python terminal version
├── netlify.toml                  # Netlify build configuration
└── README.md
```

---

## Running Locally

```bash
cd website
npm install
npm run dev
```

Opens at `http://localhost:5173`. All analytics work immediately — no configuration needed.

---

## Input Formats

The search accepts both:

- Plain username: `isaad-ui`
- GitHub profile URL: `https://github.com/isaad-ui`
- Repository URL: `https://github.com/isaad-ui/some-repo` (extracts the username)

---

## Python Terminal Version

```bash
pip install requests
python main.py
```

Enter any GitHub username when prompted. Outputs profile, languages, repository statistics, insights, and top repositories in the terminal.

---

## Deployment

Deployed automatically to **Netlify** via `netlify.toml` on every push to `main`.

Build settings (from `netlify.toml`):
- Base: `website`
- Build command: `npm run build`
- Publish: `dist`

---

## GitHub API Rate Limits

| Situation | Limit |
|---|---|
| No token (unauthenticated) | 60 requests/hour |
| With a personal access token | 5,000 requests/hour |

To use a token, expand the optional token field on the website before searching.

---

## Technologies

| Technology | Purpose |
|---|---|
| React 18 | Frontend framework |
| Vite | Build tool |
| React Router | Client-side routing |
| GitHub REST API | Data source |
| Netlify | Hosting |
| GitHub Actions | CI/CD |
| Python + requests | Terminal analytics tool |

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/analytics/:username` | Full analytics dashboard |
| `/repos/:username` | All repositories with search and filters |

---

## Project Status

| Feature | Status |
|---|---|
| GitHub profile analytics | Live |
| Language distribution | Live |
| Repository statistics | Live |
| Top repositories | Live |
| All repositories browser | Live |
| Multi-page React app | Live |
| Netlify deployment | Live |
| GitHub URL input support | Live |
| Python terminal tool | Working |
