import os
import sys

def main():
    # In the Antigravity architecture, hooks receive the user prompt via environment variable or stdin.
    # We will simulate reading the prompt.
    prompt = os.environ.get("ANTIGRAVITY_PROMPT", "fix the login button")
    
    if not prompt or prompt.startswith("/"):
        # If it's empty or already a command, leave it alone.
        return
        
    enhanced_prompt = prompt
    keywords_bug = ["fix", "bug", "error", "broken", "issue"]
    
    # If the prompt implies fixing a bug, mandate the DevHealer workflow
    if any(k in prompt.lower() for k in keywords_bug):
        enhanced_prompt = f"[ENHANCED PROMPT] Execute /workflow_heal_project.\nContext: Automatically injected by Prompt Optimizer.\nUser Request: {prompt}"
        
    # If the user specifically mentions a UI component, inject context
    if "login" in prompt.lower():
        enhanced_prompt += "\nFile Context: Found 'login' references in src/components/Login.js"
        
    # Print the enhanced prompt to stdout so the C++ engine can intercept it
    print(enhanced_prompt)

if __name__ == "__main__":
    main()
