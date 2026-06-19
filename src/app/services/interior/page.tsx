import ServiceInteriorPage from '../../../views/ServiceInterior';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Interior Painting Services | Sky's the Limit Painting LLC",
  description: "Clean walls, sharp lines, and a finished space that feels new. We provide precise interior painting for homes and businesses.",
};

export default function ServiceInterior() {
  return <ServiceInteriorPage />;
}
