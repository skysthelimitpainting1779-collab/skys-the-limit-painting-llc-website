import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "Prep-First Painting Contractor Twin Cities | Sky's the Limit Painting LLC",
  description:
    "Owner-operated Twin Cities painting contractor for homes, businesses, and public facilities. Interior, exterior, and striping work with meticulous prep, insured coverage, and fast free estimates.",
  alternates: {
    canonical: "https://www.skysthelimitpaintingllc.com",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
