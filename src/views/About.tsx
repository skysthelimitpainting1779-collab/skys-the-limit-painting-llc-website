import Link from 'next/link';
import { ArrowRight, Camera, ClipboardCheck, ShieldCheck } from 'lucide-react';
import ResponsiveImage from '../components/ResponsiveImage';
import JsonLd from '../components/JsonLd';
import HeroOverlays from '../components/HeroOverlays';
import IconFeatureCard from '../components/IconFeatureCard';
import { businessSchema, breadcrumbSchema } from '../lib/seo';

export default function AboutPage() {
  const schemaJson = [
    businessSchema,
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' }
    ])
  ];

  return (
    <>
      <JsonLd data={schemaJson} />
      
      <main className="animate-premium-fade-in">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#050505] py-24 px-6">
          <HeroOverlays
            imageSrc="/brand/generated/sky-service-proof.webp"
            imageAlt="Premium painting service proof and trade detailing"
          />
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <span className="inline-block text-[#FF5A00] font-black tracking-[0.24em] text-xs uppercase mb-4">About Us</span>
              <h1 className="text-5xl md:text-7xl font-display font-black mb-6 text-white uppercase tracking-normal leading-[0.96]">Trade-Built Painting.<br/>Owner-Led Care.</h1>
              <p className="text-xl text-gray-300 max-w-xl">
                Serving the Twin Cities with proper surface preparation and a focus on lasting results.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-[#050505] py-24 px-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              {/* Branded Equipment Bento Card */}
              <div className="relative group overflow-hidden border border-white/10 bg-[#0B0B0D] shadow-md transition duration-500 hover:border-[#FF5A00]/45">
                <ResponsiveImage src="/brand/generated/sky-owner-proof.webp" alt="Sky's the Limit branded equipment and owner-led proof" width={1200} height={1200} className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-black-primary/10"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(0deg,rgba(5,5,5,0.92),transparent)] p-6">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#FF5A00]">Branded Equipment</p>
                  <p className="mt-1 text-sm font-bold text-white">Owner-operated trade tools</p>
                </div>
              </div>

              {/* Anthony Briseno Portrait/Trust Bento Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border border-white/10 bg-[#0B0B0D] p-6">
                <div className="md:col-span-4 relative aspect-square overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center bg-[#FF5A00]/5 text-[#FF5A00] font-display text-2xl font-black">
                    AB
                  </div>
                  <ResponsiveImage src="/images/site/anthony-portrait.webp" alt="Anthony Briseno" width={400} height={400} className="absolute inset-0 h-full w-full object-cover opacity-90 grayscale hover:grayscale-0 transition duration-500" />
                </div>
                <div className="md:col-span-8 flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#FF5A00]">Founder & Operator</p>
                  <h3 className="text-lg font-black text-white uppercase mt-1">Anthony Briseno</h3>
                  <p className="text-xs text-[#b9b2a6] mt-2 leading-relaxed">
                    Minnesota Journeyworker Painter & Decorator. Direct lead on every site, ensuring absolute prep and finish compliance.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-display font-bold mb-6 leading-tight uppercase tracking-wide">Sky's the Limit Painting LLC</h2>
              <div className="w-12 h-1 bg-[#FF5A00] mb-8"></div>
              
              <div className="space-y-6 text-lg text-[#e4ded2] leading-relaxed">
                <p>
                  Sky’s the Limit Painting LLC is a Minnesota painting company serving the Twin Cities Metro and led by Anthony Briseno.
                </p>
                <p>
                  After completing a Minnesota Journeyworker Painter & Decorator apprenticeship, Anthony started Sky’s the Limit to bring dependable, skilled painting work to homeowners, businesses, and qualified opportunities across the Twin Cities area.
                </p>
                <p>
                  We do not treat prep as an optional line item. Thorough surface preparation is the foundation of a finish that lasts, and our owner-operated structure keeps communication clear from first scope to final walkthrough.
                </p>
              </div>

              <div className="mt-12">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-[#FF5A00] hover:bg-white text-[#050505] px-8 py-4 rounded-none font-black transition-colors uppercase tracking-widest text-sm cursor-pointer">
                  Work With Us <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <section className="relative overflow-hidden bg-[#050505] px-6 py-20">
          <div className="measurement-rules absolute inset-0 opacity-12"></div>
          <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'Neatness & Respect', body: 'We treat your property like our own, utilizing clean drop cloths, dust isolation, and orderly tool staging every single day.' },
              { icon: ClipboardCheck, title: 'Apprentice-Built Craft', body: 'Led by Anthony Briseno with a formal Journeyworker Painter & Decorator background\u2014combining hands-on field experience with structural discipline.' },
              { icon: Camera, title: 'Detail-First Estimates', body: 'Every bid features detailed photo scopes and clear, itemized line items so you know exactly what prep and coating you are paying for.' },
            ].map((card) => (
              <IconFeatureCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                body={card.body}
                className="h-full border-l border-[#FF5A00]/35 bg-[#0B0B0D] p-7 transition duration-500 hover:-translate-y-1 hover:border-[#FF5A00]/55"
                iconSize={30}
                iconClassName="mb-8 text-[#FF5A00]"
                titleClassName="text-2xl font-black uppercase leading-tight text-white"
                bodyClassName="mt-5 text-sm leading-relaxed text-[#b9b2a6]"
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
