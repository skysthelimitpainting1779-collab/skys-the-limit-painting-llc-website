import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';

export default function ServiceCommercial() {
  return (
    <PageTransition>
      <PageMeta title="Commercial Painting Services | Sky's the Limit Painting LLC" description="Professional repainting for shops, offices, facilities, and job sites prioritizing minimal disruption and durable finishes." />
      
      {/* Hero */}
      <section className="relative bg-black-primary pt-24 pb-32 overflow-hidden px-6 shadow-inner border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img src="/images/services/commercial/sky-work-real-08-commercial.webp" alt="Commercial Painting" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black-primary via-black-primary/95 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <FadeIn>
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">Commercial Painting Services</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white uppercase tracking-normal leading-none">Clean Work For<br/>Business Spaces.</h1>
              <p className="text-xl text-gray-300 max-w-xl mb-8">
                Professional repainting for shops, offices, and facilities. We understand downtime costs money, so we focus on clear scheduling and rapid execution.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Shop Refreshes", "Office Repaints", "Facilities", "After-Hours"].map((tag, i) => (
                  <span key={i} className="text-xs font-bold text-orange-safety border border-orange-safety/50 rounded-sm px-3 py-1.5 uppercase bg-black/50 backdrop-blur-sm">{tag}</span>
                ))}
              </div>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-orange-safety hover:bg-orange-deep text-[#050505] px-8 py-4 rounded-sm font-bold transition-colors uppercase tracking-wide">
                Get Your Commercial Estimate <ArrowRight size={18} />
              </Link>
            </FadeIn>
          </div>
          <div className="flex-1 hidden md:block">
            <FadeIn delay={0.2} direction="left">
               <img src="/images/services/commercial/sky-work-08-finished-commercial.webp" alt="Finished Commercial Interior" className="rounded-sm border border-white/20 shadow-2xl w-full rotate-1" />
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
                  "Detailed planning for business hours or after-hours work",
                  "High-durability coatings suited for high traffic",
                  "Protection of inventory, tech, and furniture",
                  "Clear communication with property managers",
                  "Specialty ceiling paint and drop ceilings",
                  "Documentation and insurance verification"
                 ].map((item, i) => (
                   <div key={i} className="flex items-start gap-3">
                     <CheckCircle2 className="text-orange-safety shrink-0 mt-0.5" size={20} />
                     <span className="text-gray-200 font-medium">{item}</span>
                   </div>
                 ))}
              </div>
            </FadeIn>
          </div>
          <div className="flex-1 bg-black-primary p-8 md:p-12 rounded-sm border border-white/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-safety opacity-10 rounded-bl-full rounded-tr-sm -z-10"></div>
            <FadeIn delay={0.2}>
              <h3 className="text-2xl font-bold font-display uppercase tracking-wide mb-6 text-white">Best For</h3>
               <ul className="space-y-4">
                 <li className="flex flex-col">
                   <strong className="text-orange-safety uppercase text-sm tracking-wider">Retail & Shops</strong>
                   <span className="text-gray-400 text-sm">Storefront refreshes, dark ceiling conversions, and clean trim overhauls.</span>
                 </li>
                 <li className="flex flex-col">
                   <strong className="text-orange-safety uppercase text-sm tracking-wider">Offices</strong>
                   <span className="text-gray-400 text-sm">Professional environments updated with minimal disruption.</span>
                 </li>
                 <li className="flex flex-col">
                   <strong className="text-orange-safety uppercase text-sm tracking-wider">Facilities</strong>
                   <span className="text-gray-400 text-sm">Large-scale walls, specialty surfaces, and structural painting.</span>
                 </li>
               </ul>
            </FadeIn>
          </div>
        </div>
      </div>

      <section className="py-24 bg-black-charcoal px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
               <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-3">Project Proof</span>
               <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-normal">Recent Commercial Work</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FadeIn delay={0.1}>
                <div className="group rounded-sm overflow-hidden border border-white/10 relative h-[300px]">
                  <img src="/images/services/commercial/sky-work-real-08-commercial.webp" alt="Commercial Prep" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black-primary/90 to-transparent p-6 pt-12">
                    <span className="text-white font-bold uppercase tracking-wider text-sm">Commercial Painting Progress</span>
                  </div>
                </div>
             </FadeIn>
             <FadeIn delay={0.2}>
                <div className="group rounded-sm overflow-hidden border border-white/10 relative h-[300px]">
                  <img src="/images/services/commercial/sky-work-08-finished-commercial.webp" alt="Finished Commercial" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black-primary/90 to-transparent p-6 pt-12">
                    <span className="text-white font-bold uppercase tracking-wider text-sm">Completed Drop-Ceiling Grid Blackout</span>
                  </div>
                </div>
             </FadeIn>
          </div>
        </div>
      </section>

      {/* Process CTA */}
      <section className="py-24 px-6 bg-black-primary border-t border-white/5">
         <div className="max-w-4xl mx-auto bg-black-charcoal border border-white/10 rounded-sm p-8 md:p-12 text-center">
           <FadeIn>
             <h2 className="text-3xl font-display font-bold text-white mb-4 uppercase tracking-wide">Commercial Work in the Twin Cities</h2>
             <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
               We bring our commercial painting expertise to Inver Grove Heights, South St. Paul, West St. Paul, Woodbury, Eagan, Mendota Heights, and across the Twin Cities.
             </p>
             <Link to="/contact" className="inline-flex items-center gap-2 bg-orange-safety hover:bg-orange-deep text-[#050505] px-8 py-4 rounded-sm font-bold transition-colors uppercase tracking-wide">
                Start Your Commercial Project <ArrowRight size={18} />
             </Link>
           </FadeIn>
         </div>
      </section>

    </PageTransition>
  );
}
