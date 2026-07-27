import { parseDeploymentEnv } from '../src/lib/env/deployment-schema.ts';

try {
  parseDeploymentEnv({
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    CONVEX_DEPLOY_KEY: process.env.CONVEX_DEPLOY_KEY,
  });
  process.stdout.write('Convex deployment environment validated.\n');
} catch {
  process.stderr.write('Convex deployment environment validation failed.\n');
  process.exitCode = 1;
}
