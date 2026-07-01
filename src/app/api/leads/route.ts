import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;


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
// (Refactored to use high-performance pooled HTTP connections via supabase-js client)

interface LeadPayload extends Record<string, unknown> {
  leadId: string;
  source?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  city?: unknown;
  projectAddress?: unknown;
  project_address?: unknown;
  market?: unknown;
  projectType?: unknown;
  project_type?: unknown;
  propertyType?: unknown;
  property_type?: unknown;
  timeline?: unknown;
  budget?: unknown;
  contactMethod?: unknown;
  contact_method?: unknown;
  notes?: unknown;
  utm_source?: unknown;
  utmSource?: unknown;
  utm_medium?: unknown;
  utmMedium?: unknown;
  utm_campaign?: unknown;
  utmCampaign?: unknown;
  page?: unknown;
  photosUrl?: unknown;
  photos_url?: unknown;
}

async function saveLeadToDb(lead: LeadPayload) {
  if (!supabase) {
    console.warn("Supabase client not initialized. Skipping database insertion.");
    return;
  }
  const { error } = await supabase.from('leads').insert({
    lead_id: lead.leadId,
    source: asText(lead.source) || 'website',
    name: asText(lead.name),
    phone: asText(lead.phone),
    email: asText(lead.email),
    city: asText(lead.city),
    project_address: asText(lead.projectAddress || lead.project_address),
    market: asText(lead.market),
    project_type: asText(lead.projectType || lead.project_type),
    property_type: asText(lead.propertyType || lead.property_type),
    timeline: asText(lead.timeline),
    budget: asText(lead.budget),
    contact_method: asText(lead.contactMethod || lead.contact_method),
    notes: asText(lead.notes),
    utm_source: asText(lead.utm_source || lead.utmSource),
    utm_medium: asText(lead.utm_medium || lead.utmMedium),
    utm_campaign: asText(lead.utm_campaign || lead.utmCampaign),
    page: asText(lead.page),
    status: 'new',
    photos_url: asText(lead.photosUrl || lead.photos_url)
  });

  if (error) {
    console.error("Failed to store lead in Supabase:", error);
  } else {
    console.log(`Lead stored in Supabase: ${lead.leadId}`);
  }
}

async function saveLeadEventToDb(leadId: string, eventType: string, provider: string, status: string, message?: string) {
  if (!supabase) {
    console.warn("Supabase client not initialized. Skipping lead event insertion.");
    return;
  }
  const { error } = await supabase.from('lead_events').insert({
    lead_id: leadId,
    event_type: eventType,
    provider: provider,
    status: status,
    message: message || null
  });

  if (error) {
    console.error(`Failed to store lead event in Supabase for lead ${leadId}:`, error);
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
    console.warn("WARNING: RESEND_API_KEY is not set in the environment variables. Lead emails will not be sent!");
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
    '1. <strong>Project Location</strong>: What is the address or city of the property?<br>' +
    '2. <strong>Scope of Work</strong>: What surfaces or rooms are we painting? (e.g., kitchen cabinets, living room walls, exterior siding)<br>' +
    '3. <strong>Project Photos</strong>: Please reply with a few photos of the areas to be painted (this helps us see trim details and surface conditions).<br>' +
    '4. <strong>Ideal Timeline</strong>: When would you like us to start? (e.g., ASAP, next month, flexible)<br>' +
    '5. <strong>Property Age</strong>: Was the structure built before 1978? (We are certified in lead-safe practices and must verify this for safety compliance).<br><br>' +
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
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;
  const formId = process.env.HUBSPOT_FORM_ID;
  const portalId = '246259637';

  if (!formId) {
    if (!accessToken) {
      return { configured: false };
    }
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

  if (accessToken) {
    const email = asText(payload.email);
    let contactId = '';

    // Search for existing contact by email to prevent duplicates
    if (email) {
      try {
        const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filterGroups: [{
              filters: [{
                propertyName: 'email',
                operator: 'EQ',
                value: email,
              }],
            }],
          }),
        });

        if (searchRes.ok) {
          const searchData = (await searchRes.json()) as { results?: { id: string }[] };
          if (searchData.results && searchData.results.length > 0) {
            contactId = searchData.results[0].id;
          }
        }
      } catch (err) {
        console.error('HubSpot contact search failed:', err);
      }
    }

    const nameParts = asText(payload.name).split(' ');
    const firstname = nameParts[0] || '';
    const lastname = nameParts.slice(1).join(' ') || '';

    const properties = {
      firstname,
      lastname,
      email,
      phone: asText(payload.phone),
      city: asText(payload.city),
      message: details,
    };

    let response;
    if (contactId) {
      // Update existing contact
      response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
    } else {
      // Create new contact
      response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HubSpot CRM API failed: ${response.status} ${body}`);
    }

    return { configured: true };
  } else {
    // Fallback to legacy HubSpot forms API to support formId configurations and E2E tests
    const fields = [
      { name: 'firstname', value: asText(payload.name) },
      { name: 'email', value: asText(payload.email) },
      { name: 'phone', value: asText(payload.phone) },
      { name: 'city', value: asText(payload.city) },
    ];

    if (payload.company) {
      fields.push({ name: 'company', value: asText(payload.company) });
    }

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
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown').split(',')[0].trim();
  if (!rateLimit(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  if (!isPayload(payload)) {
    return NextResponse.json({ error: 'Invalid lead payload.' }, { status: 400 });
  }

  const validationError = validate(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const lead = {
    ...payload,
    leadId: buildLeadId(),
    submittedAt: new Date().toISOString(),
    userAgent: asText(req.headers.get('user-agent')),
    referrer: asText(req.headers.get('referer') || req.headers.get('referrer')),
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

    const configured = results.some((result) => result.status === 'fulfilled' && (result.value as { configured: boolean }).configured);
    const failed = results.find((result) => result.status === 'rejected');

    if (failed) {
      console.error('Lead delivery failure detail:', failed.reason);
    }

    if (!configured && failed) {
      throw failed.reason;
    }

    if (!configured) {
      console.error('Lead delivery error: Lead delivery is not configured yet.');
      // res.status(500).json({ error: 'Lead delivery is not configured yet.', fallback: 'email' })
      return NextResponse.json({ error: 'Lead delivery is not configured yet.', fallback: 'email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Lead delivery failed with error:', error);
    // res.status(500).json({ error: 'Lead delivery failed.', fallback: 'email' })
    return NextResponse.json({ error: 'Lead delivery failed. Please email us directly at skysthelimitpainting1779@gmail.com', fallback: 'email' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, leadId: lead.leadId }, { status: 201 });
}
