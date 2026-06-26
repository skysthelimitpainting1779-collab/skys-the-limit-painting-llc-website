import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Supabase integration is not configured on the server.' }, { status: 500 });
  }

  try {
    const { fileName } = await req.json();
    if (!fileName) {
      return NextResponse.json({ error: 'File name is required.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const bucketName = 'lead-photos';

    // Generate secure, signed upload URL
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(fileName);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Standard public URL structure in Supabase storage
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${fileName}`;

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      publicUrl
    });
  } catch (err) {
    console.error('Storage upload URL generation failed:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Storage upload URL generation failed.' }, { status: 500 });
  }
}
