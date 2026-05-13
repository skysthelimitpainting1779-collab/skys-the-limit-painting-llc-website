import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ProjectCard = ({ type, location, problem, work, result, image }: any) => (
  <div className="bg-black-charcoal rounded-sm overflow-hidden border border-white/10 shadow-sm flex flex-col group h-full">
    <div className="relative overflow-hidden h-[300px]">
      <img src={image} alt={`${type} in ${location}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute top-4 left-4">
        <span className="bg-orange-safety text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">
          {type}
        </span>
      </div>
       <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-sm">
        {location}
      </div>
    </div>
    <div className="p-8 flex flex-col flex-1">
      <div className="space-y-6 mb-8 flex-grow">
        <div>
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Scope</h4>
          <p className="text-white text-sm leading-relaxed">{problem}</p>
        </div>
        <div className="w-full h-px bg-white/5"></div>
        <div>
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Work</h4>
          <p className="text-white text-sm leading-relaxed">{work}</p>
        </div>
        <div className="w-full h-px bg-white/5"></div>
        <div>
          <h4 className="text-orange-safety text-xs font-bold uppercase tracking-widest mb-2">Result</h4>
          <p className="text-white text-sm font-medium leading-relaxed">{result}</p>
        </div>
      </div>
    </div>
  </div>
);

export default function ProjectsPage() {
  return (
    <PageTransition>
      <PageMeta title="Recent Painting Projects | Sky's the Limit Painting LLC" description="Real work. Clean finish. Take a look at some of our recent verifiable interior, exterior, and commercial painting projects across the Twin Cities." />
      
      {/* Hero */}
      <section className="bg-black-primary py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="max-w-3xl">
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">Our Work</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white uppercase tracking-tight leading-none">Real Surfaces.<br/>Real Finish.</h1>
              <p className="text-xl text-gray-300 max-w-xl">
                Take a look at some of our recent verifiable interior, exterior, and commercial painting projects across the Twin Cities.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="bg-gray-warm py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <FadeIn delay={0.1}>
               <ProjectCard 
                type="Commercial Interior Refresh"
                location="Inver Grove Heights, MN"
                problem="Client needed a dark, modern look for a smoke shop storefront without replacing the existing ceiling grid."
                work="Surface prep, cleaning, and two coats of premium black finish applied to the entire ceiling grid and aluminum tracking."
                result="Darker, cleaner, more finished commercial interior that completely transformed the space."
                image="/images/services/commercial/sky-work-08-finished-commercial.png"
              />
             </FadeIn>
             <FadeIn delay={0.2}>
               <ProjectCard 
                type="Interior Residential Repaint"
                location="Twin Cities Metro"
                problem="Bedroom walls, trim, and doors requiring a fresh start and careful attention to detail."
                work="Patched drywall, sanded rough areas, masked trim, and applied two seamless finish coats."
                result="A clean, modernized bedroom with sharp lines and even coverage."
                image="/images/services/interior/sky-work-real-04-before-after-bedroom.png"
              />
             </FadeIn>
             <FadeIn delay={0.3}>
               <ProjectCard 
                type="Pavement Marking / Striping"
                location="Dakota County, MN"
                problem="Faded lot lines causing parking confusion and safety concerns in a commercial lot."
                work="Cleaned the surface and restriped stalls and safety markings with high-grade traffic paint."
                result="Clear, bright, and compliant parking lot markings providing a sharp first impression."
                image="/images/services/striping/SkyLLP_ParkingLot_Striping.png"
              />
             </FadeIn>
             <FadeIn delay={0.4}>
               <ProjectCard 
                type="Interior Trim & Wall Finishing"
                location="St. Paul Metro"
                problem="Living room walls and trim needing an update to brighten the space."
                work="Comprehensive room protection, precise cut-ins, and smooth application on walls."
                result="A flawless finish that brings a fresh, clean feeling back to the room."
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
             <Link to="/contact" className="inline-flex items-center gap-2 bg-orange-safety hover:bg-orange-deep text-white px-8 py-4 rounded-sm font-bold transition-colors uppercase tracking-wide">
                Get Your Free Estimate <ArrowRight size={18} />
             </Link>
           </FadeIn>
         </div>
      </section>

    </PageTransition>
  );
}
