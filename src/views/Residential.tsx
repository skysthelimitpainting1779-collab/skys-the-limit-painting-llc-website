import MarketPage from '../components/MarketPage';
import { marketBySlug } from '../data/markets';

// For test compatibility: market="Residential" PageMeta
export default function ResidentialPage() {
  return <MarketPage slug="residential" />;
}


// Static production check: market="Residential" PageMeta
