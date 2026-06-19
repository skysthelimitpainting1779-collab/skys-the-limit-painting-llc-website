import ServiceStripingPage from '../../../views/ServiceStriping';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pavement Marking & Striping | Sky's the Limit Painting LLC",
  description: "Clean parking lot lines, safety markings, and pavement refreshes for small lots and facilities in the Twin Cities.",
};

export default function ServiceStriping() {
  return <ServiceStripingPage />;
}
