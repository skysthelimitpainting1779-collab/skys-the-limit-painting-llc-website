import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';

export default function ServiceAreaPage() {
  const areas = [
    "Inver Grove Heights", "South St. Paul", "West St. Paul", "Eagan",
    "Mendota Heights", "Cottage Grove", "Woodbury", "St. Paul", "Minneapolis",
    "Dakota County", "Ramsey County", "Washington County", "Hennepin County"
  ];

  return (
    <PageTransition>
      <PageMeta title="Service Area | Twin Cities Painting Contractor" description="Serving Inver Grove Heights, Dakota County, and the Twin Cities Metro. Local, dependable painting services near you." />
      
      {/* Hero */}
      <section className="bg-black-primary py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">Service Area</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white uppercase tracking-tight leading-none">Twin Cities<br/>Local Coverage.</h1>
              <p className="text-xl text-gray-300 max-w-xl mx-auto">
                Serving Inver Grove Heights & the Twin Cities Metro with dependable painting focused on thorough prep.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="bg-black-charcoal py-24 px-6 min-h-screen">
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
                <Link to="/contact" className="inline-flex items-center gap-2 bg-orange-safety hover:bg-orange-deep text-white px-8 py-4 rounded-sm font-bold transition-colors uppercase tracking-wide">
                  Get an Estimate <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="bg-black-primary p-8 md:p-12 rounded-sm border border-white/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-safety opacity-10 rounded-bl-full rounded-tr-sm -z-10"></div>
              
              <div className="flex items-center gap-3 mb-8">
                <MapPin className="text-orange-safety shrink-0" size={28} />
                <h3 className="text-2xl font-bold font-display uppercase tracking-wide">Communities We Cover</h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {areas.map((loc, i) => (
                  <span key={i} className="bg-white/5 border border-white/10 text-white font-bold tracking-wide uppercase text-sm px-4 py-2 rounded-sm">
                    {loc}
                  </span>
                ))}
              </div>
               <p className="text-sm text-gray-500 mt-8 italic">
                 Don't see your city? We may still be able to help. Please contact us to discuss your project.
               </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
