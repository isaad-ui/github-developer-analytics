# GitHub Developer Analytics — API Server

This is the backend API server for the Claude AI features of GitHub Developer Analytics.

It acts as a secure proxy between the React frontend and the Anthropic Claude API,
keeping the API key server-side and never exposing it to the browser.

---

## What it does

- `POST /api/insights` — generates a full AI Developer Insights report for a GitHub user
- `POST /api/ask` — answers a single question about a user's GitHub activity
- `GET /api/health` — health check endpoint (returns AI availability status)

Both AI endpoints receive structured GitHub data from the frontend and forward it to
Claude with a strict system prompt. Claude only analyzes data it is given — it never
fabricates statistics or invents information.

---

## Requirements

- Node.js 18+
- An Anthropic API key — get one at https://console.anthropic.com/

---

## Local setup

### 1. Install dependencies

```bash
cd api
npm install
```

### 2. Create your `.env` file

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_key_here
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Start the server

```bash
npm start
```

The server starts on `http://localhost:3001`.

### 4. Start the frontend

In a separate terminal:

```bash
cd website
npm run dev
```

The frontend at `http://localhost:5173` will automatically connect to the API at
`http://localhost:3001`.

---

## Production deployment

The API server needs to run somewhere with a persistent process — GitHub Pages
only hosts static files and cannot run Node.js.

### Recommended: Render (free tier)

1. Create a free account at https://render.com
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Set the following:
   - **Root directory:** `api`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. Add environment variables in the Render dashboard:
   - `ANTHROPIC_API_KEY` = your Anthropic key
   - `ALLOWED_ORIGINS` = `https://isaad-ui.github.io`
   - `PORT` = `10000` (Render sets this automatically)
6. Deploy — Render gives you a URL like `https://your-app.onrender.com`

### Alternative: Railway

1. Create an account at https://railway.app
2. New project → Deploy from GitHub repo
3. Select the `api/` directory as the root
4. Set `ANTHROPIC_API_KEY` and `ALLOWED_ORIGINS` in the Railway Variables tab
5. Railway gives you a URL like `https://your-app.up.railway.app`

---

## Connecting the frontend to the deployed API

### Option A — GitHub repository secret (recommended)

1. In your GitHub repository go to **Settings → Secrets and variables → Actions**
2. Add a new secret:
   - Name: `VITE_API_URL`
   - Value: your deployed API URL (e.g. `https://your-app.onrender.com`)
3. Push any commit — the next GitHub Actions deployment will bake the URL into the build

### Option B — Local `.env` file (for local development only)

Create `website/.env.local`:

```
VITE_API_URL=http://localhost:3001
```

---

## Environment variables

| Variable           | Required | Description                                      |
|--------------------|----------|--------------------------------------------------|
| `ANTHROPIC_API_KEY`| Yes      | Your Anthropic API key                           |
| `PORT`             | No       | Port to listen on (default: 3001)                |
| `ALLOWED_ORIGINS`  | No       | Comma-separated list of allowed frontend origins |

---

## Security notes

- The Anthropic API key is never sent to the browser
- User input (questions) is validated and limited to 500 characters
- Request body size is capped at 128KB
- CORS is restricted to the origins listed in `ALLOWED_ORIGINS`
- If the API server is unavailable, the GitHub analytics features continue working normally

---

## API reference

### `POST /api/insights`

Generates a full AI Developer Insights report.

**Request body:**
```json
{
  "data": {
    "user": { ...GitHub user object },
    "repos": [ ...GitHub repo objects ],
    "languages": { "HTML": 56.7, "Python": 11.1 },
    "stats": { "totalStars": 11, ... },
    "insights": { "total": 19, "withLang": 9, ... }
  }
}
```

**Response:**
```json
{
  "insights": "## Developer Summary\n...\n## Technical Strengths\n..."
}
```

---

### `POST /api/ask`

Answers a single question about a user's GitHub data.

**Request body:**
```json
{
  "data": { ...same as above },
  "question": "What is my strongest programming language?"
}
```

**Response:**
```json
{
  "answer": "Based on your repositories, HTML is your most used language..."
}
```

---

### `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "ai": true,
  "timestamp": "2026-10-08T12:00:00.000Z"
}
```

<!-- deployed: 2026-10-08 14:01:49 --># trigger
