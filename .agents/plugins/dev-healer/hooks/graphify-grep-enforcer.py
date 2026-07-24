import sys
import json
import os

def main():
    try:
        payload_str = sys.stdin.read().strip()
        if not payload_str:
            print(json.dumps({"decision": "allow"}))
            return
            
        payload = json.loads(payload_str)
        tool_name = payload.get("toolName", "")
        args = payload.get("arguments", {})

        if "grep_search" in tool_name:
            search_path = args.get("SearchPath", "")
            # If the search path is a directory (meaning a broad search)
            if os.path.isdir(search_path):
                print(json.dumps({
                    "decision": "deny",
                    "reason": "VIOLATION: Broad grep searches waste massive token amounts. You MUST use the `graphify` MCP server tools (e.g., search_graph, query_graph) for codebase discovery. Only use grep_search on specific, individual files."
                }))
                return

        print(json.dumps({"decision": "allow"}))
    except Exception as e:
        print(json.dumps({"decision": "allow", "reason": f"Hook error: {str(e)}"}))

if __name__ == "__main__":
    main()
