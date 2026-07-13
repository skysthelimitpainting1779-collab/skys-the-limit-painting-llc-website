import sys
import json
import re
import os

def check_frontmatter(content, required_keys):
    # Regex to extract YAML frontmatter
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if not match:
        return False, "Missing YAML frontmatter (--- ... ---) at the top of the file."
    
    frontmatter = match.group(1)
    missing = []
    for key in required_keys:
        match_key = re.search(r"^" + key + r"\s*:\s*(.*)", frontmatter, re.MULTILINE)
        if not match_key:
            missing.append(key)
        else:
            value = match_key.group(1).strip()
            if key == "trigger" and value not in ["always_on", "manual", "model_decision"]:
                return False, f"Invalid value '{value}' for trigger. Must be always_on, manual, or model_decision."
            
    if missing:
        return False, f"Missing required frontmatter keys: {', '.join(missing)}"
    return True, ""

def validate_tool(payload):
    tool_name = payload.get("toolName", "")
    args = payload.get("arguments", {})
    
    # We only care about file writing tools
    if tool_name not in ["default_api:write_to_file", "default_api:replace_file_content", "default_api:multi_replace_file_content"]:
        return {"decision": "allow"}
        
    target = args.get("TargetFile", "").replace("\\", "/")
    content = args.get("CodeContent", "") or args.get("ReplacementContent", "")
    
    if not target:
        return {"decision": "allow"}

    filename = os.path.basename(target)
    
    # 1. Workflow Validation
    if "/.agents/workflows/" in target or "/plugins/" in target and "/workflows/" in target:
        if "plugins/" in target and "/workflows/" in target:
            return {"decision": "deny", "reason": "VIOLATION: Official Docs prohibit placing workflows inside plugins/<name>/workflows/. They must go in .agents/workflows/."}
        
        if not filename.endswith(".md") or not filename.islower() or " " in filename:
            return {"decision": "deny", "reason": f"VIOLATION: Workflow filename '{filename}' must be lowercase, end in .md, and contain no spaces."}
            
        is_valid, err = check_frontmatter(content, ["name", "description"])
        if not is_valid:
            return {"decision": "deny", "reason": f"VIOLATION: Workflow file lacks correct frontmatter. {err}"}

    # 2. Rules Validation
    elif "/.agents/rules/" in target or "/rules/" in target:
        if not filename.endswith(".md") or not filename.islower() or " " in filename:
            return {"decision": "deny", "reason": f"VIOLATION: Rule filename '{filename}' must be lowercase, end in .md, and contain no spaces."}
            
        is_valid, err = check_frontmatter(content, ["trigger", "description"])
        if not is_valid:
            return {"decision": "deny", "reason": f"VIOLATION: Rule file lacks correct frontmatter. {err}"}

    # 3. Skills Validation
    elif "/skills/" in target and filename == "SKILL.md":
        is_valid, err = check_frontmatter(content, ["name", "description"])
        if not is_valid:
            return {"decision": "deny", "reason": f"VIOLATION: SKILL.md lacks correct frontmatter. {err}"}

    return {"decision": "allow"}

def main():
    try:
        # Read from stdin
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"decision": "allow"}))
            return
            
        payload = json.loads(input_data)
        result = validate_tool(payload)
        
        # Output JSON result to stdout for the IDE engine
        print(json.dumps(result))
        
    except Exception as e:
        # Failsafe: if the hook crashes, deny the tool to be safe and log error
        print(json.dumps({
            "decision": "deny",
            "reason": f"Hook crashed during validation: {str(e)}"
        }))

if __name__ == "__main__":
    main()
