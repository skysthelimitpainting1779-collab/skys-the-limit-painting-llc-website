import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from './animations/FadeIn';
import PageMeta from './PageMeta';
import PageTransition from './PageTransition';
import BookingCta from './BookingCta';
import ResponsiveImage from './ResponsiveImage';
import { Market } from '../data/markets';
import { breadcrumbSchema, serviceSchema } from '../lib/seo';
import { trackEvent } from '../lib/analytics';

interface MarketPageProps {
  market: Market;
}

export default function MarketPage({ market }: MarketPageProps) {
  const Icon = market.icon;

  return (
    <PageTransition>
      <PageMeta
        title={market.metaTitle}
        description={market.metaDescription}
        path={`/${market.slug}`}
        schema={[
          serviceSchema(market.title, market.metaDescription, `/${market.slug}`),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: market.navLabel, path: `/${market.slug}` },
          ]),
        ]}
      />

      <section className="relative overflow-hidden bg-black-primary px-6 py-20 md:py-28">
        <div className="blueprint-grid absolute inset-0 opacity-30"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-safety/70 to-transparent"></div>
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          <FadeIn className="lg:col-span-7">
            <div className="mb-8 flex items-center gap-4 text-orange-safety">
              <span className="font-display text-6xl font-black leading-none opacity-70">{market.number}</span>
              <div className="h-px w-24 bg-orange-safety/60"></div>
              <Icon size={34} strokeWidth={1.5} />
            </div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.32em] text-orange-safety">{market.accent}</p>
            <h1 className="max-w-5xl break-words text-5xl font-black uppercase leading-[0.94] tracking-normal text-white md:text-6xl lg:text-7xl">
              {market.title}
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">{market.headline}</p>
            <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {market.proof.map((item) => (
                <div key={item} className="border-t border-white/10 pt-4">
                  <p className="text-xs font-black uppercase leading-relaxed tracking-wider text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.15} direction="left" className="lg:col-span-5">
            <div className="relative overflow-hidden border border-white/15 bg-black-charcoal">
              <ResponsiveImage src={market.image} alt={`${market.title} work example`} width={1600} height={900} loading="eager" fetchPriority="high" className="h-[360px] w-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-black-primary/25 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="max-w-md text-lg font-semibold leading-relaxed text-white">{market.summary}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-black-primary px-6 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12">
          <FadeIn className="lg:col-span-4">
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-orange-safety">Market Focus</p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-tight text-white">Built for the way this work is actually bought.</h2>
          </FadeIn>

          <div className="grid gap-5 lg:col-span-8 md:grid-cols-3">
            {market.capabilities.map((capability, index) => (
              <FadeIn key={capability.title} delay={0.08 * index}>
                <article className="market-panel h-full border border-white/10 bg-black-charcoal p-6">
                  <span className="mb-8 block font-display text-4xl font-black text-orange-safety/80">0{index + 1}</span>
                  <h3 className="text-xl font-bold uppercase leading-tight text-white">{capability.title}</h3>
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
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-orange-safety">Scope / Prep / Execute / Verify</p>
              <h2 className="mt-4 text-4xl font-black uppercase leading-tight text-white md:text-5xl">A disciplined process for better outcomes.</h2>
            </div>
          </FadeIn>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-white/10 md:grid-cols-4">
            {market.process.map((step, index) => (
              <FadeIn key={step.title} delay={0.08 * index}>
                <article className="h-full bg-black-primary p-6">
                  <p className="mb-8 text-sm font-bold uppercase tracking-[0.28em] text-orange-safety">Step 0{index + 1}</p>
                  <h3 className="text-2xl font-black uppercase text-white">{step.title}</h3>
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
            <h2 className="max-w-3xl text-4xl font-black uppercase leading-tight text-white md:text-5xl">
              Insured, owner-led, and built for real scope clarity.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">{market.description}</p>
          </FadeIn>
          <FadeIn delay={0.1} direction="left" className="lg:col-span-5">
            <div className="border border-orange-safety/30 bg-orange-safety/10 p-6">
              {market.proof.map((item) => (
                <div key={item} className="flex gap-3 border-b border-white/10 py-4 last:border-b-0">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-orange-safety" size={20} />
                  <p className="text-sm font-semibold uppercase tracking-wider text-white">{item}</p>
                </div>
              ))}
              <Link to="/contact" onClick={() => trackEvent('hero_cta_click', { label: market.cta, source: market.slug })} className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-orange-safety px-6 py-4 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-orange-deep">
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
