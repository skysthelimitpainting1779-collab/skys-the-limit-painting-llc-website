# Agentic Learnings & System Improvements

This document captures deep procedural and architectural learnings from this session to improve future agent executions.

---

## 1. Context Window Optimization
* **Observation**: Large rule files (such as `.agents/rules.md` with 600+ lines and `.agents/AGENTS.md` with 300+ lines) consume significant token space and can cause instruction drift if re-read repeatedly.
* **Learning**: Once the agent has read a static configuration file or rule file at the start of the session, it should avoid re-reading the entire file. Instead, the agent should query specific sections using line ranges or refer to its internal memory.
* **Improvement**: Rely on `codebase-memory-mcp` for structural definitions rather than scanning raw directories.

---

## 2. Proactive Markdown Hygiene
* **Observation**: Markdown style warnings (like MD032/MD031) are common when injecting lists or code blocks directly below headings or paragraphs.
* **Learning**: Agents should format all markdown outputs defensively from the start to prevent IDE lint warnings.
* **Rule**: Always leave exactly one blank line before and after list blocks, fenced code blocks, and headers—even when nesting them inside blockquotes.

---

## 3. Immediate SSOT Enforcement
* **Observation**: Split context between the repository root (e.g., duplicate `AGENTS.md`) and the `.agents/` folder led to double edits and redundant work.
* **Learning**: At the start of any workspace task, if the agent detects split context or duplicate metadata files at the root, it must immediately propose consolidating them into `.agents/` to maintain the Single Source of Truth (SSOT).
* **Improvement**: Do not make edits to root-level files if they belong inside the `.agents/` control plane.

---

## 4. Reducing Polling Overhead on Background Tasks
* **Observation**: The agent scheduled multiple one-shot timers (`schedule` tool) to check the status of long-running compilation scripts.
* **Learning**: The IDE system automatically wakes up the agent and delivers messages when background tasks complete. Polling or setting tight timers is redundant.
* **Rule**: Once a background task is launched, stop calling tools and wait. Trust the system's reactive wake-up loop to notify you upon completion.
