'use client';

import type { Key } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Calculator,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Phone,
  ShieldCheck,
  UserCheck,
  Ruler,
} from 'lucide-react';
import FadeIn from '../components/animations/FadeIn';
import MagneticButton from '../components/animations/MagneticButton';
import LeadForm from '../components/LeadForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import Balancer from 'react-wrap-balancer';
import ResponsiveImage from '../components/ResponsiveImage';
import ServiceAreaMap from '../components/ServiceAreaMap';
import SpotlightCard from '../components/SpotlightCard';
import MarqueeTicker from '../components/ui/MarqueeTicker';
import AnimatedStatsBar from '../components/ui/AnimatedCounter';
import ReviewCarousel from '../components/ReviewCarousel';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import SpecInspector from '../components/SpecInspector';
import IconFeatureCard from '../components/IconFeatureCard';
import { markets, supportingImages, trustPillars, type MarketSlug } from '../data/markets';
import { trackEvent } from '../lib/analytics';
import { faqSchema } from '../lib/seo';

const corePositioningLine = 'No shortcuts. No mess. No surprise costs.';

const customerPromise =
  'Owner-operated craftsmanship from a Minnesota Journeyworker who treats your home or business like his own.';
const verifiedContractorLine =
  "Sky’s the Limit Painting LLC is a fully insured, owner-operated registered Minnesota Specialty Contractor (Painting). MN ID: IR816596 | MN Statute 176.041 Worker's Comp Exemption for owner-operators.";

const homeStats = [
  { target: 15, suffix: '+', label: 'Years Trade Experience' },
  { target: 100, suffix: '%', label: 'Owner-Led Work' },
  { target: 50, suffix: '+', label: 'Cities Served' },
];

const marqueeItems = [
  { text: 'General Liability Insured' },
  { text: 'MN Specialty Contractor' },
  { text: 'Owner-Operated' },
  { text: 'Twin Cities Metro' },
  { text: 'COI Available' },
  { text: 'Commercial + Residential' },
  { text: 'Public Sector Ready' },
  { text: 'Parking Lot Striping' },
  { text: 'Prep-First Standards' },
];

const conversionSteps = [
  {
    step: '01',
    title: 'Tell us what you need',
    body: 'Send your city, surfaces, timeline, and photos. Anthony reads every request personally.',
  },
  {
    step: '02',
    title: 'Get a clear scope and price',
    body: 'Anthony confirms the project, answers your questions, and turns the request into a written painting scope.',
  },
  {
    step: '03',
    title: 'Reserve your spot',
    body: 'Once you approve the estimate, a deposit locks your date. No surprises, no upsells on site.',
  },
];

const coverageItems = [
  ['General liability coverage in place', 'General liability coverage in place'],
  ['Commercial auto + tools coverage', 'Commercial auto + tools/equipment coverage'],
  ['COI available for qualified opportunities', 'COI available for qualified commercial/public-sector opportunities'],
];

const faqItems = [
  {
    question: 'How do you price a painting project?',
    answer:
      'Every estimate starts with the surfaces, access, prep needs, photos, and timeline so the scope is clear before any work begins. You get a real conversation first, then a written estimate.',
  },
  {
    question: 'What kinds of jobs do you handle?',
    answer:
      'Residential repaints, commercial interiors and exteriors, and public-sector facility work. The same prep-first standard applies whether it is a bedroom, storefront, or parking lot.',
  },
  {
    question: 'Do you provide insurance and COI documentation?',
    answer:
      'Yes. Sky’s the Limit Painting is fully insured, owner-operated, and can provide a COI for qualified commercial and public-sector opportunities.',
  },
  {
    question: 'What makes your estimates different?',
    answer:
      'You are talking directly with Anthony, not a sales team. That keeps the scope tight, the price honest, and the next steps simple from the first call to the final walkthrough.',
  },
];

const marketMedia: Record<MarketSlug, { image: string; label: string; accent: string }> = {
  residential: {
    image: '/images/site/iphone-interior-painting-progress.webp',
    label: 'Real home work',
    accent: 'Warm, detailed, protected',
  },
  commercial: {
    image: '/images/site/iphone-commercial-door-frame.webp',
    label: 'Real property work',
    accent: 'Structured, reliable, clean',
  },
  'public-sector': {
    image: '/images/services/striping/SkyLLP_ParkingLot_Striping.webp',
    label: 'Civic readiness',
    accent: 'Documented, precise, infrastructure-aware',
  },
};

