'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import NotFound from './NotFound';
import { ArrowRight, Calculator, Camera, CheckCircle2, ClipboardCheck, MapPin, PaintRoller, Phone, Route } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import FadeIn from '../components/animations/FadeIn';
import LeadForm from '../components/LeadForm';
import ResponsiveImage from '../components/ResponsiveImage';
import IconFeatureCard from '../components/IconFeatureCard';
import { breadcrumbSchema, localBusinessSchema, serviceSchema } from '../lib/seo';
import { businessPhone } from '../lib/contact';
import {
  areaLandingPages,
  landingPageByKindAndSlug,
  landingPageBySlug,
  landingPagePath,
  serviceLandingPages,
  type LandingPage,
  type LandingPageKind,
} from '../data/landingPages';
import { trackEvent } from '../lib/analytics';

interface LandingPageRouteProps {
  kind: LandingPageKind;
  initialPageData?: LandingPage;
}

const marketPath = {
  Residential: '/residential',
  Commercial: '/commercial',
  'Public Sector': '/public-sector',
} as const;

const sectionImages = [
  '/brand/generated/sky-residential-authority.webp',
  '/brand/generated/sky-commercial-authority.webp',
  '/brand/generated/sky-public-authority.webp',
] as const;

export default function LandingPageRoute({ kind, initialPageData }: LandingPageRouteProps) {
  const { slug } = useParams();
  const pageData = initialPageData || landingPageByKindAndSlug(kind, typeof slug === 'string' ? slug : undefined);

  if (!pageData) {
    notFound();
    return <NotFound />;
  }

  const resolvedPage = pageData;

  const page = resolvedPage;
  const path = landingPagePath(page);
  const siblings = page.kind === 'area' ? areaLandingPages : serviceLandingPages;
  const relatedPages = page.related
    .map((relatedSlug) => landingPageBySlug(relatedSlug))
    .filter((related): related is LandingPage => Boolean(related))
    .slice(0, 4);
  const relatedCards = [
    ...relatedPages,
    ...siblings.filter(
      (sibling) => sibling.slug !== page.slug && !relatedPages.some((related) => related!.slug === sibling.slug),
    ),
  ].slice(0, 4);

  return (
    <PageTransition>
      <section className="relative overflow-hidden bg-[#070706] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <ResponsiveImage
          src={page.image}
          alt={`${page.title} visual proof`}
          width={1920}
          height={1080}
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-48"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#070706_0%,rgba(7,7,6,0.93)_42%,rgba(7,7,6,0.5)_100%)]"></div>
        <div className="measurement-rules absolute inset-0 opacity-20"></div>
        <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-80"></div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          <FadeIn className="w-full overflow-hidden lg:col-span-7">
            <div className="font-display mb-7 inline-flex max-w-full items-center gap-3 border border-[#d8c7aa]/20 bg-[#070706]/65 px-4 py-3 text-xs font-semibold text-white backdrop-blur sm:text-xs">
              {page.kind === 'area' ? <MapPin size={16} /> : <PaintRoller size={16} />}
              <span>{page.eyebrow}</span>
            </div>
            <h1 className="max-w-[calc(100vw-2rem)] break-words text-[2rem] font-black leading-[1.02] text-white sm:max-w-5xl sm:text-5xl md:text-7xl">{page.title}</h1>
            <p className="mt-7 max-w-[calc(100vw-2rem)] text-base leading-relaxed text-[#e7dfd2] sm:max-w-3xl md:text-xl">{page.headline}</p>
            <div className="mt-8 flex max-w-[calc(100vw-2rem)] flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                onClick={() => trackEvent('landing_cta_click', { page: path, action: 'estimate' })}
                className="inline-flex items-center justify-center gap-2 bg-white px-7 py-4 text-sm font-semibold text-[#15110a] transition-colors hover:bg-white"
              >
                Start This Scope <ArrowRight size={18} />
              </Link>
              <Link
                href="/estimate"
                onClick={() => trackEvent('landing_cta_click', { page: path, action: 'calculator' })}
                className="inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/30 bg-[#070706]/55 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white hover:text-white"
              >
                <Calculator size={18} /> Price Range
              </Link>
              <a
                href={`tel:${businessPhone}`}
                onClick={() => trackEvent('call_click', { source: path })}
                className="inline-flex items-center justify-center gap-2 border border-[#d8c7aa]/30 bg-[#070706]/55 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white hover:text-white"
              >
                <Phone size={18} /> Call Anthony
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.12} direction="left" className="w-full overflow-hidden lg:col-span-5">
            <div className="w-full overflow-hidden border border-[#d8c7aa]/18 bg-[#11100d]/86 p-6 backdrop-blur">
              <p className="text-xs font-semibold text-white">{page.accent}</p>
              <p className="mt-5 text-base leading-relaxed text-[#e7dfd2]">{page.description}</p>
              <div className="mt-8 space-y-4">
                {page.proof.map((item) => (
                  <div key={item} className="flex gap-3 border-t border-white/10 pt-4">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-white" size={18} />
                    <span className="min-w-0 break-words text-base font-medium text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-[#e6dfd2] px-4 py-20 text-[#171512] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
          <FadeIn className="lg:col-span-4">
            <p className="text-xs font-semibold text-[#8b4d20]">Scope map</p>
            <h2 className="mt-5 break-words text-3xl font-black leading-tight sm:text-4xl md:text-5xl">A focused page for a real buyer question.</h2>
            <p className="mt-5 text-base leading-relaxed text-[#4c453d]">
              Start with the kind of work, where it is, what surface needs attention, and what proof or timeline matters before the first call.
            </p>
            {page.kind === 'area' && page.neighborhoods && page.neighborhoods.length > 0 && (
              <div className="mt-8 border-t border-[#8b4d20]/20 pt-6">
                <p className="text-xs font-semibold text-[#8b4d20]">Neighborhoods Served</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {page.neighborhoods.map((neighborhood) => (
                    <span key={neighborhood} className="bg-[#171512]/10 px-3 py-1.5 text-xs font-semibold text-[#171512]">
                      {neighborhood}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </FadeIn>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {page.scope.map((item, index) => (
              <FadeIn key={item} delay={0.04 * index}>
                <div className="flex min-h-[112px] gap-4 border-l border-[#8b4d20]/35 bg-[#f5f0e7] p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#171512]/15 bg-white text-xs font-black text-[#8b4d20]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-base font-black leading-snug text-[#171512]">{item}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#080807] px-4 py-24 sm:px-6 lg:px-8">
        <div className="blueprint-grid absolute inset-0 opacity-10"></div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          <FadeIn className="lg:sticky lg:top-36 lg:col-span-5">
            <p className="text-xs font-semibold text-white">How it moves</p>
            <h2 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">Clear steps before anyone starts painting.</h2>
          </FadeIn>
          <div className="grid gap-5 lg:col-span-7">
            {page.process.map((step, index) => (
              <FadeIn key={step.title} delay={0.08 * index}>
                <article className="grid overflow-hidden border border-white/10 bg-[#11100d] md:grid-cols-12">
                  <div className="relative min-h-[180px] md:col-span-5">
                    <ResponsiveImage
                      src={sectionImages[index % sectionImages.length]}
                      alt=""
                      width={900}
                      height={700}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="absolute inset-0 h-full w-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,7,0.75),rgba(8,8,7,0.12))]"></div>
                    <span className="absolute left-4 top-4 border border-white/15 bg-[#080807]/75 px-3 py-2 text-xs font-semibold text-white">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="p-7 md:col-span-7">
                    <h3 className="text-3xl font-black leading-tight text-white">{step.title}</h3>
                    <p className="mt-4 text-base leading-relaxed text-[#c9c1b4]">{step.body}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#182023] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <FadeIn className="lg:col-span-5">
            <p className="text-xs font-semibold text-white">Proof intake</p>
            <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">Send photos, location, timeline, and the surface story.</h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: Camera, title: 'Photo link', body: 'Add a Google Drive, iCloud, Dropbox, or public album link in the form.' },
                { icon: Route, title: 'Service lane', body: `This page routes into the ${page.market.toLowerCase()} estimate path.` },
                { icon: ClipboardCheck, title: 'Clear next step', body: 'Anthony gets the project details in a structured format instead of a vague callback request.' },
              ].map((card) => (
                <IconFeatureCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  body={card.body}
                  className="min-h-[210px] border-l border-white/35 bg-[#11100d] p-6"
                  iconClassName="mb-8 text-white"
                  bodyClassName="mt-4 text-sm leading-relaxed text-[#cbd4d3]"
                  as="div"
                />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-[#e6dfd2] px-4 py-24 text-[#171512] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden border border-[#171512]/15 bg-[#f5f0e7] lg:grid-cols-12">
          <div className="relative min-h-[420px] lg:col-span-5">
            <ResponsiveImage src={page.image} alt="" width={1200} height={900} sizes="(min-width: 1024px) 42vw, 100vw" className="absolute inset-0 h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(23,21,18,0.78),rgba(23,21,18,0.05))]"></div>
          </div>
          <div className="p-7 md:p-10 lg:col-span-7 lg:p-12">
            <FadeIn>
              <p className="text-xs font-semibold text-[#8b4d20]">Start the estimate</p>
              <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">{page.shortTitle} project details.</h2>
              <div className="mt-10">
                <LeadForm source={`${page.title} landing page`} defaultMarket={page.market} compact />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-[#080807] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Related paths</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Keep moving through the right lane.</h2>
            </div>
            <Link href={marketPath[page.market]} className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              View {page.market} <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {relatedCards.map((related) => (
              <Link
                key={related.slug}
                href={landingPagePath(related)}
                className="group min-h-[190px] border border-white/10 bg-[#11100d] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/60"
              >
                <p className="text-xs font-semibold text-[#9fa9a9]">{related.eyebrow}</p>
                <h3 className="mt-4 text-2xl font-black leading-tight text-white">{related.shortTitle}</h3>
                <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-white">
                  Open <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
