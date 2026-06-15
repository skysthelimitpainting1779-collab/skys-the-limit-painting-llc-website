import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Navigation2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { trackEvent } from '../lib/analytics';

const serviceAreaPins = [
  { name: 'Minneapolis', slug: 'minneapolis', region: 'West metro', lat: 44.9778, lng: -93.2650 },
  { name: 'St. Paul', slug: 'st-paul', region: 'Core metro', lat: 44.9537, lng: -93.0900 },
  { name: 'Inver Grove Heights', slug: 'inver-grove-heights', region: 'Home base', lat: 44.8341, lng: -93.0427, primary: true },
  { name: 'South St. Paul', slug: 'south-st-paul', region: 'South metro', lat: 44.8872, lng: -93.0294 },
  { name: 'Eagan', slug: 'eagan', region: 'Dakota County', lat: 44.8041, lng: -93.1669 },
  { name: 'Woodbury', slug: 'woodbury', region: 'East metro', lat: 44.9239, lng: -92.9594 },
  { name: 'Twin Cities', slug: 'twin-cities', region: 'Metro coverage', lat: 44.9100, lng: -93.1800 },
];

const proofItems = [
  'Twin Cities Metro base',
  'Broad Twin Cities metro coverage',
  'Residential first, commercial ready',
  'Photo-assisted estimate intake',
];

interface ServiceAreaMapProps {
  compact?: boolean;
}

export default function ServiceAreaMap({ compact = false }: ServiceAreaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const prefersReducedMotion = useReducedMotion();

  const mapMotion = (prefersReducedMotion
    ? {}
    : {
        initial: false,
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.22 },
        transition: { duration: 0.42, ease: 'easeOut' as const },
      }) as any;

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let active = true;

    import('leaflet').then((LModule) => {
      const L = LModule.default || LModule;
      if (!active || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map instance
      const map = L.map(mapContainerRef.current, {
        center: [44.88, -93.14],
        zoom: 10,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Add zoom control at bottom right (gold/black styled via CSS if needed)
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(map);

      // Add custom styled markers
      serviceAreaPins.forEach((pin) => {
        const goldIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: ${pin.primary ? '#f0c067' : '#0B0B0D'}; border: 2px solid #f0c067; width: 14px; height: 14px; box-shadow: 0 0 10px rgba(240,192,103,0.35);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const marker = L.marker([pin.lat, pin.lng], { icon: goldIcon }).addTo(map);

        marker.bindPopup(
          `<div style="font-family: 'Outfit', sans-serif; color: #fff; background: #0B0B0D; padding: 4px; line-height: 1.4;">
            <h5 style="margin: 0; font-size: 13px; font-weight: 900; text-transform: uppercase; color: #f0c067; letter-spacing: 0.05em;">${pin.name}</h5>
            <p style="margin: 3px 0 0 0; font-size: 10px; color: #c9c1b4; text-transform: uppercase; font-weight: 600;">${pin.region}</p>
            <a href="/service-areas/${pin.slug}" style="display: inline-block; margin-top: 8px; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #f0c067; text-decoration: none; border-bottom: 1px solid #f0c067;">View Area Scope &rarr;</a>
           </div>`,
          {
            closeButton: false,
            className: 'custom-map-popup'
          }
        );
      });
    });

    return () => {
      active = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section
      id="service-area-map"
      aria-labelledby="service-area-map-heading"
      className={`relative overflow-hidden border-y border-[#d8c7aa]/12 bg-[#050505] px-4 text-white sm:px-6 lg:px-8 ${compact ? 'py-16' : 'py-20'}`}
    >
      <div className="blueprint-grid absolute inset-0 opacity-8"></div>
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#D9AE43,#f0c067,transparent)] opacity-70"></div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        <motion.div {...mapMotion} className="lg:col-span-5">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#f0c067]">Service-area map</p>
          <h2 id="service-area-map-heading" className="mt-4 text-3xl font-black leading-tight text-white md:text-5xl">
            Twin Cities coverage with live interactive mapping.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#d7e3df] md:text-lg">
            A real-time, responsive Leaflet coverage map for homeowners and commercial property managers verifying whether our painting teams reach their local site.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {proofItems.map((item) => (
              <div key={item} className="flex items-start gap-3 border-l border-[#f0c067]/35 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#eef7f4]">
                <MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-[#f0c067]" size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/contact"
              onClick={() => trackEvent('service_area_map_cta_click', { action: 'estimate' })}
              className="inline-flex items-center justify-center gap-2 bg-[#f0c067] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#050505] transition-colors hover:bg-white"
            >
              Check My Address <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Sky%27s%20the%20Limit%20Painting%20LLC%20Inver%20Grove%20Heights%20MN"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('service_area_map_cta_click', { action: 'directions' })}
              className="inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/28 bg-white/[0.04] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:border-[#f0c067] hover:text-[#f0c067]"
            >
              <Navigation2 aria-hidden="true" size={17} /> Open Directions
            </a>
          </div>
        </motion.div>

        <motion.figure {...mapMotion} className="lg:col-span-7">
          <div
            className="relative aspect-[5/4] overflow-hidden border border-[#d8c7aa]/18 bg-[#0B0B0D] shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:aspect-[16/10] h-[350px] sm:h-[450px]"
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

            <svg className="hidden" aria-hidden="true" />
            <div ref={mapContainerRef} className="h-full w-full relative z-0"></div>
          </div>

          <figcaption className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreaPins.map((pin) => (
              <Link
                key={pin.slug}
                to={`/service-areas/${pin.slug}`}
                aria-label={`View ${pin.name} painting service area`}
                onClick={() => trackEvent('service_area_map_list_click', { area: pin.slug })}
                className="flex items-center justify-between gap-3 border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-[#eef7f4] transition-colors hover:border-[#f0c067] hover:text-[#f0c067]"
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
