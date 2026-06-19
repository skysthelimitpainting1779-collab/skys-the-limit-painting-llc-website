'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import FadeIn from '../components/animations/FadeIn';
import ServiceAreaMap from '../components/ServiceAreaMap';

export default function ServiceAreaPage() {
  return (
    <PageTransition>
      
      {/* Hero */}
      <section className="bg-black-primary py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">Service Area</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white uppercase tracking-normal leading-none">Twin Cities<br/>Local Coverage.</h1>
              <p className="text-xl text-gray-300 max-w-xl mx-auto">
                Serving Inver Grove Heights & the Twin Cities Metro with dependable painting focused on thorough prep.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="bg-black-charcoal px-6 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn delay={0.1}>
            <div>
              <h2 className="text-4xl font-display font-bold mb-6 uppercase tracking-wide">Local & Dependable</h2>
              <div className="w-12 h-1 bg-orange-safety mb-8"></div>
              
              <div className="space-y-6 text-lg text-page-text leading-relaxed">
                <p>
                  Based in Inver Grove Heights, Sky’s the Limit Painting LLC serves homeowners, property owners, businesses, and facilities across the surrounding Twin Cities area.
                </p>
                <p>
                  We focus on our designated service area to ensure we can provide prompt responses, accurate estimates, and dedicated time on every job site without stretching our resources too thin.
                </p>
              </div>
              
              <div className="mt-12">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-orange-safety hover:bg-orange-deep text-[#050505] px-8 py-4 rounded-sm font-bold transition-colors uppercase tracking-wide">
                  Get an Estimate <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="border-l border-[#f0c067]/35 bg-black-primary p-8 md:p-12">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-orange-safety">How to use the map</p>
              <h3 className="mt-4 text-3xl font-black leading-tight text-white">Pick a city, then send the project details.</h3>
              <p className="mt-5 text-base leading-relaxed text-gray-300">
                The map keeps the service area easy to scan without loading a slow embedded third-party map on every visit.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      <ServiceAreaMap compact />
    </PageTransition>
  );
}