const MotionLink = motion(Link);
const faqJson = faqSchema(faqItems);

const marketContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const marketItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 120, damping: 20 },
  },
};

const MarketLane = ({ market, index }: { market: (typeof markets)[number]; index: number; key?: Key }) => {
  const media = marketMedia[market.slug];
  const Icon = market.icon;

  return (
    <FadeIn delay={0.08 * index} className="h-full">
      <MotionLink
        href={`/${market.slug}`}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="group block h-full"
      >
        <Card className="h-full overflow-hidden border-zinc-800 bg-black/50 backdrop-blur-md transition-colors hover:bg-black/60">
          <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-zinc-800">
            <ResponsiveImage
              src={media.image}
              alt={`${market.navLabel} painting work example`}
              width={1600}
              height={1100}
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
            <span className="absolute left-5 top-5 bg-[#050505]/75 px-4 py-3 text-base font-semibold text-white backdrop-blur">
              {media.label}
            </span>
          </div>
          
          <CardHeader>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
              }}
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mb-4 flex items-center justify-between gap-5">
                <span className="font-display text-5xl font-black leading-none text-white/12">{market.number}</span>
                <span className="grid h-10 w-10 place-items-center border border-white/15 bg-white/5 text-white">
                  <Icon size={24} strokeWidth={1.6} />
                </span>
              </motion.div>
              <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="text-base font-semibold text-zinc-400">{media.accent}</motion.p>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                <CardTitle className="text-3xl tracking-tight text-white">{market.navLabel}</CardTitle>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                <CardDescription className="text-zinc-400">
                  <Balancer>{market.summary}</Balancer>
                </CardDescription>
              </motion.div>
            </motion.div>
          </CardHeader>

          <CardContent className="text-base text-zinc-300">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
              }}
            >
              <div className="grid gap-4 text-base sm:grid-cols-2">
                {market.proof.slice(0, 2).map((item) => (
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} key={item} className="flex gap-2 border-t border-zinc-800 pt-3">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-zinc-400" size={16} />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
              <motion.span variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mt-6 inline-flex items-center gap-3 text-base font-semibold text-white group-hover:text-zinc-300">
                View {market.navLabel} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </motion.span>
            </motion.div>
          </CardContent>
        </Card>
      </MotionLink>
    </FadeIn>
  );
};

const TrustPillar = ({ pillar, index }: { pillar: (typeof trustPillars)[number]; index: number; key?: Key }) => {
  const Icon = pillar.icon;

  return (
    <FadeIn delay={0.06 * index}>
      <div className="flex h-full flex-col justify-start border-t border-zinc-800 pt-10 transition-colors hover:border-zinc-500" onMouseEnter={() => trackEvent('proof_block_view', { title: pillar.title })}>
        <Icon className="mb-8 text-white" size={32} strokeWidth={1.5} />
        <h3 className="text-xl font-black leading-tight text-white">{pillar.title}</h3>
        <p className="mt-4 max-w-[65ch] text-lg leading-relaxed text-zinc-400">{pillar.body}</p>
      </div>
    </FadeIn>
  );
};

const ProcessStep = ({ step, title, body }: { step: string; title: string; body: string }) => (
  <div className="relative py-12 pl-16 border-t border-zinc-800/60">
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -left-2 top-4 select-none text-[6rem] font-black leading-none text-white/[0.04]"
    >
      {step}
    </span>
    <span className="absolute left-0 top-12 text-sm font-semibold text-zinc-600">{step}</span>
    <h3 className="text-2xl font-black leading-tight text-white">{title}</h3>
    <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-zinc-400">{body}</p>
  </div>
);

