import { z } from 'zod';

const AppEnvironmentSchema = z.enum(['development', 'preview', 'production']);

/**
 * Pure deployment/CI parser for the high-privilege Convex deployment key.
 * Request-time application code must not import this boundary.
 */
export const DeploymentEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: AppEnvironmentSchema,
  CONVEX_DEPLOY_KEY: z.string().trim().min(1),
}).strict().superRefine((env, context) => {
  const convexPrefix = {
    development: 'dev:',
    preview: 'preview:',
    production: 'prod:',
  }[env.NEXT_PUBLIC_APP_ENV];

  if (!env.CONVEX_DEPLOY_KEY.startsWith(convexPrefix)) {
    context.addIssue({
      code: 'custom',
      path: ['CONVEX_DEPLOY_KEY'],
      message: `${env.NEXT_PUBLIC_APP_ENV} requires a Convex deployment key starting with ${convexPrefix}.`,
    });
  }
});

export type DeploymentEnv = z.infer<typeof DeploymentEnvSchema>;

export function parseDeploymentEnv(input: unknown): DeploymentEnv {
  return DeploymentEnvSchema.parse(input);
}
