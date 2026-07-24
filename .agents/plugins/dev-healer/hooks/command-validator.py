import sys
import json

def main():
    try:
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"decision": "allow"}))
            return
            
        payload = json.loads(input_data)
        tool_name = payload.get("toolName", "")
        args = payload.get("arguments", {})
        
        if tool_name == "default_api:run_command":
            cmd = args.get("CommandLine", "").lower()
            # If the command starts with node, pytest, npm, cargo, but NOT wrapped by python run_tests_hardened.py
            if any(cmd.startswith(x) for x in ["npm run build", "pytest", "cargo test", "node "]):
                if "run_tests_hardened.py" not in cmd:
                    print(json.dumps({
                        "decision": "deny",
                        "reason": "VIOLATION: Bare compilation/test commands are forbidden. You MUST wrap them with 'python run_tests_hardened.py <command>'."
                    }))
                    return
        
        print(json.dumps({"decision": "allow"}))
        
    except Exception as e:
        print(json.dumps({
            "decision": "deny",
            "reason": f"Hook crashed: {str(e)}"
        }))

if __name__ == "__main__":
    main()
