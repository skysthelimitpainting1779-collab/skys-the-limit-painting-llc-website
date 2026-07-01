'use client';

import { useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { isEnabled } from '../lib/flags';

// Cal.com booking embed for estimate scheduling. Free-tier friendly: uses a
// plain iframe (no SDK, no external <script>), gated behind an env var so the
// site never renders a broken widget when the link isn't configured.
//
// Set NEXT_PUBLIC_CALCOM_LINK to your Cal.com path, e.g. "skys-the-limit/estimate".
const CAL_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK?.trim() || undefined;

export default function CalBooking() {
  const enabled = isEnabled('calBooking');

  useEffect(() => {
    if (enabled && CAL_LINK) {
      trackEvent('cal_booking_view', { link: CAL_LINK });
    }
  }, [enabled]);

  // Render nothing until the booking link is actually configured, so the
  // estimate page never ships an unfinished "coming soon" CTA in production.
  if (!enabled || !CAL_LINK) return null;

  return (
    <section className="relative bg-[#050505] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-[#FF5A00]">
            <Calendar size={18} />
            <span className="text-xs font-black uppercase tracking-widest">
              Book Your Walkthrough
            </span>
          </div>
          <h2 className="font-display text-3xl font-black leading-none text-white sm:text-4xl">
            Schedule an Owner-Led Estimate
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-base text-[#c9c1b4]">
            Pick a time that works for you. You&apos;ll get a confirmed,
            owner-led site walkthrough — no call center, no runaround.
          </p>
        </div>

        <div className="overflow-hidden border border-white/10 bg-[#0B0B0D]">
          <iframe
            title="Schedule an estimate with Sky's the Limit Painting"
            src={`https://cal.com/${CAL_LINK}?embed=true&theme=dark&layout=month_view`}
            className="h-[720px] w-full"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </section>
  );
}
