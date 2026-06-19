import LandingPageRoute from '../../../views/LandingPage';
import { areaLandingPages } from '../../../data/landingPages';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return areaLandingPages.map((page) => ({
    slug: page.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = areaLandingPages.find((p) => p.slug === slug);
  if (!page) {
    return {};
  }
  return {
    title: page.metaTitle,
    description: page.metaDescription,
  };
}

export default async function ServiceAreaLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const page = areaLandingPages.find((p) => p.slug === slug);
  if (!page) {
    notFound();
  }
  return <LandingPageRoute kind="area" />;
}
