import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent } from '../lib/analytics';

const NavLink = ({ to, children }: { to: string; children: ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <div className="relative group flex items-center">
      <Link 
        to={to} 
        onClick={() => trackEvent('nav_click', { path: to, label: String(children) })}
        className={`relative whitespace-nowrap text-xs font-bold uppercase tracking-widest transition-colors duration-200 py-2 hover:text-white ${isActive ? 'text-white' : 'text-gray-400'}`}
      >
        {children}
      </Link>
      {isActive && (
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-safety"></span>
      )}
    </div>
  );
};

export default function ConversionHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/78 backdrop-blur-md shadow-sm border-b border-white/10' : 'bg-[#050505]/92 backdrop-blur-sm'}`}>
        
        {/* Micro-Utility Bar */}
        <div className="h-8 bg-[#050505] border-b border-white/10 flex items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center gap-3 overflow-hidden text-[10px] md:text-[11px] uppercase tracking-widest text-white/70 font-bold">
            <span className="truncate">Interior + exterior painting in the Twin Cities</span>
            <span className="hidden sm:inline truncate">Request an estimate, approve the scope, reserve the schedule.</span>
          </div>
        </div>

        {/* Primary Nav */}
        <div className={`py-4`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center overflow-hidden border border-white/12 bg-white p-1.5">
                <img src="/brand/SkyLLP_BrandLogo.svg" alt="Sky's the Limit Painting LLC" className="h-full w-full object-contain" />
              </div>
              <span className="font-display hidden text-xl font-black leading-none tracking-normal text-white sm:block">
                SKY'S THE LIMIT
                <span className="mt-1 block text-[10px] uppercase tracking-[0.28em] text-[#f0c067]">Painting LLC</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <NavLink to="/residential">Residential</NavLink>
              <NavLink to="/commercial">Commercial</NavLink>
              <NavLink to="/public-sector">Public Sector</NavLink>
              <NavLink to="/projects">Projects</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </nav>

            {/* Desktop Actions - Conversion Anchor */}
            <div className="hidden items-center gap-4 md:flex">
              <Link
                to="/contact"
                onClick={() => trackEvent('hero_cta_click', { source: 'header', label: 'Get Estimate' })}
                className="whitespace-nowrap border border-orange-safety bg-orange-safety px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#050505] transition-colors hover:bg-white hover:border-white"
              >
                Get Estimate
              </Link>
              <a href="tel:651-410-4196" onClick={() => trackEvent('call_click', { source: 'header' })} className="group flex flex-col items-end gap-0">
                <span className="text-[10px] sm:text-[12px] font-bold uppercase tracking-widest text-white transition-colors">Call / Text</span>
                <span className="whitespace-nowrap text-xl font-black tracking-normal leading-none text-orange-safety transition-colors group-hover:text-white xl:text-3xl">651-410-4196</span>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[104px] bg-[#050505] z-40 lg:hidden flex flex-col p-6 overflow-y-auto pb-32"
          >
            <nav className="flex flex-col gap-6 text-xl">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/residential">Residential</NavLink>
              <NavLink to="/commercial">Commercial</NavLink>
              <NavLink to="/public-sector">Public Sector</NavLink>
              <NavLink to="/projects">Projects</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </nav>
            <div className="mt-12 flex flex-col gap-4">
              <a href="tel:651-410-4196" onClick={() => trackEvent('call_click', { source: 'mobile_menu' })} className="w-full text-center bg-orange-safety text-[#050505] px-6 py-4 rounded-sm font-black text-lg uppercase tracking-wide">
                Call / Text 651-410-4196
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
