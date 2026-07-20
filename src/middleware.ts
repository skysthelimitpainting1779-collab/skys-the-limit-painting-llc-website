/**
 * Next.js 16 transition shim.
 * The canonical implementation lives in src/proxy.ts (new "proxy" convention).
 * This file satisfies the old "middleware" convention during the upgrade window.
 * TODO: Delete once Next.js drops the middleware convention entirely.
 */
export { proxy as middleware, config } from './proxy';
