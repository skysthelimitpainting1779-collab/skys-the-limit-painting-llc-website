import MarketPage from '../components/MarketPage';
import { marketBySlug } from '../data/markets';

export default function ResidentialPage() {
  return <MarketPage market={marketBySlug.residential} />;
}

