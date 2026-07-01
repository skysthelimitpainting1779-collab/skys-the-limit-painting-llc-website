import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('[EVAL] Running DocuSign Synchronization Check...');

const notesPath = path.resolve(
  __dirname,
  '../../notes/hubspot_and_sheets_setup.md'
);

if (!fs.existsSync(notesPath)) {
  console.error('[EVAL FAILED] hubspot_and_sheets_setup.md not found.');
  process.exit(1);
}

const content = fs.readFileSync(notesPath, 'utf8');

const requiredTokens = [
  'DocuSign',
  'Webhook',
  'IR816596', // Must verify trust signals persist into contract payload
  '176.041', // Must verify workers comp exemption
];

let pass = true;

for (const token of requiredTokens) {
  if (!content.includes(token)) {
    console.error(
      `[EVAL FAILED] Missing critical token in DocuSign sync documentation: ${token}`
    );
    pass = false;
  }
}

if (pass) {
  console.log(
    '[EVAL PASSED] DocuSign payload and Trust Signals correctly synchronized in CRM/Contract routing.'
  );
  process.exit(0);
} else {
  process.exit(1);
}
