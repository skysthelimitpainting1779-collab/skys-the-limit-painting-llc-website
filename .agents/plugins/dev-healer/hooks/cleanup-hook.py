import subprocess
import os

def main():
    project_dir = os.environ.get("ANTIGRAVITY_WORKSPACE_ROOT", "")
    if not project_dir or not os.path.exists(project_dir):
        return
        
    try:
        # Get list of worktrees
        result = subprocess.run(["git", "worktree", "list"], text=True, capture_output=True, cwd=project_dir)
        lines = result.stdout.strip().split('\n')
        
        for line in lines:
            if "subagent-" in line:
                # Extract the branch name (which is usually the last word in brackets, or part of the path)
                parts = line.split()
                if len(parts) >= 3:
                    branch = parts[-1].strip("[]")
                    if "subagent-" in branch:
                        subprocess.run(["git", "worktree", "remove", "--force", branch], cwd=project_dir, capture_output=True)
                        subprocess.run(["git", "branch", "-D", branch], cwd=project_dir, capture_output=True)
    except Exception as e:
        print(f"Cleanup failed: {e}")

if __name__ == "__main__":
    main()
