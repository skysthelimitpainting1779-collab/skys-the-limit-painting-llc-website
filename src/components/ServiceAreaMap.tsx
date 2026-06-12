import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Navigation2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { trackEvent } from '../lib/analytics';

const serviceAreaPins = [
  { name: 'Minneapolis', slug: 'minneapolis', region: 'West metro', x: 36, y: 34 },
  { name: 'St. Paul', slug: 'st-paul', region: 'Core metro', x: 55, y: 38 },
  { name: 'Inver Grove Heights', slug: 'inver-grove-heights', region: 'Home base', x: 58, y: 64, primary: true },
  { name: 'South St. Paul', slug: 'south-st-paul', region: 'South metro', x: 55, y: 55 },
  { name: 'Eagan', slug: 'eagan', region: 'Dakota County', x: 47, y: 72 },
  { name: 'Woodbury', slug: 'woodbury', region: 'East metro', x: 76, y: 49 },
  { name: 'Twin Cities', slug: 'twin-cities', region: 'Metro coverage', x: 47, y: 48 },
];

const proofItems = [
  'Based in Inver Grove Heights',
  'Broad Twin Cities metro coverage',
  'Residential first, commercial ready',
  'Photo-assisted estimate intake',
];

interface ServiceAreaMapProps {
  compact?: boolean;
}

export default function ServiceAreaMap({ compact = false }: ServiceAreaMapProps) {
  const prefersReducedMotion = useReducedMotion();
  const mapMotion = (prefersReducedMotion
    ? {}
    : {
        initial: false,
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.22 },
        transition: { duration: 0.42, ease: 'easeOut' as const },
      }) as any;

  return (
    <section
      id="service-area-map"
      aria-labelledby="service-area-map-heading"
      className={`relative overflow-hidden border-y border-[#d8c7aa]/12 bg-[#0d1211] px-4 text-white sm:px-6 lg:px-8 ${compact ? 'py-16' : 'py-20'}`}
    >
      <div className="blueprint-grid absolute inset-0 opacity-8"></div>
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#7dd3fc,#f0c067,transparent)] opacity-70"></div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        <motion.div {...mapMotion} className="lg:col-span-5">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#7dd3fc]">Service-area map</p>
          <h2 id="service-area-map-heading" className="mt-4 text-3xl font-black leading-tight text-white md:text-5xl">
            Twin Cities coverage without the heavy map embed.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#d7e3df] md:text-lg">
            A fast, accessible coverage map for homeowners and property managers checking whether Sky's the Limit Painting can reach their project.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {proofItems.map((item) => (
              <div key={item} className="flex items-start gap-3 border-l border-[#7dd3fc]/35 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#eef7f4]">
                <MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-[#f0c067]" size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/contact"
              onClick={() => trackEvent('service_area_map_cta_click', { action: 'estimate' })}
              className="inline-flex items-center justify-center gap-2 bg-[#f0c067] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#101513] transition-colors hover:bg-white"
            >
              Check My Address <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Sky%27s%20the%20Limit%20Painting%20LLC%20Inver%20Grove%20Heights%20MN"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('service_area_map_cta_click', { action: 'directions' })}
              className="inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/28 bg-white/[0.04] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:border-[#7dd3fc] hover:text-[#7dd3fc]"
            >
              <Navigation2 aria-hidden="true" size={17} /> Open Directions
            </a>
          </div>
        </motion.div>

        <motion.figure {...mapMotion} className="lg:col-span-7">
          <div
            className="relative aspect-[5/4] overflow-hidden border border-[#d8c7aa]/18 bg-[#111915] shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:aspect-[16/10]"
            role="img"
            aria-labelledby="service-area-visual-title"
            aria-describedby="service-area-visual-description"
          >
            <span id="service-area-visual-title" className="sr-only">
              Map of Sky's the Limit Painting service coverage across the Twin Cities metro.
            </span>
            <span id="service-area-visual-description" className="sr-only">
              Map markers include Minneapolis, St. Paul, Inver Grove Heights, South St. Paul, Eagan, Woodbury, and broad Twin Cities coverage.
            </span>

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 80" aria-hidden="true">
              <rect width="100" height="80" fill="#111915" />
              <path d="M14 20 C32 28 42 22 53 31 C63 39 75 34 89 44" fill="none" stroke="#7dd3fc" strokeOpacity="0.32" strokeWidth="1.2" />
              <path d="M18 58 C31 48 44 52 55 45 C67 37 72 31 83 23" fill="none" stroke="#f0c067" strokeOpacity="0.48" strokeWidth="0.9" />
              <path d="M25 11 L73 72" stroke="#d8c7aa" strokeOpacity="0.14" strokeWidth="0.7" />
              <path d="M11 39 L92 39" stroke="#d8c7aa" strokeOpacity="0.14" strokeWidth="0.7" />
              <path d="M50 8 L50 74" stroke="#d8c7aa" strokeOpacity="0.12" strokeWidth="0.7" />
              <path d="M32 73 C42 56 45 43 42 23" fill="none" stroke="#d8c7aa" strokeOpacity="0.12" strokeWidth="0.7" />
              <path d="M69 74 C60 55 63 42 76 20" fill="none" stroke="#d8c7aa" strokeOpacity="0.12" strokeWidth="0.7" />
            </svg>

            <div className="absolute left-4 top-4 border border-white/12 bg-[#0d1211]/82 px-4 py-3 backdrop-blur">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#7dd3fc]">Metro reach</p>
              <p className="mt-1 text-sm font-black text-white">Inver Grove Heights base</p>
            </div>

            {serviceAreaPins.map((pin, index) => (
              <Link
                key={pin.slug}
                to={`/service-areas/${pin.slug}`}
                aria-label={`View ${pin.name} painting service area`}
                onClick={() => trackEvent('service_area_map_pin_click', { area: pin.slug })}
                className="group absolute z-10 grid min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7dd3fc]"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18, delay: index * 0.02 }}
                  className={`grid h-6 w-6 place-items-center rounded-full border ${pin.primary ? 'border-[#f0c067] bg-[#f0c067] text-[#101513]' : 'border-[#7dd3fc] bg-[#0d1211] text-[#7dd3fc]'} shadow-[0_0_0_6px_rgba(125,211,252,0.1)] transition-transform group-hover:scale-110`}
                >
                  <span className="h-2 w-2 rounded-full bg-current"></span>
                </motion.span>
                <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap border border-white/12 bg-[#0d1211]/92 px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-white opacity-0 shadow-xl backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
                  {pin.name}
                </span>
              </Link>
            ))}
          </div>

          <figcaption className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreaPins.map((pin) => (
              <Link
                key={pin.slug}
                to={`/service-areas/${pin.slug}`}
                onClick={() => trackEvent('service_area_map_list_click', { area: pin.slug })}
                className="flex items-center justify-between gap-3 border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-[#eef7f4] transition-colors hover:border-[#7dd3fc] hover:text-[#7dd3fc]"
              >
                <span>
                  {pin.name}
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9fb0aa]">{pin.region}</span>
                </span>
                <ArrowRight aria-hidden="true" size={16} className="shrink-0" />
              </Link>
            ))}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
