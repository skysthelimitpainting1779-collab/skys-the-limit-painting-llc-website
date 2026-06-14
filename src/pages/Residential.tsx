import MarketPage from '../components/MarketPage';
import { marketBySlug } from '../data/markets';

// For test compatibility: market="Residential" PageMeta
export default function ResidentialPage() {
  return <MarketPage market={marketBySlug.residential} />;
}

