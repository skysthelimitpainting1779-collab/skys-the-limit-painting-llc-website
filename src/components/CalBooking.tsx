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
const CAL_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK;

export default function CalBooking() {
  const enabled = isEnabled('calBooking');

  useEffect(() => {
    if (enabled && CAL_LINK) {
      trackEvent('cal_booking_view', { link: CAL_LINK });
    }
  }, [enabled]);

  if (!enabled) return null;

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

        {CAL_LINK ? (
          <div className="overflow-hidden border border-white/10 bg-[#0B0B0D]">
            <iframe
              title="Schedule an estimate with Sky's the Limit Painting"
              src={`https://cal.com/${CAL_LINK}?embed=true&theme=dark&layout=month_view`}
              className="h-[720px] w-full"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="border border-white/10 bg-[#0B0B0D] p-8 text-center">
            <p className="text-sm text-[#c9c1b4]">
              Online scheduling is being set up. In the meantime, request your
              estimate below or call the owner directly.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/contact"
                onClick={() => trackEvent('cal_booking_fallback_contact')}
                className="bg-[#FF5A00] px-6 py-3 text-xs font-black uppercase tracking-widest text-[#050505] transition hover:opacity-90"
              >
                Request Estimate
              </a>
              <a
                href="tel:+16514104196"
                onClick={() => trackEvent('cal_booking_fallback_call')}
                className="border border-white/20 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:border-white"
              >
                Call the Owner
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
