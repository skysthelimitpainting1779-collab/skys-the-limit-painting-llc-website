import MarketPage from '../components/MarketPage';
import { marketBySlug } from '../data/markets';

export default function CommercialPage() {
  return <MarketPage market={marketBySlug.commercial} />;
}

