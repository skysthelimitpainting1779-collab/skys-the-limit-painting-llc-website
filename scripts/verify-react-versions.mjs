#!/usr/bin/env node
/**
 * Codified prevention for ERR-20260629-004 (React / react-dom version mismatch)
 *
 * Run as part of lint / preflight.
 * Fails the build on any version skew.
 */

import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const react = pkg.dependencies?.react || pkg.devDependencies?.react;
const reactDom =
  pkg.dependencies?.['react-dom'] || pkg.devDependencies?.['react-dom'];

if (!react || !reactDom) {
  console.error(
    '[verify-react-versions] Could not find react / react-dom in package.json'
  );
  process.exit(1);
}

// Strip ^ ~ etc for comparison
const normalize = (v) => v.replace(/^[~^]/, '');

if (normalize(react) !== normalize(reactDom)) {
  console.error(`
[ERR-20260629-004] React version mismatch detected!

react:     ${react}
react-dom: ${reactDom}

This causes blank screens, hydration failures, and "Incompatible React versions" errors (seen in multiple Gemini brain sessions).

# CORRECT
"dependencies": {
  "react": "19.2.7",
  "react-dom": "19.2.7"
}

# WRONG
"react": "19.2.7",
"react-dom": "19.2.6"
`);

  process.exit(1);
}

console.log(
  '[verify-react-versions] OK — react and react-dom are pinned to identical versions'
);
process.exit(0);
