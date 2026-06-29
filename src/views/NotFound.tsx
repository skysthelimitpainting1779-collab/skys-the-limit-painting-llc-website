'use client';

import { ArrowRight, Home, PaintRoller, Building2, Landmark, Calculator } from 'lucide-react';
import Link from 'next/link';
import PageTransition from '../components/PageTransition';
import LeadForm from '../components/LeadForm';
import FadeIn from '../components/animations/FadeIn';
import ResponsiveImage from '../components/ResponsiveImage';
import HeroOverlays from '../components/HeroOverlays';

export default function NotFoundPage() {
  return (
    <PageTransition>
      
      {/* 404 Dark Section */}
      <section className="relative overflow-hidden bg-[#070706] px-6 py-24">
        <HeroOverlays
          imageSrc="/brand/generated/sky-service-proof.webp"
          imageAlt="Premium painting service proof and trade detailing"
          imageClassName="absolute inset-0 h-full w-full object-cover opacity-20"
          gradients={[
            'bg-gradient-to-r from-[#070706] via-[#070706]/94 to-transparent',
            'bg-gradient-to-t from-[#070706] via-transparent to-transparent',
          ]}
          blueprintOpacity="opacity-18"
        />
 
        <div className="relative mx-auto max-w-4xl text-center md:text-left z-10">
          <p className="text-sm font-semibold text-white">404 / Page not found</p>
          <h1 className="mt-5 text-5xl font-black leading-tight text-white md:text-7xl">
            This page is not on the job board.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 mx-auto md:mx-0">
            The link may be old, moved, or typed incorrectly. Don't worry, you can start fresh from the homepage, use the room cost calculator, or submit a request directly below.
          </p>
          <div className="mt-10 flex flex-col justify-center md:justify-start gap-3 sm:flex-row">
            <Link href="/" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-white text-[#15110a] px-7 py-4 text-sm font-black transition-colors">
              <Home size={18} />
              Back to Home
            </Link>
            <Link href="/estimate" className="inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/16 bg-[#11100d]/90 px-7 py-4 text-sm font-black text-white transition-colors hover:border-white/45 hover:text-white">
              <Calculator size={18} />
              Room Cost Calculator
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
 
      {/* Main Pages Quick Navigation */}
      <section className="bg-[#11100d] py-12 px-6 border-t border-[#d8c7aa]/16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold text-[#c9c1b4] mb-6">Or navigate our primary painting sectors:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/residential" className="flex items-center gap-4 p-4 border border-[#d8c7aa]/16 bg-[#070706]/60 hover:border-white/45 transition duration-500 hover:-translate-y-0.5 group shadow-sm">
              <span className="grid h-12 w-12 place-items-center border border-[#d8c7aa]/20 bg-[#11100d] text-white"><PaintRoller size={20} /></span>
              <div>
                <h4 className="font-bold text-white group-hover:text-white transition-colors">Residential</h4>
                <p className="text-xs text-[#b9b2a6]">Interior & Exterior detail</p>
              </div>
            </Link>
            <Link href="/commercial" className="flex items-center gap-4 p-4 border border-[#d8c7aa]/16 bg-[#070706]/60 hover:border-white/45 transition duration-500 hover:-translate-y-0.5 group shadow-sm">
              <span className="grid h-12 w-12 place-items-center border border-[#d8c7aa]/20 bg-[#11100d] text-white"><Building2 size={20} /></span>
              <div>
                <h4 className="font-bold text-white group-hover:text-white transition-colors">Commercial</h4>
                <p className="text-xs text-[#b9b2a6]">Offices, retail, property</p>
              </div>
            </Link>
            <Link href="/public-sector" className="flex items-center gap-4 p-4 border border-[#d8c7aa]/16 bg-[#070706]/60 hover:border-white/45 transition duration-500 hover:-translate-y-0.5 group shadow-sm">
              <span className="grid h-12 w-12 place-items-center border border-[#d8c7aa]/20 bg-[#11100d] text-white"><Landmark size={20} /></span>
              <div>
                <h4 className="font-bold text-white group-hover:text-white transition-colors">Public Sector</h4>
                <p className="text-xs text-[#b9b2a6]">Striping, parking lots, specs</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Direct Capture Form Section */}
      <section className="bg-[#e6dfd2] px-6 py-20 text-[#171512]">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold text-[#8b4d20]">Direct Estimate</p>
              <h2 className="mt-4 text-3xl font-black leading-tight">Request an estimate right here.</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#4c453d]">
                If you were looking for an estimate form, you don't need to navigate further. Describe your project surfaces, timeline, and location details below.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="border border-[#171512]/15 bg-[#f5f0e7] p-5 md:p-8">
                <LeadForm source="404 page redirect form" compact />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

