import MarketPage from '../../components/MarketPage';
import { marketBySlug } from '../../data/markets';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: marketBySlug.commercial.metaTitle,
  description: marketBySlug.commercial.metaDescription,
};

export default function CommercialPage() {
  return <MarketPage slug="commercial" />;
}
