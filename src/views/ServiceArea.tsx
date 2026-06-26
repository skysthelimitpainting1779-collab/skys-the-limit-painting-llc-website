import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ServiceAreaMap from '../components/ServiceAreaMap';
import { businessSchema, breadcrumbSchema } from '../lib/seo';

export default function ServiceAreaPage() {
  const schemaJson = [
    businessSchema,
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Service Area', path: '/service-area' }
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
        <section className="bg-black-primary py-24 px-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block text-white font-bold text-sm mb-4">Service Area</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white leading-none">Twin Cities<br/>Local Coverage.</h1>
              <p className="text-xl text-gray-300 max-w-xl mx-auto">
                Serving Inver Grove Heights & the Twin Cities Metro with dependable painting focused on thorough prep.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-black-charcoal px-6 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Local & Dependable</h2>
              <div className="w-12 h-1 bg-white mb-8"></div>
              
              <div className="space-y-6 text-lg text-page-text leading-relaxed">
                <p>
                  Based in Inver Grove Heights, Sky’s the Limit Painting LLC serves homeowners, property owners, businesses, and facilities across the surrounding Twin Cities area.
                </p>
                <p>
                  We focus on our designated service area to ensure we can provide prompt responses, accurate estimates, and dedicated time on every job site without stretching our resources too thin.
                </p>
              </div>
              
              <div className="mt-12">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-[#050505] px-8 py-4 rounded-none font-bold transition-colors cursor-pointer">
                  Get an Estimate <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            
            <div className="border-l border-white/35 bg-black-primary p-8 md:p-12">
              <p className="text-xs font-semibold text-white">How to use the map</p>
              <h3 className="mt-4 text-3xl font-black leading-tight text-white">Pick a city, then send the project details.</h3>
              <p className="mt-5 text-base leading-relaxed text-gray-300">
                The map keeps the service area easy to scan without loading a slow embedded third-party map on every visit.
              </p>
            </div>
          </div>
        </div>

        <ServiceAreaMap compact />
      </main>
    </>
  );
}
