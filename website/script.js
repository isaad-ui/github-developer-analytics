// ================================
// CURRENT YEAR
// ================================

document.getElementById("year").textContent =
    new Date().getFullYear();


// ================================
// AI INSIGHT DEMO
// ================================

const generateInsightButton =
    document.getElementById("generateInsight");

const aiResult =
    document.getElementById("aiResult");


const insights = [
    "Your recent activity shows a stronger level of consistency compared with earlier periods. Maintaining regular contributions may help you build stronger development habits.",

    "Your GitHub activity suggests that you are actively working across multiple repositories. Focusing on fewer projects at a time could make your development efforts more focused.",

    "Your contribution activity has increased recently. Reviewing which projects generated the most activity could help you identify the areas where you are making the most progress."
];


generateInsightButton.addEventListener("click", function () {

    const randomIndex =
        Math.floor(Math.random() * insights.length);

    aiResult.innerHTML = `
        <p>${insights[randomIndex]}</p>
    `;

});


// ================================
// NAVIGATION
// ================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(event) {

        const targetId =
            this.getAttribute("href");

        if (targetId === "#") {
            return;
        }

        const target =
            document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


// ================================
// GITHUB API
// ================================

const GITHUB_API_BASE = "https://api.github.com";


// Build request headers — mirrors main.py header setup
function buildHeaders(token) {
    const headers = {
        "Accept": "application/vnd.github+json"
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}


// Fetch a single URL with error handling — mirrors requests.get() + raise_for_status()
async function githubFetch(url, params, token) {
    const headers = buildHeaders(token);

    if (params) {
        const query = new URLSearchParams(params).toString();
        url = `${url}?${query}`;
    }

    const response = await fetch(url, { headers });

    if (response.status === 404) {
        throw new GithubError("User not found.", 404);
    }

    if (response.status === 401) {
        throw new GithubError("Invalid or expired token. Remove your token or generate a new one.", 401);
    }

    if (response.status === 403) {
        const data = await response.json();
        const isRateLimit = data.message && data.message.includes("rate limit");
        throw new GithubError(
            isRateLimit
                ? "GitHub API rate limit exceeded. Add a personal access token for higher limits."
                : "Access forbidden (403).",
            403
        );
    }

    if (!response.ok) {
        throw new GithubError(`GitHub API error: ${response.status} ${response.statusText}`, response.status);
    }

    return response.json();
}


// Custom error class for GitHub API errors
class GithubError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}


// Retrieve user profile — mirrors get_user_data()
async function getUserData(username, token) {
    const url = `${GITHUB_API_BASE}/users/${username}`;
    return githubFetch(url, null, token);
}


// Retrieve all repositories with pagination — mirrors get_repositories()
async function getRepositories(username, token) {
    const repos = [];
    let page = 1;

    while (true) {
        const url = `${GITHUB_API_BASE}/users/${username}/repos`;

        const params = {
            per_page: 100,
            page: page
        };

        const data = await githubFetch(url, params, token);

        if (!data || data.length === 0) {
            break;
        }

        repos.push(...data);
        page++;
    }

    return repos;
}


// ================================
// ANALYTICS — mirrors main.py functions
// ================================

// mirrors analyze_languages() + calculate_language_percentages()
function analyzeLanguages(repos) {
    const languages = {};

    for (const repo of repos) {
        const lang = repo.language;
        if (lang) {
            languages[lang] = (languages[lang] || 0) + 1;
        }
    }

    const total = Object.values(languages).reduce((sum, n) => sum + n, 0);

    if (total === 0) return {};

    const percentages = {};
    for (const [lang, count] of Object.entries(languages)) {
        percentages[lang] = (count / total) * 100;
    }

    // Sort by percentage descending
    return Object.fromEntries(
        Object.entries(percentages).sort(([, a], [, b]) => b - a)
    );
}


