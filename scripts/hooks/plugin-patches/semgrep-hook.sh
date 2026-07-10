#!/bin/bash
# Windows-safe launcher for Semgrep Guardian hooks.
# Prefer native .exe on Windows (incl. Git Bash / MSYS / WSL-on-Windows).
DIR="$(cd "$(dirname "$0")" && pwd)"

# Detect Windows even when OSTYPE is empty / unexpected
is_windows=0
if [[ -n "${WINDIR:-}" || -n "${SYSTEMROOT:-}" ]]; then is_windows=1; fi
case "${OSTYPE:-}" in msys*|cygwin*|mingw*) is_windows=1 ;; esac
case "$(uname -s 2>/dev/null || true)" in MINGW*|MSYS*|CYGWIN*) is_windows=1 ;; esac
if [[ -n "${WSL_DISTRO_NAME:-}" ]]; then is_windows=1; fi

if [[ "$is_windows" -eq 1 && -x "$DIR/hook-windows-amd64.exe" ]]; then
  exec "$DIR/hook-windows-amd64.exe" "$@"
fi
if [[ "$is_windows" -eq 1 && -f "$DIR/hook-windows-amd64.exe" ]]; then
  exec "$DIR/hook-windows-amd64.exe" "$@"
fi

case "${OSTYPE:-}" in
  darwin*)
    case "${HOSTTYPE:-}" in
      arm64) exec "$DIR/hook-darwin-arm64" "$@" ;;
      *)     exec "$DIR/hook-darwin-amd64" "$@" ;;
    esac ;;
  linux*)
    case "${HOSTTYPE:-}" in
      aarch64) exec "$DIR/hook-linux-arm64" "$@" ;;
      *)       exec "$DIR/hook-linux-amd64" "$@" ;;
    esac ;;
  msys*|cygwin*|mingw*)
    exec "$DIR/hook-windows-amd64.exe" "$@" ;;
  *)
    # Last resort on Windows-ish hosts
    if [[ -f "$DIR/hook-windows-amd64.exe" ]]; then
      exec "$DIR/hook-windows-amd64.exe" "$@"
    fi
    echo "unsupported platform: OSTYPE=${OSTYPE:-unknown} (semgrep hook)" >&2
    # Soft-fail: never hard-block the agent on launcher errors
    exit 0 ;;
esac
