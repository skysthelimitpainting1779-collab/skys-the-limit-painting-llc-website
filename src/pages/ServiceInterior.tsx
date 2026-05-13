import { Link } from 'react-router-dom';
import { ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';

export default function ServiceInterior() {
  return (
    <PageTransition>
      <PageMeta title="Interior Painting Services | Sky's the Limit Painting LLC" description="Clean walls, sharp lines, and a finished space that feels new. We provide precise interior painting for homes and businesses." />
      
      {/* Hero */}
      <section className="relative bg-black-primary pt-24 pb-32 overflow-hidden px-6 shadow-inner border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img src="/images/services/interior/sky-work-02-finished-living-room.png" alt="Interior Painting" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black-primary via-black-primary/95 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <FadeIn>
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">Interior Painting Services</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white uppercase tracking-tight leading-none">Clean Walls.<br/>Sharp Lines.</h1>
              <p className="text-xl text-gray-300 max-w-xl mb-8">
                Precision interior painting that protects surfaces and makes rooms feel new again. Handled with care and careful masking from start to finish.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Walls & Ceilings", "Trim & Doors", "Cabinets", "Drywall Patching"].map((tag, i) => (
                  <span key={i} className="text-xs font-bold text-orange-safety border border-orange-safety/50 rounded-sm px-3 py-1.5 uppercase bg-black/50 backdrop-blur-sm">{tag}</span>
                ))}
              </div>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-orange-safety hover:bg-orange-deep text-white px-8 py-4 rounded-sm font-bold transition-colors uppercase tracking-wide">
                Get Your Free Estimate <ArrowRight size={18} />
              </Link>
            </FadeIn>
          </div>
          <div className="flex-1 hidden md:block">
            <FadeIn delay={0.2} direction="left">
               <img src="/images/services/interior/sky-work-real-04-before-after-bedroom.png" alt="Before and After Bedroom" className="rounded-sm border border-white/20 shadow-2xl w-full rotate-2" />
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="bg-gray-warm py-24 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="flex-1">
            <FadeIn>
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-3">Service Scope</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-black-primary mb-8 uppercase tracking-wide">What We Handle</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                 {[
                  "Comprehensive room protection",
                  "Floor and furniture masking",
                  "Scraping, sanding, and patching",
                  "Caulking baseboards and trim",
                  "High-quality primer application",
                  "Premium finish coating",
                  "Sharp ceiling-to-wall cut-ins",
                  "Thorough end-of-job cleanup"
                 ].map((item, i) => (
                   <div key={i} className="flex items-start gap-3">
                     <CheckCircle2 className="text-orange-safety shrink-0 mt-0.5" size={20} />
                     <span className="text-gray-800 font-medium">{item}</span>
                   </div>
                 ))}
              </div>
            </FadeIn>
          </div>
          <div className="flex-1 bg-white p-8 md:p-12 rounded-sm border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-safety opacity-10 rounded-bl-full rounded-tr-sm -z-10"></div>
            <FadeIn delay={0.2}>
              <h3 className="text-2xl font-bold font-display uppercase tracking-wide mb-6">Best For</h3>
               <ul className="space-y-4">
                 <li className="flex flex-col">
                   <strong className="text-black-primary uppercase text-sm tracking-wider">Homeowners</strong>
                   <span className="text-gray-600 text-sm">Living rooms, bedrooms, kitchens, and basements looking for a refresh.</span>
                 </li>
                 <li className="flex flex-col">
                   <strong className="text-black-primary uppercase text-sm tracking-wider">Rentals & Flips</strong>
                   <span className="text-gray-600 text-sm">Durable, clean, and fast turnovers between tenants.</span>
                 </li>
                 <li className="flex flex-col">
                   <strong className="text-black-primary uppercase text-sm tracking-wider">Offices & Retail</strong>
                   <span className="text-gray-600 text-sm">Professional workspaces requiring careful scheduling and clean execution.</span>
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
               <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">Recent Interior Work</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <FadeIn delay={0.1}>
                <div className="group rounded-sm overflow-hidden border border-white/10 relative h-[300px]">
                  <img src="/images/services/interior/sky-work-01-finished-kitchen.png" alt="Finished Kitchen" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black-primary/90 to-transparent p-6 pt-12">
                    <span className="text-white font-bold uppercase tracking-wider text-sm">Finished Kitchen</span>
                  </div>
                </div>
             </FadeIn>
             <FadeIn delay={0.2}>
                <div className="group rounded-sm overflow-hidden border border-white/10 relative h-[300px]">
                  <img src="/images/services/interior/sky-work-02-finished-living-room.png" alt="Living Room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black-primary/90 to-transparent p-6 pt-12">
                    <span className="text-white font-bold uppercase tracking-wider text-sm">Living Room</span>
                  </div>
                </div>
             </FadeIn>
             <FadeIn delay={0.3}>
                <div className="group rounded-sm overflow-hidden border border-white/10 relative h-[300px]">
                  <img src="/images/services/interior/sky-work-real-04-before-after-bedroom.png" alt="Bedroom Before & After" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black-primary/90 to-transparent p-6 pt-12">
                    <span className="text-white font-bold uppercase tracking-wider text-sm">Bedroom Repaint</span>
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
             <h2 className="text-3xl font-display font-bold text-white mb-4 uppercase tracking-wide">Serving the Twin Cities Metro</h2>
             <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
               We bring our interior painting expertise to Inver Grove Heights, South St. Paul, West St. Paul, Woodbury, Eagan, Mendota Heights, and across the Twin Cities.
             </p>
             <Link to="/contact" className="inline-flex items-center gap-2 bg-orange-safety hover:bg-orange-deep text-white px-8 py-4 rounded-sm font-bold transition-colors uppercase tracking-wide">
                Start Your Interior Project <ArrowRight size={18} />
             </Link>
           </FadeIn>
         </div>
      </section>

    </PageTransition>
  );
}
