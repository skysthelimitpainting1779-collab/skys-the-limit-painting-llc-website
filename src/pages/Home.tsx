import { FormEvent, useState } from 'react';
import type { Key } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Phone,
  Ruler,
  ShieldCheck,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';
import { markets, supportingImages, trustPillars, type MarketSlug } from '../data/markets';
import { openEstimateEmail } from '../lib/contact';

const corePositioningLine = 'Residential detail. Commercial discipline. Public-sector ready.';

const coverageItems = [
  'General liability coverage in place',
  'Commercial auto + tools/equipment coverage',
  'COI available for qualified commercial/public-sector opportunities',
];

const marketMedia: Record<MarketSlug, { video: string; poster: string; label: string; accent: string }> = {
  residential: {
    video: '/videos/sky-residential-loop.mp4',
    poster: '/brand/generated/premium-residential-finished-room.png',
    label: 'Home finish',
    accent: 'Warm, detailed, protected',
  },
  commercial: {
    video: '/videos/sky-commercial-loop.mp4',
    poster: '/brand/generated/premium-commercial-crew.png',
    label: 'Property standard',
    accent: 'Structured, reliable, clean',
  },
  'public-sector': {
    video: '/videos/sky-public-sector-loop.mp4',
    poster: '/brand/gbp/SkyGBP_Branded_Equipment.png',
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
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
            poster={media.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={media.video} type="video/mp4" />
          </video>
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
      <div className="h-full border-l border-[#c8a45d]/35 bg-[#11100d]/80 p-6">
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
  const [heroFormStatus, setHeroFormStatus] = useState<'idle' | 'opened'>('idle');

  const handleHeroEstimateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    openEstimateEmail({
      Source: 'Homepage three-market estimate form',
      'Full name': String(formData.get('fullName') || ''),
      Phone: String(formData.get('phone') || ''),
      Email: String(formData.get('email') || ''),
      'Project lane': String(formData.get('projectLane') || ''),
      'City or ZIP': String(formData.get('location') || ''),
      'Project details': String(formData.get('description') || ''),
    });

    setHeroFormStatus('opened');
  };

  return (
    <PageTransition>
      <PageMeta
        title="Sky's the Limit Painting LLC | Minnesota Painting Contractor"
        description="Sky’s the Limit Painting LLC is an insured, owner-operated Minnesota painting contractor built for residential painting, commercial work, and public-sector opportunities."
      />

      <section className="relative min-h-[calc(100svh-116px)] overflow-hidden bg-[#070706]">
        <video
          className="absolute inset-0 h-full w-full object-cover object-[58%_center]"
          poster="/brand/generated/premium-residential-spray.png"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/sky-hero-cinematic.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#070706_0%,rgba(7,7,6,0.94)_30%,rgba(7,7,6,0.58)_62%,rgba(7,7,6,0.22)_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#070706_0%,rgba(7,7,6,0.08)_38%,rgba(7,7,6,0.2)_100%)]"></div>
        <div className="blueprint-grid absolute inset-0 opacity-16"></div>
        <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-70"></div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-116px)] max-w-7xl flex-col justify-between px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <FadeIn className="max-w-4xl pt-6 md:pt-12">
            <div className="mb-7 inline-flex max-w-full items-center gap-3 border border-[#d8c7aa]/20 bg-[#070706]/55 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#f0c067] backdrop-blur sm:text-[11px] sm:tracking-[0.24em]">
              <ShieldCheck size={16} />
              <span className="sm:hidden">Insured MN Contractor</span>
              <span className="hidden sm:inline">Insured Minnesota Painting Contractor</span>
            </div>
            <h1 aria-label={corePositioningLine} className="max-w-4xl text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              <span className="block">Residential detail.</span>
              <span className="block text-[#f2d9bf]">Commercial discipline.</span>
              <span className="block text-[#f0c067]">Public-sector ready.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#e7dfd2] md:text-xl">
              Sky’s the Limit Painting LLC is an insured, owner-operated Minnesota painting contractor built for careful residential painting, reliable commercial work, and city, county, and state opportunities.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-[#f0c067] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#15110a] transition-colors hover:bg-white">
                Request an Estimate <ArrowRight size={18} />
              </Link>
              <a href="tel:651-410-4196" className="inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/30 bg-[#070706]/50 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white backdrop-blur transition-colors hover:border-[#f0c067] hover:text-[#f0c067]">
                <Phone size={18} /> Call or Text Anthony
              </a>
            </div>
            <div className="mt-8 flex max-w-3xl flex-col gap-3 text-sm font-semibold text-[#d8c7aa] md:flex-row md:flex-wrap md:items-center">
              {coverageItems.map((item) => (
                <span key={item} className="flex min-w-0 items-start gap-2">
                  <CheckCircle2 className="shrink-0 text-[#f0c067]" size={16} />
                  <span className="break-words">{item}</span>
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.12} className="mt-12">
            <div className="grid border-y border-[#d8c7aa]/20 bg-[#070706]/72 backdrop-blur md:grid-cols-3">
              {markets.map((market) => (
                <Link key={market.slug} to={`/${market.slug}`} className="group border-[#d8c7aa]/15 p-5 transition-colors hover:bg-white/5 md:border-r md:last:border-r-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#9fa9a9]">
                    {market.number} / {market.navLabel}
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#e7dfd2]">{market.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#f0c067]">
                    Enter lane <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
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
              A serious owner-led contractor brand, without pretending to be a giant company.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-[#3f3a33]">
              The site is organized around how buyers actually evaluate painting work: a homeowner wants care and protection, a commercial client wants reliable execution, and a public-sector buyer wants clarity, documentation, and follow-through.
            </p>
          </FadeIn>
        </div>
      </section>

      <section id="markets" className="relative overflow-hidden bg-[#080807] px-4 py-24 sm:px-6 lg:px-8">
        <div className="blueprint-grid absolute inset-0 opacity-10"></div>
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f0c067]">Three serious markets</p>
                <h2 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">
                  One standard, three different buyer mindsets.
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-[#c9c1b4] lg:col-span-5">
                Each lane gets a different visual rhythm and service story, tied together by trade discipline, clean prep, documentation, and owner accountability.
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

      <section className="relative overflow-hidden border-y border-[#d8c7aa]/10 bg-[#11100d] px-4 py-24 sm:px-6 lg:px-8">
        <div className="measurement-rules absolute inset-0 opacity-15"></div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
          <FadeIn className="lg:col-span-4">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f0c067]">Proof without hype</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">Verified claims, clean language.</h2>
            <p className="mt-5 text-sm leading-relaxed text-[#b9b2a6]">
              The site states what can be stated: insured, owner-operated, Minnesota-based, and organized for serious residential, commercial, and qualified public-sector opportunities.
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
              Built for city, county, and state painting opportunities as the company grows.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-6">
            <p className="text-lg leading-relaxed text-[#dce5e4]">
              Public-sector positioning stays accurate: no invented contracts, no unsupported certifications, and no inflated status claims. The brand presents capability, documentation discipline, insurance readiness, and a serious path toward facility and pavement-marking work.
            </p>
          </FadeIn>
        </div>
        <div className="relative mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-px bg-white/15 md:grid-cols-3">
          {[
            [FileCheck2, 'Documentation mindset', 'Scope clarity, photos, COI requests, quantities, surfaces, timelines, and project closeout details treated seriously.'],
            [ShieldCheck, 'Coverage language', 'General liability coverage, commercial auto coverage, and tools/equipment coverage stated carefully and truthfully.'],
            [Ruler, 'Infrastructure lanes', 'Facility repainting, pavement marking, road striping, sign painting, light poles, guardrails, and parking-lot striping positioned as opportunities.'],
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
            <img src={supportingImages.commercialReal} alt="Owner-led commercial painting work" className="absolute inset-0 h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(23,21,18,0.72),rgba(23,21,18,0.05))]"></div>
          </div>
          <div className="p-7 md:p-10 lg:col-span-7 lg:p-12">
            <FadeIn>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8b4d20]">Start the scope</p>
              <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                Request an estimate for a home, property, facility, or public-sector opportunity.
              </h2>
              <form className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleHeroEstimateSubmit}>
                <input name="fullName" type="text" placeholder="Full Name" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f]" required />
                <input name="phone" type="tel" placeholder="Phone Number" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f]" required />
                <input name="email" type="email" placeholder="Email Address" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f]" required />
                <select name="projectLane" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none focus:border-[#bf6f2f]" required defaultValue="">
                  <option value="" disabled>Project Lane</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="public-sector">Public Sector / Municipal Opportunity</option>
                </select>
                <input name="location" type="text" placeholder="City or ZIP Code" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f] md:col-span-2" required />
                <textarea name="description" rows={4} placeholder="Project details, surfaces, timeline, or COI needs" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f] md:col-span-2" required></textarea>
                <button type="submit" className="bg-[#171512] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#bf6f2f] md:col-span-2">
                  Open Estimate Email
                </button>
              </form>
              <p className="mt-5 flex items-start gap-2 text-sm font-semibold text-[#4c453d]" aria-live="polite">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#bf6f2f]" />
                {heroFormStatus === 'opened'
                  ? 'Email draft opened. You can also call or text 651-410-4196 for the fastest response.'
                  : 'Free estimate requests open a prefilled email draft. Call or text 651-410-4196 for fastest response.'}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
