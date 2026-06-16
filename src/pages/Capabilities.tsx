import { ShieldCheck, FileText, CheckCircle2, Building, Landmark, Award } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import ResponsiveImage from '../components/ResponsiveImage';
import { breadcrumbSchema } from '../lib/seo';

export default function CapabilitiesPage() {
  return (
    <PageTransition>
      <PageMeta
        title="Corporate Capabilities Statement | Sky's the Limit Painting LLC"
        description="Capabilities statement, verified corporate credentials, NAICS codes, SWIFT details, and public-sector readiness notes for Sky’s the Limit Painting LLC."
        path="/capabilities"
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Capabilities', path: '/capabilities' },
        ])}
      />

      {/* Hero Header */}
      <section className="relative bg-[#050505] py-20 px-6 text-white overflow-hidden">
        <ResponsiveImage
          src="/images/services/striping/SkyLLP_ParkingLot_Striping.webp"
          alt="Procurement and commercial parking lot striping"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/94 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        <div className="blueprint-grid absolute inset-0 opacity-12"></div>
        <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-70"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 border border-[#f0c067]/30 bg-[#050505]/55 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#f0c067] mb-6 backdrop-blur">
              <Landmark size={12} /> Procurement & Bidding
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-black mb-6 text-white uppercase tracking-normal leading-none">
              Capabilities Statement
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              Professional commercial, facility, and public-sector specialty painting services from a registered Minnesota Specialty Contractor (Painting).
            </p>
            <div className="mt-8">
              <a 
                href="/documents/skys-the-limit-capabilities-statement.pdf" 
                download
                className="inline-flex items-center gap-2 bg-[#f0c067] px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-[#050505] transition-colors hover:bg-white hover:text-black cursor-pointer"
              >
                <FileText size={16} /> Download Capabilities PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-[#050505] py-20 px-6 text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Column 1 & 2: Main Details */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Core Competencies */}
            <div>
              <h2 className="text-2xl font-display font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="h-6 w-1 bg-[#f0c067] inline-block"></span>
                Core Competencies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-white/10 bg-[#0B0B0D] p-6 hover:-translate-y-1 hover:border-[#f0c067]/45 transition duration-500">
                  <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-3">Commercial & Facility Painting</h3>
                  <p className="text-sm text-[#b9b2a6]">
                    High-durability coatings, protective sealants, drywall repairs, and precise cutting-in for retail spaces, corporate offices, and property developments.
                  </p>
                </div>
                <div className="border border-white/10 bg-[#0B0B0D] p-6 hover:-translate-y-1 hover:border-[#f0c067]/45 transition duration-500">
                  <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-3">Specialty Pavement Striping</h3>
                  <p className="text-sm text-[#b9b2a6]">
                    Standard parking lot layout markings, ADA-compliant stencils, curb paint, and municipal parking garage traffic control markings.
                  </p>
                </div>
                <div className="border border-white/10 bg-[#0B0B0D] p-6 hover:-translate-y-1 hover:border-[#f0c067]/45 transition duration-500">
                  <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-3">Cabinet & Fine Millwork Spraying</h3>
                  <p className="text-sm text-[#b9b2a6]">
                    Meticulous multi-stage prep, grain stabilization, industrial primers, and dust-controlled airless spray coatings for high-end wood upgrades.
                  </p>
                </div>
                <div className="border border-white/10 bg-[#0B0B0D] p-6 hover:-translate-y-1 hover:border-[#f0c067]/45 transition duration-500">
                  <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-3">Precision Prep & Trim Finish</h3>
                  <p className="text-sm text-[#b9b2a6]">
                    Sanding, dust extraction, caulking, premium primer coat application, and high-performance trade-built neatness for longevity.
                  </p>
                </div>
              </div>
            </div>

            {/* Differentiators */}
            <div>
              <h2 className="text-2xl font-display font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="h-6 w-1 bg-[#f0c067] inline-block"></span>
                Why Partner With Sky's the Limit
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircle2 className="text-[#f0c067] shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-white uppercase text-xs tracking-wider mb-1">Journeyworker Apprenticeship Foundation</h3>
                    <p className="text-sm text-[#b9b2a6]">
                      Led by Anthony Briseno, a tradesman who completed a comprehensive Minnesota Journeyworker Painter & Decorator apprenticeship.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="text-[#f0c067] shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-white uppercase text-xs tracking-wider mb-1">Thorough Surface Prep Protocol</h3>
                    <p className="text-sm text-[#b9b2a6]">
                      Meticulous cleaning, scraping, deep sanding, and primer stabilization. We prioritize bond-quality and neatness over fast, cheap shortcuts.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="text-[#f0c067] shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-white uppercase text-xs tracking-wider mb-1">Owner-Operated Trade Execution</h3>
                    <p className="text-sm text-[#b9b2a6]">
                      Direct trade oversight on every commercial project, ensuring transparent communication, project timeline tracking, and zero sub-contractor layers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance & Compliance */}
            <div>
              <h2 className="text-2xl font-display font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="h-6 w-1 bg-[#f0c067] inline-block"></span>
                Insurance & Compliance
              </h2>
              <div className="border border-white/10 bg-[#0B0B0D] p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-[#f0c067] shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider text-white">Liability Coverage</p>
                    <p className="text-xs text-[#b9b2a6] mt-1">
                      Fully insured by Acuity Insurance ($1M/$2M Commercial General Liability, Commercial Auto, and Inland Marine). Policy validation records available.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="text-[#f0c067] shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider text-white">Workers' Compensation Exemption</p>
                    <p className="text-xs text-[#b9b2a6] mt-1">
                      Exempt owner-operator status under Minnesota Statute 176.041 (zero payroll). Signed attestation forms are maintained, and certificates of compliance are provided upon request to commercial and government partners.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Column 3: Corporate Registries */}
          <div className="space-y-8 lg:border-l lg:border-white/10 lg:pl-10">
            
            {/* Quick Registry Box */}
            <div className="relative overflow-hidden border border-white/10 bg-[#0B0B0D]/90 p-6 md:p-8 backdrop-blur-sm space-y-6">
              <div className="measurement-rules absolute inset-0 opacity-12 pointer-events-none"></div>
              <h3 className="relative z-10 font-display font-bold text-lg uppercase tracking-wider text-[#f0c067] pb-4 border-b border-white/10 flex items-center gap-2">
                <Building size={18} /> Company Profile
              </h3>
              
              <div className="relative z-10 space-y-4">
                <div className="border border-white/5 bg-white/[0.02] p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#f0c067]">Legal Entity</p>
                  <p className="text-xs font-bold text-white mt-1 uppercase">Sky's the Limit Painting LLC</p>
                </div>
                <div className="border border-white/5 bg-white/[0.02] p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#f0c067]">Specialty Designation</p>
                  <p className="text-xs font-bold text-white mt-1 uppercase">Registered Minnesota Specialty Contractor (Painting)</p>
                </div>
                <div className="border border-[#f0c067]/20 bg-[#f0c067]/5 p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#f0c067]">DLI Registration ID</p>
                  <p className="text-xs font-mono font-bold text-white mt-1">IR816596</p>
                </div>
                <div className="border border-[#f0c067]/20 bg-[#f0c067]/5 p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#f0c067]">Employer Identification (EIN)</p>
                  <p className="text-xs font-mono font-bold text-white mt-1">41-4832542</p>
                </div>
                <div className="border border-[#f0c067]/20 bg-[#f0c067]/5 p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#f0c067]">SWIFT Portal ID</p>
                  <p className="text-xs font-mono font-bold text-white mt-1">VN0001223327_1</p>
                </div>
                <div className="border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">SAM.gov Package</p>
                  <p className="text-xs font-bold text-white mt-1 uppercase">Registration package in preparation</p>
                </div>
              </div>
            </div>

            {/* NAICS Codes */}
            <div className="relative overflow-hidden border border-white/10 bg-[#0B0B0D] p-6 space-y-4">
              <div className="measurement-rules absolute inset-0 opacity-10 pointer-events-none"></div>
              <h3 className="relative z-10 font-display font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <Award size={16} className="text-[#f0c067]" /> Industry Codes
              </h3>
              <div className="relative z-10 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[#f0c067]">NAICS 238320</span>
                  <span className="text-[#b9b2a6] font-bold uppercase tracking-wider">Painting & Wall Covering</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[#f0c067]">PSC Z1JZ</span>
                  <span className="text-[#b9b2a6] font-bold uppercase tracking-wider">Maint/Repair of Painting</span>
                </div>
              </div>
            </div>

            {/* Geographic Coverage */}
            <div className="border border-white/10 bg-[#0B0B0D] p-6 space-y-2 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-white">Geographic Scope</h4>
              <p className="text-[#b9b2a6] leading-relaxed">
                Headquartered in the Twin Cities Metro, MN. Proudly providing commercial painting, pavement marking, and cabinet spraying across the entire Metropolitan Area.
              </p>
            </div>

          </div>

        </div>
      </section>
    </PageTransition>
  );
}
