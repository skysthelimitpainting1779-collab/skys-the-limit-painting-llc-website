import ServiceExteriorPage from '../../../views/ServiceExterior';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Exterior Painting Services | Sky's the Limit Painting LLC",
  description: "Protect curb appeal with prep-first exterior painting. Specialized in adhering to varied siding types and weather conditions in MN.",
};

export default function ServiceExterior() {
  return <ServiceExteriorPage />;
}
