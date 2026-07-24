import sys
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

def main():
    try:
        raw_input = sys.stdin.read()
        if not raw_input:
            sys.exit(0)
            
        payload = json.loads(raw_input)
        tool_name = payload.get("tool", "")
        args = payload.get("args", {})
        
        # Hard Gate: Only enforce for specific high-risk tools
        if tool_name in ["invoke_subagent", "write_to_file"]:
            prompt = str(args).lower()
            if "context7" not in prompt and "graphify" not in prompt:
                response = {
                    "action": "DENY",
                    "reason": "MANDATE VIOLATION: You attempted to write code or spawn a repair agent without explicit context injection. You MUST query the 'context7' MCP for library documentation and 'graphify' for architectural context before proceeding."
                }
                print(json.dumps(response))
                sys.exit(1)
                
        print(json.dumps({"action": "ALLOW"}))
        sys.exit(0)
        
    except Exception as e:
        logging.error(f"Hook failed: {e}")
        print(json.dumps({"action": "ALLOW"}))
        sys.exit(0)

if __name__ == "__main__":
    main()
