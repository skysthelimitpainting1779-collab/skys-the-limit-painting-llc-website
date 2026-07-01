const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.send('Agentic Backend Container running on Vercel Fluid 👋');
});

// Self-Healing Webhook Endpoint
// Triggered by GitHub Actions (.github/workflows/self-healing.yml)
app.post('/api/agent/remediate', async (req, res) => {
  console.log('Received remediation webhook payload:', req.body);

  const { run_id, branch, failure_reason } = req.body;

  if (!run_id) {
    return res.status(400).json({ error: 'Missing run_id in payload.' });
  }

  // MOCK LOGIC for Agentic Remediation loop:
  // 1. Fetch build logs using GitHub API and run_id
  // 2. Parse logs with AI SDK / Claude
  // 3. Generate patch
  // 4. Commit to branch or open PR

  console.log(
    `[Agent Loop] Initiating self-healing protocol for run: ${run_id}`
  );

  return res.status(202).json({
    status: 'accepted',
    message: `Agentic remediation started for run ${run_id}.`,
    details:
      'This container will continue processing the heavy LLM tasks asynchronously.',
  });
});

// The Vercel Fluid compute layer automatically assigns a PORT environment variable
const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Agentic backend listening on port ${port}`);
});
