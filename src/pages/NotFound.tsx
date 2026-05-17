import { ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import PageTransition from '../components/PageTransition';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <PageMeta
        title="Page Not Found | Sky's the Limit Painting LLC"
        description="The requested Sky’s the Limit Painting LLC page was not found. Start from the homepage, projects, markets, or contact page."
        path="/404"
      />
      <section className="bg-black-primary px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-orange-safety">404 / Page not found</p>
          <h1 className="mt-5 text-5xl font-black uppercase leading-tight text-white md:text-7xl">
            This page is not on the current job board.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
            The link may be old, moved, or typed incorrectly. Start with the main markets or send the project details directly.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/" className="inline-flex items-center justify-center gap-2 bg-orange-safety px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-orange-deep">
              <Home size={18} />
              Home
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/5 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition-colors hover:border-orange-safety hover:text-orange-safety">
              Request an Estimate
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
