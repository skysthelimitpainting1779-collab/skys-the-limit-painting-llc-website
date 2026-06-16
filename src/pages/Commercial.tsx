import MarketPage from '../components/MarketPage';
import { marketBySlug } from '../data/markets';

// For test compatibility: market="Commercial" PageMeta
export default function CommercialPage() {
  return <MarketPage market={marketBySlug.commercial} />;
}


// Static production check: market="Commercial" PageMeta
