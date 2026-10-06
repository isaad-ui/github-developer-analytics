import requests
user_name = input("Enter your username: ")
print (user_name)
url = f"https://api.github.com/users/{user_name}"
print(url)

response = requests.get(url)
print(response)

data = response.json()
print(f'Login: {data["login"]}')
print(f'Name: {data["name"]}')
print(f'Followers: {data["followers"]}')
print(f'Following: {data["following"]}')
print(f'Public Repositories: {data["public_repos"]}')

repos_url = f"https://api.github.com/users/{user_name}/repos"

repos_response = requests.get(repos_url)

print(repos_response)

repos_data = repos_response.json()

most_recently_updated_repo = None
latest_update_time = None

for repo in repos_data:
    update_time = repo["updated_at"]
    if latest_update_time is None or update_time > latest_update_time:
        latest_update_time = update_time
        most_recently_updated_repo = repo["name"]

languages = {}

for repo in repos_data:
    language = repo["language"]

    if language:
        if language in languages:
            languages[language] += 1
        else:
            languages[language] = 1

print("Repository language percentages:")
if repos_data:
    for language, count in languages.items():
        percentage = count / len(repos_data) * 100
        print(f"{language}: {percentage:.2f}%")

total_stars = 0
total_forks = 0
most_starred_repo = None
highest_stars = 0
most_forked_repo = None
highest_forks = 0
largest_repo = None
largest_size = -1
for repo in repos_data:
    print(f"Name: {repo['name']}")
    print(f"Stars: {repo['stargazers_count']}")
    print(f"Forks: {repo['forks_count']}")
    print(f"Language: {repo['language']}")
    total_stars += repo['stargazers_count']
    total_forks += repo['forks_count']
    if repo["stargazers_count"] > highest_stars:
        highest_stars = repo["stargazers_count"]
        most_starred_repo = repo["name"]
    if most_forked_repo is None or repo["forks_count"] > highest_forks:
        highest_forks = repo["forks_count"]
        most_forked_repo = repo["name"]
    if repo["size"] > largest_size:
        largest_size = repo["size"]
        largest_repo = repo["name"]

print(f"Total Stars: {total_stars}")
print(f"Total Forks: {total_forks}")
print(f"Most Starred Repository: {most_starred_repo}")
print(f"Stars: {highest_stars}")
print(f"Most Forked Repository: {most_forked_repo}")
print(f"Forks: {highest_forks}")
print(f"Largest Repository: {largest_repo}")
print(f"Size: {largest_size} KB")
print(f"Most Recently Updated Repository: {most_recently_updated_repo}")
print(f"Latest Update Time: {latest_update_time}")