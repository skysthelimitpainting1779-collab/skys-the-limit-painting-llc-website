import { ArrowRight, Home, PaintRoller, Building2, Landmark, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import PageTransition from '../components/PageTransition';
import LeadForm from '../components/LeadForm';
import FadeIn from '../components/animations/FadeIn';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <PageMeta
        title="Page Not Found | Sky's the Limit Painting LLC"
        description="The requested Sky’s the Limit Painting LLC page was not found. Start from the homepage, projects, markets, or contact page."
        path="/404"
      />
      
      {/* 404 Dark Section */}
      <section className="relative overflow-hidden bg-black-primary px-6 py-24">
        <div className="blueprint-grid absolute inset-0 opacity-10"></div>
        <div className="relative mx-auto max-w-4xl text-center md:text-left">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-orange-safety">404 / Page not found</p>
          <h1 className="mt-5 text-5xl font-black uppercase leading-tight text-white md:text-7xl">
            This page is not on the job board.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 mx-auto md:mx-0">
            The link may be old, moved, or typed incorrectly. Don't worry, you can start fresh from the homepage, use the room cost calculator, or submit a request directly below.
          </p>
          <div className="mt-10 flex flex-col justify-center md:justify-start gap-3 sm:flex-row">
            <Link to="/" className="inline-flex items-center justify-center gap-2 bg-orange-safety px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-orange-deep">
              <Home size={18} />
              Back to Home
            </Link>
            <Link to="/estimate" className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/5 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition-colors hover:border-orange-safety hover:text-orange-safety">
              <Calculator size={18} />
              Room Cost Calculator
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Pages Quick Navigation */}
      <section className="bg-black-charcoal py-12 px-6 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-gray-500 mb-6">Or navigate our primary painting sectors:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/residential" className="flex items-center gap-4 p-4 border border-white/5 bg-white/5 hover:border-orange-safety transition-colors group">
              <span className="grid h-12 w-12 place-items-center border border-white/10 bg-white/5 text-orange-safety"><PaintRoller size={20} /></span>
              <div>
                <h4 className="font-bold text-white group-hover:text-orange-safety transition-colors">Residential</h4>
                <p className="text-xs text-gray-400">Interior & Exterior detail</p>
              </div>
            </Link>
            <Link to="/commercial" className="flex items-center gap-4 p-4 border border-white/5 bg-white/5 hover:border-orange-safety transition-colors group">
              <span className="grid h-12 w-12 place-items-center border border-white/10 bg-white/5 text-orange-safety"><Building2 size={20} /></span>
              <div>
                <h4 className="font-bold text-white group-hover:text-orange-safety transition-colors">Commercial</h4>
                <p className="text-xs text-gray-400">Offices, retail, property</p>
              </div>
            </Link>
            <Link to="/public-sector" className="flex items-center gap-4 p-4 border border-white/5 bg-white/5 hover:border-orange-safety transition-colors group">
              <span className="grid h-12 w-12 place-items-center border border-white/10 bg-white/5 text-orange-safety"><Landmark size={20} /></span>
              <div>
                <h4 className="font-bold text-white group-hover:text-orange-safety transition-colors">Public Sector</h4>
                <p className="text-xs text-gray-400">Striping, parking lots, specs</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Direct Capture Form Section */}
      <section className="bg-[#e6dfd2] px-6 py-20 text-[#171512]">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8b4d20]">Direct Estimate</p>
              <h2 className="mt-4 text-3xl font-black leading-tight">Request an estimate right here.</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#4c453d]">
                If you were looking for an estimate form, you don't need to navigate further. Describe your project surfaces, timeline, and location details below.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="border border-[#171512]/15 bg-[#f5f0e7] p-5 md:p-8">
                <LeadForm source="404 page redirect form" compact />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