// mirrors calculate_repository_statistics()
function calculateRepositoryStatistics(repos) {
    let totalStars = 0;
    let totalForks = 0;

    let mostStarredRepo = null;
    let highestStars = 0;

    let mostForkedRepo = null;
    let highestForks = 0;

    let largestRepo = null;
    let largestSize = -1;

    let mostRecentlyUpdatedRepo = null;
    let latestUpdateTime = null;

    for (const repo of repos) {
        totalStars += repo.stargazers_count;
        totalForks += repo.forks_count;

        if (repo.stargazers_count > highestStars) {
            highestStars = repo.stargazers_count;
            mostStarredRepo = repo.name;
        }

        if (repo.forks_count > highestForks) {
            highestForks = repo.forks_count;
            mostForkedRepo = repo.name;
        }

        if (repo.size > largestSize) {
            largestSize = repo.size;
            largestRepo = repo.name;
        }

        const updateTime = repo.updated_at;
        if (!latestUpdateTime || updateTime > latestUpdateTime) {
            latestUpdateTime = updateTime;
            mostRecentlyUpdatedRepo = repo.name;
        }
    }

    return {
        totalStars,
        totalForks,
        mostStarredRepo,
        highestStars,
        mostForkedRepo,
        highestForks,
        largestRepo,
        largestSize,
        mostRecentlyUpdatedRepo,
        latestUpdateTime
    };
}


// mirrors calculate_repository_insights()
function calculateRepositoryInsights(repos) {
    const total = repos.length;

    let withLanguages = 0;
    let withoutLanguages = 0;
    let withStars = 0;
    let forked = 0;
    let archived = 0;
    let totalStars = 0;

    for (const repo of repos) {
        if (repo.language) withLanguages++;
        else withoutLanguages++;

        if (repo.stargazers_count > 0) withStars++;
        if (repo.fork) forked++;
        if (repo.archived) archived++;

        totalStars += repo.stargazers_count;
    }

    return {
        total,
        withLanguages,
        withoutLanguages,
        withStars,
        forked,
        archived,
        averageStars: total > 0 ? totalStars / total : 0
    };
}


// mirrors get_top_repositories()
function getTopRepositories(repos, limit = 5) {
    return [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, limit);
}


// Generate insight text based on real data
function generateInsightText(userData, insights, languagePercentages, stats) {
    const messages = [];

    const topLang = Object.keys(languagePercentages)[0];
    if (topLang) {
        messages.push(
            `${userData.login}'s most used language is <strong>${topLang}</strong> ` +
            `(${languagePercentages[topLang].toFixed(1)}% of repositories).`
        );
    }

    if (insights.withStars > 0) {
        messages.push(
            `<strong>${insights.withStars}</strong> of ${insights.total} repositories have received stars — ` +
            `your work is getting noticed.`
        );
    }

    if (insights.forked > 0) {
        messages.push(
            `You have forked <strong>${insights.forked}</strong> repositories, showing active collaboration ` +
            `and exploration of other projects.`
        );
    }

    if (insights.withoutLanguages > insights.withLanguages) {
        messages.push(
            `${insights.withoutLanguages} repositories have no detected language. ` +
            `These are likely config, documentation, or template repos.`
        );
    }

    if (stats.largestRepo) {
        messages.push(
            `Your largest repository is <strong>${stats.largestRepo}</strong> ` +
            `(${(stats.largestSize / 1024).toFixed(1)} MB).`
        );
    }

    if (messages.length === 0) {
        messages.push("Keep building — your analytics will grow with your GitHub activity.");
    }

    return messages;
}


// ================================
// DISPLAY FUNCTIONS
// ================================

