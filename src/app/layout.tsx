import type { Metadata } from 'next';
import '../index.css';
import React from 'react';
import ConversionHeader from '../components/ConversionHeader';
import ConversionFooterCta from '../components/ConversionFooterCta';
import CustomCursor from '../components/CustomCursor';
import SocialLinks from '../components/SocialLinks';
import HeatmapOverlay from '../components/HeatmapOverlay';
import Script from 'next/script';
import Link from 'next/link';

export const metadata: Metadata = {
  metadataBase: new URL("https://www.skysthelimitpaintingllc.com"),
  title: "Sky’s the Limit Painting LLC | Minnesota Painting Contractor",
  description: "Sky’s the Limit Painting LLC is an insured, owner-operated Minnesota painting contractor built for residential painting, commercial work, and public-sector opportunities.",
  keywords: [
    "Minnesota painting contractor",
    "Inver Grove Heights painting contractor",
    "Twin Cities painting contractor",
    "residential painting Minnesota",
    "commercial painting Minnesota",
    "parking lot striping Minnesota",
    "pavement marking Minnesota"
  ],
  alternates: {
    canonical: "https://www.skysthelimitpaintingllc.com",
  },
  openGraph: {
    title: "Sky’s the Limit Painting LLC | Minnesota Painting Contractor",
    description: "Residential detail. Commercial discipline. Public-sector ready.",
    images: [{ url: "/og-preview.svg" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "E4yKOu61Os6v4EQNmZ6-djni1eCyuDCw6v_XyLYFo90",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;700;900&family=Oswald:wght@400;500;700&family=Fira+Code:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HousePainter",
              "name": "Sky's the Limit Painting LLC",
              "founder": "Anthony Briseno",
              "telephone": "+1-651-410-4196",
              "email": "skysthelimitpainting1779@gmail.com",
              "url": "https://www.skysthelimitpaintingllc.com",
              "logo": "https://www.skysthelimitpaintingllc.com/brand/SkyLLP_BrandLogo.svg",
              "image": "https://www.skysthelimitpaintingllc.com/brand/generated/sky-local-authority.webp",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Inver Grove Heights",
                "addressRegion": "MN",
                "addressCountry": "US",
              },
              "areaServed": [
                { "@type": "Place", "name": "Twin Cities Metro" },
                { "@type": "AdministrativeArea", "name": "Minnesota" },
              ],
            }),
          }}
        />
      </head>
      <body>
        <div className="min-h-[100dvh] flex flex-col bg-page-bg text-page-text">
          <CustomCursor />
          <HeatmapOverlay />
          <div className="noise-overlay" aria-hidden="true"></div>

          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-orange-safety focus:px-4 focus:py-3 focus:text-sm focus:font-black focus:uppercase focus:tracking-wide focus:text-[#050505]"
          >
            Skip to content
          </a>

          <ConversionHeader />

          <main id="main-content" className="flex-grow pt-[117px] pb-20 md:pb-0">
            {children}
          </main>

          {/* Mobile Sticky Bottom CTA */}
          <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] gap-2 overflow-hidden">
            <a
              href="tel:+16514104196"
              data-track="call_click"
              data-track-payload='{"source":"mobile_sticky"}'
              className="min-w-0 basis-0 flex-1 bg-black-charcoal border border-white/10 text-white py-4 px-2 rounded-sm font-bold text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.8)] whitespace-nowrap text-xs"
            >
              Call/Text
            </a>
            <Link
              href="/estimate"
              data-track="hero_cta_click"
              data-track-payload='{"source":"mobile_sticky","label":"Price Range"}'
              className="min-w-0 basis-0 flex-1 bg-orange-safety text-[#050505] py-4 px-2 rounded-sm font-bold text-center shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center uppercase text-xs tracking-wide whitespace-nowrap"
            >
              Price Range
            </Link>
          </div>

          <ConversionFooterCta />

          {/* Footer */}
          <footer className="bg-black-primary text-white py-20 px-6 mt-12 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-safety/10 via-black-charcoal/0 to-transparent pointer-events-none rounded-full blur-3xl"></div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6 relative z-10">
              <div className="col-span-1 lg:col-span-2">
                <h2 className="text-3xl font-display font-bold mb-4">Sky's the Limit Painting LLC</h2>
                <h3 className="text-xl font-display font-semibold text-gray-300 mb-4 tracking-wide">
                  Residential detail. Commercial discipline. Public-sector ready.
                </h3>
                <p className="text-gray-400 max-w-md text-lg">
                  A fully insured, owner-operated registered Minnesota Specialty Contractor (Painting) serving
                  residential, commercial, and qualified public-sector opportunities across the Twin Cities Metro area.
                </p>
                <div className="mt-8">
                  <a
                    href="tel:+16514104196"
                    data-track="call_click"
                    data-track-payload='{"source":"footer"}'
                    className="text-xl font-bold text-orange-safety hover:text-white transition-colors block mb-2"
                  >
                    651-410-4196
                  </a>
                  <a
                    href="mailto:skysthelimitpainting1779@gmail.com"
                    data-track="lead_mailto_fallback_opened"
                    data-track-payload='{"source":"footer"}'
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    skysthelimitpainting1779@gmail.com
                  </a>
                </div>
                <SocialLinks />
              </div>

              <div>
                <h4 className="font-bold mb-6 text-lg">Markets</h4>
                <nav className="flex flex-col gap-4 text-gray-400">
                  <Link href="/residential" className="hover:text-orange-safety transition-colors">
                    Residential
                  </Link>
                  <Link href="/commercial" className="hover:text-orange-safety transition-colors">
                    Commercial
                  </Link>
                  <Link href="/public-sector" className="hover:text-orange-safety transition-colors">
                    Public Sector
                  </Link>
                  <Link href="/projects" className="hover:text-orange-safety transition-colors">
                    Recent Work
                  </Link>
                </nav>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-lg">Services</h4>
                <nav className="flex flex-col gap-4 text-gray-400">
                  <Link href="/painting-services/interior-painting" className="hover:text-orange-safety transition-colors">
                    Interior Painting
                  </Link>
                  <Link href="/painting-services/exterior-painting" className="hover:text-orange-safety transition-colors">
                    Exterior Painting
                  </Link>
                  <Link href="/painting-services/cabinet-refinishing" className="hover:text-orange-safety transition-colors">
                    Cabinet Refinishing
                  </Link>
                  <Link href="/painting-services/deck-fence-staining" className="hover:text-orange-safety transition-colors">
                    Deck & Fence Staining
                  </Link>
                  <Link href="/painting-services/commercial-repaints" className="hover:text-orange-safety transition-colors">
                    Commercial Repaints
                  </Link>
                </nav>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-lg">Service Areas</h4>
                <nav className="flex flex-col gap-4 text-gray-400">
                  <Link href="/service-area" className="hover:text-orange-safety transition-colors">
                    Coverage Map
                  </Link>
                  <Link href="/service-areas/inver-grove-heights" className="hover:text-orange-safety transition-colors">
                    Inver Grove Heights
                  </Link>
                  <Link href="/service-areas/eagan" className="hover:text-orange-safety transition-colors">
                    Eagan
                  </Link>
                  <Link href="/service-areas/woodbury" className="hover:text-orange-safety transition-colors">
                    Woodbury
                  </Link>
                  <Link href="/service-areas/st-paul" className="hover:text-orange-safety transition-colors">
                    St. Paul
                  </Link>
                </nav>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-lg">Company</h4>
                <nav className="flex flex-col gap-4 text-gray-400">
                  <Link href="/about" className="hover:text-orange-safety transition-colors">
                    About Us
                  </Link>
                  <Link href="/capabilities" className="hover:text-orange-safety transition-colors">
                    Capabilities Statement
                  </Link>
                  <Link href="/estimate" className="hover:text-orange-safety transition-colors">
                    Room Cost Calculator
                  </Link>
                  <Link href="/refer" className="hover:text-orange-safety transition-colors">
                    Referral Program
                  </Link>
                  <Link href="/review" className="hover:text-orange-safety transition-colors">
                    Google Review Funnel
                  </Link>
                  <Link href="/contact" className="hover:text-orange-safety transition-colors">
                    Get an Estimate
                  </Link>
                </nav>
              </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>© {currentYear} Sky's the Limit Painting LLC. All rights reserved.</p>
              <p>
                Registered MN Specialty Contractor (ID: IR816596) | Owner exempt from workers’ comp under MN Statute
                176.041 | Fully Insured
              </p>
              <p>Twin Cities Metro Area, MN</p>
            </div>
          </footer>
        </div>
        <Script id="hs-script-loader" async defer src="//js-na2.hs-scripts.com/246259637.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
