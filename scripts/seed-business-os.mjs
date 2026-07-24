/**
 * Seed the Notion Command Center · Business OS for Sky's the Limit Painting.
 * Uses Notion MCP OAuth token from ~/.grok/mcp_credentials.json
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const MCP_URL = "https://mcp.notion.com/mcp";
const OWNER = "367d872b-594c-81da-ba4a-0002b47ff0a9";
const HOME_PAGE = "e8110a79-9a89-4033-a686-3e0702039a2e";

const DS = {
  priorities: "c15a7940-676a-46c7-91a5-044c3432c914",
  projects: "50bdfb11-0ad6-4ee0-86d8-56d0e789af67",
  crm: "bf8c4a3d-7b03-4baa-9fbc-a216593792ca",
  scorecard: "443229a6-b89f-446e-ab4b-77896a4bdba8",
  sop: "feacf3e8-ec47-4d57-9fdd-bfec1994c17b",
};

// Existing rows to update (not re-create)
const EXISTING = {
  weeklyRhythm: "7aba2c9d-0937-49d4-95ef-db0360d5570e",
  linearConnect: "fa89200f-60df-4413-bbd8-be6dca55a888",
  definePriorities: "66216950-58ee-4881-8b67-2da6b2907e5e",
};

function loadToken() {
  const credPath = path.join(os.homedir(), ".grok", "mcp_credentials.json");
  const raw = JSON.parse(fs.readFileSync(credPath, "utf8"));
  const entry = raw["notion:https://mcp.notion.com/mcp"];
  if (!entry?.token_response?.access_token) {
    throw new Error("No Notion MCP token in mcp_credentials.json — run OAuth first");
  }
  return entry;
}

async function refreshIfNeeded(entry) {
  const now = Math.floor(Date.now() / 1000);
  const exp = Number(entry.token_received_at) + Number(entry.token_response.expires_in || 3600);
  if (now < exp - 120) return entry.token_response.access_token;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: entry.token_response.refresh_token,
    client_id: entry.client_id,
    resource: "https://mcp.notion.com",
  });
  const res = await fetch("https://mcp.notion.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${await res.text()}`);
  const tok = await res.json();
  entry.token_response.access_token = tok.access_token;
  if (tok.refresh_token) entry.token_response.refresh_token = tok.refresh_token;
  entry.token_response.expires_in = tok.expires_in || 3600;
  entry.token_received_at = now;
  const credPath = path.join(os.homedir(), ".grok", "mcp_credentials.json");
  const all = JSON.parse(fs.readFileSync(credPath, "utf8"));
  all["notion:https://mcp.notion.com/mcp"] = entry;
  fs.writeFileSync(credPath, JSON.stringify(all, null, 2) + "\n");
  console.log("refreshed token");
  return tok.access_token;
}

let sessionId = null;
let token = null;
let rpcId = 1;

async function mcp(method, params) {
  const payload = { jsonrpc: "2.0", id: rpcId++, method };
  if (params !== undefined) payload.params = params;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (sessionId) headers["Mcp-Session-Id"] = sessionId;

  const res = await fetch(MCP_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const sid = res.headers.get("mcp-session-id") || res.headers.get("Mcp-Session-Id");
  if (sid) sessionId = sid;

  const text = await res.text();
  let data;
  if (text.includes("data:")) {
    const m = text.match(/data:\s*(\{[\s\S]*\})/);
    if (!m) throw new Error(`SSE parse fail: ${text.slice(0, 400)}`);
    data = JSON.parse(m[1]);
  } else {
    data = JSON.parse(text);
  }
  if (data.error) {
    throw new Error(`${method} error: ${JSON.stringify(data.error)}`);
  }
  return data;
}

async function tool(name, args) {
  const data = await mcp("tools/call", { name, arguments: args });
  const content = data.result?.content || [];
  const texts = content.map((c) => c.text || "").join("\n");
  if (data.result?.isError) {
    throw new Error(`tool ${name} isError: ${texts.slice(0, 800)}`);
  }
  console.log(`  ✓ ${name}`);
  return { data, texts };
}

function mapLinearStatus(s) {
  const m = {
    Backlog: "Backlog",
    Todo: "Ready",
    "In Progress": "In progress",
    "In Review": "In progress",
    Done: "Done",
    Canceled: "Canceled",
    Cancelled: "Canceled",
    Blocked: "Blocked",
  };
  return m[s] || "Ready";
}

function mapPriority(p) {
  // Linear: 1 urgent, 2 high, 3 medium, 4 low
  if (p === 1 || p === "Urgent") return "Urgent";
  if (p === 2 || p === "High") return "High";
  if (p === 4 || p === "Low") return "Low";
  return "Medium";
}

function businessAreaFromLabels(labels = [], project = "") {
  const joined = [...labels, project].join(" ").toLowerCase();
  if (joined.includes("gtm:sales") || joined.includes("sales")) return "Sales";
  if (joined.includes("gtm:marketing") || joined.includes("gtm:content") || joined.includes("gtm:acq"))
    return "Marketing";
  if (joined.includes("area:infra") || joined.includes("reliability") || joined.includes("area:security"))
    return "Operations";
  if (joined.includes("guapo") || joined.includes("platform") || joined.includes("area:"))
    return "Operations";
  if (joined.includes("gtm:ops")) return "Operations";
  if (joined.includes("finance")) return "Finance";
  return "Operations";
}

function typeFromLabels(labels = [], title = "") {
  const j = labels.join(" ").toLowerCase();
  if (j.includes("epic") || title.toLowerCase().includes("epic:")) return "Project";
  if (j.includes("bug")) return "Issue";
  return "Task";
}

// --- content definitions ---

const Q3_PRIORITIES = [
  {
    Priority: "Lock brand voice & claim-safe messaging (all markets)",
    Status: "On track",
    Quarter: "Q3",
    Progress: 15,
    "Measurable Outcome":
      "Approved claims one-pager live in Linear + repo; site/GBP/proposal language aligned; zero unapproved claims in public copy.",
    Notes: "Linear: SKY-139 · GTM-0 Messaging & claims lock",
    "date:Due Date:start": "2026-08-15",
    "date:Due Date:is_datetime": 0,
    Owner: OWNER,
  },
  {
    Priority: "Ship shared sales process (new → won/lost → handoff)",
    Status: "On track",
    Quarter: "Q3",
    Progress: 10,
    "Measurable Outcome":
      "Stage definitions + 15-min first-touch SLA + estimate follow-up sequence documented and used on every new lead for 4 consecutive weeks.",
    Notes: "Linear: SKY-138 · Feeds CRM & Pipeline in this OS",
    "date:Due Date:start": "2026-08-31",
    "date:Due Date:is_datetime": 0,
    Owner: OWNER,
  },
  {
    Priority: "Residential acquisition engine live",
    Status: "Not started",
    Quarter: "Q3",
    Progress: 0,
    "Measurable Outcome":
      "Offer ladder + lead magnets published; weekly residential lead target met 3 weeks in a row; review velocity tracked on scorecard.",
    Notes: "Linear: SKY-135 / SKY-140 · GTM-1",
    "date:Due Date:start": "2026-09-30",
    "date:Due Date:is_datetime": 0,
    Owner: OWNER,
  },
  {
    Priority: "Commercial GC outreach machine started",
    Status: "Not started",
    Quarter: "Q3",
    Progress: 0,
    "Measurable Outcome":
      "50 Twin Cities GC/facility contacts loaded; first 10 touches logged; COI/capabilities packet ready for qualified jobs.",
    Notes: "Linear: SKY-136 / SKY-141 · GTM-2",
    "date:Due Date:start": "2026-09-30",
    "date:Due Date:is_datetime": 0,
    Owner: OWNER,
  },
  {
    Priority: "Municipal readiness packet + opportunity tracking",
    Status: "Not started",
    Quarter: "Q3",
    Progress: 0,
    "Measurable Outcome":
      "Claim-safe municipal capabilities PDF approved; bid/opportunity tracker in use; no false cert claims in any public materials.",
    Notes: "Linear: SKY-137 / SKY-142 · GTM-3",
    "date:Due Date:start": "2026-09-30",
    "date:Due Date:is_datetime": 0,
    Owner: OWNER,
  },
];

const SCORECARD_METRICS = [
  { Metric: "New leads (all markets)", Area: "Sales", Unit: "Count", Target: 10, Actual: 0 },
  { Metric: "Residential leads", Area: "Sales", Unit: "Count", Target: 6, Actual: 0 },
  { Metric: "Commercial leads", Area: "Sales", Unit: "Count", Target: 3, Actual: 0 },
  { Metric: "Municipal / public leads", Area: "Sales", Unit: "Count", Target: 1, Actual: 0 },
  { Metric: "Estimates sent", Area: "Sales", Unit: "Count", Target: 5, Actual: 0 },
  { Metric: "Jobs won", Area: "Sales", Unit: "Count", Target: 2, Actual: 0 },
  { Metric: "Pipeline value open ($)", Area: "Sales", Unit: "Dollars", Target: 50000, Actual: 0 },
  { Metric: "First-touch under 15 minutes (%)", Area: "Operations", Unit: "Percent", Target: 90, Actual: 0 },
  { Metric: "Blocked work items", Area: "Operations", Unit: "Count", Target: 0, Actual: 0 },
  { Metric: "Jobs in production", Area: "Production", Unit: "Count", Target: 3, Actual: 0 },
  { Metric: "On-time job completions (%)", Area: "Production", Unit: "Percent", Target: 95, Actual: 0 },
  { Metric: "Cash collected ($)", Area: "Finance", Unit: "Dollars", Target: 15000, Actual: 0 },
  { Metric: "AR past due ($)", Area: "Finance", Unit: "Dollars", Target: 0, Actual: 0 },
  { Metric: "Google reviews received", Area: "Marketing", Unit: "Count", Target: 2, Actual: 0 },
  { Metric: "Content / outbound posts published", Area: "Marketing", Unit: "Count", Target: 3, Actual: 0 },
];

// Week ending next Friday (or this Friday if today is Fri+)
function weekEndingISO() {
  const d = new Date();
  const day = d.getUTCDay(); // 0 Sun
  const add = day <= 5 ? 5 - day : 6; // to Friday
  d.setUTCDate(d.getUTCDate() + add);
  return d.toISOString().slice(0, 10);
}

const CRM_SEED = [
  {
    "Opportunity / Customer": "TEMPLATE — Residential estimate follow-up",
    Stage: "Follow-up",
    "Lead Source": "Website",
    "Estimated Value": 4500,
    "Contact Name": "(replace with real contact)",
    Notes: "Clone this pattern: every open estimate needs Next Follow-up + owner.",
    "date:Next Follow-up:start": "2026-07-11",
    "date:Next Follow-up:is_datetime": 0,
    Owner: OWNER,
  },
  {
    "Opportunity / Customer": "TEMPLATE — Commercial GC intro",
    Stage: "New lead",
    "Lead Source": "Other",
    "Estimated Value": 25000,
    "Contact Name": "(GC / facility manager)",
    Notes: "Use for commercial outreach; attach COI packet when qualified.",
    "date:Next Follow-up:start": "2026-07-14",
    "date:Next Follow-up:is_datetime": 0,
    Owner: OWNER,
  },
  {
    "Opportunity / Customer": "TEMPLATE — Municipal opportunity",
    Stage: "Qualified",
    "Lead Source": "Other",
    "Estimated Value": 40000,
    "Contact Name": "(city / school / prime)",
    Notes: "Claim-safe only. Link municipal capabilities packet. No fake certs.",
    "date:Next Follow-up:start": "2026-07-18",
    "date:Next Follow-up:is_datetime": 0,
    Owner: OWNER,
  },
];

const SOPS = [
  {
    Process: "Lead intake & 15-minute first touch",
    Status: "Draft",
    "Business Area": "Sales",
    Frequency: "Daily",
    "Purpose / Notes": "Every new lead gets human or system first touch within 15 minutes during business hours.",
    "date:Last Reviewed:start": "2026-07-10",
    "date:Last Reviewed:is_datetime": 0,
    OwnerKey: "Process Owner",
    content: `## Purpose
Convert speed into trust. Missed first-touch kills residential and commercial deals.

## Trigger
- Website estimate form (\`/estimate\`, \`/api/leads\`)
- Phone / SMS / Google message
- Referral

## Steps
1. Capture contact, market (residential / commercial / municipal), job type, timeline, photos if any.
2. Confirm receipt (call preferred; SMS/email if after-hours queue).
3. Qualify: decision-maker, budget band, access, start window.
4. Book walkthrough or schedule estimate window.
5. Log in **CRM & Pipeline** with Stage, Owner, Next Follow-up, Estimated Value.
6. If software handoff needed, file Linear issue under Reliability/Guapo and set Linear Link on the work item.

## SLA
- **Business hours:** first touch ≤ 15 minutes
- **After hours:** auto-reply + first human touch next business morning

## Definition of done
Lead row exists in CRM with owner + next step. Customer knows what happens next.
`,
  },
  {
    Process: "Estimate send & follow-up sequence",
    Status: "Draft",
    "Business Area": "Sales",
    Frequency: "Per job",
    "Purpose / Notes": "No estimate dies silent. Structured follow-ups until win/loss.",
    "date:Last Reviewed:start": "2026-07-10",
    "date:Last Reviewed:is_datetime": 0,
    content: `## Purpose
Turn estimates into booked work without spam or pressure that damages brand.

## Sequence (default)
| Day | Action |
|-----|--------|
| 0 | Send estimate (clear scope, claim-safe language, next step CTA) |
| 2 | Check-in: questions? walkthrough needed? |
| 5 | Value follow-up: timeline / season / materials note |
| 10 | Decision check: yes / no / later |
| 21 | Close-lost or nurture (mark Stage Lost or Follow-up) |

## Rules
- One owner on the CRM row
- Next Follow-up date always set while Stage is open
- Claims must match brand lock (IR816596, insured, owner-op — only if true)

## Handoff when Won
1. Stage → Won
2. Create production job checklist
3. Deposit / contract path
4. Schedule kickoff
`,
  },
  {
    Process: "Weekly owner reset (leadership meeting)",
    Status: "Approved",
    "Business Area": "Operations",
    Frequency: "Weekly",
    "Purpose / Notes": "60-minute OS review: numbers → priorities → customers → solve → commit.",
    "date:Last Reviewed:start": "2026-07-10",
    "date:Last Reviewed:is_datetime": 0,
    content: `## Agenda (60 min)
1. **Numbers — 5 min** — Update scorecard first. Flag exceptions only.
2. **Priorities — 10 min** — Each Q3 priority: On track / At risk / Off track.
3. **Customers + jobs — 10 min** — Pipeline, production risk, cash collection.
4. **Solve — 25 min** — Highest-impact issue; root cause; decision; action.
5. **Commit — 10 min** — Owners, due dates, three must-win outcomes for the week.

## Prep (before meeting)
- [ ] Scorecard Actuals filled
- [ ] Blocked / overdue items reviewed
- [ ] Open estimates have next follow-up
- [ ] Linear high-priority issues reflected in Projects & Action Items

## Non-negotiables
One owner. One deadline. One measurable outcome.
`,
  },
  {
    Process: "Job kickoff checklist (won → production)",
    Status: "Draft",
    "Business Area": "Production",
    Frequency: "Per job",
    "Purpose / Notes": "Standard handoff so crews start with clear scope, access, and materials.",
    "date:Last Reviewed:start": "2026-07-10",
    "date:Last Reviewed:is_datetime": 0,
    content: `## Before day 1
- [ ] Scope written and customer-confirmed
- [ ] Colors / products locked
- [ ] Access / parking / pets / occupied notes
- [ ] Materials ordered or staged
- [ ] Crew assigned + hours estimate
- [ ] Photos of pre-start condition
- [ ] Payment terms clear (deposit if required)

## Day 1
- [ ] Walk space with customer or PM
- [ ] Protect floors / furniture
- [ ] Confirm change-order path

## Close-out
- [ ] Punch list zero
- [ ] Final photos
- [ ] Review request sent
- [ ] Invoice / final payment
`,
  },
  {
    Process: "Brand voice & claims lock (publish gate)",
    Status: "Draft",
    "Business Area": "Marketing",
    Frequency: "As needed",
    "Purpose / Notes": "Nothing public ships without claim-safe language. SSOT: Linear SKY-139 + repo docs.",
    "date:Last Reviewed:start": "2026-07-10",
    "date:Last Reviewed:is_datetime": 0,
    content: `## Allowed (when true)
- Licensed where required (e.g. MN IR816596 when accurate)
- Insured; COI available for qualified jobs
- Owner-operated / local Twin Cities
- Workmanship language that matches real warranty policy

## Banned (unless verified in writing)
- "Government certified" / MnDOT / DBE without proof
- Fake award counts or inflated years
- Guaranteed lowest price
- Invented reviews or logos

## Gate
1. Draft copy
2. Check against claims one-pager
3. Owner approve for site / GBP / proposals / ads
4. Ship
`,
  },
  {
    Process: "Linear ↔ Business OS work mapping",
    Status: "Draft",
    "Business Area": "Admin",
    Frequency: "Weekly",
    "Purpose / Notes": "Linear remains execution SSOT for GTM + eng. This OS mirrors active work for owner command.",
    "date:Last Reviewed:start": "2026-07-10",
    "date:Last Reviewed:is_datetime": 0,
    content: `## Mapping
| Linear | Business OS field |
|--------|-------------------|
| Issue / project | Work Item |
| Status | Status |
| Priority | Priority |
| Assignee | Owner |
| URL | Linear Link |
| Labels / project | Business Area |
| Epic | Type: Project |
| Issue/task | Type: Task or Issue |

## Cadence
- **Daily:** active customer / production blockers in Projects
- **Weekly:** import or refresh high-priority Linear issues into Projects
- **Never:** duplicate full eng backlog — only owner-relevant work

## Links
- Linear OS: repo \`docs/LINEAR_OS.md\`
- Workspace: https://linear.app/skysthelimit
`,
  },
];

const LINEAR_HIGHLIGHTS = [
  {
    id: "SKY-134",
    title: "[GTM] Epic: Company go-to-market OS (all markets)",
    url: "https://linear.app/skysthelimit/issue/SKY-134/gtm-epic-company-go-to-market-os-all-markets",
    status: "In Progress",
    priority: 1,
    labels: ["gtm:marketing", "Epic"],
    project: "GTM",
  },
  {
    id: "SKY-139",
    title: "[GTM] Epic: Brand voice & claims lock (all markets)",
    url: "https://linear.app/skysthelimit/issue/SKY-139/gtm-epic-brand-voice-and-claims-lock-all-markets",
    status: "Todo",
    priority: 1,
    labels: ["gtm:marketing", "Epic"],
    project: "GTM",
  },
  {
    id: "SKY-138",
    title: "[GTM] Epic: Shared sales process (all markets)",
    url: "https://linear.app/skysthelimit/issue/SKY-138/gtm-epic-shared-sales-process-all-markets",
    status: "Todo",
    priority: 1,
    labels: ["gtm:sales", "Epic"],
    project: "GTM",
  },
  {
    id: "SKY-135",
    title: "[GTM] Epic: Residential marketing & sales engine",
    url: "https://linear.app/skysthelimit/issue/SKY-135/gtm-epic-residential-marketing-and-sales-engine",
    status: "Todo",
    priority: 2,
    labels: ["gtm:acq", "market:residential", "Epic"],
    project: "GTM",
  },
  {
    id: "SKY-136",
    title: "[GTM] Epic: Commercial marketing & sales engine",
    url: "https://linear.app/skysthelimit/issue/SKY-136/gtm-epic-commercial-marketing-and-sales-engine",
    status: "Todo",
    priority: 2,
    labels: ["gtm:sales", "market:commercial", "Epic"],
    project: "GTM",
  },
  {
    id: "SKY-137",
    title: "[GTM] Epic: Municipal / public-sector readiness",
    url: "https://linear.app/skysthelimit/issue/SKY-137/gtm-epic-municipal-public-sector-readiness",
    status: "Todo",
    priority: 2,
    labels: ["gtm:sales", "market:municipal", "Epic"],
    project: "GTM",
  },
  {
    id: "SKY-143",
    title: "[GTM] Define weekly GTM scoreboard (res/com/muni metrics)",
    url: "https://linear.app/skysthelimit/issue/SKY-143/gtm-define-weekly-gtm-scoreboard-rescommuni-metrics",
    status: "Todo",
    priority: 2,
    labels: ["gtm:ops", "Docs"],
    project: "GTM",
  },
  {
    id: "SKY-46",
    title: "[G-013] CI green gate: lint + test + build required on main/PRs",
    url: "https://linear.app/skysthelimit/issue/SKY-46/g-013-ci-green-gate-lint-test-build-required-on-mainprs",
    status: "Todo",
    priority: 2,
    labels: ["area:infra", "agent-ready"],
    project: "Guapo Upgrade",
  },
  {
    id: "SKY-48",
    title: "[G-015] Legal footer block: privacy, terms, contractor disclosures",
    url: "https://linear.app/skysthelimit/issue/SKY-48/g-015-legal-footer-block-privacy-terms-contractor-disclosures",
    status: "Todo",
    priority: 2,
    labels: ["area:design", "agent-ready"],
    project: "Guapo Upgrade",
  },
  {
    id: "SKY-49",
    title: "[G-016] Hero conversion rewrite: one primary CTA path above fold",
    url: "https://linear.app/skysthelimit/issue/SKY-49/g-016-hero-conversion-rewrite-one-primary-cta-path-above-fold",
    status: "Backlog",
    priority: 2,
    labels: ["area:leads", "agent-ready"],
    project: "Guapo Upgrade",
  },
];

const OPS_WORK = [
  {
    "Work Item": "Fill this week's scorecard Actuals before Monday review",
    Type: "Task",
    Status: "Ready",
    Priority: "Urgent",
    "Business Area": "Operations",
    Source: "Meeting",
    "Next Step / Notes": "Enter real numbers into Weekly Scorecard; leave On Track accurate.",
    "date:Due Date:start": "2026-07-14",
    "date:Due Date:is_datetime": 0,
    Owner: OWNER,
  },
  {
    "Work Item": "Replace CRM templates with real open estimates",
    Type: "Follow-up",
    Status: "Ready",
    Priority: "High",
    "Business Area": "Sales",
    Source: "Notion",
    "Next Step / Notes": "Pull from Supabase leads / inbox; delete or rename TEMPLATE rows.",
    "date:Due Date:start": "2026-07-12",
    "date:Due Date:is_datetime": 0,
    Owner: OWNER,
  },
  {
    "Work Item": "Run first full weekly owner reset using OS agenda",
    Type: "Task",
    Status: "Ready",
    Priority: "High",
    "Business Area": "Operations",
    Source: "Meeting",
    "Next Step / Notes": "Use SOP: Weekly owner reset. Capture three must-win outcomes on home page checklist.",
    "date:Due Date:start": "2026-07-14",
    "date:Due Date:is_datetime": 0,
    Owner: OWNER,
  },
];

const HOME_CONTENT = `<callout icon="🎯">
**OWNER COMMAND CENTER** — Strategy · Sales · Delivery · Cash

Sky's the Limit Painting LLC · Twin Cities · Markets: residential · commercial · municipal

Run the business from one screen. Review the numbers, make decisions, assign owners, and move.
</callout>

## How this OS works

| Layer | System of record | This Notion page |
|-------|------------------|------------------|
| Tasks / GTM / eng execution | **Linear** (\`SKY-XX\`) | Mirrored high-signal work in Projects & Action Items |
| Knowledge / SOPs / weekly owner rhythm | **Notion** (this OS) | Source of truth |
| Website / deploy | Git + Vercel | Linked via Linear Guapo / Reliability |
| Leads data | Supabase + website | Feed CRM & Pipeline manually until sync |

**Rule:** Linear executes. Notion commands. One owner · one deadline · one measurable outcome.

---

## Live command center

<database url="https://app.notion.com/p/43ccbc433b684344b842af65b51fb318" inline="true">Executive Command Center</database>

---

## Operating system

| | System | What it controls | Review |
|---|--------|------------------|--------|
| 1 | **Quarterly Priorities** | The 3–5 outcomes that matter most this quarter | Weekly |
| 2 | **Projects & Action Items** | Jobs, tasks, blockers, owners, deadlines (+ Linear links) | Daily |
| 3 | **CRM & Pipeline** | Leads, estimates, follow-ups, booked work | Daily |
| 4 | **Weekly Scorecard** | Sales, production, cash, quality, capacity | Weekly |
| 5 | **SOP Library** | The repeatable way the company operates | Monthly |

### System databases

<database url="https://app.notion.com/p/fab44f3aaa9442cf909bacdf73218825" inline="false" data-source-url="collection://c15a7940-676a-46c7-91a5-044c3432c914"></database>

<database url="https://app.notion.com/p/447b7d30559440abb53f2c62ef6053de" inline="false" data-source-url="collection://50bdfb11-0ad6-4ee0-86d8-56d0e789af67"></database>

<database url="https://app.notion.com/p/eedc0fb7e552437da304982787afb4db" inline="false" data-source-url="collection://bf8c4a3d-7b03-4baa-9fbc-a216593792ca"></database>

<database url="https://app.notion.com/p/296b955dab1d4b5cb412a9133229c09a" inline="false" data-source-url="collection://443229a6-b89f-446e-ab4b-77896a4bdba8"></database>

<database url="https://app.notion.com/p/9e5ff86c1661445a9699c13fd68ca4df" inline="false" data-source-url="collection://feacf3e8-ec47-4d57-9fdd-bfec1994c17b"></database>

---

## Weekly owner reset

- [ ] Update the scorecard **Actuals** before the meeting
- [ ] Review every **Blocked** or overdue item
- [ ] Confirm each active job has a clear next step
- [ ] Follow up on every open estimate (CRM Next Follow-up)
- [ ] Mark each Q3 priority: **On track / At risk / Off track**
- [ ] Assign one owner and one due date to every commitment
- [ ] Choose the week's **three must-win outcomes** (write them below)

### This week's three must-win outcomes
1. _
2. _
3. _

<details>
<summary>60-minute leadership meeting</summary>

1. **Numbers — 5 min** — Scan the scorecard. Flag exceptions; do not explain them yet.
2. **Priorities — 10 min** — Mark each quarterly priority on track, at risk, or off track.
3. **Customers + jobs — 10 min** — Pipeline, commitments, production risk, cash collection.
4. **Solve — 25 min** — Highest-impact issue. Root cause, decide, assign action.
5. **Commit — 10 min** — Read back owners, due dates, and the three must-win outcomes.

</details>

---

## Non-negotiables

> One owner. One deadline. One measurable outcome.
> If recurring work only lives in someone's head, it becomes an SOP.

---

## External links (company stack)

- Linear workspace: https://linear.app/skysthelimit
- Linear OS doc: https://linear.app/skysthelimit/document/linear-os-skysthelimit-7a94e6db17cb
- GTM project: https://linear.app/skysthelimit/project/skysthelimit-gtm-b47097455766
- Website: https://www.skysthelimitpaintingllc.com
- Repo OS mirror: \`docs/BUSINESS_OS.md\` (when present)

---

## Build status

**Seeded 2026-07-10** via agent:
- Q3 priorities aligned to GTM-0…3 + operating rhythm
- Projects seeded from Linear epics/highlights + owner ops tasks
- CRM templates for res / commercial / municipal
- Weekly scorecard metrics for this week (fill Actuals)
- Core SOP library drafts (lead intake, estimate follow-up, weekly reset, kickoff, claims lock, Linear mapping)

Next human actions: replace CRM templates with real leads; fill scorecard Actuals; run first weekly reset.
`;

async function createInDataSource(dataSourceId, pages) {
  // batch up to 20
  const batches = [];
  for (let i = 0; i < pages.length; i += 20) batches.push(pages.slice(i, i + 20));
  const results = [];
  for (const batch of batches) {
    const r = await tool("notion-create-pages", {
      parent: { type: "data_source_id", data_source_id: dataSourceId },
      pages: batch,
    });
    results.push(r.texts);
  }
  return results;
}

async function main() {
  console.log("== Seed Business OS ==");
  const entry = loadToken();
  token = await refreshIfNeeded(entry);

  await mcp("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "seed-business-os", version: "1.0" },
  });
  // initialized notification
  await fetch(MCP_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
    },
    body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
  });

  // 1) Update existing priority + work items
  console.log("\n[1] Update existing rows");
  await tool("notion-update-page", {
    page_id: EXISTING.weeklyRhythm,
    command: "update_properties",
    properties: {
      Status: "On track",
      Progress: 20,
      "Measurable Outcome":
        "Complete a weekly scorecard and leadership review for 10 consecutive weeks (Q3).",
      Notes: "Agenda on Command Center home. SOP: Weekly owner reset.",
      "date:Due Date:start": "2026-09-30",
      "date:Due Date:is_datetime": 0,
      Owner: OWNER,
    },
  });
  await tool("notion-update-page", {
    page_id: EXISTING.weeklyRhythm,
    command: "replace_content",
    new_str: `## Definition of done
- Weekly scorecard is updated before the review
- Active jobs, pipeline, priorities, and issues are reviewed
- Every next action has one owner and one due date
- Decisions and blockers are captured in Projects & Action Items
- 10 consecutive weeks completed by 2026-09-30

## Weekly check-in
- **What moved forward?**
- **What is off track?**
- **What decision is needed?**
- **What are the next actions?**
`,
    allow_deleting_content: true,
  });

  await tool("notion-update-page", {
    page_id: EXISTING.linearConnect,
    command: "update_properties",
    properties: {
      Status: "Done",
      Priority: "High",
      "Business Area": "Operations",
      Source: "Notion",
      Type: "Project",
      "Next Step / Notes":
        "Manual Linear mirror seeded into Projects. Native Notion↔Linear sync still optional.",
      Owner: OWNER,
    },
  });

  await tool("notion-update-page", {
    page_id: EXISTING.definePriorities,
    command: "update_properties",
    properties: {
      Status: "Done",
      Priority: "High",
      "Business Area": "Operations",
      Type: "Task",
      Source: "Notion",
      "Next Step / Notes": "Q3 priorities seeded in Quarterly Priorities DB (2026-07-10).",
      "date:Due Date:start": "2026-07-10",
      "date:Due Date:is_datetime": 0,
      Owner: OWNER,
    },
  });
  await tool("notion-update-page", {
    page_id: EXISTING.definePriorities,
    command: "replace_content",
    new_str: `## Done
Q3 priorities created in **Quarterly Priorities** database, aligned to Linear GTM milestones GTM-0…3 plus weekly operating rhythm.

Review board weekly; change Status to At risk / Off track when needed.
`,
    allow_deleting_content: true,
  });

  // 2) Q3 priorities (skip weekly rhythm duplicate title if already exists as separate row)
  console.log("\n[2] Seed Q3 priorities");
  await createInDataSource(
    DS.priorities,
    Q3_PRIORITIES.map((p) => ({ properties: p })),
  );

  // 3) Projects from Linear + ops
  console.log("\n[3] Seed Projects & Action Items");
  const projectPages = [
    ...LINEAR_HIGHLIGHTS.map((iss) => ({
      properties: {
        "Work Item": `${iss.id}: ${iss.title}`,
        Type: typeFromLabels(iss.labels, iss.title),
        Status: mapLinearStatus(iss.status),
        Priority: mapPriority(iss.priority),
        "Business Area": businessAreaFromLabels(iss.labels, iss.project),
        Source: "Linear",
        "Linear Link": iss.url,
        "Next Step / Notes": `Mirrored from Linear ${iss.id}. Execution SSOT remains Linear.`,
        Owner: OWNER,
      },
      content: `## Linear
- ID: **${iss.id}**
- Link: ${iss.url}
- Project: ${iss.project}
- Labels: ${iss.labels.join(", ")}

## Owner note
Update status here only for command-center clarity. Change work in Linear; refresh this row weekly if needed.
`,
    })),
    ...OPS_WORK.map((p) => ({ properties: p })),
  ];
  await createInDataSource(DS.projects, projectPages);

  // 4) CRM
  console.log("\n[4] Seed CRM templates");
  await createInDataSource(
    DS.crm,
    CRM_SEED.map((p) => ({
      properties: p,
      content: `## Instructions
Replace this template with a real opportunity. Keep Stage, Owner, Estimated Value, and Next Follow-up current.

Sales process SSOT: Linear SKY-138.
`,
    })),
  );

  // 5) Scorecard
  console.log("\n[5] Seed weekly scorecard");
  const week = weekEndingISO();
  await createInDataSource(
    DS.scorecard,
    SCORECARD_METRICS.map((m) => ({
      properties: {
        Metric: m.Metric,
        Area: m.Area,
        Unit: m.Unit,
        Target: m.Target,
        Actual: m.Actual,
        "On Track": m.Actual >= m.Target && m.Target > 0 ? "__YES__" : "__NO__",
        Notes: "Fill Actual before weekly owner reset",
        "date:Week Ending:start": week,
        "date:Week Ending:is_datetime": 0,
        Owner: OWNER,
      },
    })),
  );

  // 6) SOPs
  console.log("\n[6] Seed SOP library");
  await createInDataSource(
    DS.sop,
    SOPS.map((s) => {
      const { content, OwnerKey, ...props } = s;
      const properties = { ...props };
      if (OwnerKey) {
        properties["Process Owner"] = OWNER;
        delete properties.OwnerKey;
      } else {
        properties["Process Owner"] = OWNER;
      }
      return { properties, content };
    }),
  );

  // 7) Home page
  console.log("\n[7] Upgrade Command Center home");
  await tool("notion-update-page", {
    page_id: HOME_PAGE,
    command: "replace_content",
    new_str: HOME_CONTENT,
    allow_deleting_content: true,
  });

  console.log("\n== DONE ==");
  console.log(`Home: https://app.notion.com/p/${HOME_PAGE.replace(/-/g, "")}`);
  console.log(`Week ending seeded: ${week}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
