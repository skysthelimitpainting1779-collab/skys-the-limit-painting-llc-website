'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route-level Error caught:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center bg-[#050505] p-8 text-[#FF5A00]">
      <div className="mx-auto max-w-md space-y-4 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-widest">
          Module Fault
        </h2>
        <p className="text-sm opacity-80">
          We encountered an unexpected error loading this section.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 border border-[#FF5A00] px-6 py-2 uppercase tracking-widest transition-colors hover:bg-[#FF5A00] hover:text-[#050505]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
