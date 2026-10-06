import requests


def get_user_data(user_name):
    url = f"https://api.github.com/users/{user_name}"
    response = requests.get(url)

    if response.status_code == 404:
        print("User not found.")
        return None

    response.raise_for_status()
    return response.json()


def get_repositories(user_name):
    repos = []
    page = 1

    while True:
        url = f"https://api.github.com/users/{user_name}/repos"

        params = {
            "per_page": 100,
            "page": page
        }

        response = requests.get(url, params=params)
        response.raise_for_status()

        data = response.json()

        if not data:
            break

        repos.extend(data)
        page += 1

    return repos


def analyze_languages(repos_data):
    languages = {}

    for repo in repos_data:
        language = repo["language"]

        if language:
            if language in languages:
                languages[language] += 1
            else:
                languages[language] = 1

    return languages


def calculate_language_percentages(languages):
    total_languages = sum(languages.values())

    percentages = {}

    if total_languages == 0:
        return percentages

    for language, count in languages.items():
        percentages[language] = count / total_languages * 100

    return percentages


def calculate_repository_statistics(repos_data):
    total_stars = 0
    total_forks = 0

    most_starred_repo = None
    highest_stars = 0

    most_forked_repo = None
    highest_forks = 0

    largest_repo = None
    largest_size = -1

    most_recently_updated_repo = None
    latest_update_time = None

    for repo in repos_data:
        total_stars += repo["stargazers_count"]
        total_forks += repo["forks_count"]

        if repo["stargazers_count"] > highest_stars:
            highest_stars = repo["stargazers_count"]
            most_starred_repo = repo["name"]

        if repo["forks_count"] > highest_forks:
            highest_forks = repo["forks_count"]
            most_forked_repo = repo["name"]

        if repo["size"] > largest_size:
            largest_size = repo["size"]
            largest_repo = repo["name"]

        update_time = repo["updated_at"]

        if latest_update_time is None or update_time > latest_update_time:
            latest_update_time = update_time
            most_recently_updated_repo = repo["name"]

    return {
        "total_stars": total_stars,
        "total_forks": total_forks,
        "most_starred_repo": most_starred_repo,
        "highest_stars": highest_stars,
        "most_forked_repo": most_forked_repo,
        "highest_forks": highest_forks,
        "largest_repo": largest_repo,
        "largest_size": largest_size,
        "most_recently_updated_repo": most_recently_updated_repo,
        "latest_update_time": latest_update_time
    }
def calculate_repository_insights(repos_data):
    total_repositories = len(repos_data)
    repositories_with_languages = 0
    repositories_without_languages = 0
    repositories_with_stars = 0
    forked_repositories = 0
    archived_repositories = 0
    total_stars = 0

    for repo in repos_data:
        if repo["language"]:
            repositories_with_languages += 1
        else:
            repositories_without_languages += 1

        if repo["stargazers_count"] > 0:
            repositories_with_stars += 1

        if repo["fork"]:
            forked_repositories += 1

        if repo["archived"]:
            archived_repositories += 1

        total_stars += repo["stargazers_count"]

    if total_repositories > 0:
        average_stars = total_stars / total_repositories
    else:
        average_stars = 0

    return {
        "total_repositories": total_repositories,
        "repositories_with_languages": repositories_with_languages,
        "repositories_without_languages": repositories_without_languages,
        "repositories_with_stars": repositories_with_stars,
        "forked_repositories": forked_repositories,
        "archived_repositories": archived_repositories,
        "average_stars": average_stars
    }
def get_top_repositories(repos_data, limit=3):
    sorted_repositories = sorted(
        repos_data,
        key=lambda repo: repo["stargazers_count"],
        reverse=True
    )

    return sorted_repositories[:limit]



def display_user_data(data):
    print("\nGITHUB PROFILE")
    print(f"Login: {data['login']}")
    print(f"Name: {data['name']}")
    print(f"Followers: {data['followers']}")
    print(f"Following: {data['following']}")
    print(f"Public Repositories: {data['public_repos']}")


def display_repository_languages(percentages):
    print("\nLANGUAGE USAGE")

    if not percentages:
        print("No programming languages found.")
        return

    for language, percentage in percentages.items():
        print(f"{language}: {percentage:.2f}%")


def display_repository_data(repos_data):
    print("\nREPOSITORIES")

    for repo in repos_data:
        print(f"\nName: {repo['name']}")
        print(f"Description: {repo['description']}")
        print(f"Language: {repo['language']}")
        print(f"Stars: {repo['stargazers_count']}")
        print(f"Forks: {repo['forks_count']}")
        print(f"Updated: {repo['updated_at']}")
        print(f"URL: {repo['html_url']}")


def display_statistics(statistics):
    print("\nREPOSITORY STATISTICS")
    print(f"Total Stars: {statistics['total_stars']}")
    print(f"Total Forks: {statistics['total_forks']}")
    print(f"Most Starred Repository: {statistics['most_starred_repo']}")
    print(f"Stars: {statistics['highest_stars']}")
    print(f"Most Forked Repository: {statistics['most_forked_repo']}")
    print(f"Forks: {statistics['highest_forks']}")
    print(f"Largest Repository: {statistics['largest_repo']}")
    print(f"Size: {statistics['largest_size']} KB")
    print(f"Most Recently Updated Repository: {statistics['most_recently_updated_repo']}")
    print(f"Latest Update Time: {statistics['latest_update_time']}")

def display_repository_insights(insights):
  print("\nREPOSITORY INSIGHTS")
  print(f"Total Repositories: {insights['total_repositories']}")
  print(f"Repositories With Languages: {insights['repositories_with_languages']}")
  print(f"Repositories Without Languages: {insights['repositories_without_languages']}")
  print(f"Repositories With Stars: {insights['repositories_with_stars']}")
  print(f"Forked Repositories: {insights['forked_repositories']}")
  print(f"Archived Repositories: {insights['archived_repositories']}")
  print(f"Average Stars Per Repository: {insights['average_stars']:.2f}")

def display_top_repositories(repositories):
    print("\nTOP REPOSITORIES")

    for position, repo in enumerate(repositories, start=1):
        print(f"{position}. {repo['name']}")
        print(f"   Stars: {repo['stargazers_count']}")
        print(f"   Forks: {repo['forks_count']}")
        print(f"   Language: {repo['language']}")


def main():
    print("GITHUB DEVELOPER ANALYTICS")

    user_name = input("Enter your GitHub username: ")

    try:
        user_data = get_user_data(user_name)

        if user_data is None:
            return

        display_user_data(user_data)

        repos_data = get_repositories(user_name)

        if not repos_data:
            print("\nThis user has no public repositories.")
            return

        languages = analyze_languages(repos_data)

        language_percentages = calculate_language_percentages(languages)

        display_repository_languages(language_percentages)
        display_repository_data(repos_data)

        statistics = calculate_repository_statistics(repos_data)

        display_statistics(statistics)

        insights = calculate_repository_insights(repos_data)

        display_repository_insights(insights)

        top_repositories = get_top_repositories(repos_data)

        display_top_repositories(top_repositories)

    except requests.exceptions.RequestException as error:
        print(f"\nAn error occurred while connecting to GitHub: {error}")


if __name__ == "__main__":
    main()