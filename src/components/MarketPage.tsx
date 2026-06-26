'use client';

import { ArrowRight, Calculator, Camera, CheckCircle2, ClipboardCheck, FileCheck2 } from 'lucide-react';
import Link from 'next/link';
import FadeIn from './animations/FadeIn';
import PageTransition from './PageTransition';
import BookingCta from './BookingCta';
import ResponsiveImage from './ResponsiveImage';
import JsonLd from './JsonLd';
import HeroOverlays from './HeroOverlays';
import IconFeatureCard from './IconFeatureCard';
import { marketBySlug, MarketSlug } from '../data/markets';
import { breadcrumbSchema, serviceSchema } from '../lib/seo';
import { trackEvent } from '../lib/analytics';

interface MarketPageProps {
  slug: MarketSlug;
}

export default function MarketPage({ slug }: MarketPageProps) {
  const market = marketBySlug[slug];
  const Icon = market.icon;

  return (
    <PageTransition>
      <JsonLd data={[
        serviceSchema(market.title, market.metaDescription, `/${market.slug}`),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: market.navLabel, path: `/${market.slug}` },
        ]),
      ]} />

      <section className="relative min-h-[calc(100svh-116px)] overflow-hidden bg-[#070706] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <HeroOverlays
          imageSrc={market.heroImage}
          imageAlt={`${market.title} project atmosphere`}
          imageClassName="absolute inset-0 h-full w-full object-cover opacity-56"
          loading="eager"
          fetchPriority="high"
          gradients={[
            'bg-[linear-gradient(90deg,#070706_0%,rgba(7,7,6,0.95)_36%,rgba(7,7,6,0.62)_68%,rgba(7,7,6,0.28)_100%)]',
            'bg-[linear-gradient(0deg,#070706_0%,rgba(7,7,6,0.08)_45%,rgba(7,7,6,0.2)_100%)]',
          ]}
          blueprintOpacity="opacity-18"
          roadRuleOpacity="opacity-75"
        />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          <FadeIn className="w-full overflow-hidden lg:col-span-7">
            <div className="mb-8 flex items-center gap-4 text-white">
              <span className="font-display text-6xl font-black leading-none opacity-70">{market.number}</span>
              <div className="h-px w-24 bg-white/60"></div>
              <Icon size={34} strokeWidth={1.5} />
            </div>
            <p className="mb-5 text-sm font-medium text-white">{market.accent}</p>
            <h1 className="max-w-[calc(100vw-2rem)] break-words text-[2rem] font-black leading-[1.02] text-white sm:max-w-5xl sm:text-5xl md:text-6xl lg:text-7xl">
              {market.title}
            </h1>
            <p className="mt-8 max-w-[calc(100vw-2rem)] text-lg leading-relaxed text-gray-300 sm:max-w-3xl md:text-2xl">{market.headline}</p>
            <div className="mt-8 grid max-w-[calc(100vw-2rem)] grid-cols-1 gap-3 sm:max-w-3xl sm:grid-cols-3">
              {market.proof.map((item) => (
                <div key={item} className="border-t border-white/10 pt-4">
                  <p className="break-words text-xs font-black leading-relaxed ] text-gray-300 sm:">{item}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.15} direction="left" className="w-full overflow-hidden lg:col-span-5">
            <div className="grid w-full overflow-hidden border border-white/15 bg-[#11100d]/90 backdrop-blur">
              <div className="relative min-h-[240px]">
                <ResponsiveImage src={market.image} alt={`${market.title} work example`} width={1600} height={900} loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover opacity-86" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080807] via-transparent to-transparent"></div>
                <span className="absolute left-5 top-5 border border-white/15 bg-[#080807]/75 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
                  {market.accent}
                </span>
              </div>
              <div className="p-6">
                <p className="max-w-full text-lg font-semibold leading-relaxed text-white sm:max-w-md">{market.summary}</p>
                <div className="mt-6 grid gap-3 text-sm text-[#d8c7aa]">
                  {market.proof.map((item) => (
                    <span key={item} className="flex min-w-0 items-start gap-2">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-white" size={16} />
                      <span className="min-w-0 break-words">{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-[#d8c7aa]/10 bg-[#11100d] px-4 py-20 sm:px-6 lg:px-8">
        <div className="measurement-rules absolute inset-0 opacity-15"></div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          <FadeIn className="lg:col-span-5">
            <div className="relative h-full min-h-[420px] overflow-hidden border border-white/10">
              <ResponsiveImage src={market.heroImage} alt={`${market.title} project showcase`} width={1600} height={1200} className="absolute inset-0 h-full w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,7,0.78),rgba(8,8,7,0.08))]"></div>
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-xs font-semibold text-white">Proven standards</p>
                <h2 className="mt-3 text-4xl font-black leading-tight text-white">Documented project stages from start to finish.</h2>
              </div>
            </div>
          </FadeIn>
          <div className="grid gap-4 lg:col-span-7 md:grid-cols-3">
            {[
              { icon: Camera, title: 'Remote Visual Scope', body: 'Upload or link photos of your rooms or surfaces directly in our estimate form for a faster, more precise preliminary review.' },
              { icon: ClipboardCheck, title: 'Streamlined Intake', body: 'Our simple multi-step form gathers your project details so we arrive fully prepared.' },
              { icon: FileCheck2, title: 'Itemized Proposals', body: 'We provide highly detailed, transparent scopes specifying exact preparation, paint products, and linear measurements.' },
            ].map((card, index) => (
              <FadeIn key={card.title} delay={0.06 * index}>
                <IconFeatureCard
                  icon={card.icon}
                  title={card.title}
                  body={card.body}
                  className="h-full border-l border-[#c8a45d]/35 bg-[#080807]/72 p-6"
                  iconClassName="mb-8 text-white"
                  as="div"
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black-primary px-6 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12">
          <FadeIn className="lg:col-span-4">
            <p className="text-sm font-medium text-white">Market Focus</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white">Engineered to meet the exact standards of your project.</h2>
          </FadeIn>

          <div className="grid gap-5 lg:col-span-8 md:grid-cols-3">
            {market.capabilities.map((capability, index) => (
              <FadeIn key={capability.title} delay={0.08 * index}>
                <article className="market-panel h-full border border-white/10 bg-black-charcoal p-6">
                  <span className="mb-8 block font-display text-4xl font-black text-white/80">0{index + 1}</span>
                  <h3 className="text-xl font-bold leading-tight text-white">{capability.title}</h3>
                  <p className="mt-5 text-sm leading-relaxed text-gray-300">{capability.body}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black-charcoal px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-white">Scope / Prep / Execute / Verify</p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">A disciplined process for better outcomes.</h2>
            </div>
          </FadeIn>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-white/10 md:grid-cols-4">
            {market.process.map((step, index) => (
              <FadeIn key={step.title} delay={0.08 * index}>
                <article className="h-full bg-black-primary p-6">
                  <p className="mb-8 text-sm font-medium text-white">Step 0{index + 1}</p>
                  <h3 className="text-2xl font-black text-white">{step.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-gray-300">{step.body}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black-primary px-6 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <FadeIn className="lg:col-span-7">
            <h2 className="max-w-3xl text-4xl font-black leading-tight text-white md:text-5xl">
              Insured, owner-led, and built for real scope clarity. (MN ID: IR816596 | MN Statute 176.041 Worker's Comp Exemption for owner-operators)
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">{market.description}</p>
          </FadeIn>
          <FadeIn delay={0.1} direction="left" className="lg:col-span-5">
            <div className="border border-white/30 bg-white/10 p-6">
              {market.proof.map((item) => (
                <div key={item} className="flex gap-3 border-b border-white/10 py-4 last:border-b-0">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-white" size={20} />
                  <p className="text-sm font-semibold text-white">{item}</p>
                </div>
              ))}
              <Link href="/estimate" onClick={() => trackEvent('hero_cta_click', { label: 'Price Range', source: market.slug })} className="mt-8 inline-flex w-full items-center justify-center gap-2 border border-white/35 bg-white/10 px-6 py-4 text-sm font-black text-white transition-colors hover:border-white hover:text-white">
                <Calculator size={18} /> Get A Price Range
              </Link>
              <Link href="/contact" onClick={() => trackEvent('hero_cta_click', { label: market.cta, source: market.slug })} className="mt-3 inline-flex w-full items-center justify-center gap-2 bg-white px-6 py-4 text-sm font-black text-[#050505] transition-colors hover:bg-gray-200">
                {market.cta} <ArrowRight size={18} />
              </Link>
              <BookingCta audience={market.slug === 'residential' ? 'homeowner' : market.slug} className="mt-3 w-full" />
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
