const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Allowlisted origins (never `*`). Mirrors the CORS policy in vercel.json.
const ALLOWED_ORIGINS = [
  'https://www.skysthelimitpaintingllc.com',
  'https://skysthelimitpaintingllc.com',
  ...(process.env.EXTRA_CORS_ORIGINS
    ? process.env.EXTRA_CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : []),
];

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin / server-to-server calls (no Origin header).
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['POST', 'OPTIONS'],
  })
);

// Keep the raw body so we can verify HMAC signatures on webhooks.
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Liveness/readiness probe (used by Docker HEALTHCHECK + uptime monitors).
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.get('/', (_req, res) => {
  res.send('Agentic Backend Container running on Vercel Fluid');
});

// Timing-safe verification of an HMAC-SHA256 signature: "sha256=<hex>".
function verifySignature(req) {
  const secret = process.env.REMEDIATE_SECRET;
  if (!secret) return false;
  const provided = req.get('X-Signature') || '';
  const expected =
    'sha256=' +
    crypto.createHmac('sha256', secret).update(req.rawBody || Buffer.from('')).digest('hex');
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Rate limit the remediation endpoint (defense-in-depth on top of the HMAC
// check) so a leaked/guessed secret can't be used to flood the agent loop.
const remediateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many remediation requests, slow down.' },
});

// Self-healing webhook. Triggered by .github/workflows/self-healing.yml.
// Rejects unsigned/invalid requests; requires REMEDIATE_SECRET to be configured.
app.post('/api/agent/remediate', remediateLimiter, (req, res) => {
  if (!process.env.REMEDIATE_SECRET) {
    return res.status(503).json({ error: 'Remediation disabled: REMEDIATE_SECRET not set.' });
  }
  if (!verifySignature(req)) {
    return res.status(401).json({ error: 'Invalid or missing signature.' });
  }

  const { run_id: runId, branch } = req.body || {};
  if (!runId) {
    return res.status(400).json({ error: 'Missing run_id in payload.' });
  }

  console.log(`[Agent Loop] Accepted remediation for run ${runId} on ${branch}.`);

  // Async remediation (fetch logs -> analyze -> propose fix). Left as a stub;
  // production should route this to Vercel Agent's approved-actions flow.
  return res.status(202).json({
    status: 'accepted',
    message: `Agentic remediation started for run ${runId}.`,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Agentic backend listening on port ${port}`);
});
