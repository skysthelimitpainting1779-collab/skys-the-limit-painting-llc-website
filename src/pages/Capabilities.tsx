/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, FileText, CheckCircle2, Building, Landmark, Award } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import { breadcrumbSchema } from '../lib/seo';

export default function CapabilitiesPage() {
  return (
    <PageTransition>
      <PageMeta
        title="Corporate Capabilities Statement | Sky's the Limit Painting LLC"
        description="Official capabilities statement, corporate credentials, NAICS codes, and public sector bidding registry for Sky’s the Limit Painting LLC."
        path="/capabilities"
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Capabilities', path: '/capabilities' },
        ])}
      />

      {/* Hero Header */}
      <section className="relative bg-black-primary py-20 px-6 border-b border-white/10 text-white overflow-hidden">
        <div className="blueprint-grid absolute inset-0 opacity-5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 border border-orange-safety/30 bg-orange-safety/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-orange-safety mb-6">
              <Landmark size={12} /> Procurement & Bidding
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white uppercase tracking-normal leading-none">
              Capabilities Statement
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              Professional commercial, industrial, and public sector specialty painting services. Twin Cities metro area registered contractor.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-black-charcoal py-20 px-6 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Column 1 & 2: Main Details */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Core Competencies */}
            <div>
              <h2 className="text-2xl font-display font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="h-6 w-1 bg-orange-safety inline-block"></span>
                Core Competencies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-white/5 bg-[#11100d] p-6">
                  <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-3">Commercial & Facility Painting</h3>
                  <p className="text-sm text-gray-400">
                    High-durability coatings, protective sealants, drywall repairs, and precise cutting-in for retail spaces, corporate offices, and property developments.
                  </p>
                </div>
                <div className="border border-white/5 bg-[#11100d] p-6">
                  <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-3">Specialty Pavement Striping</h3>
                  <p className="text-sm text-gray-400">
                    Standard parking lot layout markings, ADA-compliant stencils, curb paint, and municipal parking garage traffic control markings.
                  </p>
                </div>
                <div className="border border-white/5 bg-[#11100d] p-6">
                  <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-3">Cabinet & Fine Millwork Spraying</h3>
                  <p className="text-sm text-gray-400">
                    Meticulous multi-stage prep, grain stabilization, industrial primers, and dust-controlled airless spray coatings for high-end wood upgrades.
                  </p>
                </div>
                <div className="border border-white/5 bg-[#11100d] p-6">
                  <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-3">Precision Prep & Trim Finish</h3>
                  <p className="text-sm text-gray-400">
                    Sanding, dust extraction, caulking, premium primer coat application, and high-performance trade-built neatness for longevity.
                  </p>
                </div>
              </div>
            </div>

            {/* Differentiators */}
            <div>
              <h2 className="text-2xl font-display font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="h-6 w-1 bg-orange-safety inline-block"></span>
                Why Partner With Sky's the Limit
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircle2 className="text-orange-safety shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-white uppercase text-xs tracking-wider mb-1">Journeyworker Apprenticeship Foundation</h3>
                    <p className="text-sm text-gray-400">
                      Led by Anthony Briseno, a tradesman who completed a comprehensive Minnesota Journeyworker Painter & Decorator apprenticeship.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="text-orange-safety shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-white uppercase text-xs tracking-wider mb-1">Thorough Surface Prep Protocol</h3>
                    <p className="text-sm text-gray-400">
                      Meticulous cleaning, scraping, deep sanding, and primer stabilization. We prioritize bond-quality and neatness over fast, cheap shortcuts.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="text-orange-safety shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-white uppercase text-xs tracking-wider mb-1">Owner-Operated Trade Execution</h3>
                    <p className="text-sm text-gray-400">
                      Direct trade oversight on every commercial project, ensuring transparent communication, project timeline tracking, and zero sub-contractor layers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance & Compliance */}
            <div>
              <h2 className="text-2xl font-display font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="h-6 w-1 bg-orange-safety inline-block"></span>
                Insurance & Compliance
              </h2>
              <div className="border border-white/10 bg-[#070706] p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-orange-safety shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider text-white">Liability Coverage</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Fully insured by Acuity Insurance ($1M/$2M Commercial General Liability, Commercial Auto, and Inland Marine). Policy validation records available.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="text-orange-safety shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider text-white">Workers' Compensation Exemption</p>
                    <p className="text-xs text-gray-300 mt-1">
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
            <div className="border border-[#d8c7aa]/16 bg-[#11100d]/90 p-6 md:p-8 backdrop-blur-sm space-y-6">
              <h3 className="font-display font-bold text-lg uppercase tracking-wider text-orange-safety pb-4 border-b border-white/10 flex items-center gap-2">
                <Building size={18} /> Company Profile
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Legal Entity</p>
                  <p className="text-sm font-bold text-white mt-1">Sky's the Limit Painting LLC</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Specialty Designation</p>
                  <p className="text-sm font-bold text-white mt-1">Registered Minnesota Specialty Contractor (Painting)</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">DLI Registration ID</p>
                  <p className="text-sm font-bold text-white mt-1">IR816596</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Employer Identification (EIN)</p>
                  <p className="text-sm font-bold text-white mt-1">41-4832542</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">SWIFT Portal ID</p>
                  <p className="text-sm font-mono text-white mt-1">VN0001223327_1</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">SAM.gov Status</p>
                  <p className="text-sm font-bold text-white mt-1">Active / Bidding Ready</p>
                </div>
              </div>
            </div>

            {/* NAICS Codes */}
            <div className="border border-white/10 p-6 space-y-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <Award size={16} className="text-orange-safety" /> Industry Codes
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-orange-safety">NAICS 238320</span>
                  <span className="text-gray-300 font-bold uppercase tracking-wider">Painting & Wall Covering</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-orange-safety">PSC Z1JZ</span>
                  <span className="text-gray-300 font-bold uppercase tracking-wider">Maint/Repair of Painting</span>
                </div>
              </div>
            </div>

            {/* Geographic Coverage */}
            <div className="border border-white/10 p-6 space-y-2 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-white">Geographic Scope</h4>
              <p className="text-gray-400 leading-relaxed">
                Headquartered in Inver Grove Heights, MN. Proudly providing commercial painting, pavement marking, and cabinet spraying across the entire Twin Cities Metropolitan Area.
              </p>
            </div>

          </div>

        </div>
      </section>
    </PageTransition>
  );
}
