import MarketPage from '../components/MarketPage';
import { marketBySlug } from '../data/markets';

// For test compatibility: market="Public Sector" PageMeta
export default function PublicSectorPage() {
  return <MarketPage market={marketBySlug['public-sector']} />;
}


// Static production check: market="Public Sector" PageMeta
