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
      <section className="bg-black-primary py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="max-w-3xl">
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">About Us</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white uppercase tracking-normal leading-none">Built By A Painter.<br/>Not A Sales Office.</h1>
              <p className="text-xl text-gray-300 max-w-xl">
                Serving the Twin Cities with proper surface preparation and a focus on lasting results.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="bg-black-charcoal py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn delay={0.1} direction="right">
            <div className="relative group overflow-hidden rounded-sm border border-white/20 shadow-md">
              <ResponsiveImage src="/brand/generated/sky-owner-proof.webp" alt="Sky's the Limit branded equipment and owner-led proof" width={1200} height={1200} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black-primary/10"></div>
              <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(0deg,rgba(5,5,5,0.92),transparent)] p-6">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-safety">Real owner-led positioning</p>
                <p className="mt-3 text-2xl font-black leading-tight text-white">Owner-operated. Trade-built. Minnesota-based.</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2} direction="left">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6 leading-tight uppercase tracking-wide">Sky's the Limit Painting LLC</h2>
              <div className="w-12 h-1 bg-orange-safety mb-8"></div>
              
              <div className="space-y-6 text-lg text-page-text leading-relaxed">
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
                <Link to="/contact" className="inline-flex items-center gap-2 bg-orange-safety hover:bg-orange-deep text-white px-8 py-4 rounded-sm font-bold transition-colors uppercase tracking-wide">
                  Work With Us <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <section className="bg-[#080807] px-6 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-3">
          {[
            [ShieldCheck, 'Insured contractor language', 'The site stays inside verified claim guardrails while still presenting the company seriously.'],
            [ClipboardCheck, 'Journeyworker background', 'Anthony’s apprenticeship background is part of the trust story without inflating unsupported credentials.'],
            [Camera, 'Photo-led follow-up', 'Project photos help Anthony understand surfaces, access, prep needs, and the right next step sooner.'],
          ].map(([Icon, title, body], index) => {
            const AboutIcon = Icon as typeof ShieldCheck;
            return (
              <FadeIn key={title as string} delay={0.06 * index}>
                <article className="h-full border-l border-orange-safety/40 bg-black-charcoal p-7">
                  <AboutIcon className="mb-8 text-orange-safety" size={30} strokeWidth={1.5} />
                  <h2 className="text-2xl font-black uppercase leading-tight text-white">{title as string}</h2>
                  <p className="mt-5 text-sm leading-relaxed text-gray-300">{body as string}</p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </PageTransition>
  );
}
