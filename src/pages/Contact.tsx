import React, { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <PageTransition>
      <PageMeta title="Contact Us & Free Estimates | Sky's the Limit Painting LLC" description="Get a free, clear estimate on your painting or striping project in the Twin Cities Metro. Call 651-410-4196 or message us today." />
      
      {/* Hero */}
      <section className="bg-black-primary py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <span className="inline-block text-orange-safety font-bold tracking-widest text-sm uppercase mb-4">Contact Us</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white uppercase tracking-tight leading-none">Get A Clear<br/>Estimate.</h1>
              <p className="text-xl text-gray-300 max-w-xl mx-auto">
                No hidden fees. Just an honest assessment for your next painting or striping project.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="bg-gray-warm py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeIn delay={0.1}>
            <div>
              <h2 className="text-4xl font-display font-bold mb-6 uppercase tracking-wide">Let's Discuss Your Project</h2>
              <div className="w-12 h-1 bg-orange-safety mb-8"></div>
              
              <p className="text-lg text-page-text leading-relaxed mb-10">
                Send a few details and we’ll help you figure out the next step. Whether it’s a room, exterior, storefront, parking lot, or specialty surface, Sky’s the Limit is ready to take a look.
              </p>
              
               <div className="space-y-8 mb-12">
                 <a href="tel:651-410-4196" className="flex items-center gap-4 text-xl font-bold hover:text-orange-safety transition-colors group">
                    <div className="w-14 h-14 rounded-sm bg-black-primary flex items-center justify-center group-hover:bg-orange-safety transition-colors border border-white/10">
                      <Phone className="text-white" size={24} />
                    </div>
                    651-410-4196
                  </a>
                  <a href="mailto:skysthelimitpainting1779@gmail.com" className="flex items-center gap-4 text-lg font-bold hover:text-orange-safety transition-colors group break-all">
                    <div className="w-14 h-14 shrink-0 rounded-sm bg-black-primary flex items-center justify-center group-hover:bg-orange-safety transition-colors border border-white/10">
                      <Mail className="text-white" size={24} />
                    </div>
                    skysthelimitpainting1779@gmail.com
                  </a>
                  <div className="flex items-center gap-4 text-lg font-bold group">
                    <div className="w-14 h-14 shrink-0 rounded-sm bg-black-primary flex items-center justify-center border border-white/10">
                      <MapPin className="text-orange-safety" size={24} />
                    </div>
                    Inver Grove Heights, MN
                  </div>
              </div>
              
               <div className="bg-black-charcoal p-8 rounded-sm border border-white/10">
                 <h3 className="font-bold text-white text-xl mb-3 tracking-wide uppercase">Fastest Response:</h3>
                 <p className="text-gray-300">Call or text us directly at <strong className="text-orange-safety">651-410-4196</strong>. We'll get back to you as soon as possible.</p>
               </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="up" className="bg-white p-8 md:p-10 rounded-sm border border-gray-300 shadow-md relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-safety/10 rounded-bl-[100px] rounded-tr-sm -z-10"></div>
            
            {formStatus === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-3xl font-bold font-display uppercase tracking-wide">Request Sent</h3>
                <p className="text-page-text text-lg">Thank you. We've received your request and will be in touch shortly.</p>
                <button onClick={() => setFormStatus('idle')} className="mt-4 bg-black-primary hover:bg-black-charcoal text-white font-bold uppercase tracking-widest text-sm py-4 px-8 rounded-sm transition-colors">
                  Send Another Request
                </button>
              </div>
            ) : (
               <form className="space-y-6" onSubmit={handleSubmit}>
                <h3 className="text-2xl font-bold mb-6 font-display uppercase tracking-wide border-b border-gray-200 pb-4">Request Estimate</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Name</label>
                      <input type="text" className="w-full border-b-2 border-gray-300 bg-gray-50/50 p-3 outline-none focus:border-orange-safety focus:bg-white transition-colors text-black-primary" required disabled={formStatus === 'submitting'} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Phone</label>
                      <input type="tel" className="w-full border-b-2 border-gray-300 bg-gray-50/50 p-3 outline-none focus:border-orange-safety focus:bg-white transition-colors text-black-primary" required disabled={formStatus === 'submitting'} />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Email</label>
                    <input type="email" className="w-full border-b-2 border-gray-300 bg-gray-50/50 p-3 outline-none focus:border-orange-safety focus:bg-white transition-colors text-black-primary" required disabled={formStatus === 'submitting'} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Project Address / City</label>
                    <input type="text" className="w-full border-b-2 border-gray-300 bg-gray-50/50 p-3 outline-none focus:border-orange-safety focus:bg-white transition-colors text-black-primary" required disabled={formStatus === 'submitting'} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Service Needed</label>
                      <select className="w-full border-b-2 border-gray-300 bg-gray-50/50 p-3 outline-none focus:border-orange-safety focus:bg-white transition-colors text-black-primary" required disabled={formStatus === 'submitting'}>
                        <option value="">Select...</option>
                        <option value="interior">Interior Painting</option>
                        <option value="exterior">Exterior Painting</option>
                        <option value="commercial">Commercial Painting</option>
                        <option value="striping">Striping / Marking</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Timeline</label>
                      <select className="w-full border-b-2 border-gray-300 bg-gray-50/50 p-3 outline-none focus:border-orange-safety focus:bg-white transition-colors text-black-primary" required disabled={formStatus === 'submitting'}>
                        <option value="">Select...</option>
                        <option value="asap">ASAP</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Message</label>
                    <textarea rows={4} className="w-full border-b-2 border-gray-300 bg-gray-50/50 p-3 outline-none focus:border-orange-safety focus:bg-white transition-colors resize-none text-black-primary" required disabled={formStatus === 'submitting'} placeholder="Briefly describe what needs to be painted or restriped..."></textarea>
                  </div>
                  <button type="submit" className="w-full bg-orange-safety hover:bg-orange-deep text-white font-bold py-4 rounded-sm transition-colors mt-6 text-sm uppercase tracking-widest shadow-sm flex justify-center items-center gap-2" disabled={formStatus === 'submitting'}>
                    {formStatus === 'submitting' ? (
                      <>
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                         Sending...
                      </>
                    ) : 'Send Request'}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4 font-mono uppercase">We'll use your details only to respond about your project. No spam.</p>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
