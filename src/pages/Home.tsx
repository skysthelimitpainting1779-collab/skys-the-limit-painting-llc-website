import { Link } from 'react-router-dom';
import { Phone, ArrowRight, CheckCircle2, ChevronRight, Home, Building2, PaintRoller, GripHorizontal, Lightbulb, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';
import { useState } from 'react';

import heroImage from '../assets/images/regenerated_image_1778651981792.png';
import projectImage1 from '../assets/images/regenerated_image_1778651987756.png';
import projectImage2 from '../assets/images/regenerated_image_1778651993633.png';
import projectImage3 from '../assets/images/regenerated_image_1778652000603.png';

const PhotoServiceCard = ({ title, headline, bullets, image, icon: Icon, link, ctaText }: any) => (
  <div className="group relative rounded-sm overflow-hidden border border-white/10 shadow-sm flex flex-col h-full bg-black-charcoal">
    <div className="relative h-[250px] w-full overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black-charcoal via-black-charcoal/60 to-transparent"></div>
      <div className="absolute top-4 left-4 bg-black-primary/80 backdrop-blur-sm p-3 rounded-sm border border-white/10 text-orange-safety">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-2xl font-display font-bold uppercase tracking-wide text-white">{title}</h3>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h4 className="text-lg text-white font-bold mb-4">{headline}</h4>
      <ul className="mb-8 space-y-2 flex-1">
        {bullets.map((b: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <CheckCircle2 size={16} className="text-orange-safety shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link to={link || "/services"} className="inline-flex items-center gap-2 text-orange-safety font-bold text-sm tracking-widest uppercase hover:text-orange-deep transition-colors mt-auto border border-orange-safety/30 px-6 py-3 rounded-sm justify-center group-hover:border-orange-safety">
        {ctaText || "Learn More"} <ArrowRight size={16} />
      </Link>
    </div>
  </div>
);

const ProjectCard = ({ type, scope, work, result, image }: any) => (
  <div className="bg-black-charcoal border border-white/10 rounded-sm overflow-hidden flex flex-col group h-full">
    <div className="relative overflow-hidden h-[280px]">
      <img src={image} alt={type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute top-4 left-4">
        <span className="bg-orange-safety text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">
          {type}
        </span>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-1">
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Scope</h4>
          <p className="text-white text-sm leading-relaxed">{scope}</p>
        </div>
        <div className="w-full h-px bg-white/5"></div>
        <div>
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Work</h4>
          <p className="text-white text-sm leading-relaxed">{work}</p>
        </div>
        <div className="w-full h-px bg-white/5"></div>
        <div>
          <h4 className="text-orange-safety text-xs font-bold uppercase tracking-widest mb-1">Result</h4>
          <p className="text-white text-sm font-medium leading-relaxed">{result}</p>
        </div>
      </div>
      <Link to="/contact" className="mt-auto block text-center text-sm font-bold uppercase tracking-widest text-white border border-white/20 py-3 rounded-sm hover:border-orange-safety hover:text-orange-safety transition-colors">
        Have a Similar Project?
      </Link>
    </div>
  </div>
);

export default function HomePage() {
  const [formState, setFormState] = useState({ projectType: '', timeline: '', zipCode: '', description: '' });

  return (
    <PageTransition>
      <PageMeta 
        title="Sky's the Limit Painting LLC | Inver Grove Heights Painting Contractor" 
        description="Sky’s the Limit Painting LLC provides interior painting, exterior painting, commercial painting, pavement marking, light pole painting, and surface prep in Inver Grove Heights and the Twin Cities Metro. Request a free estimate today." 
      />
      
      {/* 2 & 3. Hero + Above-Fold Estimate Form */}
      <section className="relative bg-black-primary pt-12 pb-24 lg:pt-24 lg:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={heroImage} 
            alt="Painter on job site" 
            className="w-full h-full object-cover opacity-30" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black-primary via-black-primary/95 to-black-primary/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 text-white">
            <FadeIn>
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">
                Minnesota Painting & Pavement Marking Contractor
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight mb-2 uppercase">
                Professional Painting <br/><span className="text-orange-safety">Done Right</span>
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-semibold mb-6">
                From Homes to Commercial Jobs
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl">
                Sky’s the Limit Painting LLC helps homeowners, property owners, and businesses get clean, dependable painting work across Inver Grove Heights and the Twin Cities Metro. From interior and exterior painting to commercial repainting, light pole painting, and pavement marking, we bring careful prep, clean execution, and straight communication to every job.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <ul className="space-y-3 mb-10">
                {[
                  "Owner-operated local business",
                  "Residential, commercial, and specialty painting",
                  "Clean prep, sharp finish",
                  "Clear communication, dependable service"
                ].map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg">
                    <CheckCircle2 className="text-orange-safety shrink-0 mt-0.5" size={24} />
                    <span className="text-gray-200">{bullet}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 hidden lg:flex">
                  <a href="#estimate" className="bg-orange-safety hover:bg-orange-deep text-white px-8 py-4 rounded-sm font-bold transition-colors inline-flex items-center justify-center uppercase tracking-wide">
                    Get a Free Estimate <ArrowRight className="ml-2" size={20} />
                  </a>
                  <a href="tel:651-410-4196" className="bg-transparent hover:bg-white/5 text-white border-2 border-white/20 px-8 py-4 rounded-sm font-bold transition-colors inline-flex items-center justify-center gap-2 uppercase tracking-wide">
                    <Phone size={18} className="text-orange-safety" /> Call 651-410-4196
                  </a>
              </div>
            </FadeIn>

            {/* Service Preview Rail */}
            <FadeIn delay={0.4} className="hidden lg:block mt-12">
              <p className="text-sm font-bold tracking-widest uppercase text-white/50 mb-3">View Our Work</p>
              <div className="flex gap-4 scrollbar-hide overflow-x-auto pb-4">
                {[
                  { name: 'Interior', img: '/images/services/interior/sky-work-02-finished-living-room.png' },
                  { name: 'Exterior', img: '/images/backup/Sky_LLP_Painting_Photo_002.jpg' },
                  { name: 'Commercial', img: '/images/services/commercial/sky-work-08-finished-commercial.png' },
                  { name: 'Striping', img: '/images/services/striping/SkyLLP_ParkingLot_Striping.png' },
                  { name: 'Prep', img: '/images/backup/Sky_LLP_Painting_Photo_004.jpg' },
                ].map((item, i) => (
                  <a href="#services" key={i} className="group relative w-32 h-20 rounded-sm overflow-hidden border border-white/20 shrink-0">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors"></div>
                    <span className="absolute bottom-1 left-2 text-white text-xs font-bold uppercase tracking-wider">{item.name}</span>
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-5" id="estimate">
            <FadeIn delay={0.5} direction="left">
              <div className="bg-black-charcoal/80 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-2xl relative border border-white/10">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 text-center uppercase tracking-wide">Get Your Free Estimate</h2>
                <p className="text-gray-300 text-center mb-6 text-sm">Fast, free, and no obligation.</p>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" className="w-full bg-black-primary border border-white/20 rounded-sm p-3 text-white focus:border-orange-safety outline-none placeholder:text-gray-500" required />
                    <input type="tel" placeholder="Phone Number" className="w-full bg-black-primary border border-white/20 rounded-sm p-3 text-white focus:border-orange-safety outline-none placeholder:text-gray-500" required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="email" placeholder="Email Address" className="w-full bg-black-primary border border-white/20 rounded-sm p-3 text-white focus:border-orange-safety outline-none placeholder:text-gray-500" required />
                    <select className="w-full bg-black-primary border border-white/20 rounded-sm p-3 text-white focus:border-orange-safety outline-none" required defaultValue="">
                      <option value="" disabled className="text-gray-500">Project Type</option>
                      <option value="interior">Interior Painting</option>
                      <option value="exterior">Exterior Painting</option>
                      <option value="commercial">Commercial Painting</option>
                      <option value="striping">Pavement Marking / Striping</option>
                      <option value="specialty">Light Pole / Specialty</option>
                    </select>
                  </div>
                  <input type="text" placeholder="City or ZIP Code" className="w-full bg-black-primary border border-white/20 rounded-sm p-3 text-white focus:border-orange-safety outline-none placeholder:text-gray-500" required />
                  <textarea rows={3} placeholder="Tell us about your project" className="w-full bg-black-primary border border-white/20 rounded-sm p-3 text-white focus:border-orange-safety outline-none resize-none placeholder:text-gray-500" required></textarea>
                  <button type="submit" className="w-full bg-orange-safety hover:bg-orange-deep text-white font-bold py-4 rounded-sm transition-colors mt-2 text-lg uppercase tracking-wide">
                    Request My Estimate
                  </button>
                  <p className="text-center text-sm text-gray-400 mt-4 flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} className="text-orange-safety" /> 100% free. No obligation. Fast response.
                  </p>
                </form>
              </div>
            </FadeIn>
             <div className="mt-6 text-center lg:hidden">
                 <a href="tel:651-410-4196" className="text-white text-lg font-bold hover:text-orange-safety transition-colors">Or Call: 651-410-4196</a>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Trust Strip */}
      <section className="bg-black-charcoal py-10 border-b border-black-primary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <FadeIn delay={0.1}>
                <div className="flex items-start gap-4">
                  <CheckCircle2 size={32} className="text-orange-safety mt-1 shrink-0" />
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-1">Owner-Operated<br/>Local Business</h4>
                    <p className="text-gray-400 text-sm">Inver Grove Heights, MN</p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="flex items-start gap-4">
                  <PaintRoller size={32} className="text-orange-safety mt-1 shrink-0" />
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-1">Residential,<br/>Commercial & Specialty</h4>
                    <p className="text-gray-400 text-sm">Interior, Exterior & More</p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="flex items-start gap-4">
                  <CheckCircle2 size={32} className="text-orange-safety mt-1 shrink-0" />
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-1">Clean Prep.<br/>Sharp Finish.</h4>
                    <p className="text-gray-400 text-sm">Quality work that lasts</p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex items-start gap-4">
                  <span className="text-orange-safety mt-1 shrink-0">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line></svg>
                  </span>
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-1">Clear Communication.<br/>Dependable Service.</h4>
                    <p className="text-gray-400 text-sm">We do what we say we'll do</p>
                  </div>
                </div>
              </FadeIn>
          </div>
        </div>
      </section>

      {/* 5. Services Grid */}
      <section id="services" className="py-24 bg-black-primary px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="max-w-3xl mb-16 px-4">
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">
                What We Paint, Mark, Prep & Finish
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase tracking-tight">Complete Painting & Surface Solutions</h2>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                From clean interior repaints to commercial refreshes, parking lot markings, specialty surfaces, and prep work, Sky’s the Limit handles the work that makes a property look sharper and function better.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FadeIn delay={0.1}>
              <PhotoServiceCard 
                title="Interior Painting"
                headline="Clean walls. Sharp lines. Better rooms."
                bullets={["Walls, ceilings, trim, doors", "Homes, rentals, offices, refreshes", "Careful masking and cleanup"]}
                image="/images/services/interior/sky-work-02-finished-living-room.png"
                 icon={Home}
                 link="/services/interior"
                 ctaText="Plan Interior Project"
               />
            </FadeIn>
            <FadeIn delay={0.2}>
              <PhotoServiceCard 
                 title="Exterior Painting"
                 headline="Curb appeal with prep that holds up."
                 bullets={["Siding, trim, doors, garages", "Residential and small commercial exteriors", "Scraping, masking, coating, finish"]}
                 image="/images/backup/Sky_LLP_Painting_Photo_002.jpg"
                 icon={PaintRoller}
                 link="/services/exterior"
                 ctaText="Plan Exterior Project"
               />
            </FadeIn>
            <FadeIn delay={0.3}>
               <PhotoServiceCard 
                 title="Commercial Painting"
                 headline="Clean work for serious business spaces."
                 bullets={["Shops, offices, facilities", "Scheduling with less disruption", "Professional finish and cleanup"]}
                 image="/images/services/commercial/sky-work-08-finished-commercial.png"
                 icon={Building2}
                 link="/services/commercial"
                 ctaText="Discuss Commercial Job"
               />
            </FadeIn>
            <FadeIn delay={0.4}>
               <PhotoServiceCard 
                 title="Pavement Marking / Striping"
                 headline="Cleaner lots. Clearer traffic flow."
                 bullets={["Parking stalls", "Directional markings", "Safety and property presentation"]}
                 image="/images/services/striping/SkyLLP_ParkingLot_Striping.png"
                 icon={GripHorizontal}
                 link="/services/striping"
                 ctaText="Get Striping Quote"
               />
            </FadeIn>
            <FadeIn delay={0.5}>
               <PhotoServiceCard 
                 title="Light Pole / Specialty Painting"
                 headline="Specialty surfaces need serious prep."
                 bullets={["Light poles and fixtures", "Metal and exterior surfaces", "Durable coating approach"]}
                 image="/images/backup/Sky_LLP_Painting_Photo_003.jpg"
                 icon={Lightbulb}
                 link="/contact"
                 ctaText="Ask About Specialty Work"
               />
            </FadeIn>
            <FadeIn delay={0.6}>
               <PhotoServiceCard 
                 title="Surface Prep"
                 headline="The finish is only as good as the prep."
                 bullets={["Siding scraping and power washing", "Drywall patching, caulking, and sanding", "Primer coating application"]}
                 image="/images/backup/Sky_LLP_Painting_Photo_004.jpg"
                 icon={Sparkles}
                 link="/contact"
                 ctaText="Prep My Project"
               />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 6. Offer Wall / Bento Grid */}
      <section className="py-24 bg-black-primary px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-12">
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-3">
                Built For
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">Homes, Businesses, Lots & Specialty Surfaces</h2>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeIn delay={0.1}>
              <div className="relative group overflow-hidden rounded-sm h-[350px]">
                <img src="/images/services/interior/sky-work-01-finished-kitchen.png" alt="Home Interiors" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-black-primary/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-3xl font-display font-bold text-white uppercase tracking-wide mb-2">Home Interiors</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Walls", "Ceilings", "Trim", "Rentals", "Refreshes"].map((tag, i) => (
                      <span key={i} className="text-xs font-bold text-orange-safety border border-orange-safety/50 rounded-sm px-2 py-1 uppercase">{tag}</span>
                    ))}
                  </div>
                  <Link to="/services/interior" className="inline-flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase hover:text-orange-safety transition-colors">
                    View Interior Work <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="relative group overflow-hidden rounded-sm h-[350px]">
                <img src="/images/backup/Sky_LLP_Painting_Photo_001.jpg" alt="Exterior Property Refreshes" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-black-primary/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-3xl font-display font-bold text-white uppercase tracking-wide mb-2">Exterior Refreshes</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Siding", "Trim", "Doors", "Garages", "Curb Appeal"].map((tag, i) => (
                      <span key={i} className="text-xs font-bold text-orange-safety border border-orange-safety/50 rounded-sm px-2 py-1 uppercase">{tag}</span>
                    ))}
                  </div>
                  <Link to="/services/exterior" className="inline-flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase hover:text-orange-safety transition-colors">
                    View Exterior Work <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="relative group overflow-hidden rounded-sm h-[350px]">
                <img src="/images/services/commercial/sky-work-real-08-commercial.png" alt="Commercial Spaces" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-black-primary/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-3xl font-display font-bold text-white uppercase tracking-wide mb-2">Commercial Spaces</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Shops", "Offices", "Facilities", "After-Hours Work"].map((tag, i) => (
                      <span key={i} className="text-xs font-bold text-orange-safety border border-orange-safety/50 rounded-sm px-2 py-1 uppercase">{tag}</span>
                    ))}
                  </div>
                  <Link to="/services/commercial" className="inline-flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase hover:text-orange-safety transition-colors">
                    View Commercial Work <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="relative group overflow-hidden rounded-sm h-[350px]">
                <img src="/images/backup/Sky_LLP_Painting_Photo_005.jpg" alt="Marking & Specialty Work" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-black-primary/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-3xl font-display font-bold text-white uppercase tracking-wide mb-2">Marking + Specialty</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Striping", "Light Poles", "Metal", "Surface Prep"].map((tag, i) => (
                      <span key={i} className="text-xs font-bold text-orange-safety border border-orange-safety/50 rounded-sm px-2 py-1 uppercase">{tag}</span>
                    ))}
                  </div>
                  <Link to="/contact" className="inline-flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase hover:text-orange-safety transition-colors">
                    Contact Us For Specialty <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 7. Project Proof Module */}
      <section className="py-24 px-6 bg-black-charcoal border-t border-black-primary/50">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
              <div>
                <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-3">
                  Real Surfaces. Real Finish.
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-white uppercase">Project Proof</h2>
              </div>
              <Link to="/projects" className="font-bold text-orange-safety tracking-widest uppercase text-sm hover:text-orange-deep transition-colors flex items-center gap-2 pb-1">
                View All Projects <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <FadeIn delay={0.1}>
               <ProjectCard 
                type="Commercial Interior Refresh"
                scope="Ceiling tile and aluminum ceiling tracking/bars painted black."
                work="Surface prep and two coats applied."
                result="Darker, cleaner, more finished commercial interior."
                image="/images/services/commercial/sky-work-08-finished-commercial.png"
              />
             </FadeIn>
             <FadeIn delay={0.2}>
               <ProjectCard 
                type="Interior Residential Repaint"
                scope="Bedroom walls, trim, and doors requiring a fresh start."
                work="Patched drywall, masked trim, and applied two finish coats."
                result="Clean, modernized bedroom with sharp lines."
                image="/images/services/interior/sky-work-real-04-before-after-bedroom.png"
              />
             </FadeIn>
             <FadeIn delay={0.3}>
               <ProjectCard 
                type="Pavement Marking / Striping"
                scope="Faded lot lines causing parking confusion."
                work="Cleaned surface and restriped stalls and safety markings."
                result="Clear, bright, and compliant parking lot markings."
                image="/images/services/striping/SkyLLP_ParkingLot_Striping.png"
              />
             </FadeIn>
          </div>
        </div>
      </section>

      {/* 8. Process Section */}
      <section className="py-24 bg-black-primary text-white px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-3">
              The Sky Standard Process
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-16 uppercase tracking-tight">How We Work</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Inspect',
                desc: 'We look at surface condition, access, timeline, and scope.',
                image: '/images/backup/Sky_LLP_Painting_Photo_002.jpg'
              },
              {
                step: '2',
                title: 'Prep',
                desc: 'We prep before paint goes on. Scraping, patching, masking.',
                image: '/images/backup/Sky_LLP_Painting_Photo_004.jpg'
              },
              {
                step: '3',
                title: 'Paint',
                desc: 'Clean application, sharp lines, and jobsite respect.',
                image: '/images/backup/Sky_LLP_Painting_Photo_003.jpg'
              },
              {
                step: '4',
                title: 'Finish',
                desc: 'Final walkthrough, cleanup, and next steps.',
                image: '/images/services/interior/sky-work-01-finished-kitchen.png'
              }
            ].map((s, i) => (
              <FadeIn key={i} delay={0.1 * (i + 1)} className="flex flex-col group h-full">
                <div className="relative h-[200px] overflow-hidden rounded-sm mb-6 border border-white/10">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-orange-safety text-white font-display font-bold text-lg flex items-center justify-center rounded-sm">
                    {s.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold font-display uppercase tracking-wide text-xl mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 8.5 Equipment & Capabilities */}
      <section className="py-24 bg-black-charcoal border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="max-w-3xl mb-16">
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-3">
                Equipment & Capabilities
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tight mb-6">Built For More Than Basic Brush Work</h2>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                Sky’s the Limit is equipped for interior, exterior, commercial, and specialty painting work — including surfaces and jobs that need more prep than a basic repaint.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <FadeIn delay={0.1}>
              <div className="relative group overflow-hidden rounded-sm h-[250px] border border-white/10">
                <img src="/images/backup/Sky_LLP_Painting_Photo_005.jpg" alt="Commercial Equipment" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black-primary/90 via-black-primary/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white uppercase">Sprayers & Lifts</h3>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="relative group overflow-hidden rounded-sm h-[250px] border border-white/10">
                <img src="/images/backup/Sky_LLP_Painting_Photo_004.jpg" alt="Prep Tools" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black-primary/90 via-black-primary/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white uppercase">Surface Prep</h3>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="relative group overflow-hidden rounded-sm h-[250px] border border-white/10">
                <img src="/images/backup/Sky_LLP_Painting_Photo_001.jpg" alt="Work Trucks" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black-primary/90 via-black-primary/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white uppercase">Mobile Ready</h3>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="relative group overflow-hidden rounded-sm h-[250px] border border-white/10">
                <img src="/images/services/striping/SkyLLP_ParkingLot_Striping.png" alt="Striping Machine" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black-primary/90 via-black-primary/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white uppercase">Pavement Marking</h3>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 9. Reviews / Reputation Section */}
      <section id="reviews" className="py-24 bg-black-charcoal px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-white uppercase">Local Work. Real Reputation.</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <FadeIn delay={0.1} className="lg:col-span-4">
              <p className="text-gray-300 text-lg mb-8">
                We're proud to serve homeowners and businesses across the Twin Cities with honest work and clear communication.
              </p>
              <ul className="space-y-3">
                {[
                  "Clear communication",
                  "Respect for your property",
                  "Clean jobsite",
                  "Careful prep",
                  "Sharp, lasting finish"
                ].map((promise, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle2 className="text-orange-safety shrink-0" size={20} />
                    {promise}
                  </li>
                ))}
              </ul>
            </FadeIn>
            
            <FadeIn delay={0.2} direction="left" className="lg:col-span-8 bg-black-primary border border-white/10 p-8 md:p-12 rounded-sm flex items-center justify-center">
               <div className="text-center">
                 <h3 className="text-2xl font-bold mb-4 text-white uppercase tracking-wide">Reviews Coming Soon</h3>
                 <p className="text-gray-400 max-w-lg mx-auto">
                    We are actively building our online review profiles as we complete our first rounds of localized projects. Ask us for references during your estimate!
                 </p>
               </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 10 & 11. About & Service Area Split */}
      <section className="py-24 px-6 bg-black-primary">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 rounded-sm border border-white/10 overflow-hidden">
          {/* Left: About */}
          <div className="bg-black-charcoal p-8 md:p-12">
            <FadeIn>
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-3">
                About Sky's the Limit Painting LLC
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white leading-tight">Built by a Painter, Not a Sales Office</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <img src="https://picsum.photos/seed/owner/800/800" alt="Anthony Briseno" className="w-full sm:w-1/3 aspect-[4/3] object-cover rounded-sm border border-white/10" />
                <div className="flex-1">
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Sky’s the Limit Painting LLC is a Minnesota painting company based in Inver Grove Heights and led by Anthony Briseno.
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    After more than a decade in the trade and completing a Minnesota Journeyworker Painter & Decorator apprenticeship, Anthony started Sky’s the Limit to bring dependable, skilled painting work to homeowners, businesses, and specialty job sites across the Twin Cities area.
                  </p>
                  <Link to="/about" className="inline-flex items-center gap-2 text-orange-safety font-bold text-sm tracking-widest uppercase hover:text-orange-deep transition-colors">
                    Learn More About Anthony <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
          
          {/* Right: Service Area */}
          <div className="bg-black-charcoal p-8 md:p-12 relative overflow-hidden">
            <FadeIn delay={0.2} direction="left">
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-3 relative z-10">
                Serving the Twin Cities Metro
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-white relative z-10">Based in Inver Grove Heights, MN</h2>
              
              <div className="grid grid-cols-2 gap-y-3 relative z-10">
                {[
                  "Inver Grove Heights", "Woodbury", "South St. Paul", "St. Paul",
                  "West St. Paul", "Minneapolis", "Eagan", "Dakota County",
                  "Mendota Heights", "Ramsey County", "Cottage Grove", "Washington County", "Hennepin County"
                ].map((loc, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                    <CheckCircle2 size={16} className="text-orange-safety" /> {loc}
                  </div>
                ))}
              </div>
              
              <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-safety/20 via-black-charcoal/0 to-transparent pointer-events-none rounded-full blur-2xl"></div>
              
              <div className="mt-8 relative z-10">
                <Link to="/service-area" className="inline-flex items-center gap-2 text-orange-safety font-bold text-sm tracking-widest uppercase hover:text-orange-deep transition-colors border border-orange-safety/30 px-6 py-3 rounded-sm">
                  View Full Service Area <ArrowRight size={16} />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 12 & 13. FAQ & Final CTA */}
      <section className="py-24 px-6 bg-black-primary border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* FAQ */}
          <div>
            <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-3">
              Frequently Asked Questions
            </span>
            <div className="space-y-4">
              {[
                { q: "How much does painting cost?", a: "Costs vary depending on size, surface type, and required prep. We provide free, accurate estimates after reviewing the details." },
                { q: "Do you offer free estimates?", a: "Yes, we provide 100% free, clear, no-obligation estimates for all projects." },
                { q: "Are you insured?", a: "For commercial work or jobs requiring a COI, we confirm what documentation is available before scheduling." },
                { q: "How long does a typical project take?", a: "Interiors can be done in a few days, while larger exteriors or commercial jobs depend on scope. We give timelines with your estimate." },
                { q: "What areas do you service?", a: "Primarily Inver Grove Heights, Dakota County, and the greater Twin Cities Metro area." }
              ].map((faq, i) => (
                <div key={i} className="border-b border-white/10 pb-4">
                  <summary className="flex justify-between font-bold text-white cursor-pointer list-none pt-4 group">
                    {faq.q}
                    <span className="text-orange-safety opacity-60 group-hover:opacity-100 transition-opacity">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </span>
                  </summary>
                  <p className="text-gray-400 mt-2 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Final Form */}
          <div className="bg-black-charcoal border border-white/10 p-8 rounded-sm">
            <h2 className="text-2xl font-display font-bold text-white mb-2 text-center uppercase tracking-wide">Ready to Start Your Project?</h2>
            <p className="text-gray-400 text-center mb-8 text-sm">Get your free estimate today.</p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="w-full bg-black-primary border border-white/20 rounded-sm p-3 text-white focus:border-orange-safety outline-none placeholder:text-gray-500" required />
                <input type="tel" placeholder="Phone Number" className="w-full bg-black-primary border border-white/20 rounded-sm p-3 text-white focus:border-orange-safety outline-none placeholder:text-gray-500" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="City or ZIP Code" className="w-full bg-black-primary border border-white/20 rounded-sm p-3 text-white focus:border-orange-safety outline-none placeholder:text-gray-500" required />
                <select className="w-full bg-black-primary border border-white/20 rounded-sm p-3 text-white focus:border-orange-safety outline-none" required defaultValue="">
                  <option value="" disabled className="text-gray-500">Project Type</option>
                  <option value="interior">Interior</option>
                  <option value="exterior">Exterior</option>
                  <option value="commercial">Commercial</option>
                  <option value="striping">Striping</option>
                </select>
              </div>
              <textarea rows={3} placeholder="Tell us about your project" className="w-full bg-black-primary border border-white/20 rounded-sm p-3 text-white focus:border-orange-safety outline-none resize-none placeholder:text-gray-500" required></textarea>
              <button type="submit" className="w-full bg-orange-safety hover:bg-orange-deep text-white font-bold py-4 rounded-sm transition-colors mt-2 text-lg uppercase tracking-wide">
                Request My Estimate
              </button>
              <div className="text-center mt-6">
                <a href="tel:651-410-4196" className="text-gray-300 font-medium hover:text-white transition-colors flex items-center justify-center gap-2">
                  Or call / text us now: <Phone size={18} className="text-orange-safety" /> <strong className="text-white text-lg">651-410-4196</strong>
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>


    </PageTransition>
  );
}
