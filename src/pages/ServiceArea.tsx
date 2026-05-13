import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';

export default function ServiceAreaPage() {
  const areas = [
    "Inver Grove Heights", "South St. Paul", "West St. Paul", "Eagan",
    "Mendota Heights", "Cottage Grove", "Woodbury", "St. Paul", "Minneapolis",
    "Dakota County", "Ramsey County", "Washington County", "Hennepin County"
  ];

  return (
    <PageTransition>
      <PageMeta title="Service Area | Twin Cities Painting Contractor" description="Serving Inver Grove Heights, Dakota County, and the Twin Cities Metro. Local, dependable painting services near you." />
      <div className="bg-white min-h-screen">
        <div className="bg-black-primary text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Service Area</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Serving Inver Grove Heights & the Twin Cities Metro
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-24 px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold mb-6">Local & Dependable</h2>
            <p className="text-lg text-page-text leading-relaxed mb-8">
              Based in Inver Grove Heights, Sky’s the Limit Painting LLC serves homeowners, property owners, businesses, and facilities across the surrounding Twin Cities area.
            </p>
            <p className="text-lg text-page-text leading-relaxed mb-10">
              We focus on our designated service area to ensure we can provide prompt responses, accurate estimates, and dedicated time on every job site without stretching our resources too thin.
            </p>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-orange-safety text-white hover:bg-orange-deep px-8 py-4 rounded-xl font-bold transition-colors">
              Get an Estimate in Your Area
            </Link>
          </div>
          <div className="bg-gray-warm p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 font-display">Communities We Cover</h3>
            <div className="flex flex-wrap gap-4">
              {areas.map((loc, i) => (
                <span key={i} className="bg-white border border-gray-300 text-black-primary font-medium px-4 py-2 rounded-lg shadow-sm">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
