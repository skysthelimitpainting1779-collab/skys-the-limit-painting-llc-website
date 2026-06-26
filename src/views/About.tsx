import Link from 'next/link';
import { ArrowRight, Camera, ClipboardCheck, ShieldCheck } from 'lucide-react';
import ResponsiveImage from '../components/ResponsiveImage';
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      
      <main className="animate-premium-fade-in">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#050505] py-24 px-6">
          <ResponsiveImage
            src="/brand/generated/sky-service-proof.webp"
            alt="Premium painting service proof and trade detailing"
            width={1600}
            height={900}
            className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/94 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
          <div className="blueprint-grid absolute inset-0 opacity-12"></div>
          <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-70"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <span className="inline-block text-white font-semibold text-xs mb-4">About Us</span>
              <h1 className="text-5xl md:text-7xl font-display font-black mb-6 text-white leading-[0.96]">Trade-Built Painting.<br/>Owner-Led Care.</h1>
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
              <div className="relative group overflow-hidden border border-white/10 bg-[#0B0B0D] shadow-md transition duration-500 hover:border-white/45">
                <ResponsiveImage src="/brand/generated/sky-owner-proof.webp" alt="Sky's the Limit branded equipment and owner-led proof" width={1200} height={1200} className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-black-primary/10"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(0deg,rgba(5,5,5,0.92),transparent)] p-6">
                  <p className="text-xs font-semibold text-white">Branded Equipment</p>
                  <p className="mt-1 text-sm font-bold text-white">Owner-operated trade tools</p>
                </div>
              </div>

              {/* Anthony Briseno Portrait/Trust Bento Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border border-white/10 bg-[#0B0B0D] p-6">
                <div className="md:col-span-4 relative aspect-square overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-white font-display text-2xl font-black">
                    AB
                  </div>
                  <ResponsiveImage src="/images/site/anthony-portrait.webp" alt="Anthony Briseno" width={400} height={400} className="absolute inset-0 h-full w-full object-cover opacity-90 grayscale hover:grayscale-0 transition duration-500" />
                </div>
                <div className="md:col-span-8 flex flex-col justify-center">
                  <p className="text-xs font-black text-white">Founder & Operator</p>
                  <h3 className="text-lg font-black text-white mt-1">Anthony Briseno</h3>
                  <p className="text-xs text-[#b9b2a6] mt-2 leading-relaxed">
                    Minnesota Journeyworker Painter & Decorator. Direct lead on every site, ensuring absolute prep and finish compliance.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-display font-bold mb-6 leading-tight">Sky's the Limit Painting LLC</h2>
              <div className="w-12 h-1 bg-white mb-8"></div>
              
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
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white hover:bg-white text-[#050505] px-8 py-4 rounded-none font-black transition-colors text-sm cursor-pointer">
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
              [ShieldCheck, 'Neatness & Respect', 'We treat your property like our own, utilizing clean drop cloths, dust isolation, and orderly tool staging every single day.'],
              [ClipboardCheck, 'Apprentice-Built Craft', 'Led by Anthony Briseno with a formal Journeyworker Painter & Decorator background—combining hands-on field experience with structural discipline.'],
              [Camera, 'Detail-First Estimates', 'Every bid features detailed photo scopes and clear, itemized line items so you know exactly what prep and coating you are paying for.'],
            ].map(([Icon, title, body]) => {
              const AboutIcon = Icon as typeof ShieldCheck;
              return (
                <article key={title as string} className="h-full border-l border-white/35 bg-[#0B0B0D] p-7 transition duration-500 hover:-translate-y-1 hover:border-white/55">
                  <AboutIcon className="mb-8 text-white" size={30} strokeWidth={1.5} />
                  <h2 className="text-2xl font-black leading-tight text-white">{title as string}</h2>
                  <p className="mt-5 text-sm leading-relaxed text-[#b9b2a6]">{body as string}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
