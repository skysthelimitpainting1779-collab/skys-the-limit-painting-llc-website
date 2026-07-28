from __future__ import annotations

import os
from pathlib import Path


def find_control_plane_workspace(start: Path | None = None) -> Path:
    current = (start or Path.cwd()).resolve()
    for candidate in (current, *current.parents):
        control_plane = candidate / "dev"
        if (
            (control_plane / "mcp_server.py").is_file()
            and (control_plane / "sync-graphify-db.ps1").is_file()
        ):
            return candidate
    raise FileNotFoundError(
        f"Shared development control plane not found above {current}"
    )


def agentgraph_server(workspace: Path) -> Path:
    return workspace / "dev" / "mcp_server.py"


def graphify_sync_script(workspace: Path) -> Path:
    return workspace / "dev" / "sync-graphify-db.ps1"


def graphify_sqlite_script(workspace: Path) -> Path:
    return workspace / "dev" / "graphify_sqlite.py"


def execution_sqlite_script(workspace: Path) -> Path:
    return workspace / "dev" / "execution_graph_sqlite.py"


def runtime_database_path() -> Path:
    override = os.environ.get("SKY_DEV_RUNTIME")
    if override:
        return Path(override).expanduser() / "graphify.db"
    local_app_data = os.environ.get("LOCALAPPDATA")
    if local_app_data:
        return Path(local_app_data) / "SkyDevControlPlane" / "graphify.db"
    return Path.home() / ".local" / "share" / "sky-dev-control-plane" / "graphify.db"
