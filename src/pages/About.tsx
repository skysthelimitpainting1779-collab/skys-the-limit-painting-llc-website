import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';

export default function AboutPage() {
  return (
    <PageTransition>
      <PageMeta title="About Us | Sky's the Limit Painting LLC" description="Built by a Painter, Not a Sales Office. Learn about Anthony Briseno and Sky's the Limit Painting LLC based in Inver Grove Heights, MN." />
      
      {/* Hero */}
      <section className="bg-black-primary py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="max-w-3xl">
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">About Us</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white uppercase tracking-tight leading-none">Built By A Painter.<br/>Not A Sales Office.</h1>
              <p className="text-xl text-gray-300 max-w-xl">
                Serving the Twin Cities with proper surface preparation and a focus on lasting results.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="bg-gray-warm py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn delay={0.1} direction="right">
            <div className="relative group overflow-hidden rounded-sm border border-gray-300 shadow-md">
              {/* Fallback image as we don't have owner photo in public dir yet */}
              <img src="/images/services/interior/sky-work-real-04-before-after-bedroom.png" alt="Owner working" className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black-primary/10"></div>
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
                  After more than a decade in the trade and completing a Minnesota Journeyworker Painter & Decorator apprenticeship, Anthony started Sky’s the Limit to bring dependable, skilled painting work to homeowners, businesses, and public/private job sites across the Twin Cities area.
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
    </PageTransition>
  );
}
