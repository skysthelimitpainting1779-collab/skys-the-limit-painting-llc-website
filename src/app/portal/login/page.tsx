'use client';

import { useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { buildPortalOAuthOptions, type OAuthProvider } from '@/lib/auth/portal';

function LoginInner() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/portal';
  const errorParam = searchParams.get('error');
  const [busy, setBusy] = useState<OAuthProvider | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const errorMessage = useMemo(() => {
    if (localError) return localError;
    if (errorParam === 'oauth_callback_failed') {
      return 'Sign-in did not complete. Try again or contact support.';
    }
    if (errorParam === 'auth_not_configured') {
      return 'Authentication is not configured on this environment.';
    }
    return null;
  }, [errorParam, localError]);

  async function startOAuth(provider: OAuthProvider) {
    setLocalError(null);
    setBusy(provider);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { provider: p, options } = buildPortalOAuthOptions(origin, provider, next);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: p,
        options,
      });
      if (error) {
        setLocalError(error.message);
        setBusy(null);
      }
      // On success the browser navigates to the IdP.
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Sign-in failed');
      setBusy(null);
    }
  }

  return (
    <main className="min-h-[70vh] bg-[#050505] text-white px-6 py-24">
      <div className="max-w-md mx-auto border border-white/10 bg-[#0B0B0D] p-8 rounded-none">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Client portal</p>
        <h1 className="text-3xl font-display font-black mb-3">Sign in</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Use the same email you put on your estimate request to see status updates.
          OAuth is powered by Supabase Auth (Google or GitHub).
        </p>

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 border border-red-500/40 bg-red-500/10 text-red-100 text-sm px-4 py-3"
          >
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => startOAuth('google')}
            className="w-full bg-white text-[#050505] font-bold py-3 px-4 rounded-none hover:bg-gray-200 transition disabled:opacity-60"
          >
            {busy === 'google' ? 'Redirecting…' : 'Continue with Google'}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => startOAuth('github')}
            className="w-full border border-white/20 text-white font-bold py-3 px-4 rounded-none hover:bg-white/5 transition disabled:opacity-60"
          >
            {busy === 'github' ? 'Redirecting…' : 'Continue with GitHub'}
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-500 leading-relaxed">
          Configure the provider in the Supabase dashboard (Authentication → Providers)
          and allow-list redirect URL{' '}
          <code className="text-gray-300">/auth/callback</code>. Setup notes:{' '}
          <code className="text-gray-300">docs/DIRECTUS_AND_PORTAL.md</code> (repo).
        </p>

        <p className="mt-6 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white">
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[50vh] bg-[#050505] text-white flex items-center justify-center">
          Loading…
        </main>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
