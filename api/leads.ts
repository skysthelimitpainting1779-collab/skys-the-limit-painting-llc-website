const leadToEmail = process.env.LEAD_TO_EMAIL || 'skysthelimitpainting1779@gmail.com';

const requiredFields = ['name', 'phone', 'email', 'city', 'market', 'projectType', 'timeline', 'contactMethod', 'notes'];

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value: unknown) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function validate(payload: Record<string, unknown>) {
  const missing = requiredFields.filter((field) => !asText(payload[field]));
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(asText(payload.email))) {
    return 'Enter a valid email address.';
  }

  if (asText(payload.website)) {
    return 'Spam check failed.';
  }

  return '';
}

function buildLeadHtml(payload: Record<string, unknown>) {
  const rows = Object.entries(payload)
    .filter(([key, value]) => key !== 'website' && asText(value).length > 0)
    .map(([key, value]) => `<tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:700;">${escapeHtml(key)}</td><td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(value)}</td></tr>`)
    .join('');

  return `<h1>New Sky's the Limit Painting lead</h1><table style="border-collapse:collapse;">${rows}</table>`;
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
      subject: `New ${asText(payload.market)} lead - ${asText(payload.name)}`,
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let payload: Record<string, unknown>;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON.' });
  }

  const validationError = validate(payload);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await sendWithResend(payload);
    if (!result.configured) {
      return res.status(501).json({ error: 'Email delivery is not configured yet.', fallback: 'email' });
    }
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Lead delivery failed.' });
  }

  return res.status(200).json({ ok: true });
}
