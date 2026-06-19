import MarketPage from '../../components/MarketPage';
import { marketBySlug } from '../../data/markets';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: marketBySlug.residential.metaTitle,
  description: marketBySlug.residential.metaDescription,
};

export default function ResidentialPage() {
  return <MarketPage slug="residential" />;
}
