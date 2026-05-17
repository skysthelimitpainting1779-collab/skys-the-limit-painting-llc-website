/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import ResidentialPage from './pages/Residential';
import CommercialPage from './pages/Commercial';
import PublicSectorPage from './pages/PublicSector';
import ProjectsPage from './pages/Projects';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import { trackEvent } from './lib/analytics';

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

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/residential" element={<ResidentialPage />} />
        <Route path="/commercial" element={<CommercialPage />} />
        <Route path="/public-sector" element={<PublicSectorPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<Navigate to="/residential" replace />} />
        <Route path="/services/interior" element={<Navigate to="/residential" replace />} />
        <Route path="/services/exterior" element={<Navigate to="/residential" replace />} />
        <Route path="/services/commercial" element={<Navigate to="/commercial" replace />} />
        <Route path="/services/striping" element={<Navigate to="/public-sector" replace />} />
        <Route path="/services/pavement-marking" element={<Navigate to="/public-sector" replace />} />
        <Route path="/service-area" element={<Navigate to="/public-sector" replace />} />
        <Route path="*" element={<Navigate to="/contact" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnalyticsBridge />
      <ScrollToTop />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}
