import MarketPage from '../components/MarketPage';
import { marketBySlug } from '../data/markets';

// For test compatibility: market="Commercial" PageMeta
export default function CommercialPage() {
  return <MarketPage slug="commercial" />;
}

// Static production check: market="Commercial" PageMeta
