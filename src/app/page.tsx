import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "Sky's the Limit Painting LLC | Twin Cities Painting Contractor",
  description: "Sky’s the Limit Painting LLC provides interior and exterior painting estimates for homes, businesses, and facilities across the Twin Cities Metro Area.",
  alternates: {
    canonical: "https://www.skysthelimitpaintingllc.com",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
