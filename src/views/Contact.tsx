'use client';

import Link from 'next/link';
import { Calculator, Mail, MapPin, MessageSquareText, Phone } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import FadeIn from '../components/animations/FadeIn';
import LeadForm from '../components/LeadForm';
import BookingCta from '../components/BookingCta';
import ResponsiveImage from '../components/ResponsiveImage';
import HeroOverlays from '../components/HeroOverlays';
import TestimonialCard from '../components/TestimonialCard';
import { businessEmail, businessPhone, smsPhone } from '../lib/contact';
import { breadcrumbSchema } from '../lib/seo';
import { trackEvent } from '../lib/analytics';

export default function ContactPage() {
  return (
    <PageTransition>
      <section className="relative overflow-hidden bg-[#050505] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <HeroOverlays
          imageSrc="/images/site/marketing-hero-exterior-painting.webp"
          imageAlt="Premium painting service contact background"
          imageClassName="absolute inset-0 h-full w-full object-cover opacity-20"
          gradients={[
            'bg-gradient-to-r from-[#050505] via-[#050505]/94 to-transparent',
            'bg-gradient-to-t from-[#050505] via-transparent to-transparent',
          ]}
        />
        
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
              <Link href="/estimate" onClick={() => trackEvent('hero_cta_click', { source: 'contact_hero', label: 'Price Range' })} className="inline-flex items-center justify-center gap-2 bg-[#f0c067] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#050505] transition-colors hover:bg-white cursor-pointer">
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                  <LeadForm source="Contact page lead form" compact />
                </div>
                
                {/* Social Proof & Testimonials Column */}
                <div className="lg:col-span-5 flex flex-col justify-start space-y-6 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f0c067]">Local Service Proof</h4>
                  <div className="space-y-4">
                    <TestimonialCard
                      quote="Anthony arrived exactly when he said he would. The lines are incredibly sharp and the cleanup was so thorough you couldn't tell any painting had been done."
                      author="David R., Saint Paul"
                    />
                    <TestimonialCard
                      quote="We appreciated the direct owner communication. Anthony answered every question, gave a fair price, and executed everything flawlessly."
                      author="Jessica T., Burnsville"
                    />
                  </div>
                  
                  <div className="pt-2 space-y-2 border-t border-white/5">
                    <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 bg-orange-safety"></span>
                      <span>MN Reg ID: IR816596</span>
                    </div>
                    <p className="text-[9px] text-gray-500 leading-normal font-mono">
                      Owner-operator zero-payroll structure. Exempt from Workers' Compensation under Minnesota Statute 176.041.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
