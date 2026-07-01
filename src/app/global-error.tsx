'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex h-screen w-screen flex-col items-center justify-center bg-[#050505] text-[#FF5A00]">
        <div className="mx-auto max-w-md space-y-4 text-center">
          <h2 className="text-3xl font-bold uppercase tracking-widest">
            System Fault
          </h2>
          <p className="text-sm opacity-80">
            A critical error occurred at the root level.
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 border border-[#FF5A00] px-6 py-2 uppercase tracking-widest transition-colors hover:bg-[#FF5A00] hover:text-[#050505]"
          >
            Reboot System
          </button>
        </div>
      </body>
    </html>
  );
}
