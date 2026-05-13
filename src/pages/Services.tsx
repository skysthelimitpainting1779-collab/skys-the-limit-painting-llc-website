import { Link } from 'react-router-dom';
import { ChevronRight, Home, Building2, PaintRoller, GripHorizontal, Lightbulb, Sparkles } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';

const ServiceCard = ({ title, description, icon: Icon, link }: any) => (
  <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 rounded-full bg-orange-safety/10 flex items-center justify-center mb-6">
      <Icon className="text-orange-safety" size={24} />
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-page-text mb-6 text-base">{description}</p>
    <Link to={link} className="inline-flex items-center gap-2 text-orange-safety font-bold text-sm tracking-wide hover:text-orange-deep transition-colors">
      Learn More <ChevronRight size={16} />
    </Link>
  </div>
);

export default function ServicesPage() {
  return (
    <PageTransition>
      <PageMeta title="Professional Painting Services | Sky's the Limit Painting LLC" description="Professional painting and surface preparation built for real-world application. From residential interiors to high-traffic commercial environments." />
      <div className="bg-gray-warm py-20 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Our Services</h1>
              <p className="text-lg text-page-text leading-relaxed">
                Professional painting and surface preparation built for real-world application. From residential interiors to high-traffic commercial environments.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <ServiceCard 
                title="Interior Painting"
                description="Clean walls, sharp lines, and a finished space that feels new. We handle prep, mask-off, and flawless finish coating."
                icon={Home}
                link="/services/interior"
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <ServiceCard 
                title="Exterior Painting"
                description="Protect curb appeal with prep-first exterior painting. Specialized in adhering to varied siding types and weather conditions."
                icon={PaintRoller}
                link="/services/exterior"
              />
            </FadeIn>
            <FadeIn delay={0.3}>
              <ServiceCard 
                title="Commercial Painting"
                description="Professional repainting for shops, offices, facilities, and job sites prioritizing minimal disruption."
                icon={Building2}
                link="/services/commercial"
              />
            </FadeIn>
            <FadeIn delay={0.4}>
              <ServiceCard 
                title="Pavement Marking"
                description="Clean parking lot lines, safety markings, and pavement refreshes for small lots and facilities."
                icon={GripHorizontal}
                link="/services/striping"
              />
            </FadeIn>
            <FadeIn delay={0.5}>
              <ServiceCard 
                title="Light Pole / Specialty"
                description="Durable coating work for exterior fixtures, metal surfaces, and specialty architectural elements."
                icon={Lightbulb}
                link="/contact" // Future page
              />
            </FadeIn>
            <FadeIn delay={0.6}>
              <ServiceCard 
                title="Surface Prep"
                description="Scraping, sanding, patching, cleaning, masking, and readying surfaces. Better prep means better finish."
                icon={Sparkles}
                link="/contact" // Future page
              />
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
