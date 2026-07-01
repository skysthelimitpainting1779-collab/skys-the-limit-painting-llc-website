import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SITE_URL = process.env.SITE_URL || 'https://www.skysthelimitpaintingllc.com';

async function fetchCheck(url: string) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    return { url, status: response.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed';
    return { url, error: message };
  }
}

export async function GET(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const secured = Boolean(cronSecret);

    if (secured) {
      const authorization = request.headers.get('authorization');
      if (authorization !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const checks = await Promise.all([
      fetchCheck(`${SITE_URL}/sitemap.xml`),
      fetchCheck(`${SITE_URL}/`),
    ]);

    return NextResponse.json({
      ok: true,
      ranAt: new Date().toISOString(),
      secured,
      checks,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cron route error';
    console.error('[/api/cron/seo-ping GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
