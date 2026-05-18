import React from 'react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import ResponsiveImage from '../components/ResponsiveImage';
import commercialBeforeImage from '../assets/images/regenerated_image_1778652000603.png';
import { breadcrumbSchema } from '../lib/seo';
import { trackEvent } from '../lib/analytics';

const ProcessTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded-sm uppercase tracking-wider">
    <CheckCircle2 size={12} className="text-orange-safety" />
    {children}
  </span>
);

const CaseStudyCard = ({ type, location, problem, prep, result, image, beforeImage, afterImage }: any) => (
  <div className="bg-black-charcoal rounded-sm overflow-hidden border border-white/10 shadow-sm flex flex-col group h-full mb-12">
    <div className="relative overflow-hidden">
      {beforeImage && afterImage ? (
        <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} beforeLabel="The Challenge" afterLabel="The Result" />
      ) : (
        <div className="h-[350px] relative">
          <ResponsiveImage src={image} alt={`${type} in ${location}`} width={1200} height={700} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-sm">
            {location}
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="bg-orange-safety text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">
          {type}
        </span>
      </div>
    </div>
    <div className="p-8 flex flex-col flex-1">
      <div className="space-y-6 mb-8 flex-grow">
        <div>
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> The Challenge</h4>
          <p className="text-white text-sm leading-relaxed">{problem}</p>
        </div>
        <div className="w-full h-px bg-white/5"></div>
        <div>
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> The Prep</h4>
          <div className="flex flex-wrap gap-2">
            {prep.map((tag: string, i: number) => (
              <ProcessTag key={i}>{tag}</ProcessTag>
            ))}
          </div>
        </div>
        <div className="w-full h-px bg-white/5"></div>
        <div>
          <h4 className="text-orange-safety text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-safety"></span> The Result</h4>
          <p className="text-white text-sm font-medium leading-relaxed">{result}</p>
        </div>
      </div>
    </div>
  </div>
);

export default function ProjectsPage() {
  return (
    <PageTransition>
      <PageMeta
        title="Painting Projects in the Twin Cities | Sky's the Limit"
        description="Real project proof from Sky’s the Limit Painting LLC, including residential painting, commercial repainting, and striping references in the Twin Cities area."
        path="/projects"
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Projects', path: '/projects' },
        ])}
      />
      
      {/* Hero */}
      <section className="relative overflow-hidden bg-black-primary py-24 px-6 border-b border-white/10">
        <ResponsiveImage src="/brand/generated/sky-service-proof.webp" alt="" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.92)_44%,rgba(5,5,5,0.5)_100%)]"></div>
        <div className="measurement-rules absolute inset-0 opacity-16"></div>
        <div className="relative max-w-7xl mx-auto">
          <FadeIn>
            <div className="max-w-3xl">
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">Our Work</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white uppercase tracking-normal leading-none">Real Surfaces.<br/>Real Finish.</h1>
              <p className="text-xl text-gray-300 max-w-xl">
                Take a look at some of our recent verifiable interior, exterior, and commercial painting projects across the Twin Cities.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="bg-black-charcoal py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <FadeIn delay={0.1}>
               <CaseStudyCard 
                type="Commercial Interior Refresh"
                location="Inver Grove Heights, MN"
                problem="Client needed a darker, more finished look for a storefront interior while working with the existing ceiling grid."
                prep={["Grid cleaning", "Floor protection", "Masking fixtures", "Adhesion primer"]}
                result="Darker, cleaner commercial interior with a more complete presentation for customers and staff."
                beforeImage={commercialBeforeImage} 
                afterImage="/images/services/commercial/sky-work-08-finished-commercial.png"
              />
             </FadeIn>
             <FadeIn delay={0.2}>
               <CaseStudyCard 
                type="Interior Residential Repaint"
                location="Twin Cities Metro"
                problem="Bedroom walls, trim, and doors had visible wear, dated colors, and stains that needed careful prep before finish paint."
                prep={["Drywall patching", "Stain-blocking primer", "Trim sanding", "Dust containment"]}
                result="A cleaner, more current bedroom finish with sharper lines, stronger coverage, and a calmer finished feel."
                beforeImage="/images/services/interior/sky-work-01-finished-kitchen.png"
                afterImage="/images/services/interior/sky-work-real-04-before-after-bedroom.png"
              />
             </FadeIn>
             <FadeIn delay={0.3}>
               <CaseStudyCard 
                type="Pavement Marking / Striping"
                location="Dakota County, MN"
                problem="Faded lot markings made parking flow harder to read and weakened the first impression of the property."
                prep={["Power washing", "Debris clearing", "Chalk lining", "Layout adjustment"]}
                result="Clearer, brighter parking lot markings that improve visibility, traffic flow, and the property's arrival experience."
                image="/images/services/striping/SkyLLP_ParkingLot_Striping.png"
              />
             </FadeIn>
             <FadeIn delay={0.4}>
               <CaseStudyCard 
                type="Interior Trim & Wall Finishing"
                location="St. Paul Metro"
                problem="Living room walls and trim needing an update to brighten the space after years of fading and minor structural settling."
                prep={["Caulking baseboards", "Putty filling", "Spot priming", "Masking windows"]}
                result="A fresh, clean finish that brightens the room and gives the trim and walls a more finished look."
                image="/images/services/interior/sky-work-02-finished-living-room.png"
              />
             </FadeIn>
          </div>
        </div>
      </div>

      <section className="py-24 px-6 bg-black-charcoal border-t border-white/5">
         <div className="max-w-4xl mx-auto bg-black-primary border border-white/10 rounded-sm p-8 md:p-12 text-center">
           <FadeIn>
             <h2 className="text-3xl font-display font-bold text-white mb-4 uppercase tracking-wide">Have a Similar Project?</h2>
             <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
               We're ready to put the same level of care into your next project. Contact us today for a free estimate.
             </p>
             <Link to="/contact" onClick={() => trackEvent('projects_interaction', { action: 'estimate_cta' })} className="inline-flex items-center gap-2 bg-orange-safety hover:bg-orange-deep text-white px-8 py-4 rounded-sm font-bold transition-colors uppercase tracking-wide">
                Get Your Free Estimate <ArrowRight size={18} />
             </Link>
           </FadeIn>
         </div>
      </section>

    </PageTransition>
  );
}
