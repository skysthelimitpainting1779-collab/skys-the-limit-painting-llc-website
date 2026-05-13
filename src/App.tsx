/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import ServicesPage from './pages/Services';
import ServiceInterior from './pages/ServiceInterior';
import ServiceExterior from './pages/ServiceExterior';
import ServiceCommercial from './pages/ServiceCommercial';
import ServiceStriping from './pages/ServiceStriping';
import ProjectsPage from './pages/Projects';
import AboutPage from './pages/About';
import ServiceAreaPage from './pages/ServiceArea';
import ContactPage from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/interior" element={<ServiceInterior />} />
        <Route path="/services/exterior" element={<ServiceExterior />} />
        <Route path="/services/commercial" element={<ServiceCommercial />} />
        <Route path="/services/striping" element={<ServiceStriping />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/service-area" element={<ServiceAreaPage />} />
        <Route path="/contact" element={<ContactPage />} />
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
