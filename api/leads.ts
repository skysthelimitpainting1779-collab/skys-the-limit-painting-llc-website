import { Resend } from 'resend';
import pg from 'pg';
const { Client } = pg;

if (!process.env.RESEND_API_KEY) {
  console.warn("WARNING: RESEND_API_KEY is not set in the environment variables. Lead emails will not be sent!");
}

if (!process.env.POSTGRES_URL_NON_POOLING && !process.env.POSTGRES_URL) {
  console.warn("WARNING: POSTGRES_URL_NON_POOLING is not set in the environment variables. Leads will not be saved to the database!");
}

const leadToEmail = process.env.LEAD_TO_EMAIL || 'skysthelimitpainting1779@gmail.com';

// Simple in-memory IP rate limiter
const ipCache = new Map<string, { count: number; lastReset: number }>();
const LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // max 5 requests per minute per IP

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const state = ipCache.get(ip);
  if (!state) {
    ipCache.set(ip, { count: 1, lastReset: now });
    return true;
  }
  if (now - state.lastReset > LIMIT_WINDOW_MS) {
    ipCache.set(ip, { count: 1, lastReset: now });
    return true;
  }
  if (state.count >= MAX_REQUESTS) {
    return false;
  }
  state.count += 1;
  return true;
}

// Database Ingestion and Event Logging Helpers
async function executeDbQuery(queryText: string, params: any[]) {
  const rawConnectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!rawConnectionString) {
    console.warn("Database connection string missing. Skipping database execution.");
    return null;
  }
  
  // Strip query parameters to prevent overriding ssl config
  const connectionString = rawConnectionString.split('?')[0];
  
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  await client.connect();
  try {
    const res = await client.query(queryText, params);
    return res;
  } finally {
    await client.end();
  }
}

async function saveLeadToDb(lead: any) {
  const query = `
    INSERT INTO public.leads (
      lead_id, source, name, phone, email, city, project_address, market, 
      project_type, property_type, timeline, budget, contact_method, notes, 
      utm_source, utm_medium, utm_campaign, page, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    ON CONFLICT (lead_id) DO NOTHING;
  `;
  const params = [
    lead.leadId,
    asText(lead.source) || 'website',
    asText(lead.name),
    asText(lead.phone),
    asText(lead.email),
    asText(lead.city),
    asText(lead.projectAddress || lead.project_address),
    asText(lead.market),
    asText(lead.projectType || lead.project_type),
    asText(lead.propertyType || lead.property_type),
    asText(lead.timeline),
    asText(lead.budget),
    asText(lead.contactMethod || lead.contact_method),
    asText(lead.notes),
    asText(lead.utm_source || lead.utmSource),
    asText(lead.utm_medium || lead.utmMedium),
    asText(lead.utm_campaign || lead.utmCampaign),
    asText(lead.page),
    'new'
  ];
  try {
    await executeDbQuery(query, params);
    console.log(`Lead stored in Supabase: ${lead.leadId}`);
  } catch (err) {
    console.error("Failed to store lead in Supabase:", err);
  }
}

async function saveLeadEventToDb(leadId: string, eventType: string, provider: string, status: string, message?: string) {
  const query = `
    INSERT INTO public.lead_events (
      lead_id, event_type, provider, status, message
    ) VALUES ($1, $2, $3, $4, $5);
  `;
  const params = [
    leadId,
    eventType,
    provider,
    status,
    message || null
  ];
  try {
    await executeDbQuery(query, params);
  } catch (err) {
    console.error(`Failed to store lead event in Supabase for lead ${leadId}:`, err);
  }
}

const requiredFields = ['name', 'phone', 'email', 'city', 'market', 'projectType', 'timeline', 'contactMethod', 'notes'];

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPayload(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function escapeHtml(value: unknown) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getSafeValue(obj: Record<string, unknown>, key: string): unknown {
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
    return undefined;
  }
  const descriptor = Object.getOwnPropertyDescriptor(obj, key);
  return descriptor ? descriptor.value : undefined;
}

function validate(payload: Record<string, unknown>) {
  const missing = requiredFields.filter((field) => !asText(getSafeValue(payload, field)));
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(asText(payload.email))) {
    return 'Enter a valid email address.';
  }

  if (asText(payload.website)) {
    return 'Spam check failed.';
  }

  const photosUrl = asText(payload.photosUrl);
  if (photosUrl) {
    try {
      const url = new URL(photosUrl);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) {
        return 'Enter a valid project photo link.';
      }
    } catch {
      return 'Enter a valid project photo link.';
    }
  }

  return '';
}

