# GitHub Developer Analytics

A Python-powered GitHub analytics application that uses the GitHub REST API to retrieve a user's GitHub profile and repository data, analyze it, and display useful developer statistics.

The project is also being used as a practical learning environment for APIs, HTTP requests, JSON, authentication, headers, and backend/frontend integration.

---

## Live Website

Deployed via GitHub Pages:
**[https://isaad-ui.github.io/github-developer-analytics](https://isaad-ui.github.io/github-developer-analytics)**

---

## What It Does

Enter any GitHub username and the application retrieves and displays:

- GitHub profile (name, avatar, bio, followers, following, public repos)
- Language usage across repositories (with percentage breakdown)
- Repository statistics (total stars, forks, largest repo, most recently updated)
- Repository highlights (most starred, most forked, largest, recently updated)
- Top repositories ranked by stars (with description, language, stars, forks)
- Developer insights generated from real repository data

---

## Project Structure

```
github-developer-analytics/
│
├── .github/
│   └── workflows/
│       └── deploy-site.yml     # GitHub Actions deployment workflow
│
├── website/
│   ├── index.html              # Frontend HTML (landing page + analytics UI)
│   ├── style.css               # All styling (dark theme, responsive)
│   └── script.js               # GitHub API calls + analytics logic
│
├── main.py                     # Python terminal version of the analytics tool
└── README.md                   # This file
```

---

## How It Works

### Frontend (website/)

The website calls the GitHub REST API directly from the browser using JavaScript.
This means it works with GitHub Pages without needing a separate backend server.

**API flow:**

```
User enters GitHub username
        ↓
JavaScript builds GitHub API URL
        ↓
Optional: Authorization header added (Bearer token)
        ↓
fetch() → https://api.github.com/users/{username}
        ↓
GitHub returns JSON
        ↓
JavaScript processes and analyzes the data
        ↓
Analytics rendered on the page
```

**API endpoints used:**

| Endpoint | Purpose |
|---|---|
| `GET /users/{username}` | Fetch user profile |
| `GET /users/{username}/repos?per_page=100&page=N` | Fetch repositories (paginated) |

### Python Terminal Version (main.py)

A standalone terminal tool that does the same analysis using Python's `requests` library.
Useful for learning API concepts, running locally, or extending with more complex features.

---

## Running the Website Locally

No build step or server is required. Just open the file in a browser:

```
website/index.html
```

Or serve it with Python's built-in server from the project root:

```powershell
python -m http.server 8000 --directory website
```

Then open: [http://localhost:8000](http://localhost:8000)

---

## Running the Python Terminal Version

### 1. Install dependencies

```powershell
pip install requests
```

### 2. Set your GitHub token (optional but recommended)

```powershell
$env:GITHUB_TOKEN = "your_token_here"
```

Without a token the program still works, but is limited to 60 API requests per hour.
With a token the limit is 5,000 requests per hour.

### 3. Run the program

```powershell
python main.py
```

Then enter a GitHub username when prompted.

**Example output:**

```
GITHUB DEVELOPER ANALYTICS
Enter your GitHub username: isaad-ui

GITHUB PROFILE
Login: isaad-ui
Name: Issaka Sa-ad Timbilla
Followers: 29
Following: 33
Public Repositories: 19

LANGUAGE USAGE
HTML: 66.67%
Python: 11.11%
TypeScript: 11.11%
JavaScript: 11.11%

REPOSITORY STATISTICS
Total Stars: 11
Total Forks: 0
Most Starred Repository: HTML-CSS-Project
...

REPOSITORY INSIGHTS
Total Repositories: 19
Repositories With Languages: 9
...

TOP REPOSITORIES
1. HTML-CSS-Project
   Stars: 1
   Language: HTML
...
```

---

## Authentication

The GitHub token is **never stored in source code**. It is read from an environment variable.

### Python version

```python
import os
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
```

### Frontend version

The token field is optional. If provided, it is only used in the `Authorization` header sent directly to GitHub. It is never stored anywhere except your browser session.

**Security rules followed by this project:**

- Never hard-code the token in `main.py`, HTML, CSS, or JavaScript
- Never commit the token to GitHub
- Never print or log the actual token value
- Always use environment variables for the Python version

---

## GitHub API Rate Limits

| Situation | Limit |
|---|---|
| No token (unauthenticated) | 60 requests/hour |
| With a personal access token | 5,000 requests/hour |

If you hit the rate limit, the application will display a clear error message.

To generate a personal access token:
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Select the `public_repo` scope (read-only is sufficient)
4. Copy the token and use it in the optional token field on the website, or set it as `GITHUB_TOKEN` for the Python version

---

## Deployment

The website is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch.

**Workflow file:** `.github/workflows/deploy-site.yml`

The workflow deploys the contents of the `website/` directory to GitHub Pages.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| Python | Terminal analytics tool |
| `requests` | HTTP requests in Python |
| GitHub REST API | External data source |
| HTML | Frontend structure |
| CSS | Frontend styling (dark theme, responsive) |
| JavaScript | Frontend API calls and analytics logic |
| GitHub Actions | Automated deployment |
| GitHub Pages | Static website hosting |

---

## HTTP Concepts Demonstrated

This project was built as a practical API learning environment. Concepts covered:

- REST APIs and endpoints
- HTTP GET requests
- URL construction and query parameters
- JSON responses and parsing
- HTTP status codes (200, 401, 403, 404, 500)
- API authentication with Bearer tokens
- HTTP request headers
- API pagination
- Error handling
- Environment variables for secrets
- CORS and browser-based API requests
- GitHub Actions and CI/CD

---

## Future Improvements

- Contribution statistics and commit activity
- Language analysis by actual lines of code (using `/repos/{owner}/{repo}/languages` endpoint)
- Repository activity trends over time
- Stars over time chart
- Share analytics as a link
- Dark/light mode toggle
- Caching to reduce API calls

---

## Project Status

| Component | Status |
|---|---|
| Python terminal tool | Working |
| GitHub API connection | Working |
| Authentication | Working |
| Repository pagination | Implemented |
| Language analysis | Working |
| Repository statistics | Working |
| Repository insights | Working |
| Frontend website | Working |
| GitHub Pages deployment | Working |
| GitHub Actions | Green |
