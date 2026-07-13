import os
import time
import subprocess
import sys
import json

def log(msg):
    sys.stderr.write(f"[CI Daemon] {msg}\n")
    sys.stderr.flush()

def get_current_commit():
    try:
        res = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True)
        if res.returncode == 0:
            return res.stdout.strip()
    except Exception:
        pass
    return None

def get_current_branch():
    try:
        res = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True)
        if res.returncode == 0:
            return res.stdout.strip()
    except Exception:
        pass
    return None

def detect_merge_conflict():
    git_dir = ".git"
    try:
        git_dir_env = subprocess.run(["git", "rev-parse", "--git-dir"], capture_output=True, text=True)
        if git_dir_env.returncode == 0:
            git_dir = git_dir_env.stdout.strip()
    except Exception:
        pass
    return os.path.exists(os.path.join(git_dir, "MERGE_HEAD"))

def get_test_command():
    if os.path.exists("package.json"):
        return ["npm", "run", "test", "--if-present"]
    elif os.path.exists("requirements.txt"):
        return ["pytest"]
    return None

def main():
    log("Universal CI Lifecycle Daemon started.")
    last_commit = get_current_commit()
    last_branch = get_current_branch()
    conflict_handled = False
    
    while True:
        try:
            current_commit = get_current_commit()
            current_branch = get_current_branch()
            
            # 0. Enforce Auto-Commit / Git Discipline
            status_res = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
            if status_res.returncode == 0 and status_res.stdout.strip():
                log("Uncommitted changes detected in repo. Triggering DAG Root: /workflow_universal_ci")
                subprocess.run(["agentapi", "new-conversation", "Uncommitted changes detected. Execute /workflow_universal_ci to perform DAG validation."], shell=True)
                last_commit = get_current_commit() # Update internal state to prevent loop
                time.sleep(30) # Wait for agent to execute before polling again
            
            # 1. Merge Conflict Detection
            is_conflict = detect_merge_conflict()
            if is_conflict and not conflict_handled:
                log("MERGE CONFLICT DETECTED! Spawning DevHealer agent to resolve structural anomalies via Graphify...")
                subprocess.run(["agentapi", "new-conversation", "A git merge conflict has occurred! Inspect the MERGE_HEAD and resolve the conflict markers using the Graphify knowledge graph to ensure structural integrity."], shell=True)
                conflict_handled = True
            elif not is_conflict and conflict_handled:
                conflict_handled = False
                
            # 2. Commit Testing Lifecycle
            if current_commit and current_commit != last_commit:
                log(f"New commit detected: {current_commit[:7]}")
                last_commit = current_commit
                
                test_cmd = get_test_command()
                if test_cmd:
                    log(f"Executing CI test programmatically: {' '.join(test_cmd)}")
                    test_res = subprocess.run(test_cmd, capture_output=True, text=True)
                    if test_res.returncode != 0:
                        log("CI Test FAILED. Spawning background DevHealer agent to heal project...")
                        subprocess.run(["agentapi", "new-conversation", "A background CI compilation error has been detected. Run: /workflow-heal-project"], shell=True)
                    else:
                        log("CI Test PASSED. Code is structurally sound.")
                        
            # 3. Branch PR Review Check
            if current_branch and current_branch != last_branch:
                log(f"Branch switched: {last_branch} -> {current_branch}")
                last_branch = current_branch
                if current_branch not in ["main", "master"]:
                    log("Feature branch detected! Generating PR Impact review using Graphify MCP...")
                    # Programmatically launching review
                    subprocess.run(["agentapi", "new-conversation", f"A new feature branch '{current_branch}' was pushed. Use Graphify MCP 'get_pr_impact' to perform an architectural review."], shell=True)
                    
        except Exception as e:
            log(f"Error in CI daemon loop: {str(e)}")
            
        time.sleep(10)

if __name__ == "__main__":
    main()
