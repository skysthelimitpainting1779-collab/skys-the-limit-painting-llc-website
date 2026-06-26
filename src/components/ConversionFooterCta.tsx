import Link from 'next/link';
import { ArrowRight, Calculator, Camera, ClipboardCheck, Phone, ShieldCheck } from 'lucide-react';
import { businessPhone } from '../lib/contact';
import MagneticButton from './animations/MagneticButton';
import IconFeatureCard from './IconFeatureCard';

const proofItems = [
  {
    icon: Camera,
    title: 'Photo-ready estimate intake',
    body: 'Send room, exterior, commercial, or striping photos with the form so the first response starts from real surface evidence.',
  },
  {
    icon: ClipboardCheck,
    title: 'Clear scope before scheduling',
    body: 'Each request is organized around surfaces, access, prep, timeline, budget range, and preferred contact method.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified contractor language',
    body: 'Registered Minnesota Specialty Contractor (Painting), fully insured, and owner-operator workers\' comp exempt under MN Statute 176.041.',
  },
];

export default function ConversionFooterCta() {
  return (
    <section className="relative overflow-hidden border-y border-[#d8c7aa]/16 mesh-gradient-bg px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="blueprint-grid absolute inset-0 opacity-10 z-10"></div>
      <div className="measurement-rules absolute inset-0 opacity-12 z-10"></div>
      <div className="relative z-20 mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f0c067]">Ready when the surface is ready</p>
          <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            Get a tighter scope before paint ever opens.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#c9c1b4] md:text-lg">
            Start with a fast planning range, then send the details for a real estimate conversation. The better the surface story, the cleaner the first response.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MagneticButton pullFactor={0.3}>
              <Link
                href="/estimate"
                data-track="footer_conversion_cta_click"
                data-track-payload='{"action":"calculator"}'
                className="shimmer-cta inline-flex items-center justify-center gap-2 bg-[#f0c067] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#15110a] transition-colors hover:bg-white"
              >
                <Calculator size={18} />
                Get A Price Range
              </Link>
            </MagneticButton>
            <a
              href={`tel:${businessPhone}`}
              data-track="call_click"
              data-track-payload='{"source":"conversion_footer"}'
              className="inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/30 bg-[#11100d]/80 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition-colors hover:border-[#f0c067] hover:text-[#f0c067]"
            >
              <Phone size={18} />
              Call / Text
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:col-span-7">
          {proofItems.map(({ icon, title, body }) => (
            <IconFeatureCard
              key={title}
              icon={icon}
              title={title}
              body={body}
              className="min-h-[240px] border-l border-[#f0c067]/35 bg-[#11100d]/88 p-6"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
