import { ReactNode, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Phone } from 'lucide-react';
import ConversionHeader from './ConversionHeader';
import ConversionFooterCta from './ConversionFooterCta';
import CustomCursor from './CustomCursor';
import SocialLinks from './SocialLinks';
import HeatmapOverlay from './HeatmapOverlay';
import { areaLandingPages, serviceLandingPages, landingPagePath } from '../data/landingPages';
import { trackEvent } from '../lib/analytics';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-track]');
      if (target) {
        const eventName = target.getAttribute('data-track');
        const payloadStr = target.getAttribute('data-track-payload');
        try {
          const payload = payloadStr ? JSON.parse(payloadStr) : {};
          if (eventName) {
            trackEvent(eventName, payload);
          }
        } catch (err) {
          console.error(`Failed to parse data-track-payload for event "${eventName}":`, err);
          if (eventName) {
            trackEvent(eventName, { parse_error: true });
          }
        }
      }
    };
    document.addEventListener('click', handleGlobalClick, { passive: true });
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-page-bg text-page-text">
      <CustomCursor />
      <HeatmapOverlay />
      <div className="noise-overlay"></div>
      
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-black focus:text-[#050505]">Skip to content</a>
      <ConversionHeader />

      <main id="main-content" className="flex-grow pt-[117px] pb-20 md:pb-0">{children ?? <Outlet />}</main>

      {/* Mobile Sticky Bottom CTA */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] gap-2 overflow-hidden">
        <a href="tel:+16514104196" data-track="call_click" data-track-payload='{"source":"mobile_sticky"}' className="min-w-0 basis-0 flex-1 bg-black-charcoal border border-white/10 text-white py-4 px-2 rounded-none font-bold text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.8)] whitespace-nowrap text-xs">
          <Phone size={16} className="text-white shrink-0" />
          Call/Text
        </a>
        <Link to="/estimate" data-track="hero_cta_click" data-track-payload='{"source":"mobile_sticky","label":"Price Range"}' className="min-w-0 basis-0 flex-1 bg-white text-[#050505] py-4 px-2 rounded-none font-bold text-center shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center text-sm whitespace-nowrap">
          Price Range
        </Link>
      </div>

      <ConversionFooterCta />

      {/* Footer */}
      <footer className="bg-black-primary text-white py-20 px-6 mt-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6 relative z-10">
          <div className="col-span-1 lg:col-span-2">
            <h2 className="text-3xl font-display font-bold mb-4">Sky's the Limit Painting LLC</h2>
            <h3 className="text-xl font-display font-semibold text-gray-300 mb-4">Residential detail. Commercial discipline. Public-sector ready.</h3>
            <p className="text-gray-400 max-w-md text-lg">
              A fully insured, owner-operated registered Minnesota Specialty Contractor (Painting) serving residential, commercial, and qualified public-sector opportunities across the Twin Cities Metro area.
            </p>
            <div className="mt-8">
               <a href="tel:+16514104196" data-track="call_click" data-track-payload='{"source":"footer"}' className="text-xl font-bold text-white hover:text-gray-300 transition-colors block mb-2">651-410-4196</a>
               <a href="mailto:skysthelimitpainting1779@gmail.com" data-track="lead_mailto_fallback_opened" data-track-payload='{"source":"footer"}' className="text-gray-400 hover:text-white transition-colors">skysthelimitpainting1779@gmail.com</a>
            </div>
            <SocialLinks />
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-lg">Markets</h4>
            <nav className="flex flex-col gap-4 text-gray-400">
              <Link to="/residential" className="hover:text-white transition-colors">Residential</Link>
              <Link to="/commercial" className="hover:text-white transition-colors">Commercial</Link>
              <Link to="/public-sector" className="hover:text-white transition-colors">Public Sector</Link>
              <Link to="/projects" className="hover:text-white transition-colors">Recent Work</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Services</h4>
            <nav className="flex flex-col gap-4 text-gray-400">
              {serviceLandingPages.slice(0, 5).map((page) => (
                <Link key={page.slug} to={landingPagePath(page)} className="hover:text-white transition-colors">
                  {page.shortTitle}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Service Areas</h4>
            <nav className="flex flex-col gap-4 text-gray-400">
              <Link to="/service-area" className="hover:text-white transition-colors">Coverage Map</Link>
              {areaLandingPages.slice(0, 5).map((page) => (
                <Link key={page.slug} to={landingPagePath(page)} className="hover:text-white transition-colors">
                  {page.shortTitle}
                </Link>
              ))}
            </nav>
          </div>

          <div>
             <h4 className="font-bold mb-6 text-lg">Company</h4>
             <nav className="flex flex-col gap-4 text-gray-400">
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link to="/capabilities" className="hover:text-white transition-colors">Capabilities Statement</Link>
              <Link to="/estimate" className="hover:text-white transition-colors">Room Cost Calculator</Link>
              <Link to="/refer" className="hover:text-white transition-colors">Referral Program</Link>
              <Link to="/review" className="hover:text-white transition-colors">Google Review Funnel</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Get an Estimate</Link>
            </nav>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Sky's the Limit Painting LLC. All rights reserved.</p>
          <p>Registered MN Specialty Contractor (ID: IR816596) | Owner exempt from workers’ comp under MN Statute 176.041 | Fully Insured</p>
          <p>Twin Cities Metro Area, MN</p>
        </div>
      </footer>
    </div>
  );
}
