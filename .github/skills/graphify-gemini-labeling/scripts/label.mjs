import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

if (!existsSync("graphify-out/graph.json")) {
  console.error("Missing graphify-out/graph.json; run the incremental graph update first.");
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.error("Set GEMINI_API_KEY or GOOGLE_API_KEY securely before labeling.");
  process.exit(1);
}

const model = process.env.GRAPHIFY_GEMINI_MODEL || "gemini-2.5-flash-lite";
const result = spawnSync(
  "graphify",
  ["label", ".", "--backend", "gemini", "--model", model, "--no-viz", "--timing"],
  { env: process.env, stdio: "inherit", windowsHide: true, shell: process.platform === "win32" },
);

process.exit(result.status ?? 1);
