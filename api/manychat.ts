if (!process.env.RESEND_API_KEY) {
  console.warn("WARNING: RESEND_API_KEY is not set in the environment variables. ManyChat lead emails will not be sent!");
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

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildLeadId(): string {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SKY-MC-${stamp}-${random}`;
}

function buildLeadHtml(payload: Record<string, unknown>): string {
  const rows = Object.entries(payload)
    .filter(([key, value]) => key !== 'website' && asText(value).length > 0)
    .map(([key, value]) => '<tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:700;">' + escapeHtml(key) + '</td><td style="padding:6px 10px;border:1px solid #ddd;">' + escapeHtml(value) + '</td></tr>')
    .join('');

  return '<h1>New Sky\'s the Limit Painting ManyChat Lead</h1><table style="border-collapse:collapse;">' + rows + '</table>';
}

async function sendWithResend(payload: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.LEAD_FROM_EMAIL || 'Sky Leads <onboarding@resend.dev>';

  if (!apiKey) {
    return { configured: false };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [leadToEmail],
      cc: process.env.LEAD_CC_EMAIL ? [process.env.LEAD_CC_EMAIL] : undefined,
      subject: `New ManyChat Lead - ${asText(payload.name)} - ${asText(payload.leadId)}`,
      html: buildLeadHtml(payload),
      reply_to: asText(payload.email),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed: ${response.status} ${body}`);
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
      event: 'sky.manychat.lead.created',
      lead: payload,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Zapier webhook failed: ${response.status} ${body}`);
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

  const details = [
    `Market: ${asText(payload.market)}`,
    `Project Type: ${asText(payload.projectType)}`,
    `Property Type: ${asText(payload.propertyType)}`,
    `Timeline: ${asText(payload.timeline)}`,
    `Budget Range: ${asText(payload.budget)}`,
    `Preferred Contact: ${asText(payload.contactMethod)}`,
    payload.projectAddress ? `Project Address: ${asText(payload.projectAddress)}` : '',
    payload.notes ? `Notes:\n${asText(payload.notes)}` : '',
  ].filter(Boolean).join('\n');

  fields.push({ name: 'message', value: details });

  const context = {
    pageUri: 'https://www.facebook.com/1049772024897008',
    pageName: 'ManyChat Facebook Chatbot Integration',
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
    console.warn(`ManyChat rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  let body: any;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON.' });
  }

  // Parse and extract custom fields sent by ManyChat webhook
  const customFields = body.custom_fields || {};
  
  const name = asText(body.name || `${body.first_name || ''} ${body.last_name || ''}`.trim()) || 'ManyChat Lead';
  const phone = asText(body.phone || customFields.phone || customFields.Phone || '');
  const email = asText(body.email || customFields.email || customFields.Email || '');
  const city = asText(customFields.City || customFields.city || body.city || 'Twin Cities');
  const projectAddress = asText(customFields["Project Address"] || customFields.address || customFields.Address || '');
  const projectType = asText(customFields["Project Type"] || customFields.project_type || 'Interior');
  const propertyType = asText(customFields["Property Type"] || customFields.property_type || 'Single-family home');
  const timeline = asText(customFields.Timeline || customFields.timeline || 'ASAP');
  const budget = asText(customFields.Budget || customFields.budget || 'Not sure yet');
  const contactMethod = asText(customFields["Preferred Contact"] || customFields.contact_method || 'Text');
  const notes = asText(customFields.Notes || customFields.notes || 'Submitted via ManyChat FB/IG Chatbot');

  const lead = {
    source: 'ManyChat',
    name,
    phone,
    email,
    city,
    projectAddress,
    market: 'Residential',
    projectType,
    propertyType,
    timeline,
    budget,
    contactMethod,
    notes,
    leadId: buildLeadId(),
    submittedAt: new Date().toISOString(),
  };

  if (!lead.phone && !lead.email) {
    return res.status(400).json({ error: 'ManyChat lead must have either a phone number or email address.' });
  }

  try {
    const delivery = await Promise.allSettled([
      sendWithResend(lead),
      sendLeadWebhook(lead),
      sendToHubspot(lead),
    ]);
    const configured = delivery.some((result) => result.status === 'fulfilled' && result.value.configured);
    const failed = delivery.find((result) => result.status === 'rejected');

    if (failed) {
      console.error('ManyChat lead delivery failure detail:', failed.reason);
    }

    if (!configured && failed) {
      throw failed.reason;
    }

    if (!configured) {
      console.error('ManyChat lead delivery error: Lead delivery is not configured yet.');
      return res.status(500).json({ error: 'Lead delivery platforms not configured in .env', fallback: 'email' });
    }
  } catch (error: any) {
    console.error('ManyChat lead delivery failed with error:', error);
    return res.status(500).json({ error: error.message || 'ManyChat lead delivery failed.', fallback: 'email' });
  }

  return res.status(201).json({ ok: true, leadId: lead.leadId });
}
