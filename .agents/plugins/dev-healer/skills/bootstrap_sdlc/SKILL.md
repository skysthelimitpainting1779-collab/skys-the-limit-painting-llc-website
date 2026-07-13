---
name: bootstrap_sdlc
description: Initializes the self-improving SDLC environment, installs dependencies, and starts the sidecar.
---

## Bootstrap SDLC Skill

This skill is designed to initialize the entire self-improving SDLC loop. It handles directory setup, dependency verification, and the initial activation of the self-improvement sidecar.

### Actions Performed

1.  **Environment Check**: Verifies the presence of the Antigravity SDK and required Python libraries.
2.  **Plugin Activation**: Ensures the `self-improving-sdlc` plugin is correctly registered in the workspace.
3.  **Sidecar Initialization**: Manually triggers the first run of the `self_improvement_sidecar.py` to establish the baseline.
4.  **Hook Verification**: Checks that `hooks.json` is active and logging data to the expected temporary paths.

### Usage

```bash
/bootstrap_sdlc
```