function formatDate(isoString) {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


function displayUserProfile(userData) {
    const el = document.getElementById("userProfile");

    el.innerHTML = `
        <div class="profile-header">
            <img
                src="${userData.avatar_url}"
                alt="${userData.login}'s avatar"
                class="profile-avatar"
            />
            <div class="profile-info">
                <h2 class="profile-name">${userData.name || userData.login}</h2>
                <a
                    href="${userData.html_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="profile-username"
                >
                    @${userData.login}
                </a>
                ${userData.bio ? `<p class="profile-bio">${userData.bio}</p>` : ""}
            </div>
        </div>

        <div class="profile-stats">

            <div class="profile-stat">
                <strong>${userData.public_repos}</strong>
                <span>Repositories</span>
            </div>

            <div class="profile-stat">
                <strong>${userData.followers}</strong>
                <span>Followers</span>
            </div>

            <div class="profile-stat">
                <strong>${userData.following}</strong>
                <span>Following</span>
            </div>

        </div>
    `;
}


function displayStatisticsGrid(stats, insights) {
    const el = document.getElementById("statsGrid");

    el.innerHTML = `
        <h3 class="results-section-title">Repository Statistics</h3>

        <div class="results-grid">

            <div class="result-stat-card">
                <span>Total Stars</span>
                <strong>${stats.totalStars}</strong>
            </div>

            <div class="result-stat-card">
                <span>Total Forks</span>
                <strong>${stats.totalForks}</strong>
            </div>

            <div class="result-stat-card">
                <span>With Languages</span>
                <strong>${insights.withLanguages}</strong>
                <small>of ${insights.total} repos</small>
            </div>

            <div class="result-stat-card">
                <span>Avg Stars / Repo</span>
                <strong>${insights.averageStars.toFixed(2)}</strong>
            </div>

            <div class="result-stat-card">
                <span>Forked Repos</span>
                <strong>${insights.forked}</strong>
            </div>

            <div class="result-stat-card">
                <span>Archived Repos</span>
                <strong>${insights.archived}</strong>
            </div>

        </div>
    `;
}


function displayLanguages(languagePercentages) {
    const el = document.getElementById("languageSection");

    if (Object.keys(languagePercentages).length === 0) {
        el.innerHTML = `
            <h3 class="results-section-title">Language Usage</h3>
            <p class="results-empty">No programming languages detected across repositories.</p>
        `;
        return;
    }

    const bars = Object.entries(languagePercentages).map(([lang, pct]) => `
        <div class="lang-row">
            <div class="lang-label">
                <span class="lang-name">${lang}</span>
                <span class="lang-pct">${pct.toFixed(1)}%</span>
            </div>
            <div class="lang-bar-track">
                <div class="lang-bar-fill" style="width: ${pct}%"></div>
            </div>
        </div>
    `).join("");

    el.innerHTML = `
        <h3 class="results-section-title">Language Usage</h3>
        <div class="lang-list">${bars}</div>
    `;
}


function displayRepositoryStats(stats) {
    const el = document.getElementById("repositoryStats");

    el.innerHTML = `
        <h3 class="results-section-title">Repository Highlights</h3>

        <div class="highlights-grid">

            <div class="highlight-card">
                <span class="highlight-label">Most Starred</span>
                <strong class="highlight-value">${stats.mostStarredRepo || "None"}</strong>
                <small>${stats.highestStars} star${stats.highestStars !== 1 ? "s" : ""}</small>
            </div>

            <div class="highlight-card">
                <span class="highlight-label">Most Forked</span>
                <strong class="highlight-value">${stats.mostForkedRepo || "None"}</strong>
                <small>${stats.highestForks} fork${stats.highestForks !== 1 ? "s" : ""}</small>
            </div>

            <div class="highlight-card">
                <span class="highlight-label">Largest</span>
                <strong class="highlight-value">${stats.largestRepo || "None"}</strong>
                <small>${(stats.largestSize / 1024).toFixed(1)} MB</small>
            </div>

            <div class="highlight-card">
                <span class="highlight-label">Recently Updated</span>
                <strong class="highlight-value">${stats.mostRecentlyUpdatedRepo || "None"}</strong>
                <small>${formatDate(stats.latestUpdateTime)}</small>
            </div>

        </div>
    `;
}


function displayTopRepositories(topRepos) {
    const el = document.getElementById("topRepositories");

    if (topRepos.length === 0) {
        el.innerHTML = `
            <h3 class="results-section-title">Top Repositories</h3>
            <p class="results-empty">No repositories found.</p>
        `;
        return;
    }

    const cards = topRepos.map((repo, index) => `
        <a
            href="${repo.html_url}"
            target="_blank"
            rel="noopener noreferrer"
            class="repo-card"
        >
            <div class="repo-card-top">
                <span class="repo-rank">${String(index + 1).padStart(2, "0")}</span>
                <span class="repo-name">${repo.name}</span>
            </div>

            ${repo.description
                ? `<p class="repo-description">${repo.description}</p>`
                : `<p class="repo-description repo-no-desc">No description</p>`
            }

            <div class="repo-meta">

                ${repo.language
                    ? `<span class="repo-lang">${repo.language}</span>`
                    : ""
                }

                <span class="repo-stars">
                    ★ ${repo.stargazers_count}
                </span>

                <span class="repo-forks">
                    ⑂ ${repo.forks_count}
                </span>

                <span class="repo-updated">
                    Updated ${formatDate(repo.updated_at)}
                </span>

            </div>

        </a>
    `).join("");

    el.innerHTML = `
        <h3 class="results-section-title">Top Repositories</h3>
        <div class="repo-list">${cards}</div>
    `;
}


function displayInsights(insightMessages) {
    const el = document.getElementById("insightsSection");

    const items = insightMessages.map(msg => `
        <div class="insight-item">
            <div class="insight-dot"></div>
            <p>${msg}</p>
        </div>
    `).join("");

    el.innerHTML = `
        <h3 class="results-section-title">Developer Insights</h3>
        <div class="insights-list">${items}</div>
    `;
}


// ================================
// SEARCH FORM HANDLER
// ================================

const searchForm    = document.getElementById("searchForm");
const usernameInput = document.getElementById("usernameInput");
const tokenInput    = document.getElementById("tokenInput");
const errorMessage  = document.getElementById("errorMessage");
const loadingMsg    = document.getElementById("loadingMessage");
const resultsSection = document.getElementById("resultsSection");


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function clearError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}

