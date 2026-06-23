import EstimatePage from '../../views/Estimate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Interactive Room Paint Cost Calculator | Sky's the Limit Painting LLC",
  description: "Estimate your residential room interior painting and trim prep cost ranges instantly across the Twin Cities.",
  alternates: {
    canonical: 'https://www.skysthelimitpaintingllc.com/estimate',
  },
};

export default function Estimate() {
  return <EstimatePage />;
}
