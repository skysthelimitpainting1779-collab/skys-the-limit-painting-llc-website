import { Link } from 'react-router-dom';
import { Calculator, Mail, MapPin, MessageSquareText, Phone } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';
import LeadForm from '../components/LeadForm';
import BookingCta from '../components/BookingCta';
import ResponsiveImage from '../components/ResponsiveImage';
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
      <section className="relative overflow-hidden bg-[#050505] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <ResponsiveImage
          src="/images/site/marketing-hero-exterior-painting.png"
          alt="Premium painting service contact background"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/94 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        <div className="blueprint-grid absolute inset-0 opacity-12"></div>
        <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-70"></div>
        
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          <FadeIn className="lg:col-span-7">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f0c067]">Contact</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] text-white md:text-7xl uppercase">
              Start with a clear scope.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#d8d0c2]">
              Send the project details Anthony needs to understand the surface, schedule, location, and next step. For the fastest response, call or text directly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/estimate" onClick={() => trackEvent('hero_cta_click', { source: 'contact_hero', label: 'Price Range' })} className="inline-flex items-center justify-center gap-2 bg-[#f0c067] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#050505] transition-colors hover:bg-white cursor-pointer">
                <Calculator size={18} />
                Get A Price Range
              </Link>
              <BookingCta />
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-5">
            <div className="border border-white/10 bg-[#0B0B0D] p-6 md:p-8 hover:border-[#f0c067]/45 transition duration-500 shadow-md rounded-none">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.24em] text-[#f0c067] mb-6">Direct Channels</h3>
                <a 
                  href={`tel:${businessPhone}`} 
                  onClick={() => trackEvent('call_click', { source: 'contact_panel' })} 
                  className="flex items-center gap-4 border border-white/5 bg-white/[0.02] p-4 text-base font-black text-white transition-colors hover:border-[#f0c067] hover:text-[#f0c067]"
                >
                  <span className="grid h-10 w-10 place-items-center bg-[#f0c067]/10 text-[#f0c067]"><Phone size={18} /></span>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-gray-500">Call Anthony</span>
                    <span className="block mt-0.5">{businessPhone}</span>
                  </div>
                </a>
                <a 
                  href={`sms:${smsPhone}`} 
                  onClick={() => trackEvent('text_click', { source: 'contact_panel' })} 
                  className="flex items-center gap-4 border border-white/5 bg-white/[0.02] p-4 text-base font-black text-white transition-colors hover:border-[#f0c067] hover:text-[#f0c067]"
                >
                  <span className="grid h-10 w-10 place-items-center bg-[#f0c067]/10 text-[#f0c067]"><MessageSquareText size={18} /></span>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-gray-500">Text Anthony</span>
                    <span className="block mt-0.5">{businessPhone}</span>
                  </div>
                </a>
                <a 
                  href={`mailto:${businessEmail}`} 
                  onClick={() => trackEvent('lead_mailto_fallback_opened', { source: 'contact_panel' })} 
                  className="flex items-center gap-4 border border-white/5 bg-white/[0.02] p-4 text-sm font-bold text-[#d8d0c2] transition-colors hover:border-[#f0c067] hover:text-white break-all"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f0c067]/10 text-[#f0c067]"><Mail size={18} /></span>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-gray-500">Email Direct</span>
                    <span className="block mt-0.5">{businessEmail}</span>
                  </div>
                </a>
                <div className="flex items-center gap-4 border border-white/5 bg-white/[0.02] p-4 text-xs font-bold text-[#d8d0c2]">
                  <span className="grid h-10 w-10 place-items-center bg-[#f0c067]/10 text-[#f0c067]"><MapPin size={18} /></span>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-gray-500">Location Base</span>
                    <span className="block mt-0.5">Twin Cities Metro Area</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-[#050505] px-4 py-20 text-white sm:px-6 lg:px-8 border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
          <FadeIn className="lg:col-span-4">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f0c067]">Estimate request</p>
            <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl uppercase">Residential, commercial, and public-sector inquiry paths in one form.</h2>
            <p className="mt-5 text-base leading-relaxed text-white/70">
              Include the city, project type, timeline, preferred contact method, and a photo link if you have one. The more surface detail you send, the better the first response can be.
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-8">
            <div className="border border-white/10 bg-[#0B0B0D] p-5 md:p-8 shadow-sm rounded-none">
              <LeadForm source="Contact page lead form" compact />
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
