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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Balancer from 'react-wrap-balancer';
import ResponsiveImage from '../components/ResponsiveImage';
import ServiceAreaMap from '../components/ServiceAreaMap';
import SpotlightCard from '../components/SpotlightCard';
import MarqueeTicker from '../components/ui/MarqueeTicker';
import AnimatedStatsBar from '../components/ui/AnimatedCounter';
import ReviewCarousel from '../components/ReviewCarousel';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import SpecInspector from '../components/SpecInspector';
import { markets, supportingImages, trustPillars, type MarketSlug } from '../data/markets';
import { trackEvent } from '../lib/analytics';

const corePositioningLine = 'Residential detail. Commercial discipline. Public-sector ready.';

const customerPromise =
  'Interior and exterior painting for homes, businesses, and facilities across the Twin Cities Metro Area.';
const verifiedContractorLine =
  "Sky’s the Limit Painting LLC is a fully insured, owner-operated registered Minnesota Specialty Contractor (Painting). MN ID: IR816596 | MN Statute 176.041 Worker's Comp Exemption for owner-operators.";

const homeStats = [
  { target: 340, suffix: '+', label: 'Projects Completed' },
  { target: 12, suffix: ' Yrs', label: 'Trade Experience' },
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
              Twin Cities Metro — MN ID: IR816596
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] text-white">
              <span className="block">Twin Cities painting</span>
              <span className="block">contractor for homes,</span>
              <span className="block text-white">businesses, and facilities.</span>
            </h1>
            <p className="mt-8 max-w-[65ch] text-base leading-relaxed text-[#e7dfd2] sm:text-lg">
              <span className="sm:hidden">
                Interior and exterior painting done right — prep-first, owner-led, fully insured.
              </span>
              <span className="hidden sm:inline">
                Interior and exterior painting for Twin Cities homes and businesses. Anthony leads every job personally — no crews handed off, no subcontractors. Fully insured, prep-first, and ready to document for commercial and public-sector opportunities.
              </span>
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <MagneticButton pullFactor={0.35}>
                <Link
                  href="/estimate"
                  onClick={() => trackEvent('hero_cta_click', { label: 'Get My Price Range', source: 'home_hero' })}
                  className="group inline-flex items-center gap-3 bg-white pl-8 pr-3 py-3 text-base font-bold text-[#15110a] transition-colors duration-300 hover:bg-gray-100"
                >
                  Get My Price Range
                  <span className="grid h-10 w-10 place-items-center bg-[#15110a] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
                    <ArrowRight size={16} className="text-white" />
                  </span>
                </Link>
              </MagneticButton>
              <Link href="/contact" onClick={() => trackEvent('hero_cta_click', { label: 'Book Walkthrough', source: 'home_hero' })} className="inline-flex items-center justify-center gap-2 bg-[#111] px-8 py-4 text-base font-bold text-white transition-colors hover:text-gray-300">
                Book a Site Walkthrough
              </Link>
              <a href="tel:+16514104196" onClick={() => trackEvent('call_click', { source: 'home_hero' })} className="inline-flex items-center justify-center gap-2 bg-[#111] px-8 py-4 text-base font-bold text-white transition-colors hover:text-gray-300">
                <Phone size={18} /> Call or Text Anthony
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
              Anthony shows up. Preps it right. Gets it done.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-5">
            <p className="max-w-[65ch] text-lg leading-relaxed text-[#c9c1b4]">
              No crews handed off mid-job. No subcontractors. Anthony Briseno leads every interior and exterior painting project personally — from the first surface prep to final walkthrough. 12 years of trade experience, 340+ projects completed across the Twin Cities.
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
              90% of a flawless paint job happens before we open a can.
            </h2>
            <p className="mt-8 max-w-[65ch] text-lg leading-relaxed text-[#c9c1b4]">
              We scrape, sand, caulk, prime, and mask before a single topcoat goes on. That is the part most painters skip — and why our finishes hold. Every surface gets the prep it needs to last.
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
                  Residential, commercial, and public-sector ready.
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
            <h2 className="text-4xl font-black leading-tight text-white md:text-5xl">12 years. 340 projects. One owner on every job.</h2>
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
              Every job runs the same four-step process. No exceptions.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="flex flex-col gap-6">
              <ProcessStep step="01" title="Scope" body="Define surfaces, access, priorities, timeline, insurance or COI needs, and the expected finish before paint starts." />
              <ProcessStep step="02" title="Prep" body="Protect spaces, clean surfaces, patch, sand, caulk, mask, and stage the job so the finished work has a real foundation." />
              <ProcessStep step="03" title="Execute" body="Apply the right coating approach with owner-led communication and a jobsite that stays organized." />
              <ProcessStep step="04" title="Verify" body="Review the result, handle touchups, clean the area, and close the loop with photos or documentation when needed." />
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
            [FileCheck2, 'Detailed Documentation', 'We treat scope clarity, photos, COI requests, schedules, and closeout records with utmost professional seriousness.'],
            [ShieldCheck, 'Comprehensive Coverage', 'We maintain robust general liability, commercial auto, and specialty tool coverages for your complete peace of mind.'],
            [Ruler, 'Infrastructure Services', 'Providing facility painting, pavement markings, safety striping, and protective coatings for civic and public assets.'],
          ].map(([Icon, title, body]) => {
            const ReadinessIcon = Icon as typeof ClipboardCheck;
            return (
              <FadeIn key={title as string}>
                <div className="flex flex-col border-t border-[#dce5e4]/20 pt-10">
                  <ReadinessIcon className="mb-10 text-white" size={30} strokeWidth={1.5} />
                  <h3 className="text-2xl font-black leading-tight text-white">{title as string}</h3>
                  <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-[#cbd4d3]">{body as string}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* Social proof marquee above lead form */}
      <div className="border-y border-[#d8c7aa]/10 bg-[#0b0b0a] py-4">
        <MarqueeTicker items={marqueeItems.map(item => item.text)} speed="normal" />
      </div>

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
                Ready to get started? Tell us what you&apos;re working with.
              </h2>
              <div className="mt-12">
                <LeadForm source="Homepage three-market estimate form" compact />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <SpecInspector />
    </>
  );
}
