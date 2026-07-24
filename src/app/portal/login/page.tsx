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
  const [busy, setBusy] = useState<OAuthProvider | 'magic' | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);

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
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Sign-in failed');
      setBusy(null);
    }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLocalError(null);
    setBusy('magic');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}${next}` },
      });
      if (error) {
        setLocalError(error.message);
      } else {
        setMagicSent(true);
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to send link');
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="min-h-[70vh] bg-[#050505] text-white px-6 py-24">
      <div className="max-w-md mx-auto border border-white/10 bg-[#0B0B0D] p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#FF5A00] mb-3">Client portal</p>
        <h1 className="text-3xl font-black mb-3">Sign in</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Use the same email from your estimate request to see project status, upload photos, and download documents.
        </p>

        {errorMessage && (
          <div role="alert" className="mb-6 border border-red-500/40 bg-red-500/10 text-red-100 text-sm px-4 py-3">
            {errorMessage}
          </div>
        )}

        {magicSent ? (
          <div className="border border-[#2E7D32]/40 bg-[#2E7D32]/10 text-green-100 text-sm px-4 py-4 mb-6">
            <p className="font-bold mb-1">Check your inbox</p>
            <p className="text-green-200/80">We sent a sign-in link to <strong>{email}</strong>. Click it to access your portal.</p>
          </div>
        ) : (
          <>
            {/* Magic link form */}
            <form onSubmit={sendMagicLink} className="mb-6">
              <label htmlFor="portal-email" className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                Email address
              </label>
              <input
                id="portal-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#FF5A00] transition-colors"
              />
              <button
                type="submit"
                disabled={busy !== null || !email.trim()}
                className="mt-3 w-full bg-[#FF5A00] font-black uppercase tracking-[0.08em] py-3.5 px-4 text-white transition-colors hover:bg-[#E94F00] disabled:opacity-50"
              >
                {busy === 'magic' ? 'Sending link...' : 'Email Me a Sign-In Link'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* OAuth buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => startOAuth('google')}
                className="w-full bg-white text-[#050505] font-bold py-3 px-4 hover:bg-gray-200 transition disabled:opacity-60"
              >
                {busy === 'google' ? 'Redirecting...' : 'Continue with Google'}
              </button>
            </div>
          </>
        )}

        <p className="mt-8 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            &larr; Back to site
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
          Loading...
        </main>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
