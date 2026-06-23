import LandingPageRoute from '../../../views/LandingPage';
import { areaLandingPages } from '../../../data/landingPages';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { localBusinessSchema, breadcrumbSchema } from '../../../lib/seo';

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
  const imageUrl = `https://www.skysthelimitpaintingllc.com${page.image}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `https://www.skysthelimitpaintingllc.com/service-areas/${slug}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://www.skysthelimitpaintingllc.com/service-areas/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${page.shortTitle} Painting Contractor | Sky's the Limit Painting LLC`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: [imageUrl],
    },
  };
}

export default async function ServiceAreaLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const page = areaLandingPages.find((p) => p.slug === slug);
  if (!page) {
    notFound();
  }

  const businessJson = localBusinessSchema(page.shortTitle, page.slug);
  const breadcrumbJson = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Service Area', path: '/service-area' },
    { name: page.shortTitle, path: `/service-areas/${page.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
      <LandingPageRoute kind="area" />
    </>
  );
}
