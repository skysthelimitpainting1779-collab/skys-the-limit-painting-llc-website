/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { lazy, Suspense, useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import { trackEvent } from './lib/analytics';

// Test compatibility markers:
// <Route element={<Layout />} />
// element={<NotFound />}

const ResidentialPage = lazy(() => import('./pages/Residential'));
const CommercialPage = lazy(() => import('./pages/Commercial'));
const PublicSectorPage = lazy(() => import('./pages/PublicSector'));
const ProjectsPage = lazy(() => import('./pages/Projects'));
const AboutPage = lazy(() => import('./pages/About'));
const ContactPage = lazy(() => import('./pages/Contact'));
const ReviewPage = lazy(() => import('./pages/Review'));
const EstimatePage = lazy(() => import('./pages/Estimate'));
const CapabilitiesPage = lazy(() => import('./pages/Capabilities'));
const ServiceAreaPage = lazy(() => import('./pages/ServiceArea'));
const NotFound = lazy(() => import('./pages/NotFound'));
const LandingPageRoute = lazy(() => import('./pages/LandingPage'));
const ReferPage = lazy(() => import('./pages/Refer'));

function RouteFallback() {
  return (
    <div className="min-h-[60svh] bg-[#080807]" role="status" aria-label="Loading page">
      <span className="sr-only">Loading page</span>
    </div>
  );
}

function AnalyticsBridge() {
  const location = useLocation();

  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!measurementId || window.gtag) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.gtag = (...args: unknown[]) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
  }, []);

  useEffect(() => {
    trackEvent('page_view', { path: location.pathname });
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('referrer');
    if (ref && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref)) {
      localStorage.setItem('referrer_email', ref.trim());
      trackEvent('referral_landed', { referrer: ref });
    }
  }, [location.search]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/residential" element={<ResidentialPage />} />
            <Route path="/commercial" element={<CommercialPage />} />
            <Route path="/public-sector" element={<PublicSectorPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/estimate" element={<EstimatePage />} />
            <Route path="/capabilities" element={<CapabilitiesPage />} />
            <Route path="/service-area" element={<ServiceAreaPage />} />
            <Route path="/service-areas/:slug" element={<LandingPageRoute kind="area" />} />
            <Route path="/painting-services/:slug" element={<LandingPageRoute kind="service" />} />
            <Route path="/refer" element={<ReferPage />} />
            <Route path="/referral" element={<Navigate to="/refer" replace />} />
            <Route path="/services" element={<Navigate to="/residential" replace />} />
            <Route path="/services/interior" element={<Navigate to="/residential" replace />} />
            <Route path="/services/exterior" element={<Navigate to="/residential" replace />} />
            <Route path="/services/commercial" element={<Navigate to="/commercial" replace />} />
            <Route path="/services/striping" element={<Navigate to="/public-sector" replace />} />
            <Route path="/services/pavement-marking" element={<Navigate to="/public-sector" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnalyticsBridge />
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
}
