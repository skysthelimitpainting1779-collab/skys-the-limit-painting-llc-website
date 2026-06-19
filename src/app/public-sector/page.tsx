import MarketPage from '../../components/MarketPage';
import { marketBySlug } from '../../data/markets';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: marketBySlug['public-sector'].metaTitle,
  description: marketBySlug['public-sector'].metaDescription,
};

export default function PublicSectorPage() {
  return <MarketPage slug="public-sector" />;
}
