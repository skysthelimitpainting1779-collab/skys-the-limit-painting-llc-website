import ServicesPage from '../../views/Services';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Professional Painting Services | Sky's the Limit Painting LLC",
  description: "Professional painting and surface preparation built for real-world application. From residential interiors to high-traffic commercial environments.",
};

export default function Services() {
  return <ServicesPage />;
}
