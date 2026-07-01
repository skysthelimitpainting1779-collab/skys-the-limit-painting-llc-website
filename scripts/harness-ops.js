/**
 * harness-ops.js — Customer & Operations State Machine Harness
 *
 * Manages the lead lifecycle: Intake → CRM-Reconciliation → Estimate-Drafting → Approval-Waitpoint
 *
 * Wired to the /api/leads payload shape defined in src/app/api/leads/route.ts.
 * Reads/writes .agents/operations/pipeline.md and .agents/approvals/.
 * Uses the SQLite queue (scripts/queue.js) for async task coordination.
 *
 * Usage:
 *   node scripts/harness-ops.js process-lead <json-string>
 *   node scripts/harness-ops.js mock-test
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { enqueueTask } from './queue.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Path constants ────────────────────────────────────────────────────────
const PIPELINE_MD = path.join(ROOT, '.agents', 'operations', 'pipeline.md');
const APPROVALS_DIR = path.join(ROOT, '.agents', 'approvals');
const TRACES_DIR = path.join(ROOT, '.agents', 'traces');

// ─── Pipeline stages ────────────────────────────────────────────────────────
const STAGES = [
  'intake',
  'crm_reconciliation',
  'estimate_drafting',
  'approval_waitpoint',
  'closed_won',
  'closed_lost',
];

// ─── Structured logger ──────────────────────────────────────────────────────
function log(stage, leadId, message, level = 'INFO') {
  const ts = new Date().toISOString();
  const line = `[${ts}] [harness-ops] [${level}] [${stage}] [${leadId}] ${message}`;
  console.log(line);
  // Append to trace log
  const traceFile = path.join(
    TRACES_DIR,
    `harness-${new Date().toISOString().slice(0, 10)}.log`
  );
  fs.mkdirSync(TRACES_DIR, { recursive: true });
  fs.appendFileSync(traceFile, line + '\n', 'utf8');
}

// ─── Pipeline.md read/write ─────────────────────────────────────────────────
function readPipelineMd() {
  if (!fs.existsSync(PIPELINE_MD)) return null;
  return fs.readFileSync(PIPELINE_MD, 'utf8');
}

function upsertLeadInPipeline(lead, stage, hubspotSynced = false, notes = '') {
  const content = readPipelineMd();
  if (!content) {
    log(
      stage,
      lead.leadId,
      'pipeline.md not found — skipping pipeline update',
      'WARN'
    );
    return;
  }

  const ts = new Date().toISOString();
  const hubspotStatus = hubspotSynced ? '✅' : '❌';
  const newRow = `| ${lead.leadId} | ${lead.name} | ${lead.market} | \`${stage}\` | ${lead.submittedAt} | ${ts} | ${hubspotStatus} | ${notes} |`;

  // Check if lead already exists in the table
  if (content.includes(lead.leadId)) {
    // Update existing row by regex replacement
    const updated = content.replace(
      new RegExp(`\\| ${lead.leadId} \\|[^\n]+`),
      newRow
    );
    fs.writeFileSync(PIPELINE_MD, updated, 'utf8');
  } else {
    // Insert new row — replace the "No active leads" placeholder or append
    const updated = content.replace(
      '| *(No active leads)* | — | — | — | — | — | — | — |',
      newRow
    );
    // If placeholder wasn't found, append before the Stale Lead section
    if (updated === content) {
      const insertBefore = '\n---\n\n## Stale Lead Alert Rules';
      fs.writeFileSync(
        PIPELINE_MD,
        content.replace(insertBefore, `\n${newRow}${insertBefore}`),
        'utf8'
      );
    } else {
      fs.writeFileSync(PIPELINE_MD, updated, 'utf8');
    }
  }
  log(
    stage,
    lead.leadId,
    `Pipeline updated → stage: ${stage}, hubspot: ${hubspotStatus}`
  );
}

// ─── HubSpot CRM Reconciliation ──────────────────────────────────────────────
async function crmReconciliation(lead) {
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!accessToken) {
    log(
      'crm_reconciliation',
      lead.leadId,
      'HUBSPOT_ACCESS_TOKEN not set — CRM reconciliation skipped',
      'WARN'
    );
    return { synced: false, reason: 'no_token', contactId: null };
  }

  let contactId = null;

  // Step 1: Search for existing contact by email
  try {
    const searchRes = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts/search',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                { propertyName: 'email', operator: 'EQ', value: lead.email },
              ],
            },
          ],
          properties: ['email', 'firstname', 'lastname', 'hs_lead_status'],
        }),
      }
    );

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.results?.length > 0) {
        contactId = data.results[0].id;
        log(
          'crm_reconciliation',
          lead.leadId,
          `HubSpot contact found: ${contactId}`
        );
      }
    }
  } catch (err) {
    log(
      'crm_reconciliation',
      lead.leadId,
      `HubSpot search failed: ${err.message}`,
      'ERROR'
    );
  }

  // Step 2: Build properties
  const nameParts = (lead.name || '').split(' ');
  const properties = {
    firstname: nameParts[0] || '',
    lastname: nameParts.slice(1).join(' ') || '',
    email: lead.email || '',
    phone: lead.phone || '',
    city: lead.city || '',
    message: [
      `Lead ID: ${lead.leadId}`,
      `Market: ${lead.market}`,
      `Project Type: ${lead.projectType}`,
      `Timeline: ${lead.timeline}`,
      `Budget: ${lead.budget}`,
      `Contact Method: ${lead.contactMethod}`,
      lead.notes ? `Notes: ${lead.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    hs_lead_status: 'NEW',
  };

  // Step 3: Create or update
  try {
    let response;
    if (contactId) {
      response = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ properties }),
        }
      );
      log(
        'crm_reconciliation',
        lead.leadId,
        `HubSpot contact PATCHED: ${contactId}`
      );
    } else {
      response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
      if (response.ok) {
        const data = await response.json();
        contactId = data.id;
        log(
          'crm_reconciliation',
          lead.leadId,
          `HubSpot contact CREATED: ${contactId}`
        );
      }
    }

    if (!response.ok) {
      const body = await response.text();
      log(
        'crm_reconciliation',
        lead.leadId,
        `HubSpot API error ${response.status}: ${body}`,
        'ERROR'
      );
      return {
        synced: false,
        reason: `http_${response.status}`,
        contactId: null,
      };
    }

    return { synced: true, reason: 'ok', contactId };
  } catch (err) {
    log(
      'crm_reconciliation',
      lead.leadId,
      `HubSpot upsert failed: ${err.message}`,
      'ERROR'
    );
    return { synced: false, reason: err.message, contactId: null };
  }
}

// ─── Estimate Draft Generator ────────────────────────────────────────────────
function draftEstimate(lead, hubspotResult) {
  const approvalFile = path.join(APPROVALS_DIR, `ESTIMATE-${lead.leadId}.md`);
  fs.mkdirSync(APPROVALS_DIR, { recursive: true });

  const content = [
    `---`,
    `type: approval-item`,
    `title: "Estimate Approval — ${lead.leadId}"`,
    `tags: [estimate, approval, lead, human-required]`,
    `lead_id: ${lead.leadId}`,
    `stage: approval_waitpoint`,
    `created_at: ${new Date().toISOString()}`,
    `status: pending`,
    `---`,
    ``,
    `# Estimate Draft — ${lead.leadId}`,
    ``,
    `> ⚠️ **Human review required.** Approve this draft before it is sent to the customer.`,
    ``,
    `## Lead Details`,
    ``,
    `| Field | Value |`,
    `|---|---|`,
    `| **Name** | ${lead.name} |`,
    `| **Email** | ${lead.email} |`,
    `| **Phone** | ${lead.phone} |`,
    `| **City** | ${lead.city} |`,
    `| **Market** | ${lead.market} |`,
    `| **Project Type** | ${lead.projectType} |`,
    `| **Property Type** | ${lead.propertyType || '—'} |`,
    `| **Timeline** | ${lead.timeline} |`,
    `| **Budget Range** | ${lead.budget || '—'} |`,
    `| **Contact Method** | ${lead.contactMethod} |`,
    `| **Notes** | ${lead.notes || '—'} |`,
    `| **Photos URL** | ${lead.photosUrl || '—'} |`,
    `| **UTM Source** | ${lead.utm_source || lead.utmSource || '—'} |`,
    `| **Submitted** | ${lead.submittedAt} |`,
    ``,
    `## Integration Status`,
    ``,
    `| System | Status | Detail |`,
    `|---|---|---|`,
    `| Supabase | ✅ Saved | Lead ID: \`${lead.leadId}\` |`,
    `| HubSpot CRM | ${hubspotResult.synced ? '✅ Synced' : '❌ Failed'} | ${hubspotResult.synced ? `Contact ID: \`${hubspotResult.contactId}\`` : `Reason: ${hubspotResult.reason}`} |`,
    `| Resend (notify) | ✅ Sent via /api/leads | — |`,
    `| Resend (auto-reply) | ✅ Sent via /api/leads | — |`,
    ``,
    `## Drafted Estimate Response`,
    ``,
    `> **Instructions:** Review the below. Edit the pricing/scope section as needed, then mark approved.`,
    ``,
    `---`,
    ``,
    `Hi ${lead.name.split(' ')[0]},`,
    ``,
    `Thank you for reaching out to Sky's the Limit Painting LLC! Based on your inquiry for **${lead.projectType}** work in **${lead.city}**, I wanted to follow up personally.`,
    ``,
    `To prepare an accurate estimate, I'd love to schedule a quick call or site visit. Given your timeline of **${lead.timeline}** and the scope you've described, we should be able to get you on the calendar quickly.`,
    ``,
    `**Next Steps:**`,
    `1. Reply to this email or call **651-410-4196** at your convenience`,
    `2. We'll confirm project scope and walk through the details`,
    `3. You'll receive a written estimate within 24 hours of our conversation`,
    ``,
    `We pride ourselves on transparency, quality prep work, and on-time completion. I look forward to earning your business.`,
    ``,
    `Best,`,
    `Anthony`,
    `Sky's the Limit Painting LLC`,
    `MN ID: IR816596 | 651-410-4196`,
    `*(Workers' Comp Exempt — MN Statute 176.041, owner-operator)*`,
    ``,
    `---`,
    ``,
    `## Human Action Required`,
    ``,
    `- [ ] Review lead details above`,
    `- [ ] Review drafted response — edit pricing/scope if needed`,
    `- [ ] **Approve**: Change \`status: pending\` → \`status: approved\` in this file's frontmatter`,
    `- [ ] **OR Reject**: Change to \`status: rejected\` and add reason`,
    `- [ ] After approval, update \`pipeline.md\` stage to \`closed_won\` or \`closed_lost\``,
    ``,
    `*Generated by harness-ops.js state machine — ${new Date().toISOString()}*`,
  ].join('\n');

  fs.writeFileSync(approvalFile, content, 'utf8');
  log(
    'estimate_drafting',
    lead.leadId,
    `Estimate draft written → ${approvalFile}`
  );
  return approvalFile;
}

// ─── Main State Machine ──────────────────────────────────────────────────────
export async function processLead(leadPayload) {
  const lead =
    typeof leadPayload === 'string' ? JSON.parse(leadPayload) : leadPayload;

  if (!lead.leadId) {
    // Assign a leadId if not provided (e.g. called directly, not from /api/leads)
    const stamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(0, 14);
    lead.leadId = `SKY-${stamp}-HARNESS`;
    lead.submittedAt = lead.submittedAt || new Date().toISOString();
  }

  // ── Stage 1: INTAKE ────────────────────────────────────────────────────────
  log(
    'intake',
    lead.leadId,
    `Processing lead: ${lead.name} | ${lead.email} | ${lead.market}`
  );
  upsertLeadInPipeline(lead, 'intake', false, 'Received from /api/leads');

  // ── Stage 2: CRM RECONCILIATION ────────────────────────────────────────────
  log(
    'crm_reconciliation',
    lead.leadId,
    'Starting HubSpot CRM reconciliation...'
  );
  upsertLeadInPipeline(
    lead,
    'crm_reconciliation',
    false,
    'CRM sync in progress'
  );
  const hubspotResult = await crmReconciliation(lead);

  if (!hubspotResult.synced) {
    log(
      'crm_reconciliation',
      lead.leadId,
      `CRM reconciliation failed: ${hubspotResult.reason} — enqueuing repair task`,
      'WARN'
    );
    enqueueTask(
      lead.leadId,
      `REPAIR: HubSpot Sync Failure for lead ${lead.leadId} (reason: ${hubspotResult.reason})`,
      'high'
    );
  }

  upsertLeadInPipeline(
    lead,
    'crm_reconciliation',
    hubspotResult.synced,
    hubspotResult.synced
      ? `HubSpot ID: ${hubspotResult.contactId}`
      : `Sync failed: ${hubspotResult.reason}`
  );

  // ── Stage 3: ESTIMATE DRAFTING ─────────────────────────────────────────────
  log(
    'estimate_drafting',
    lead.leadId,
    'Drafting estimate for human approval...'
  );
  upsertLeadInPipeline(
    lead,
    'estimate_drafting',
    hubspotResult.synced,
    'Drafting estimate'
  );
  const approvalFile = draftEstimate(lead, hubspotResult);

  // ── Stage 4: APPROVAL WAITPOINT ────────────────────────────────────────────
  log(
    'approval_waitpoint',
    lead.leadId,
    `Estimate ready for human sign-off: ${approvalFile}`
  );
  upsertLeadInPipeline(
    lead,
    'approval_waitpoint',
    hubspotResult.synced,
    `Awaiting approval: ${path.basename(approvalFile)}`
  );

  // Enqueue a reminder task for the approval
  enqueueTask(
    lead.leadId,
    `REVIEW: Estimate approval required for lead ${lead.leadId} (${lead.name} — ${lead.market})`,
    'high'
  );

  log(
    'approval_waitpoint',
    lead.leadId,
    `✅ Harness complete. Lead is in approval_waitpoint.`
  );

  return {
    leadId: lead.leadId,
    stages: [
      'intake',
      'crm_reconciliation',
      'estimate_drafting',
      'approval_waitpoint',
    ],
    hubspot: hubspotResult,
    approvalFile,
  };
}

// ─── CLI entry point ─────────────────────────────────────────────────────────
const [, , command, ...args] = process.argv;

if (command === 'process-lead') {
  const payload = args.join(' ');
  processLead(payload)
    .then((result) => {
      console.log('\n✅ Harness complete:', JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error('\n❌ Harness failed:', err.message);
      process.exit(1);
    });
} else if (command === 'mock-test') {
  // ── MOCK LEAD PAYLOAD (mirrors /api/leads shape exactly) ──────────────────
  const mockLead = {
    leadId: `SKY-MOCK-${Date.now()}`,
    name: 'Jane Homeowner',
    email: 'jane.homeowner@example.com',
    phone: '651-555-0199',
    city: 'Woodbury',
    market: 'Residential',
    projectType: 'Interior',
    propertyType: 'Single Family',
    timeline: 'Within 1 month',
    budget: '$2,000 - $5,000',
    contactMethod: 'Email',
    notes: 'Kitchen cabinets and living room walls. House built in 1985.',
    photosUrl: '',
    utm_source: 'meta_ads',
    utm_medium: 'cpc',
    utm_campaign: 'residential_spring_2026',
    page: '/residential',
    submittedAt: new Date().toISOString(),
  };

  console.log('\n🧪 Running mock test with payload:');
  console.log(JSON.stringify(mockLead, null, 2));
  console.log('\n--- Starting state machine ---\n');

  processLead(mockLead)
    .then((result) => {
      console.log('\n✅ Mock test complete:');
      console.log(JSON.stringify(result, null, 2));
      console.log(`\nApproval file written to: ${result.approvalFile}`);
    })
    .catch((err) => {
      console.error('\n❌ Mock test failed:', err.message);
      process.exit(1);
    });
} else {
  console.log(`
harness-ops.js — Customer & Operations State Machine Harness

Usage:
  node scripts/harness-ops.js mock-test
    Run a full state machine test with a mock lead payload.

  node scripts/harness-ops.js process-lead '<json>'
    Process a real lead payload JSON string.

Stages: intake → crm_reconciliation → estimate_drafting → approval_waitpoint
`);
}
