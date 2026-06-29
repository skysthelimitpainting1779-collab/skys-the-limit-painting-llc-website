import { Award, CheckCircle2, MapPin } from 'lucide-react';

export default function TrustAnchors() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-6 sm:gap-8">
      <div className="flex items-center gap-2 text-white/40 text-sm font-medium">
        <CheckCircle2 size={18} className="text-white/40" />
        <span>10+ Years Trade Experience</span>
      </div>
      <div className="flex items-center gap-2 text-white/40 text-sm font-medium">
        <Award size={18} className="text-white/40" />
        <span>Journeyworker Apprenticeship</span>
      </div>
      <div className="flex items-center gap-2 text-white/40 text-sm font-medium">
        <MapPin size={18} className="text-white/40" />
        <span>Local Owner-Operated</span>
      </div>
    </div>
  );
}
