import { CalendarClock, Phone } from 'lucide-react';
import { businessPhone } from '../lib/contact';

interface BookingCtaProps {
  audience?: 'homeowner' | 'commercial' | 'public-sector';
  className?: string;
}

const bookingLabels = {
  homeowner: 'Schedule a Project Walkthrough',
  commercial: 'Schedule a Project Review',
  'public-sector': 'Request a Capability Conversation',
};

import { ENV } from '../lib/env';

export default function BookingCta({ audience = 'homeowner', className = '' }: BookingCtaProps) {
  const bookingUrl = ENV.BOOKING_URL || '';
  const label = audience === 'commercial' 
    ? bookingLabels.commercial 
    : audience === 'public-sector' 
    ? bookingLabels['public-sector'] 
    : bookingLabels.homeowner;

  if (bookingUrl) {
    return (
      <a
        href={bookingUrl}
        target="_blank"
        rel="noreferrer"
        data-track="booking_click"
        data-track-payload={JSON.stringify({ audience })}
        className={`inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/30 bg-white/5 px-6 py-4 text-sm font-black text-white transition-colors hover:border-white hover:text-white ${className}`}
      >
        <CalendarClock size={18} />
        {label}
      </a>
    );
  }

  return (
    <a
      href={`tel:${businessPhone}`}
      data-track="booking_click"
      data-track-payload={JSON.stringify({ audience, fallback: 'phone' })}
      className={`inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/30 bg-white/5 px-6 py-4 text-sm font-black text-white transition-colors hover:border-white hover:text-white ${className}`}
    >
      <Phone size={18} />
      Call To Schedule
    </a>
  );
}
