import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Home, Building2, PaintRoller, GripHorizontal, Lightbulb, Sparkles } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';
import exteriorImage from '../assets/images/regenerated_image_1778651987756.webp';
import specialtyImage from '../assets/images/regenerated_image_1778651993633.webp';
import prepImage from '../assets/images/regenerated_image_1778652000603.webp';

const PhotoServiceCard = ({ title, headline, bullets, image, icon: Icon, link, ctaText }: any) => (
  <div className="group relative rounded-sm overflow-hidden border border-white/10 shadow-sm flex flex-col h-full bg-black-charcoal">
    <div className="relative h-[250px] w-full overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black-charcoal via-black-charcoal/60 to-transparent"></div>
      <div className="absolute top-4 left-4 bg-black-primary/80 backdrop-blur-sm p-3 rounded-sm border border-white/10 text-orange-safety">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-2xl font-display font-bold uppercase tracking-wide text-white">{title}</h3>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h4 className="text-lg text-white font-bold mb-4">{headline}</h4>
      <ul className="mb-8 space-y-2 flex-1">
        {bullets.map((b: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <CheckCircle2 size={16} className="text-orange-safety shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link to={link || "/services"} className="inline-flex items-center gap-2 text-orange-safety font-bold text-sm tracking-widest uppercase hover:text-orange-deep transition-colors mt-auto border border-orange-safety/30 px-6 py-3 rounded-sm justify-center group-hover:border-orange-safety">
        {ctaText || "Learn More"} <ArrowRight size={16} />
      </Link>
    </div>
  </div>
);

export default function ServicesPage() {
  return (
    <PageTransition>
      <PageMeta title="Professional Painting Services | Sky's the Limit Painting LLC" description="Professional painting and surface preparation built for real-world application. From residential interiors to high-traffic commercial environments." />
      
      {/* Hero */}
      <section className="bg-black-primary py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="max-w-3xl">
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">Our Services</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white uppercase tracking-normal leading-none">Complete Painting &<br/>Surface Solutions.</h1>
              <p className="text-xl text-gray-300 max-w-xl">
                Professional painting and surface preparation built for real-world application. From residential interiors to high-traffic commercial environments.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="bg-black-charcoal py-24 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <PhotoServiceCard 
                title="Interior Painting"
                headline="Clean walls. Sharp lines. Better rooms."
                bullets={["Walls, ceilings, trim, doors", "Homes, rentals, offices, refreshes", "Careful masking and cleanup"]}
                image="/images/services/interior/sky-work-02-finished-living-room.webp"
                icon={Home}
                link="/services/interior"
                ctaText="View Interior Work"
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <PhotoServiceCard 
                title="Exterior Painting"
                headline="Curb appeal with prep that holds up."
                bullets={["Siding, trim, doors, garages", "Residential and small commercial exteriors", "Scraping, masking, coating, finish"]}
                image={exteriorImage}
                icon={PaintRoller}
                link="/services/exterior"
                ctaText="View Exterior Work"
              />
            </FadeIn>
            <FadeIn delay={0.3}>
              <PhotoServiceCard 
                title="Commercial Painting"
                headline="Clean work for serious business spaces."
                bullets={["Shops, offices, facilities", "Scheduling with less disruption", "Professional finish and cleanup"]}
                image="/images/services/commercial/sky-work-08-finished-commercial.webp"
                icon={Building2}
                link="/services/commercial"
                ctaText="View Commercial Work"
              />
            </FadeIn>
            <FadeIn delay={0.4}>
              <PhotoServiceCard 
                title="Pavement Marking / Striping"
                headline="Cleaner lots. Clearer traffic flow."
                bullets={["Parking stalls", "Directional markings", "Safety and property presentation"]}
                image="/images/services/striping/SkyLLP_ParkingLot_Striping.webp"
                icon={GripHorizontal}
                link="/services/striping"
                ctaText="View Striping Work"
              />
            </FadeIn>
            <FadeIn delay={0.5}>
              <PhotoServiceCard 
                title="Light Pole / Specialty"
                headline="Specialty surfaces need serious prep."
                bullets={["Light poles and fixtures", "Metal and exterior surfaces", "Durable coating approach"]}
                image={specialtyImage}
                icon={Lightbulb}
                link="/contact"
                ctaText="Contact About Specialty"
              />
            </FadeIn>
            <FadeIn delay={0.6}>
              <PhotoServiceCard 
                title="Surface Prep"
                headline="The finish is only as good as the prep."
                bullets={["Siding scraping and power washing", "Drywall patching, caulking, and sanding", "Primer coating application"]}
                image={prepImage}
                icon={Sparkles}
                link="/contact"
                ctaText="Contact About Prep"
              />
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
