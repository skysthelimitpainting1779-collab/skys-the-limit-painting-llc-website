import type { Key } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Phone,
  UserCheck,
  Ruler,
  ShieldCheck,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';
import LeadForm from '../components/LeadForm';
import ResponsiveImage from '../components/ResponsiveImage';
import ServiceAreaMap from '../components/ServiceAreaMap';
import { markets, supportingImages, trustPillars, type MarketSlug } from '../data/markets';
import { businessSchema } from '../lib/seo';
import { trackEvent } from '../lib/analytics';

const corePositioningLine = 'Residential detail. Commercial discipline. Public-sector ready.';

const customerPromise =
  'Interior and exterior painting for homes, businesses, and facilities in Inver Grove Heights and the Twin Cities Metro.';
const verifiedContractorLine =
  'Sky’s the Limit Painting LLC is a fully insured, owner-operated registered Minnesota Specialty Contractor (Painting).';

const conversionSteps = [
  {
    step: '01',
    title: 'Request the estimate',
    body: 'Send your city, surfaces, timeline, and photos. The form emails Anthony the details live.',
  },
  {
    step: '02',
    title: 'Walk the scope',
    body: 'Anthony confirms the project, answers questions, and turns the request into a clear painting scope.',
  },
  {
    step: '03',
    title: 'Approve + reserve',
    body: 'After the estimate is approved, the job is scheduled and the deposit reserves the work window.',
  },
];

const coverageItems = [
  ['General liability coverage in place', 'General liability coverage in place'],
  ['Commercial auto + tools coverage', 'Commercial auto + tools/equipment coverage'],
  ['COI available for qualified opportunities', 'COI available for qualified commercial/public-sector opportunities'],
];

const marketMedia: Record<MarketSlug, { image: string; label: string; accent: string }> = {
  residential: {
    image: '/images/site/iphone-interior-painting-progress.png',
    label: 'Real home work',
    accent: 'Warm, detailed, protected',
  },
  commercial: {
    image: '/images/site/iphone-commercial-door-frame.png',
    label: 'Real property work',
    accent: 'Structured, reliable, clean',
  },
  'public-sector': {
    image: '/images/services/striping/SkyLLP_ParkingLot_Striping.png',
    label: 'Civic readiness',
    accent: 'Documented, precise, infrastructure-aware',
  },
};

