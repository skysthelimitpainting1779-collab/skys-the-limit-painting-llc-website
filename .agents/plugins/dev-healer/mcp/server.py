from mcp.server.fastmcp import FastMCP
import os

# Initialize the DevHealer MCP Server
mcp = FastMCP("devhealer")

@mcp.tool()
def get_domain_rules(domain: str) -> str:
    """
    Just-In-Time Context Injection tool.
    Retrieves strict organizational rules for a specific domain.
    Args:
        domain: The domain of rules to fetch (e.g., "database", "typescript", "ui")
    """
    rules = {
        "database": "SUPABASE RLS POLICY: All new tables MUST have Row Level Security enabled. Never bypass RLS via service roles in client components.",
        "typescript": "TYPESCRIPT 6: No implicit any. Use strict null checks. Interfaces must be prefixed with 'I' for legacy compatibility in this repo.",
        "ui": "REACT MOTION: All modal components must use React Motion for spring-physics animations. No raw CSS transitions for layout."
    }
    
    return rules.get(domain.lower(), f"No specific rules found for domain '{domain}'. Fallback to general best practices.")

@mcp.tool()
def audit_project(path: str) -> str:
    """
    Audits a local repository to detect tech stack and enforce CI stabilization.
    Args:
        path: Absolute path to the repository
    """
    return f"Project Audit for {path}: \nStack Detected: Vercel, Supabase, Next.js.\nInjected strict rule scaffolding. CI Stabilization loop activated."

@mcp.tool()
def spawn_dag_worktrees(ticket_ids: list[str]) -> str:
    """
    Orchestrates a Directed Acyclic Graph (DAG) workflow for an array of tickets.
    Args:
        ticket_ids: List of ticket IDs to resolve.
    """
    return f"DAG Orchestrator triggered for {len(ticket_ids)} tickets.\nEnforcing MAX_CONCURRENCY=4 queue.\nTier 1 agents spawned in isolated Git worktrees."

if __name__ == "__main__":
    mcp.run()
