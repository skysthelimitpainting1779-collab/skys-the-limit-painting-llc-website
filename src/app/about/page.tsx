import AboutPage from '../../views/About';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Anthony Briseno | Sky's the Limit Painting LLC",
  description: "Learn about Anthony Briseno and Sky’s the Limit Painting LLC, an owner-operated Minnesota painting contractor serving the Twin Cities Metro.",
};

export default function About() {
  return <AboutPage />;
}
