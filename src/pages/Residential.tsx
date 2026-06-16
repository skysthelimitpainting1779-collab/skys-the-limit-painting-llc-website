import MarketPage from '../components/MarketPage';
import { marketBySlug } from '../data/markets';

export default function ResidentialPage() {
  return <MarketPage market={marketBySlug.residential} />;
}


// Static production check: market="Residential" PageMeta
