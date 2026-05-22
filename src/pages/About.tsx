import { Link } from 'react-router-dom';
import { ArrowRight, Camera, ClipboardCheck, ShieldCheck } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';
import ResponsiveImage from '../components/ResponsiveImage';
import { breadcrumbSchema } from '../lib/seo';
export default function AboutPage() {
  return (
    <PageTransition>
      <PageMeta
        title="About Anthony Briseno | Sky's the Limit Painting LLC"
        description="Learn about Anthony Briseno and Sky’s the Limit Painting LLC, an owner-operated Minnesota painting contractor based in Inver Grove Heights."
        path="/about"
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#070706] py-24 px-6">
        <ResponsiveImage
          src="/brand/generated/sky-service-proof.webp"
          alt="Premium painting service proof and trade detailing"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070706] via-[#070706]/94 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070706] via-transparent to-transparent"></div>
        <div className="blueprint-grid absolute inset-0 opacity-18"></div>
        <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-70"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <FadeIn>
            <div className="max-w-3xl">
              <span className="inline-block text-[#f0c067] font-black tracking-[0.24em] text-xs uppercase mb-4">About Us</span>
              <h1 className="text-5xl md:text-7xl font-display font-black mb-6 text-white uppercase tracking-normal leading-[0.96]">Built By A Painter.<br/>Not A Sales Office.</h1>
              <p className="text-xl text-gray-300 max-w-xl">
                Serving the Twin Cities with proper surface preparation and a focus on lasting results.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="bg-[#11100d] py-24 px-6 border-b border-[#d8c7aa]/16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn delay={0.1} direction="right">
            <div className="relative group overflow-hidden border border-[#d8c7aa]/16 shadow-md transition duration-500 hover:border-[#f0c067]/45">
              <ResponsiveImage src="/brand/generated/sky-owner-proof.webp" alt="Sky's the Limit branded equipment and owner-led proof" width={1200} height={1200} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black-primary/10"></div>
              <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(0deg,rgba(5,5,5,0.92),transparent)] p-6">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f0c067]">Trade Excellence in Every Detail</p>
                <p className="mt-3 text-2xl font-black leading-tight text-white">Owner-operated. Trade-built. Minnesota-based.</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2} direction="left">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6 leading-tight uppercase tracking-wide">Sky's the Limit Painting LLC</h2>
              <div className="w-12 h-1 bg-[#f0c067] mb-8"></div>
              
              <div className="space-y-6 text-lg text-[#e4ded2] leading-relaxed">
                <p>
                  Sky’s the Limit Painting LLC is a Minnesota painting company based in Inver Grove Heights and led by Anthony Briseno.
                </p>
                <p>
                  After completing a Minnesota Journeyworker Painter & Decorator apprenticeship, Anthony started Sky’s the Limit to bring dependable, skilled painting work to homeowners, businesses, and qualified opportunities across the Twin Cities area.
                </p>
                <p>
                  We stand against the "fast and cheap" model. We believe in taking the time for thorough surface preparation because we know it’s the only way a paint job truly lasts. We are owner-operated, ensuring clear communication throughout your project.
                </p>
              </div>

              <div className="mt-12">
                <Link to="/contact" className="inline-flex items-center gap-2 bg-[#f0c067] hover:bg-white text-[#15110a] px-8 py-4 rounded-sm font-black transition-colors uppercase tracking-widest text-sm">
                  Work With Us <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <section className="relative overflow-hidden bg-[#080807] px-6 py-20">
        <div className="measurement-rules absolute inset-0 opacity-12"></div>
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-3">
          {[
            [ShieldCheck, 'Neatness & Respect', 'We treat your property like our own, utilizing clean drop cloths, dust isolation, and orderly tool staging every single day.'],
            [ClipboardCheck, 'Apprentice-Built Craft', 'Led by Anthony Briseno with a formal Journeyworker Painter & Decorator background—combining hands-on field experience with structural discipline.'],
            [Camera, 'Detail-First Estimates', 'Every bid features detailed photo scopes and clear, itemized line items so you know exactly what prep and coating you are paying for.'],
          ].map(([Icon, title, body], index) => {
            const AboutIcon = Icon as typeof ShieldCheck;
            return (
              <FadeIn key={title as string} delay={0.06 * index}>
                <article className="h-full border-l border-[#f0c067]/35 bg-[#11100d] p-7 transition duration-500 hover:-translate-y-1 hover:border-[#f0c067]/55">
                  <AboutIcon className="mb-8 text-[#f0c067]" size={30} strokeWidth={1.5} />
                  <h2 className="text-2xl font-black uppercase leading-tight text-white">{title as string}</h2>
                  <p className="mt-5 text-sm leading-relaxed text-[#b9b2a6]">{body as string}</p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </PageTransition>
  );
}
