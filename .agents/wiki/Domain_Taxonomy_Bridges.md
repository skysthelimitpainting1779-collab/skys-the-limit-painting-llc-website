---
title: Domain_Taxonomy_Bridges
type: concept
tags: [graphify, auto-compiled]
last_sync: 2026-06-24T19:49:37.863Z
---

# Domain Taxonomy Bridges

This document defines the semantic edges required to bridge the 395 isolated nodes into the high-density graph according to the `CLAUDE.md` taxonomy (`Market`, `Service`, `Business-Objective`).

## 1. Infrastructure / Config
These nodes represent configuration, metadata, and dependencies that are currently disconnected from the business intent.

1. **`nextConfig`** (from `next.config.ts`)
   - **Bridge Edge**: `nextConfig` --[configures]--> `Sky's the Limit Painting LLC - Website`
   - **Reasoning**: Connects the Next.js routing and config layer to the primary application hub.

2. **`version`** (from `package.json`)
   - **Bridge Edge**: `version` --[defines version for]--> `Sky's the Limit Painting LLC - Website`
   - **Reasoning**: Ties dependency state directly to the main business application node.

3. **`private`** / **`name`** (from `package.json`)
   - **Bridge Edge**: `private` --[access control for]--> `Sky's the Limit Painting LLC - Website`
   - **Bridge Edge**: `name` --[identifies]--> `Sky's the Limit Painting LLC - Website`
   - **Reasoning**: Attaches structural package identifiers to the application identity.

## 2. Business Content / Features
These nodes represent features, data, or concepts that failed to map to the overarching `Market` or `Service` abstractions.

1. **`ai`** (AI capabilities / Crawlability)
   - **Bridge Edge**: `ai` --[optimizes for]--> `Market`
   - **Reasoning**: Directs AI/LLM visibility efforts toward the Market and Audience domains.

2. **`dependencies`** / **`dotenv`** / **`express`**
   - **Bridge Edge**: `dependencies` --[supports]--> `Business-Objective`
   - **Reasoning**: Pulls generic tech stacks into the business goals they enable (e.g. Lead Capture).

## 3. Unresolved Artifacts
Nodes that exist as side-effects, cache, or generic files.

1. **Test Logs** (`E2E_Test_Results.md`)
   - **Bridge Edge**: `E2E_Test_Results.md` --[validates]--> `Sky's the Limit Painting LLC - Website`
   - **Reasoning**: Connects the consolidated test output (previously `test_out.txt`) to the QA process and the main app.

## 4. Lead Generation & CRM Hand-off Flow
These nodes represent the fragmented flow from frontend user submission to backend CRM ingestion.

1. **`LeadForm.tsx` (Frontend)**
   - **Bridge Edge**: `LeadForm.tsx` --[submits_to]--> `POST() (src/app/api/leads/route.ts)`
   - **Reasoning**: Connects the UI form directly to its corresponding API route.

2. **`POST()` in API Routes**
   - **Bridge Edge**: `POST()` --[integrates_with]--> `HubSpot and Google Sheets Integration Guide`
   - **Reasoning**: Ties the API logic to the exact CRM configuration documentation that dictates how leads are routed.

3. **`sendToHubspot()` / `sendLeadWebhook()`**
   - **Bridge Edge**: `sendToHubspot()` --[syncs_to]--> `1. HubSpot Welcome List Configuration 🧬`
   - **Reasoning**: Connects the backend sync function directly to the list configuration it targets.


## Synthesis
[System Note: Awaiting semantic compilation]

## Source References
- Source: AST Graphify Extraction

## Open Questions
- What contradictions exist in this node?
