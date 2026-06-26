import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import ResponsiveImage from '../components/ResponsiveImage';
import { createClient } from '../lib/supabase/server';
import { businessSchema, breadcrumbSchema } from '../lib/seo';

const ProcessTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded-none uppercase tracking-wider">
    <CheckCircle2 size={12} className="text-[#FF5A00]" />
    {children}
  </span>
);

interface CaseStudyCardProps {
  type: string;
  location: string;
  problem: string;
  prep: string[];
  result: string;
  image?: string;
  beforeImage?: string;
  afterImage?: string;
}

const CaseStudyCard = ({ type, location, problem, prep, result, image, beforeImage, afterImage }: CaseStudyCardProps) => (
  <div className="bg-[#0B0B0D] rounded-none overflow-hidden border border-white/10 shadow-sm flex flex-col group h-full mb-12 transition duration-500 hover:-translate-y-1 hover:border-[#FF5A00]/55">
    <div className="relative overflow-hidden">
      {beforeImage && afterImage ? (
        <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} beforeLabel="The Challenge" afterLabel="The Result" />
      ) : (
        <div className="h-[350px] relative">
          {image && (
            <ResponsiveImage src={image} alt={`${type} in ${location}`} width={1200} height={700} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" />
          )}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-none">
            {location}
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="bg-[#FF5A00] text-[#050505] text-xs font-black uppercase tracking-widest px-3 py-1 rounded-none shadow-md">
          {type}
        </span>
      </div>
    </div>
    <div className="p-8 flex flex-col flex-1">
      <h3 className="text-xl font-display font-black text-white uppercase tracking-wide mb-6 group-hover:text-[#FF5A00] transition-colors">{type}</h3>
      <div className="space-y-6 mb-8 flex-grow">
        <div>
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> The Challenge
          </h4>
          <p className="text-white text-sm leading-relaxed">{problem}</p>
        </div>
        <div className="w-full h-px bg-white/5"></div>
        <div>
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span> The Prep
          </h4>
          <div className="flex flex-wrap gap-2">
            {prep.map((tag: string, i: number) => (
              <ProcessTag key={i}>{tag}</ProcessTag>
            ))}
          </div>
        </div>
        <div className="w-full h-px bg-white/5"></div>
        <div>
          <h4 className="text-[#FF5A00] text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5A00]"></span> The Result
          </h4>
          <p className="text-white text-sm font-medium leading-relaxed">{result}</p>
        </div>
      </div>
      <div className="mt-auto pt-6 border-t border-white/5">
        <Link 
          href="/contact" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#FF5A00] hover:text-white transition-colors"
        >
          Inquire About A Similar Scope <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </div>
);

export default async function ProjectsPage() {
  const schemaJson = [
    businessSchema,
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Our Work', path: '/projects' }
    ])
  ];

  // Fetch portfolio items from Supabase
  let portfolioItems: any[] = [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data && !error) {
      portfolioItems = data;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Portfolio DB fetch failed (${message}), using static fallback.`);
  }

  // Fallback static items
  const fallbackProjects = [
    {
      type: "Commercial Interior Refresh",
      location: "Inver Grove Heights, MN",
      problem: "Client needed a darker, more finished look for a storefront interior while working with the existing ceiling grid.",
      prep: ["Grid cleaning", "Floor protection", "Masking fixtures", "Adhesion primer"],
      result: "Darker, cleaner commercial interior with a more complete presentation for customers and staff.",
      beforeImage: "/brand/generated/sky-owner-proof.webp",
      afterImage: "/images/services/commercial/sky-work-08-finished-commercial.webp"
    },
    {
      type: "Interior Residential Repaint",
      location: "Twin Cities Metro",
      problem: "Bedroom walls, trim, and doors had visible wear, dated colors, and stains that needed careful prep before finish paint.",
      prep: ["Drywall patching", "Stain-blocking primer", "Trim sanding", "Dust containment"],
      result: "A cleaner, more current bedroom finish with sharper lines, stronger coverage, and a calmer finished feel.",
      beforeImage: "/images/services/interior/sky-work-01-finished-kitchen.webp",
      afterImage: "/images/services/interior/sky-work-real-04-before-after-bedroom.webp"
    },
    {
      type: "Pavement Marking / Striping",
      location: "Dakota County, MN",
      problem: "Faded lot markings made parking flow harder to read and weakened the first impression of the property.",
      prep: ["Power washing", "Debris clearing", "Chalk lining", "Layout adjustment"],
      result: "Clearer, brighter parking lot markings that improve visibility, traffic flow, and the property's arrival experience.",
      image: "/images/services/striping/SkyLLP_ParkingLot_Striping.webp"
    },
    {
      type: "Interior Trim & Wall Finishing",
      location: "St. Paul Metro",
      problem: "Living room walls and trim needing an update to brighten the space after years of fading and minor structural settling.",
      prep: ["Caulking baseboards", "Putty filling", "Spot priming", "Masking windows"],
      result: "A fresh, clean finish that brightens the room and gives the trim and walls a more finished look.",
      image: "/images/services/interior/sky-work-02-finished-living-room.webp"
    }
  ];

  const projectsToRender = portfolioItems.length > 0 
    ? portfolioItems.map(item => ({
        type: item.title,
        location: item.location,
        problem: item.problem,
        prep: item.prep || [],
        result: item.result,
        image: item.image_url,
        beforeImage: item.before_image_url,
        afterImage: item.after_image_url
      }))
    : fallbackProjects;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <main className="animate-premium-fade-in">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#050505] py-24 px-6 border-b border-white/10">
          <ResponsiveImage src="/brand/generated/sky-service-proof.webp" alt="Sky's the Limit Painting LLC premium work proof" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.92)_44%,rgba(5,5,5,0.5)_100%)]"></div>
          <div className="blueprint-grid absolute inset-0 opacity-12"></div>
          <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-70"></div>
          <div className="measurement-rules absolute inset-0 opacity-16"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <span className="inline-block text-[#FF5A00] font-black tracking-[0.24em] text-xs uppercase mb-4">Our Work</span>
              <h1 className="text-5xl md:text-7xl font-display font-black mb-6 text-white uppercase tracking-normal leading-[0.96]">Real Surfaces.<br/>Real Finish.</h1>
              <p className="text-xl text-gray-300 max-w-xl">
                Take a look at some of our recent verifiable interior, exterior, and commercial painting projects across the Twin Cities.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-[#050505] py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projectsToRender.map((project, index) => (
                <div key={index}>
                  <CaseStudyCard {...project} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="py-24 px-6 bg-[#050505] border-t border-white/10">
          <div className="max-w-4xl mx-auto bg-[#0B0B0D] border border-white/10 rounded-none p-8 md:p-12 text-center relative overflow-hidden">
            <div className="blueprint-grid absolute inset-0 opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-black text-white mb-4 uppercase tracking-wide">Have a Similar Project?</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                We're ready to put the same level of care into your next project. Contact us today for a free estimate.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-[#FF5A00] hover:bg-white text-[#050505] px-8 py-4 rounded-none font-black transition-colors uppercase tracking-widest text-sm cursor-pointer">
                Get Your Free Estimate <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