function buildLeadId() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SKY-${stamp}-${random}`;
}

function buildLeadHtml(payload: Record<string, unknown>) {
  const rows = Object.entries(payload)
    .filter(([key, value]) => key !== 'website' && asText(value).length > 0)
    .map(([key, value]) => '<tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:700;">' + escapeHtml(key) + '</td><td style="padding:6px 10px;border:1px solid #ddd;">' + escapeHtml(value) + '</td></tr>')
    .join('');

  return '<h1>New Sky\'s the Limit Painting lead</h1><table style="border-collapse:collapse;">' + rows + '</table>';
}

async function sendWithResend(payload: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.LEAD_FROM_EMAIL || 'Sky Leads <onboarding@resend.dev>';

  if (!apiKey) {
    return { configured: false };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [leadToEmail],
    cc: process.env.LEAD_CC_EMAIL ? [process.env.LEAD_CC_EMAIL] : undefined,
    subject: `New ${asText(payload.market)} lead - ${asText(payload.name)} - ${asText(payload.leadId)}`,
    html: buildLeadHtml(payload),
    replyTo: asText(payload.email),
  });

  if (error) {
    throw new Error(error.message);
  }

  return { configured: true };
}

function buildAutoReplyHtml(payload: Record<string, unknown>) {
  const name = escapeHtml(asText(payload.name));
  return 'Hi ' + name + ',<br><br>' +
    'Thank you for reaching out to Sky\'s the Limit Painting LLC! We are excited to help you transform your space.<br><br>' +
    'As a premier specialty contractor serving the entire Twin Cities metro area, we specialize in high-detail residential painting, commercial repaints, and pavement marking.<br><br>' +
    'To help our owner, Anthony, prepare a fast and accurate estimate for your project, could you please reply to this email with a few details:<br><br>' +
    '1. <strong>Project Location</strong>: What is the address or city of the property🧬<br>' +
    '2. <strong>Scope of Work</strong>: What surfaces or rooms are we painting🧬 (e.g., kitchen cabinets, living room walls, exterior siding)<br>' +
    '3. <strong>Project Photos</strong>: Please reply with a few photos of the areas to be painted (this helps us see trim details and surface conditions).<br>' +
    '4. <strong>Ideal Timeline</strong>: When would you like us to start🧬 (e.g., ASAP, next month, flexible)<br>' +
    '5. <strong>Property Age</strong>: Was the structure built before 1978🧬 (We are certified in lead-safe practices and must verify this for safety compliance).<br><br>' +
    'Once we receive these details, Anthony will review your scope and follow up to schedule a consultation or send your estimate.<br><br>' +
    'Thank you for choosing local,<br><br>' +
    'The Team<br>' +
    '<strong>Sky\'s the Limit Painting LLC</strong><br>' +
    'Phone: 651-410-4196<br>' +
    'Email: skysthelimitpainting1779@gmail.com<br>' +
    'Positioning: Residential detail. Commercial discipline. Public-sector ready.';
}

async function sendAutoReplyToLead(payload: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.LEAD_FROM_EMAIL || 'Sky Leads <onboarding@resend.dev>';

  if (!apiKey) {
    return { configured: false };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [asText(payload.email)],
      subject: 'We received your estimate request! — Sky\'s the Limit Painting',
      html: buildAutoReplyHtml(payload),
      reply_to: leadToEmail,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error('Resend lead auto-reply failed: ' + response.status + ' ' + body);
  }

  return { configured: true };
}

async function sendLeadWebhook(payload: Record<string, unknown>) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    return { configured: false };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.LEAD_WEBHOOK_SECRET ? { 'X-Sky-Lead-Secret': process.env.LEAD_WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify({
      event: 'sky.lead.created',
      lead: payload,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Lead webhook failed: ${response.status} ${body}`);
  }

  return { configured: true };
}

