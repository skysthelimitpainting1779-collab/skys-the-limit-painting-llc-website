import time
import subprocess
import os

# Run graphify semantic update every 3 days (259200 seconds)
UPDATE_INTERVAL_SECONDS = 3 * 24 * 60 * 60
CACHE_DIR = os.path.join("graphify-out", "cache")
MEMORY_DIR = os.path.join("graphify-out", "memory")
MAX_AGE_DAYS = 14

def cleanup_old_files(directory, max_age_days):
    if not os.path.exists(directory):
        return
    cutoff = time.time() - (max_age_days * 86400)
    for root, dirs, files in os.walk(directory):
        for file in files:
            path = os.path.join(root, file)
            try:
                if os.path.getmtime(path) < cutoff:
                    os.remove(path)
                    print(f"Cleaned up stale file: {path}")
            except Exception as e:
                print(f"Failed to delete {path}: {e}")

def main():
    print("Graphify Maintainer Sidecar started. Will run LLM semantic update every 3 days.")
    while True:
        print("Running scheduled graphify update...")
        try:
            # uvx is typically used to run graphifyy
            # We use --update to only process new/changed files
            subprocess.run(["uvx", "--from", "graphifyy", "graphify", ".", "--update"], check=True)
            print("Graphify update completed successfully.")
            
            # Run automatic cleanup to prevent bloat
            print(f"Running auto-cleanup for files older than {MAX_AGE_DAYS} days...")
            cleanup_old_files(CACHE_DIR, MAX_AGE_DAYS)
            cleanup_old_files(MEMORY_DIR, MAX_AGE_DAYS)
            
        except subprocess.CalledProcessError as e:
            print(f"Graphify update failed with exit code {e.returncode}.")
        except Exception as e:
            print(f"An error occurred: {e}")
        
        print(f"Sleeping for {UPDATE_INTERVAL_SECONDS} seconds...")
        time.sleep(UPDATE_INTERVAL_SECONDS)

if __name__ == "__main__":
    main()
