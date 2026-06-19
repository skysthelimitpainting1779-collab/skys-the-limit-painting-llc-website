'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import FadeIn from '../components/animations/FadeIn';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import exteriorImage from '../assets/images/regenerated_image_1778651987756.webp';

export default function ServiceExterior() {
  const exteriorImageSrc = typeof exteriorImage === 'object' && exteriorImage !== null ? (exteriorImage as any).src : exteriorImage;
  return (
    <PageTransition>
      
      {/* Hero */}
      <section className="relative bg-black-primary pt-24 pb-32 overflow-hidden px-6 shadow-inner border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img src={exteriorImageSrc} alt="Exterior Painting" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black-primary via-black-primary/95 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <FadeIn>
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">Exterior Painting Services</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white uppercase tracking-normal leading-none">Protection Against<br/>The Elements.</h1>
              <p className="text-xl text-gray-300 max-w-xl mb-8">
                Minnesota weather is brutal on exterior surfaces. Success outside relies 80% on preparation and 20% on application. We do not skip corners.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Siding", "Trim", "Garages", "Doors"].map((tag, i) => (
                  <span key={i} className="text-xs font-bold text-orange-safety border border-orange-safety/50 rounded-none px-3 py-1.5 uppercase bg-black/50 backdrop-blur-sm">{tag}</span>
                ))}
              </div>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-orange-safety hover:bg-orange-deep text-[#050505] px-8 py-4 rounded-none font-bold transition-colors uppercase tracking-wide">
                Get Your Free Estimate <ArrowRight size={18} />
              </Link>
            </FadeIn>
          </div>
          <div className="flex-1 hidden md:block">
            <FadeIn delay={0.2} direction="left">
               <img src={exteriorImageSrc} alt="Exterior Painting Prep" className="rounded-none border border-white/20 shadow-2xl w-full -rotate-2" />
            </FadeIn>
          </div>
        </div>
      </section>
      
      <div className="bg-black-charcoal py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="flex-1">
            <FadeIn>
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-3">Service Scope</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8 uppercase tracking-wide">What We Handle</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                 {[
                  "Power washing to remove dirt and mildew",
                  "Thorough scraping of loose and peeling paint",
                  "Spot priming bare wood to seal against moisture",
                  "Caulking seams and gaps to prevent water intrusion",
                  "Application of premium exterior coatings",
                  "Siding, trim, windows, and doors"
                 ].map((item, i) => (
                   <div key={i} className="flex items-start gap-3">
                     <CheckCircle2 className="text-orange-safety shrink-0 mt-0.5" size={20} />
                     <span className="text-gray-200 font-medium">{item}</span>
                   </div>
                 ))}
              </div>
            </FadeIn>
          </div>
          <div className="flex-1 bg-black-primary p-8 md:p-12 rounded-none border border-white/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-safety opacity-10 rounded-none -z-10"></div>
            <FadeIn delay={0.2}>
              <h3 className="text-2xl font-bold font-display uppercase tracking-wide mb-6 text-white">Best For</h3>
               <ul className="space-y-4">
                 <li className="flex flex-col">
                   <strong className="text-orange-safety uppercase text-sm tracking-wider">Homeowners</strong>
                   <span className="text-gray-400 text-sm">Full exterior repaints, siding maintenance, and garage updates.</span>
                 </li>
                 <li className="flex flex-col">
                   <strong className="text-orange-safety uppercase text-sm tracking-wider">Property Managers</strong>
                   <span className="text-gray-400 text-sm">Keeping multi-family units and rental exteriors looking sharp and weather-proofed.</span>
                 </li>
                 <li className="flex flex-col">
                   <strong className="text-orange-safety uppercase text-sm tracking-wider">Small Businesses</strong>
                   <span className="text-gray-400 text-sm">Refreshing storefronts and exterior commercial facades.</span>
                 </li>
               </ul>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Project Proof Section */}
      <section className="py-24 bg-black-charcoal px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
               <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-3">Project Proof</span>
               <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-normal">Recent Exterior Work</h2>
            </div>
          </FadeIn>
          
          <div className="max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="bg-black-primary/50 p-4 border border-white/10 rounded-none">
                <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">Interactive Proof // Sanding &amp; Scraping vs Weatherproof Topcoat</h3>
                <BeforeAfterSlider 
                  beforeImage="/images/site/iphone-exterior-prep-front-entry.webp" 
                  afterImage="/images/site/marketing-hero-exterior-painting.webp"
                  beforeLabel="Sanded, Scraped, &amp; Stabilized Wood"
                  afterLabel="Finished Weatherproof Coat"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Process CTA */}
      <section className="py-24 px-6 bg-black-primary border-t border-white/5">
         <div className="max-w-4xl mx-auto bg-black-charcoal border border-white/10 rounded-none p-8 md:p-12 text-center">
           <FadeIn>
             <h2 className="text-3xl font-display font-bold text-white mb-4 uppercase tracking-wide">Serving the Twin Cities Metro</h2>
             <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
               We bring our exterior painting expertise to Inver Grove Heights, South St. Paul, West St. Paul, Woodbury, Eagan, Mendota Heights, and across the Twin Cities.
             </p>
             <Link href="/contact" className="inline-flex items-center gap-2 bg-orange-safety hover:bg-orange-deep text-[#050505] px-8 py-4 rounded-none font-bold transition-colors uppercase tracking-wide">
                Start Your Exterior Project <ArrowRight size={18} />
             </Link>
           </FadeIn>
         </div>
      </section>

    </PageTransition>
  );
}
