import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "Twin Cities Painting Contractor | Sky's the Limit Painting LLC",
  description: "Owner-operated painting contractor serving Twin Cities homes and businesses. Interior and exterior painting, prep-first standards, fully insured. Get a free estimate today.",
  alternates: {
    canonical: "https://www.skysthelimitpaintingllc.com",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
