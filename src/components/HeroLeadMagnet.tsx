import { ArrowRight, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MagneticButton from './animations/MagneticButton';

export default function HeroLeadMagnet() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mt-6 mb-8">
        <MagneticButton pullFactor={0.4}>
          <Link 
            to="/contact" 
            className="w-full sm:w-auto bg-orange-safety text-[#050505] font-black uppercase tracking-wide px-8 py-4 flex items-center justify-center gap-2 hover:bg-orange-600 transition-all duration-300 rounded-sm"
          >
            GET YOUR FREE ESTIMATE <ArrowRight size={20} />
          </Link>
        </MagneticButton>
        <Link 
          to="/projects" 
          className="w-full sm:w-auto bg-transparent border border-white/20 text-white hover:text-orange-safety hover:border-orange-safety font-bold uppercase tracking-wide px-8 py-4 flex items-center justify-center transition-colors duration-300 rounded-sm"
        >
          VIEW RECENT WORK
        </Link>
      </div>
      
      {/* Immediate Trust Anchors */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-xs font-bold uppercase tracking-widest text-gray-300">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-orange-safety" fill="currentColor" />
          <span>Project Photos First</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-orange-safety" />
          <span>Free Estimates</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-orange-safety" />
          <span>Local MN Contractor</span>
        </div>
      </div>
    </div>
  );
}