async function sendToHubspot(payload: Record<string, unknown>) {
  const portalId = '246259637';
  const formId = process.env.HUBSPOT_FORM_ID;

  if (!formId) {
    return { configured: false };
  }

  const fields = [
    { name: 'firstname', value: asText(payload.name) },
    { name: 'email', value: asText(payload.email) },
    { name: 'phone', value: asText(payload.phone) },
    { name: 'city', value: asText(payload.city) },
  ];

  if (payload.company) {
    fields.push({ name: 'company', value: asText(payload.company) });
  }

  const details = [
    `Market: ${asText(payload.market)}`,
    `Project Type: ${asText(payload.projectType)}`,
    `Property Type: ${asText(payload.propertyType)}`,
    `Timeline: ${asText(payload.timeline)}`,
    `Budget Range: ${asText(payload.budget)}`,
    `Preferred Contact: ${asText(payload.contactMethod)}`,
    payload.projectAddress ? `Project Address: ${asText(payload.projectAddress)}` : '',
    payload.photosUrl ? `Photos: ${asText(payload.photosUrl)}` : '',
    payload.notes ? `Notes:\n${asText(payload.notes)}` : '',
  ].filter(Boolean).join('\n');

  fields.push({ name: 'message', value: details });

  const context = {
    hutk: asText(payload.hubspotutk) || undefined,
    pageUri: asText(payload.page) || undefined,
    pageName: 'Request an Estimate - Sky\'s the Limit Painting',
  };

  const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields,
      context,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HubSpot Forms API failed: ${response.status} ${body}`);
  }

  return { configured: true };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = (req.headers?.['x-forwarded-for'] as string || req.headers?.['x-real-ip'] as string || 'unknown').split(',')[0].trim();
  if (!rateLimit(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  let payload: Record<string, unknown>;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON.' });
  }

  if (!isPayload(payload)) {
    return res.status(400).json({ error: 'Invalid lead payload.' });
  }

  const validationError = validate(payload);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const lead = {
    ...payload,
    leadId: buildLeadId(),
    submittedAt: new Date().toISOString(),
    userAgent: asText(req.headers?.['user-agent']),
    referrer: asText(req.headers?.referer || req.headers?.referrer),
  };

  // Save lead first to Supabase
  await saveLeadToDb(lead);

  try {
    const results = await Promise.allSettled([
      (async () => {
        try {
          const res = await sendWithResend(lead);
          await saveLeadEventToDb(lead.leadId, 'email_notify', 'resend', res.configured ? 'success' : 'skipped');
          return res;
        } catch (err) {
          await saveLeadEventToDb(lead.leadId, 'email_notify', 'resend', 'failed', err instanceof Error ? err.message : String(err));
          throw err;
        }
      })(),
      (async () => {
        try {
          const res = await sendAutoReplyToLead(lead);
          await saveLeadEventToDb(lead.leadId, 'email_autoreply', 'resend', res.configured ? 'success' : 'skipped');
          return res;
        } catch (err) {
          await saveLeadEventToDb(lead.leadId, 'email_autoreply', 'resend', 'failed', err instanceof Error ? err.message : String(err));
          throw err;
        }
      })(),
      (async () => {
        try {
          const res = await sendLeadWebhook(lead);
          await saveLeadEventToDb(lead.leadId, 'webhook', 'custom', res.configured ? 'success' : 'skipped');
          return res;
        } catch (err) {
          await saveLeadEventToDb(lead.leadId, 'webhook', 'custom', 'failed', err instanceof Error ? err.message : String(err));
          throw err;
        }
      })(),
      (async () => {
        try {
          const res = await sendToHubspot(lead);
          await saveLeadEventToDb(lead.leadId, 'crm', 'hubspot', res.configured ? 'success' : 'skipped');
          return res;
        } catch (err) {
          await saveLeadEventToDb(lead.leadId, 'crm', 'hubspot', 'failed', err instanceof Error ? err.message : String(err));
          throw err;
        }
      })()
    ]);

    const configured = results.some((result) => result.status === 'fulfilled' && (result.value as any).configured);
    const failed = results.find((result) => result.status === 'rejected');

    if (failed) {
      console.error('Lead delivery failure detail:', failed.reason);
    }

    if (!configured && failed) {
      throw failed.reason;
    }

    if (!configured) {
      console.error('Lead delivery error: Lead delivery is not configured yet.');
      return res.status(500).json({ error: 'Lead delivery is not configured yet.', fallback: 'email' });
    }
  } catch (error) {
    console.error('Lead delivery failed with error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Lead delivery failed.', fallback: 'email' });
  }

  return res.status(201).json({ ok: true, leadId: lead.leadId });
}
