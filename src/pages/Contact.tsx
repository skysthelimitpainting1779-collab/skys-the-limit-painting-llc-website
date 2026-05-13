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
      <div className="bg-white min-h-screen">
        <div className="bg-black-primary text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Contact Us</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Get a free, clear estimate on your painting or striping project.
              </p>
            </FadeIn>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-24 px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeIn delay={0.1}>
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Let's Discuss Your Project</h2>
              <p className="text-lg text-page-text leading-relaxed mb-10">
                Send a few details and we’ll help you figure out the next step. Whether it’s a room, exterior, storefront, parking lot, or specialty surface, Sky’s the Limit is ready to take a look.
              </p>
              
               <div className="space-y-8 mb-12">
                 <a href="tel:651-410-4196" className="flex items-center gap-4 text-xl font-bold hover:text-orange-safety transition-colors group">
                    <div className="w-14 h-14 rounded-full bg-orange-safety/10 flex items-center justify-center group-hover:bg-orange-safety group-hover:text-white transition-colors">
                      <Phone className="text-orange-safety group-hover:text-white transition-colors" size={28} />
                    </div>
                    651-410-4196
                  </a>
                  <a href="mailto:skysthelimitpainting1779@gmail.com" className="flex items-center gap-4 text-lg font-bold hover:text-orange-safety transition-colors group break-all">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-orange-safety/10 flex items-center justify-center group-hover:bg-orange-safety group-hover:text-white transition-colors">
                      <Mail className="text-orange-safety group-hover:text-white transition-colors" size={28} />
                    </div>
                    skysthelimitpainting1779@gmail.com
                  </a>
                  <div className="flex items-center gap-4 text-lg font-bold group">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-orange-safety/10 flex items-center justify-center">
                      <MapPin className="text-orange-safety" size={28} />
                    </div>
                    Inver Grove Heights, MN
                  </div>
              </div>
              
               <div className="bg-gray-warm p-8 rounded-2xl border border-gray-200">
                 <h3 className="font-bold text-xl mb-3">Fastest Response:</h3>
                 <p className="text-page-text">Call or text us directly at <strong>651-410-4196</strong>. We'll get back to you as soon as possible.</p>
               </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="up" className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl relative">
             <div className="absolute top-0 right-0 w-24 h-24 bg-orange-safety rounded-bl-full rounded-tr-3xl -z-10 translate-x-2 -translate-y-2 opacity-30 hidden sm:block"></div>
            
            {formStatus === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-3xl font-bold font-display">Estimate Request Sent</h3>
                <p className="text-page-text text-lg">Thank you. We've received your request and will be in touch shortly.</p>
                <button onClick={() => setFormStatus('idle')} className="mt-4 bg-gray-warm hover:bg-gray-200 text-black-primary font-bold py-3 px-6 rounded-xl transition-colors">
                  Send Another Request
                </button>
              </div>
            ) : (
               <form className="space-y-5" onSubmit={handleSubmit}>
                <h3 className="text-2xl font-bold mb-6 font-display">Request Free Estimate</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-safety" required disabled={formStatus === 'submitting'} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                      <input type="tel" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-safety" required disabled={formStatus === 'submitting'} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-safety" required disabled={formStatus === 'submitting'} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Project Address / City</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-safety" required disabled={formStatus === 'submitting'} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Service Needed</label>
                      <select className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-safety bg-white" required disabled={formStatus === 'submitting'}>
                        <option value="">Select...</option>
                        <option value="interior">Interior Painting</option>
                        <option value="exterior">Exterior Painting</option>
                        <option value="commercial">Commercial Painting</option>
                        <option value="striping">Striping / Marking</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Timeline</label>
                      <select className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-safety bg-white" required disabled={formStatus === 'submitting'}>
                        <option value="">Select...</option>
                        <option value="asap">ASAP</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                    <textarea rows={4} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-safety resize-none" required disabled={formStatus === 'submitting'} placeholder="Briefly describe what needs to be painted or restriped..."></textarea>
                  </div>
                  <button type="submit" className="w-full bg-orange-safety hover:bg-orange-deep text-white font-bold py-4 rounded-xl transition-colors mt-4 text-lg shadow-lg flex justify-center items-center gap-2" disabled={formStatus === 'submitting'}>
                    {formStatus === 'submitting' ? (
                      <>
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                         Sending...
                      </>
                    ) : 'Send Request'}
                  </button>
                  <p className="text-center text-xs text-gray-muted mt-4">We'll use your details only to respond about your project. No spam.</p>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
