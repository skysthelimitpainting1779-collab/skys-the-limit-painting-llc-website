import ServiceCommercialPage from '../../../views/ServiceCommercial';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Commercial Painting Services | Sky's the Limit Painting LLC",
  description: "Professional repainting for shops, offices, facilities, and job sites prioritizing minimal disruption and durable finishes.",
};

export default function ServiceCommercial() {
  return <ServiceCommercialPage />;
}
