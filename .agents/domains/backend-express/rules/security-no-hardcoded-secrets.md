---
title: No Hardcoded Secrets
impact: CRITICAL
impactDescription: Critical security breach — credentials exposed in version control
tags: security, secrets, environment-variables
---

## No Hardcoded Secrets

Secrets hardcoded in source are committed to Git and exposed to anyone with repo access. Use environment variables exclusively.

**Incorrect:**

```javascript
const resend = new Resend('re_abc123_liveProductionKey');
const supabase = createClient('https://xyz.supabase.co', 'eyJhbGci...');
```

**Correct:**

```javascript
const resend = new Resend(process.env.RESEND_API_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

Reference: [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
