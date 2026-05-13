import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowRight, Paintbrush } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
}

const NavLink = ({ to, children }: { to: string; children: ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`relative text-sm font-semibold transition-colors py-2 group ${isActive ? 'text-orange-safety' : 'text-page-text hover:text-orange-safety'}`}
    >
      {children}
    </Link>
  );
};

export default function Layout({ children }: LayoutProps) {
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
    <div className="min-h-[100dvh] flex flex-col bg-page-bg text-page-text">
      {/* Desktop & Mobile Header */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black-primary/95 backdrop-blur-md border-white/10 shadow-sm py-4' : 'bg-black-primary border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg">
              <Paintbrush size={28} className="text-black-primary" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight hidden sm:block text-white">SKY'S<br/><span className="text-sm uppercase tracking-widest text-orange-safety">THE LIMIT</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/#reviews">Reviews</NavLink>
            <NavLink to="/service-area">Service Area</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="tel:651-410-4196" className="flex items-center gap-2 text-lg font-bold text-white hover:text-orange-safety transition-colors">
              <Phone size={20} className="text-orange-safety" />
              651-410-4196
            </a>
            <Link to="/contact" className="bg-orange-safety text-white px-8 py-3.5 rounded-sm font-bold hover:bg-orange-deep transition-colors flex items-center gap-2 uppercase tracking-wide text-sm">
              Get Free Estimate
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[88px] bg-black-charcoal z-40 lg:hidden flex flex-col p-6 overflow-y-auto pb-32"
          >
            <nav className="flex flex-col gap-6 text-xl">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/services">Services</NavLink>
              <NavLink to="/projects">Projects</NavLink>
              <NavLink to="/#reviews">Reviews</NavLink>
              <NavLink to="/service-area">Service Area</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </nav>
            <div className="mt-12 flex flex-col gap-4">
               <a href="tel:651-410-4196" className="w-full flex items-center justify-center gap-2 text-lg font-bold border-2 border-orange-safety text-white px-6 py-4 rounded-sm">
                <Phone size={20} className="text-orange-safety" />
                Call 651-410-4196
              </a>
              <Link to="/contact" className="w-full text-center bg-orange-safety text-white px-6 py-4 rounded-sm font-bold text-lg uppercase">
                Get Free Estimate
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-[104px] pb-20 md:pb-0">{children}</main>

      {/* Mobile Sticky Bottom CTA */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex gap-2">
        <a href="tel:651-410-4196" className="flex-1 bg-black-charcoal border border-white/10 text-white py-4 rounded-sm font-bold text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          <Phone size={18} className="text-orange-safety" />
          Call Now
        </a>
        <Link to="/contact" className="flex-1 bg-orange-safety text-white py-4 rounded-sm font-bold text-center shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center uppercase text-sm tracking-wide">
          Estimate
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-black-primary text-white py-20 px-6 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-display font-bold mb-4">Sky's the Limit Painting LLC</h2>
            <p className="text-gray-400 max-w-md text-lg">
              Professional painting done right for homes, businesses, and specialty surfaces across Inver Grove Heights and the Twin Cities Metro.
            </p>
            <div className="mt-8">
               <a href="tel:651-410-4196" className="text-xl font-bold text-orange-safety hover:text-white transition-colors block mb-2">651-410-4196</a>
               <a href="mailto:skysthelimitpainting1779@gmail.com" className="text-gray-400 hover:text-white transition-colors">skysthelimitpainting1779@gmail.com</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-lg">Services</h4>
            <nav className="flex flex-col gap-4 text-gray-400">
              <Link to="/services/interior" className="hover:text-orange-safety transition-colors">Interior Painting</Link>
              <Link to="/services/exterior" className="hover:text-orange-safety transition-colors">Exterior Painting</Link>
              <Link to="/services/commercial" className="hover:text-orange-safety transition-colors">Commercial Painting</Link>
              <Link to="/services/striping" className="hover:text-orange-safety transition-colors">Pavement Marking</Link>
              <Link to="/contact" className="hover:text-orange-safety transition-colors">Surface Prep</Link>
            </nav>
          </div>

          <div>
             <h4 className="font-bold mb-6 text-lg">Company</h4>
             <nav className="flex flex-col gap-4 text-gray-400">
              <Link to="/about" className="hover:text-orange-safety transition-colors">About Anthony</Link>
              <Link to="/projects" className="hover:text-orange-safety transition-colors">Recent Work</Link>
              <Link to="/service-area" className="hover:text-orange-safety transition-colors">Service Area</Link>
              <Link to="/contact" className="hover:text-orange-safety transition-colors">Get an Estimate</Link>
            </nav>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Sky's the Limit Painting LLC. All rights reserved.</p>
          <p>Based in Inver Grove Heights, MN</p>
        </div>
      </footer>
    </div>
  );
}
