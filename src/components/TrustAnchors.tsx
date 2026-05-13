import { ShieldCheck, Star, MapPin } from 'lucide-react';

export default function TrustAnchors() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-6 sm:gap-8">
      <div className="flex items-center gap-2 text-white/40 text-sm font-medium tracking-wide">
        <Star size={18} className="text-white/40" />
        <span>150+ 5-Star Reviews</span>
      </div>
      <div className="flex items-center gap-2 text-white/40 text-sm font-medium tracking-wide">
        <ShieldCheck size={18} className="text-white/40" />
        <span>EPA Lead-Safe Certified</span>
      </div>
      <div className="flex items-center gap-2 text-white/40 text-sm font-medium tracking-wide">
        <MapPin size={18} className="text-white/40" />
        <span>Local Owner-Operated</span>
      </div>
    </div>
  );
}