function showLoading(visible) {
    loadingMsg.style.display = visible ? "flex" : "none";
}

function showResults(visible) {
    resultsSection.style.display = visible ? "block" : "none";
}


searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const token    = tokenInput ? tokenInput.value.trim() : "";

    if (!username) {
        showError("Please enter a GitHub username.");
        return;
    }

    // Reset UI
    clearError();
    showResults(false);
    showLoading(true);

    // Scroll to loading indicator
    document.getElementById("demo").scrollIntoView({ behavior: "smooth" });

    try {
        // 1. Fetch user profile — mirrors get_user_data()
        const userData = await getUserData(username, token);

        // 2. Fetch all repositories with pagination — mirrors get_repositories()
        const repos = await getRepositories(username, token);

        // 3. Analyze data — mirrors all analyze/calculate functions in main.py
        const languagePercentages   = analyzeLanguages(repos);
        const stats                 = calculateRepositoryStatistics(repos);
        const insights              = calculateRepositoryInsights(repos);
        const topRepos              = getTopRepositories(repos, 5);
        const insightMessages       = generateInsightText(userData, insights, languagePercentages, stats);

        // 4. Render results
        displayUserProfile(userData);
        displayStatisticsGrid(stats, insights);
        displayLanguages(languagePercentages);
        displayRepositoryStats(stats);
        displayTopRepositories(topRepos);
        displayInsights(insightMessages);

        showLoading(false);
        showResults(true);

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        showLoading(false);

        if (error instanceof GithubError) {
            showError(error.message);
        } else {
            showError("An unexpected error occurred. Please try again.");
            console.error(error);
        }
    }
});