const MarketLane = ({ market, index }: { market: (typeof markets)[number]; index: number; key?: Key }) => {
  const media = marketMedia[market.slug];
  const Icon = market.icon;
  const isEven = index % 2 === 0;

  return (
    <FadeIn delay={0.08 * index}>
      <Link
        to={`/${market.slug}`}
        className="group grid overflow-hidden border border-[#d8c7aa]/16 bg-[#11100d] transition duration-500 hover:-translate-y-1 hover:border-[#f0c067]/55 lg:grid-cols-12"
      >
        <div className={`relative min-h-[340px] overflow-hidden lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
          <ResponsiveImage
            src={media.image}
            alt={`${market.navLabel} painting work example`}
            width={1600}
            height={1100}
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080807] via-transparent to-transparent"></div>
          <div className="measurement-rules absolute inset-0 opacity-25"></div>
          <span className="absolute left-5 top-5 border border-white/15 bg-[#080807]/75 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#f0c067] backdrop-blur">
            {media.label}
          </span>
        </div>
        <div className={`relative flex min-h-[340px] flex-col justify-between p-7 md:p-10 lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
          <div>
            <div className="mb-10 flex items-center justify-between gap-5">
              <span className="font-display text-6xl font-black leading-none text-white/12">{market.number}</span>
              <span className="grid h-12 w-12 place-items-center border border-white/15 bg-white/5 text-white">
                <Icon size={24} strokeWidth={1.6} />
              </span>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#f0c067]">{media.accent}</p>
            <h3 className="mt-4 text-4xl font-black leading-[0.96] text-white md:text-5xl">{market.navLabel}</h3>
            <p className="mt-5 text-base leading-relaxed text-[#e4ded2]">{market.summary}</p>
          </div>
          <div className="mt-10">
            <div className="grid gap-3 text-sm text-[#d8c7aa] sm:grid-cols-2">
              {market.proof.slice(0, 2).map((item) => (
                <div key={item} className="flex gap-3 border-t border-white/10 pt-4">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#f0c067]" size={17} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <span className="mt-8 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] text-white">
              View {market.navLabel} <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
};

const TrustPillar = ({ pillar, index }: { pillar: (typeof trustPillars)[number]; index: number; key?: Key }) => {
  const Icon = pillar.icon;

  return (
    <FadeIn delay={0.06 * index}>
      <div className="h-full border-l border-[#c8a45d]/35 bg-[#11100d]/80 p-6" onMouseEnter={() => trackEvent('proof_block_view', { title: pillar.title })}>
        <Icon className="mb-8 text-[#f0c067]" size={28} strokeWidth={1.5} />
        <h3 className="text-lg font-black leading-tight text-white">{pillar.title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-[#b9b2a6]">{pillar.body}</p>
      </div>
    </FadeIn>
  );
};

const ProcessStep = ({ step, title, body }: { step: string; title: string; body: string }) => (
  <div className="relative border-t border-[#d8c7aa]/20 py-8 pl-16">
    <span className="absolute left-0 top-8 grid h-10 w-10 place-items-center border border-[#d8c7aa]/30 bg-[#0b0b0a] text-xs font-black text-[#f0c067]">
      {step}
    </span>
    <h3 className="text-2xl font-black leading-tight text-white">{title}</h3>
    <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#b9b2a6]">{body}</p>
  </div>
);

export default function HomePage() {
  return (
    <PageTransition>
      <PageMeta
        title="Sky's the Limit Painting LLC | Twin Cities Painting Contractor"
        description="Sky’s the Limit Painting LLC provides interior and exterior painting estimates for homes, businesses, and facilities in Inver Grove Heights and the Twin Cities Metro."
        path="/"
        schema={businessSchema}
      />

      <section className="relative min-h-[calc(100svh-116px)] overflow-hidden bg-[#070706]">
        <ResponsiveImage
          src="/images/site/marketing-hero-exterior-painting.png"
          alt="Exterior painting project with protected windows, clean drop cloths, and a painter working on trim"
          width={1600}
          height={900}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[58%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#070706_0%,rgba(7,7,6,0.94)_30%,rgba(7,7,6,0.58)_62%,rgba(7,7,6,0.22)_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#070706_0%,rgba(7,7,6,0.08)_38%,rgba(7,7,6,0.2)_100%)]"></div>
        <div className="blueprint-grid absolute inset-0 opacity-16"></div>
        <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-70"></div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-116px)] max-w-7xl flex-col justify-between px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <FadeIn className="w-full max-w-[calc(100vw-2rem)] pt-6 sm:max-w-4xl md:pt-12">
            <div className="mb-7 inline-flex max-w-full items-center gap-3 border border-[#d8c7aa]/20 bg-[#070706]/55 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#f0c067] backdrop-blur sm:text-[11px] sm:tracking-[0.24em]">
              <ShieldCheck size={16} />
              <span className="sm:hidden">Insured MN Contractor</span>
              <span className="hidden sm:inline">Insured Minnesota Painting Contractor</span>
            </div>
            <h1 aria-label={`${customerPromise} ${corePositioningLine}`} className="max-w-[calc(100vw-2rem)] text-[2.45rem] font-black leading-[0.98] text-white sm:max-w-4xl sm:text-6xl lg:text-7xl xl:text-8xl">
              <span className="block">Interior & exterior</span>
              <span className="block text-white">painting in Inver Grove Heights</span>
              <span className="block text-[#f0c067] sm:hidden">and the Twin</span>
              <span className="block text-[#f0c067] sm:hidden">Cities.</span>
              <span className="hidden text-[#f0c067] sm:block">and the Twin Cities.</span>
            </h1>
            <p className="mt-7 max-w-[calc(100vw-2rem)] text-base leading-relaxed text-[#e7dfd2] sm:max-w-2xl sm:text-lg md:text-xl">
              <span className="sm:hidden">
                Homes, businesses, and facilities. Request an estimate, approve the scope, reserve with a deposit.
              </span>
              <span className="hidden sm:inline">
                {customerPromise} {verifiedContractorLine} Request an estimate, approve the scope, then reserve your spot with a deposit when the job is ready to schedule.
              </span>
            </p>
            <p className="mt-4 text-sm font-black uppercase tracking-[0.22em] text-[#f0c067]">{corePositioningLine}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/contact" onClick={() => trackEvent('hero_cta_click', { label: 'Request an Estimate', source: 'home_hero' })} className="inline-flex items-center justify-center gap-2 bg-[#f0c067] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#15110a] transition-colors hover:bg-white">
                Request a Free Estimate <ArrowRight size={18} />
              </Link>
              <Link to="/estimate" onClick={() => trackEvent('hero_cta_click', { label: 'Price Range', source: 'home_hero' })} className="inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/30 bg-[#070706]/50 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white backdrop-blur transition-colors hover:border-[#f0c067] hover:text-[#f0c067]">
                <Calculator size={18} /> Get A Price Range
              </Link>
              <a href="tel:+16514104196" onClick={() => trackEvent('call_click', { source: 'home_hero' })} className="inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/30 bg-[#070706]/50 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white backdrop-blur transition-colors hover:border-[#f0c067] hover:text-[#f0c067]">
                <Phone size={18} /> Call or Text Anthony
              </a>
            </div>
            <div className="mt-8 flex max-w-3xl flex-col gap-3 text-sm font-semibold text-[#d8c7aa] md:flex-row md:flex-wrap md:items-center">
              {coverageItems.map(([mobile, desktop]) => (
                <span key={desktop} className="flex min-w-0 items-start gap-2">
                  <CheckCircle2 className="shrink-0 text-[#f0c067]" size={16} />
                  <span className="break-words sm:hidden">{mobile}</span>
                  <span className="hidden break-words sm:inline">{desktop}</span>
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.12} className="mt-12">
            <div className="grid border-y border-[#d8c7aa]/20 bg-[#070706]/72 backdrop-blur md:grid-cols-3">
              {conversionSteps.map((item) => (
                <div key={item.step} className="border-[#d8c7aa]/15 p-5 md:border-r md:last:border-r-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#9fa9a9]">{item.step} / Customer path</p>
                  <h2 className="mt-3 text-xl font-black leading-tight text-white">{item.title}</h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#e7dfd2]">{item.body}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-[#e6dfd2] px-4 py-20 text-[#171512] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          <FadeIn className="lg:col-span-7">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8b4d20]">Built from the trade up</p>
            <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Elite craftsmanship, transparent pricing, and zero jobsite stress.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-[#3f3a33]">
              We believe in exceptional craftsmanship from the ground up. Sky’s the Limit Painting is an owner-operated, fully insured registered MN specialty contractor based in Inver Grove Heights. We serve homeowners, business managers, and public agencies across the Twin Cities with a dedication to structural prep, neatness, and flawless execution.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#11100d] px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="measurement-rules absolute inset-0 opacity-15"></div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <FadeIn className="lg:col-span-5">
            <div className="relative min-h-[460px] overflow-hidden border border-white/12">
              <ResponsiveImage src="/images/site/marketing-hero-exterior-painting.png" alt="Polished exterior painting project proof" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,7,0.86),rgba(8,8,7,0.1))]"></div>
              <div className="absolute left-0 right-0 top-0 h-1 bg-[repeating-linear-gradient(90deg,#f0c067_0_72px,transparent_72px_112px)] opacity-80"></div>
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f0c067]">Elite Finishes</p>
                <h2 className="mt-4 text-4xl font-black leading-tight">Premium finishes built on absolute preparation.</h2>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-7">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f0c067]">Uncompromising Preparation</p>
            <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
              Elite preparation makes the finish last.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#c9c1b4]">
              We do not cut corners, skip prep, or leave a mess. A premium paint job is 90% preparation. That means we invest our time where it matters most: deep cleaning, scraping, sanding, priming, caulking, and meticulous masking to protect your active living or working spaces.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                [Camera, 'Real interior prep', '/images/site/iphone-interior-painting-progress.png'],
                [UserCheck, 'Real exterior prep', '/images/site/iphone-exterior-prep-front-entry.png'],
                [ClipboardCheck, 'Real commercial work', '/images/site/iphone-commercial-door-frame.png'],
              ].map(([Icon, title, body]) => {
                const ProofIcon = Icon as typeof UserCheck;
                return (
                  <div key={title as string} className="overflow-hidden border-l border-[#f0c067]/35 bg-[#080807]">
                    <div className="relative aspect-[4/3]">
                      <ResponsiveImage src={body as string} alt={`${title as string} project photo`} width={1200} height={900} className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <div className="p-5">
                      <ProofIcon className="mb-5 text-[#f0c067]" size={24} strokeWidth={1.5} />
                      <h3 className="text-lg font-black leading-tight">{title as string}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="markets" className="relative overflow-hidden bg-[#080807] px-4 py-24 sm:px-6 lg:px-8">
        <div className="blueprint-grid absolute inset-0 opacity-10"></div>
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f0c067]">Specialized Coating Divisions</p>
                <h2 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">
                  Tailored coating solutions for every scale.
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-[#c9c1b4] lg:col-span-5">
                Whether it is a custom residential repaint, a fast-track commercial property refresh, or a municipal facility upgrade, we deliver consistent trade discipline, clean job stages, and hands-on owner accountability from start to finish.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 gap-6">
            {markets.map((market, index) => (
              <MarketLane key={market.slug} market={market} index={index} />
            ))}
          </div>
        </div>
      </section>

      <ServiceAreaMap />

      <section className="relative overflow-hidden border-y border-[#d8c7aa]/10 bg-[#11100d] px-4 py-24 sm:px-6 lg:px-8">
        <div className="measurement-rules absolute inset-0 opacity-15"></div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
          <FadeIn className="lg:col-span-4">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f0c067]">Verified Standards</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">Trade discipline you can count on.</h2>
            <p className="mt-5 text-sm leading-relaxed text-[#b9b2a6]">
              We back our work with verified credentials, premium materials, clear contracts, and hands-on owner oversight. No sales gimmicks—just exceptional painting backed by general liability, commercial auto, and tools coverage.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-8">
            {trustPillars.map((pillar, index) => (
              <TrustPillar key={pillar.title} pillar={pillar} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080807] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-12 lg:items-start">
          <FadeIn className="lg:sticky lg:top-36 lg:col-span-5">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f0c067]">Scope / Prep / Execute / Verify</p>
            <h2 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">
              A process built for clean homes, active properties, and documented opportunities.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="border-l border-[#d8c7aa]/15">
              <ProcessStep step="01" title="Scope" body="Define surfaces, access, priorities, timeline, insurance or COI needs, and the expected finish before paint starts." />
              <ProcessStep step="02" title="Prep" body="Protect spaces, clean surfaces, patch, sand, caulk, mask, and stage the job so the finished work has a real foundation." />
              <ProcessStep step="03" title="Execute" body="Apply the right coating approach with owner-led communication and a jobsite that stays organized." />
              <ProcessStep step="04" title="Verify" body="Review the result, handle touchups, clean the area, and close the loop with photos or documentation when needed." />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#182023] px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="blueprint-grid absolute inset-0 opacity-20"></div>
        <div className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(90deg,#f0c067_0_72px,transparent_72px_112px)] opacity-80"></div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <FadeIn className="lg:col-span-6">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f0c067]">Public-sector readiness</p>
            <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
              Ready for public bids, state contracts, and municipal work.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-6">
            <p className="text-lg leading-relaxed text-[#dce5e4]">
              We maintain rigorous corporate compliance, full liability coverage, and structural documentation discipline, positioning us as a reliable partner for city, county, and state facility improvements.
            </p>
          </FadeIn>
        </div>
        <div className="relative mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-px bg-white/15 md:grid-cols-3">
          {[
            [FileCheck2, 'Detailed Documentation', 'We treat scope clarity, photos, COI requests, schedules, and closeout records with utmost professional seriousness.'],
            [ShieldCheck, 'Comprehensive Coverage', 'We maintain robust general liability, commercial auto, and specialty tool coverages for your complete peace of mind.'],
            [Ruler, 'Infrastructure Services', 'Providing facility painting, pavement markings, safety striping, and protective coatings for civic and public assets.'],
          ].map(([Icon, title, body]) => {
            const ReadinessIcon = Icon as typeof ClipboardCheck;
            return (
              <FadeIn key={title as string}>
                <div className="min-h-[260px] bg-[#182023] p-7">
                  <ReadinessIcon className="mb-10 text-[#f0c067]" size={30} strokeWidth={1.5} />
                  <h3 className="text-2xl font-black leading-tight text-white">{title as string}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#cbd4d3]">{body as string}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      <section className="bg-[#e6dfd2] px-4 py-24 text-[#171512] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden border border-[#171512]/15 bg-[#f5f0e7] lg:grid-cols-12">
          <div className="relative min-h-[420px] lg:col-span-5">
            <ResponsiveImage src={supportingImages.commercialReal} alt="Owner-led commercial painting work" width={1200} height={900} className="absolute inset-0 h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(23,21,18,0.72),rgba(23,21,18,0.05))]"></div>
          </div>
          <div className="p-7 md:p-10 lg:col-span-7 lg:p-12">
            <FadeIn>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8b4d20]">Start the scope</p>
              <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                Request an estimate for a home, property, facility, or public-sector opportunity.
              </h2>
              <div className="mt-10">
                <LeadForm source="Homepage three-market estimate form" compact />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
