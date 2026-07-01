import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title:
    "Sky's the Limit Painting LLC | Prep-First Painting Contractor Twin Cities",
  description:
    'Owner-operated Minnesota Journeyworker painter delivering meticulous preparation and lasting finishes for homes, businesses, and public facilities across Minneapolis, St. Paul, and the Twin Cities metro. Get your free estimate today. (651) 410-4196',
  alternates: {
    canonical: 'https://www.skysthelimitpaintingllc.com',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
