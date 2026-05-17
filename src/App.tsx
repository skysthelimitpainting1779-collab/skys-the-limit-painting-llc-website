/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import ResidentialPage from './pages/Residential';
import CommercialPage from './pages/Commercial';
import PublicSectorPage from './pages/PublicSector';
import ProjectsPage from './pages/Projects';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';

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
        <Route path="/service-area" element={<Navigate to="/public-sector" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}
