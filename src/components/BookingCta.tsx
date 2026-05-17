import { CalendarClock, Phone } from 'lucide-react';
import { businessPhone } from '../lib/contact';
import { trackEvent } from '../lib/analytics';

interface BookingCtaProps {
  audience?: 'homeowner' | 'commercial' | 'public-sector';
  className?: string;
}

const bookingLabels = {
  homeowner: 'Schedule a Project Walkthrough',
  commercial: 'Schedule a Project Review',
  'public-sector': 'Request a Capability Conversation',
};

export default function BookingCta({ audience = 'homeowner', className = '' }: BookingCtaProps) {
  const bookingUrl = import.meta.env.VITE_BOOKING_URL || '';
  const label = bookingLabels[audience];

  if (bookingUrl) {
    return (
      <a
        href={bookingUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackEvent('booking_click', { audience })}
        className={`inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/30 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:border-[#f0c067] hover:text-[#f0c067] ${className}`}
      >
        <CalendarClock size={18} />
        {label}
      </a>
    );
  }

  return (
    <a
      href={`tel:${businessPhone}`}
      onClick={() => trackEvent('booking_click', { audience, fallback: 'phone' })}
      className={`inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/30 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:border-[#f0c067] hover:text-[#f0c067] ${className}`}
    >
      <Phone size={18} />
      Call To Schedule
    </a>
  );
}

