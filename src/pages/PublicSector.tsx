import MarketPage from '../components/MarketPage';
import { marketBySlug } from '../data/markets';

export default function PublicSectorPage() {
  return <MarketPage market={marketBySlug['public-sector']} />;
}

