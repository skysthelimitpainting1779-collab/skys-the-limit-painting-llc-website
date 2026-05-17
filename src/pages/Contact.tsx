import { Mail, MapPin, MessageSquareText, Phone } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';
import LeadForm from '../components/LeadForm';
import BookingCta from '../components/BookingCta';
import { businessEmail, businessPhone, smsPhone } from '../lib/contact';
import { breadcrumbSchema } from '../lib/seo';
import { trackEvent } from '../lib/analytics';

export default function ContactPage() {
  return (
    <PageTransition>
      <PageMeta
        title="Contact Sky's the Limit Painting LLC | Free Estimates"
        description="Request an estimate from Sky’s the Limit Painting LLC for residential painting, commercial painting, facility repainting, public-sector opportunities, or pavement marking in Minnesota."
        path="/contact"
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />

      <section className="relative overflow-hidden bg-[#070706] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="blueprint-grid absolute inset-0 opacity-20"></div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          <FadeIn className="lg:col-span-7">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f0c067]">Contact</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] text-white md:text-7xl">
              Start with a clear scope.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#d8d0c2]">
              Send the project details Anthony needs to understand the surface, schedule, location, and next step. For the fastest response, call or text directly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={`tel:${businessPhone}`} onClick={() => trackEvent('call_click', { source: 'contact_hero' })} className="inline-flex items-center justify-center gap-2 bg-[#f0c067] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#15110a] transition-colors hover:bg-white">
                <Phone size={18} />
                Call Anthony
              </a>
              <a href={`sms:${smsPhone}`} onClick={() => trackEvent('text_click', { source: 'contact_hero' })} className="inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/30 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:border-[#f0c067] hover:text-[#f0c067]">
                <MessageSquareText size={18} />
                Text Anthony
              </a>
              <BookingCta />
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-5">
            <div className="border border-[#d8c7aa]/15 bg-[#11100d] p-6">
              <div className="space-y-6">
                <a href={`tel:${businessPhone}`} onClick={() => trackEvent('call_click', { source: 'contact_panel' })} className="flex items-center gap-4 text-lg font-black text-white transition-colors hover:text-[#f0c067]">
                  <span className="grid h-12 w-12 place-items-center border border-white/10 bg-white/5"><Phone size={21} /></span>
                  {businessPhone}
                </a>
                <a href={`mailto:${businessEmail}`} onClick={() => trackEvent('lead_mailto_fallback_opened', { source: 'contact_panel' })} className="flex items-center gap-4 break-all text-base font-bold text-[#d8d0c2] transition-colors hover:text-[#f0c067]">
                  <span className="grid h-12 w-12 shrink-0 place-items-center border border-white/10 bg-white/5"><Mail size={21} /></span>
                  {businessEmail}
                </a>
                <div className="flex items-center gap-4 text-base font-bold text-[#d8d0c2]">
                  <span className="grid h-12 w-12 place-items-center border border-white/10 bg-white/5"><MapPin size={21} /></span>
                  Inver Grove Heights / Twin Cities Metro
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-[#e6dfd2] px-4 py-20 text-[#171512] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
          <FadeIn className="lg:col-span-4">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8b4d20]">Estimate request</p>
            <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">Residential, commercial, and public-sector inquiry paths in one form.</h2>
            <p className="mt-5 text-base leading-relaxed text-[#4c453d]">
              The form captures UTM/source data and routes through a Vercel endpoint when email delivery is configured. Without email credentials, it opens a prepared email draft.
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-8">
            <div className="border border-[#171512]/15 bg-[#f5f0e7] p-5 md:p-8">
              <LeadForm source="Contact page lead form" compact />
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
