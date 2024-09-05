import requests
import pandas as pd

# Gerrit server details
GERRIT_BASE_URL = 'https://your-gerrit-server.com'
PROJECT_NAME = 'your-project-name'
BRANCH_NAME = 'refs/heads/main'  # Specify the branch if needed
USERNAME = 'your-username'       # Gerrit username
PASSWORD = 'your-password'       # Gerrit password or API token

# Fetch commits from Gerrit API
def fetch_commits():
    url = f'{GERRIT_BASE_URL}/a/projects/{PROJECT_NAME}/commits'
    params = {
        'q': f'branch:{BRANCH_NAME}',  # Query parameters for the commits
        'n': 100                       # Number of commits to fetch
    }
    response = requests.get(url, params=params, auth=(USERNAME, PASSWORD))
    
    # Handle response
    if response.status_code == 200:
        # Gerrit responses are often prefixed with ")]}'", which should be stripped
        response_data = response.text[4:]
        commits = response.json()  # Parse JSON data
        return commits
    else:
        print(f"Error fetching commits: {response.status_code} {response.text}")
        return []

# Save commit data to an Excel file
def save_to_excel(commits):
    # Extract desired fields from commits
    commit_data = []
    for commit in commits:
        commit_info = {
            'Commit ID': commit.get('commit'),
            'Author': commit.get('author', {}).get('name'),
            'Email': commit.get('author', {}).get('email'),
            'Message': commit.get('message'),
            'Date': commit.get('author', {}).get('date'),
        }
        commit_data.append(commit_info)

    # Create a DataFrame and save it to an Excel file
    df = pd.DataFrame(commit_data)
    df.to_excel('commits.xlsx', index=False)
    print("Commits saved to commits.xlsx")

if __name__ == "__main__":
    commits = fetch_commits()
    if commits:
        save_to_excel(commits)
