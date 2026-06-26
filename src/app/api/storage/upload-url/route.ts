import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];
const MAX_FILENAME_LENGTH = 128;

const ipCache = new Map<string, { count: number; lastReset: number }>();
const LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const state = ipCache.get(ip);
  if (!state) {
    ipCache.set(ip, { count: 1, lastReset: now });
    return true;
  }
  if (now - state.lastReset > LIMIT_WINDOW_MS) {
    ipCache.set(ip, { count: 1, lastReset: now });
    return true;
  }
  if (state.count >= MAX_REQUESTS) {
    return false;
  }
  state.count += 1;
  return true;
}

function sanitizeFileName(raw: string): string | null {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > MAX_FILENAME_LENGTH) {
    return null;
  }
  const basename = path.basename(raw);
  if (basename !== raw || basename.startsWith('.')) {
    return null;
  }
  const ext = path.extname(basename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return null;
  }
  if (/[^a-zA-Z0-9._\-]/.test(basename)) {
    return null;
  }
  return basename;
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown').split(',')[0].trim();
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Storage is not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const fileName = sanitizeFileName(body?.fileName);
    if (!fileName) {
      return NextResponse.json({ error: 'Invalid file name. Use alphanumeric characters with a supported image extension (.jpg, .jpeg, .png, .webp, .heic).' }, { status: 400 });
    }

    const uniqueName = `${Date.now()}-${fileName}`;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const bucketName = 'lead-photos';

    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(uniqueName);

    if (error) {
      return NextResponse.json({ error: 'Failed to generate upload URL.' }, { status: 500 });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${uniqueName}`;

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      publicUrl
    });
  } catch {
    return NextResponse.json({ error: 'Storage upload URL generation failed.' }, { status: 500 });
  }
}