export default function HomeClient() {
  return (
    <>
      <section className="relative min-h-[calc(100svh-116px)] overflow-hidden bg-[#070706]">
        <ResponsiveImage
          src="/images/site/marketing-hero-exterior-painting.webp"
          alt="Exterior painting project with protected windows, clean drop cloths, and a painter working on trim"
          width={1600}
          height={900}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[58%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#070706_0%,rgba(7,7,6,0.94)_30%,rgba(7,7,6,0.58)_62%,rgba(7,7,6,0.22)_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#070706_0%,rgba(7,7,6,0.08)_38%,rgba(7,7,6,0.2)_100%)]"></div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-116px)] max-w-7xl flex-col justify-between px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
          <FadeIn className="w-full pt-8 md:pt-16">
            <p className="font-display mb-8 text-sm font-semibold text-zinc-500">
              Twin Cities Metro — MN ID: IR816596 | Residential detail. Commercial discipline. Public-sector ready.
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] text-white">
              <span className="block">The Twin Cities Painter</span>
              <span className="block">Who Preps Like</span>
              <span className="block text-white">He Lives Here.</span>
            </h1>
            <p className="mt-8 max-w-[65ch] text-base leading-relaxed text-[#e7dfd2] sm:text-lg">
              <span className="sm:hidden">
                No shortcuts. No mess. No surprise costs. Owner-operated craftsmanship from a Minnesota Journeyworker.
              </span>
              <span className="hidden sm:inline">
                Projects completed across Minneapolis, St. Paul, and the greater Twin Cities metro — residential, commercial, and public-sector work executed with owner-led discipline and uncompromising preparation.
              </span>
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <MagneticButton pullFactor={0.35}>
                <Link
                  href="/estimate"
                  onClick={() => trackEvent('hero_cta_click', { label: 'Get My Price Range', source: 'home_hero' })}
                  className="group inline-flex items-center gap-3 bg-white pl-8 pr-3 py-3 text-base font-bold text-[#15110a] transition-colors duration-300 hover:bg-gray-100"
                >
                  Get Your Free Estimate
                  <span className="grid h-10 w-10 place-items-center bg-[#15110a] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
                    <ArrowRight size={16} className="text-white" />
                  </span>
                </Link>
              </MagneticButton>
              <Link href="/contact" onClick={() => trackEvent('hero_cta_click', { label: 'Book Walkthrough', source: 'home_hero' })} className="inline-flex items-center justify-center gap-2 bg-[#111] px-8 py-4 text-base font-bold text-white transition-colors hover:text-gray-300">
                Book Your Free Walkthrough
              </Link>
              <a href="tel:+16514104196" onClick={() => trackEvent('call_click', { source: 'home_hero' })} className="inline-flex items-center justify-center gap-2 bg-[#111] px-8 py-4 text-base font-bold text-white transition-colors hover:text-gray-300">
                <Phone size={18} /> (651) 410-4196
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold text-zinc-500">
              <span>Fully Insured</span>
              <span className="text-zinc-700">·</span>
              <span>Owner-Led Every Job</span>
              <span className="text-zinc-700">·</span>
              <span>COI Available</span>
              <span className="text-zinc-700">·</span>
              <span>MN ID: IR816596</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.12} className="mt-20">
            <div className="grid gap-10 border-t border-[#d8c7aa]/20 pt-12 md:grid-cols-3">
              {conversionSteps.map((item) => (
                <div key={item.step} className="flex flex-col">
                  <p className="font-display text-sm font-semibold text-zinc-500">{item.step} / Customer path</p>
                  <h2 className="mt-4 text-xl font-black leading-tight text-white">{item.title}</h2>
                  <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-zinc-300">{item.body}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats bar between hero and light section */}
      <AnimatedStatsBar
        stats={homeStats}
        className="border-b border-[#d8c7aa]/10"
      />
      <section className="border-t border-white/[0.05] bg-[#050505] px-6 py-28 text-white sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12 lg:items-end">
          <FadeIn className="lg:col-span-7">
            <p className="font-display mb-6 text-sm font-semibold text-zinc-500">The standard</p>
            <h2 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl text-white">
              Most homeowners don&apos;t end up with a bad paint job because of the color.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-5">
            <p className="max-w-[65ch] text-lg leading-relaxed text-[#c9c1b4]">
              They end up with one because the prep was skipped — and it shows up months later. Some painters rush the sanding, prime with a roller in one hand and their phone in the other. The result? Peeling trim, bubbling walls, and a crew that&apos;s long gone before the problems appear. We work the opposite way.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#11100d] px-6 py-28 text-white sm:px-8 lg:px-12 lg:py-32">
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center">
          <FadeIn className="lg:col-span-5">
            <div className="relative min-h-[500px] overflow-hidden">
              <ResponsiveImage src="/images/site/marketing-hero-exterior-painting.webp" alt="Polished exterior painting project proof" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,7,0.86),rgba(8,8,7,0.1))]"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2 className="mt-5 text-4xl font-black leading-tight">Premium finishes built on absolute preparation.</h2>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-7">
            <p className="font-display mb-6 text-sm font-semibold text-zinc-500">The difference</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">
              Prep is 90% of a finish that actually lasts.
            </h2>
            <p className="mt-8 max-w-[65ch] text-lg leading-relaxed text-[#c9c1b4]">
              We clean, scrape, sand, caulk, mask, and prime every surface until it&apos;s truly ready — then we paint. Not because we&apos;re slow. Because the only way to deliver results that hold up for years is to build them on a solid foundation.
            </p>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {[
                [Camera, 'Real interior prep', '/images/site/iphone-interior-painting-progress.webp'],
                [UserCheck, 'Real exterior prep', '/images/site/iphone-exterior-prep-front-entry.webp'],
                [ClipboardCheck, 'Real commercial work', '/images/site/iphone-commercial-door-frame.webp'],
              ].map(([Icon, title, body]) => {
                const ProofIcon = Icon as typeof UserCheck;
                return (
                  <div key={title as string} className="flex flex-col border-t border-zinc-800 pt-8">
                    <div className="relative aspect-[4/3] w-full mb-6 overflow-hidden">
                      <ResponsiveImage src={body as string} alt={`${title as string} project photo`} width={1200} height={900} className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <div>
                      <ProofIcon className="mb-5 text-white" size={24} strokeWidth={1.5} />
                      <h3 className="text-lg font-black leading-tight">{title as string}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10 bg-[#050505] px-6 py-28 sm:px-8 lg:px-12 lg:py-32">
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="font-display mb-6 text-sm font-semibold text-zinc-500">Before &amp; after</p>
                <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">
                  Prep work is the entire secret.
                </h2>
              </div>
              <p className="max-w-[65ch] text-lg leading-relaxed text-[#c9c1b4] lg:col-span-5">
                Drag the slider to compare meticulous masking and prep with the finished result. This is what prep-first looks like in practice.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mx-auto max-w-[60ch] border border-white/10 p-4 bg-[#0b0b0a]">
              <BeforeAfterSlider
                beforeImage="/images/site/iphone-interior-painting-progress.webp"
                afterImage="/images/services/interior/sky-work-02-finished-living-room.webp"
                beforeLabel="Meticulous Masking & Prep"
                afterLabel="Flawless Owner-Led Finish"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="markets" className="relative overflow-hidden bg-[#080807] px-6 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="font-display mb-6 text-sm font-semibold text-zinc-500">Who we serve</p>
                <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">
                  Three markets. One standard.
                </h2>
              </div>
              <p className="max-w-[65ch] text-lg leading-relaxed text-[#c9c1b4] lg:col-span-5">
                Whether it is a home repaint, a commercial property refresh, or a documented municipal facility job, we bring the same prep discipline, owner oversight, and clean execution to every site.
              </p>
            </div>
          </FadeIn>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={marketContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {markets.map((market, index) => (
              <motion.div key={market.slug} variants={marketItemVariants} className="h-full">
                <MarketLane market={market} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <ServiceAreaMap />

      <section className="relative overflow-hidden border-y border-white/10 bg-[#050505] px-6 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12">
          <FadeIn className="lg:col-span-4">
            <p className="font-display mb-6 text-sm font-semibold text-zinc-500">Credentials</p>
            <h2 className="text-4xl font-black leading-tight text-white md:text-5xl">Owner-operated. Journeyworker-trained. Prep-first by design.</h2>
            <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-[#b9b2a6]">
              No sales team, no subcontractors, no handoffs. Anthony handles every estimate, every walkthrough, and every final inspection personally — backed by general liability, commercial auto, and tools coverage.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-8">
            {trustPillars.map((pillar, index) => (
              <TrustPillar key={pillar.title} pillar={pillar} index={index} />
            ))}
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl mt-12">
          <FadeIn delay={0.15}>
            <ReviewCarousel />
          </FadeIn>
        </div>
      </section>

      <section className="bg-[#080807] px-6 py-28 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start">
          <FadeIn className="lg:sticky lg:top-36 lg:col-span-5">
            <p className="font-display mb-6 text-sm font-semibold text-zinc-500">The process</p>
            <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">
              Prep. Paint. Verify. That&apos;s the whole job.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="flex flex-col gap-6">
              <ProcessStep step="01" title="Scope" body="We walk every space together. You point out what matters most. We measure, document, and agree on the exact scope before any work begins. No surprises later." />
              <ProcessStep step="02" title="Prep" body="This is where most jobs fail and ours succeed. We clean, scrape, sand, caulk, mask, and prime every surface thoroughly. We fix what needs fixing so the paint adheres properly and looks flawless for years." />
              <ProcessStep step="03" title="Execute" body="Two coats minimum (more where the surface demands it). Crisp, straight lines. Clean edges. Consistent coverage. We protect your floors, furniture, and belongings as if they were our own." />
              <ProcessStep step="04" title="Verify" body="We walk through the finished space together. You inspect every detail. If anything isn't right, we fix it before the drop cloths come up. Your approval is the real finish line." />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-white/[0.05] bg-[#0a0a09] px-6 py-28 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="mb-6 text-sm font-semibold text-zinc-500">What to expect</p>
                <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">
                  You shouldn&apos;t have to wonder what&apos;s happening on your job. You&apos;ll know.
                </h2>
              </div>
              <p className="max-w-[65ch] text-lg leading-relaxed text-[#c9c1b4] lg:col-span-5">
                Here&apos;s exactly what to expect when you hire Sky&apos;s the Limit Painting.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                'A text when we arrive each morning so you know the crew is on site.',
                'A progress photo texted by 4 PM — you see what we see, in real time.',
                'A proactive heads-up before any schedule change that could affect you.',
                'One owner-operator on every job. Not a project manager. Not a crew you never meet. Anthony.',
                'The scope and price we agree on at the estimate stays the scope and price. If we discover something unexpected, we call you first.',
              ].map((item) => (
                <div key={item} className="flex gap-3 border-t border-zinc-800 pt-6">
                  <CheckCircle2 className="mt-1 shrink-0 text-white" size={18} />
                  <p className="text-base leading-relaxed text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-white/[0.05] bg-[#080807] px-6 py-28 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <p className="mb-6 text-sm font-semibold text-zinc-500">The guarantee</p>
                <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">
                  If we agree on a finish date, we hit it — or that day&apos;s labor is on us.
                </h2>
                <p className="mt-8 max-w-[65ch] text-lg leading-relaxed text-[#c9c1b4]">
                  We keep schedules realistic because we don&apos;t overbook and we don&apos;t disappear. If we&apos;re late finishing on a day we committed to, we discount that day&apos;s labor. And if something isn&apos;t right after we leave? One call brings us back — no fine print, no arguments.
                </p>
                <div className="mt-10">
                  <Link
                    href="/contact"
                    onClick={() => trackEvent('guarantee_cta_click', { source: 'home_guarantee' })}
                    className="inline-flex items-center gap-3 bg-white px-8 py-4 text-base font-bold text-[#15110a] transition-colors duration-300 hover:bg-gray-100"
                  >
                    Book Your Free Walkthrough
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5">
                <blockquote className="border-l-2 border-white/20 pl-8">
                  <p className="text-xl leading-relaxed text-[#e7dfd2] italic">
                    &ldquo;They painted nearly every room inside my house — ceilings, walls, and trim throughout — and I barely felt like I had contractors in my home. They were prompt, professional, and the finish is flawless. I would absolutely hire them again.&rdquo;
                  </p>
                  <footer className="mt-6 text-sm font-semibold text-zinc-400">
                    — Sarah M., Twin Cities homeowner
                  </footer>
                </blockquote>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#182023] px-6 py-28 text-white sm:px-8 lg:px-12 lg:py-36">
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
          <FadeIn className="lg:col-span-6">
            <p className="font-display mb-6 text-sm font-semibold text-[#dce5e4]/50">Public sector</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">
              Already documented. Ready to bid.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-6">
            <p className="max-w-[65ch] text-lg leading-relaxed text-[#dce5e4]">
              General liability coverage, commercial auto, COI on request, and NAICS 238320 readiness. We build every job around the documentation and compliance standards that city, county, and state facilities require.
            </p>
          </FadeIn>
        </div>
        <div className="relative mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-3">
          {[
            { icon: FileCheck2, title: 'Detailed Documentation', body: 'We treat scope clarity, photos, COI requests, schedules, and closeout records with utmost professional seriousness.' },
            { icon: ShieldCheck, title: 'Comprehensive Coverage', body: 'We maintain robust general liability, commercial auto, and specialty tool coverages for your complete peace of mind.' },
            { icon: Ruler, title: 'Infrastructure Services', body: 'Providing facility painting, pavement markings, safety striping, and protective coatings for civic and public assets.' },
          ].map((card) => (
            <FadeIn key={card.title}>
              <IconFeatureCard
                icon={card.icon}
                title={card.title}
                body={card.body}
                className="flex flex-col border-t border-[#dce5e4]/20 pt-10"
                iconSize={30}
                iconClassName="mb-10 text-white"
                titleClassName="text-2xl font-black leading-tight text-white"
                bodyClassName="mt-5 max-w-[65ch] text-base leading-relaxed text-[#cbd4d3]"
                as="div"
              />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Social proof marquee above lead form */}
      <div className="border-y border-[#d8c7aa]/10 bg-[#0b0b0a] py-4">
        <MarqueeTicker items={marqueeItems.map(item => item.text)} speed="normal" />
      </div>

      <section id="faq" className="relative overflow-hidden border-t border-white/10 bg-[#060606] px-6 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start">
          <FadeIn className="lg:sticky lg:top-36 lg:col-span-4">
            <p className="font-display mb-6 text-sm font-semibold text-zinc-500">Questions before you book</p>
            <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">
              Quick answers for faster decisions.
            </h2>
            <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-[#c9c1b4]">
              Most people want to know what is included, how the estimate works, and whether the job is a fit. These are the questions we hear most often.
            </p>
            <div className="mt-8">
              <Link
                href="/estimate"
                onClick={() => trackEvent('faq_cta_click', { source: 'homepage_faq' })}
                className="inline-flex items-center gap-2 border border-white/20 bg-white px-6 py-3 text-sm font-black text-[#15110a] transition-colors hover:bg-zinc-100"
              >
                Start an estimate request
                <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>

          <div className="grid gap-6 lg:col-span-8 md:grid-cols-2">
            {faqItems.map((item) => (
              <FadeIn key={item.question}>
                <Card className="h-full border border-white/10 bg-[#0b0b0b] p-8 text-white">
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-black leading-tight text-white">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 pt-4">
                    <p className="max-w-[65ch] text-base leading-relaxed text-zinc-400">{item.answer}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#050505] px-6 py-28 text-white sm:px-8 lg:px-12 lg:py-36">
        <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden bg-[#0B0B0D] lg:grid-cols-12">
          <div className="relative min-h-[480px] lg:col-span-5">
            <ResponsiveImage src={supportingImages.commercialReal} alt="Owner-led commercial painting work" width={1200} height={900} className="absolute inset-0 h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,5,5,0.72),rgba(5,5,5,0.05))]"></div>
          </div>
          <div className="p-12 lg:col-span-7 lg:p-16 bg-[#0B0B0D]">
            <FadeIn>
              <p className="font-display mb-6 text-sm font-semibold text-zinc-500">Get started</p>
              <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">
                Request Your Free Scope Walkthrough
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                Tell us about your project and preferred timeline. Anthony or the team will follow up within one business day to schedule a no-obligation walkthrough.
              </p>
              <div className="mt-12">
                <LeadForm source="Homepage three-market estimate form" compact />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
      />

      <SpecInspector />
    </>
  );
}
