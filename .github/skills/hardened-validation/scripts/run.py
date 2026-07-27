"""Run a command with a hard timeout and terminate its process tree on exit."""

from __future__ import annotations

import os
import shlex
import signal
import subprocess
import sys


DEFAULT_TIMEOUT_SECONDS = 900


def _command_from_args(args: list[str]) -> str:
    if len(args) == 1:
        return args[0]
    if os.name == "nt":
        return subprocess.list2cmdline(args)
    return shlex.join(args)


def _terminate_tree(process: subprocess.Popen[bytes]) -> None:
    if process.poll() is not None:
        return
    if os.name == "nt":
        subprocess.run(
            ["taskkill", "/PID", str(process.pid), "/T", "/F"],
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return
    try:
        os.killpg(process.pid, signal.SIGTERM)
        process.wait(timeout=5)
    except (ProcessLookupError, subprocess.TimeoutExpired):
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: python run.py <command>", file=sys.stderr)
        return 2
    command = _command_from_args(sys.argv[1:])
    timeout = int(os.environ.get("HARDENED_TEST_TIMEOUT_SECONDS", DEFAULT_TIMEOUT_SECONDS))
    process = subprocess.Popen(
        command,
        shell=True,
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == "nt" else 0,
        start_new_session=os.name != "nt",
    )
    try:
        return process.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        print(f"command timed out after {timeout}s: {command}", file=sys.stderr)
        _terminate_tree(process)
        return 124
    finally:
        _terminate_tree(process)


if __name__ == "__main__":
    raise SystemExit(main())
