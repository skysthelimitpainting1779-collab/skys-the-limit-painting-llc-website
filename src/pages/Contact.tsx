import React, { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import FadeIn from '../components/animations/FadeIn';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ projectType: '', timeline: '' });

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

      <div className="bg-black-charcoal py-24 px-6">
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

          <FadeIn delay={0.2} direction="up" className="bg-black-charcoal p-8 md:p-10 rounded-sm border border-white/10 shadow-md relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-safety/10 rounded-bl-[100px] rounded-tr-sm -z-10"></div>
            
            {formStatus === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                <div className="w-20 h-20 bg-green-900/40 text-green-500 rounded-full flex items-center justify-center border border-green-500/20">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-3xl font-bold font-display uppercase tracking-wide text-white">Request Sent</h3>
                <p className="text-gray-300 text-lg">Thank you. We've received your request and will be in touch shortly.</p>
                <button onClick={() => {setFormStatus('idle'); setStep(1);}} className="mt-4 bg-black-primary hover:bg-black-primary/80 border border-white/20 text-white font-bold uppercase tracking-widest text-sm py-4 px-8 rounded-sm transition-colors">
                  Send Another Request
                </button>
              </div>
            ) : (
               <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <h3 className="text-2xl font-bold font-display uppercase tracking-wide text-white">Estimate Wizard</h3>
                  <div className="flex gap-1">
                    <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-orange-safety' : 'bg-white/10'}`}></span>
                    <span className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-orange-safety' : 'bg-white/10'}`}></span>
                    <span className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-orange-safety' : 'bg-white/10'}`}></span>
                  </div>
                </div>

                {step === 1 && (
                  <FadeIn>
                    <div className="space-y-4">
                      <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Step 1: Project Type</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Interior Painting', 'Exterior Painting', 'Commercial Painting', 'Striping / Marking'].map((type) => (
                          <label key={type} className={`cursor-pointer border border-white/10 p-4 rounded-sm hover:border-orange-safety transition-colors flex items-center gap-3 ${formData.projectType === type ? 'bg-orange-safety/10 border-orange-safety text-white' : 'bg-black-primary text-gray-300'}`}>
                            <input 
                              type="radio" 
                              name="projectType" 
                              value={type} 
                              checked={formData.projectType === type} 
                              onChange={() => setFormData({ ...formData, projectType: type })} 
                              className="hidden"
                            />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.projectType === type ? 'border-orange-safety' : 'border-gray-500'}`}>
                              {formData.projectType === type && <div className="w-2 h-2 rounded-full bg-orange-safety"></div>}
                            </div>
                            <span className="font-bold uppercase tracking-wide text-sm">{type}</span>
                          </label>
                        ))}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setStep(2)} 
                        disabled={!formData.projectType}
                        className="w-full bg-orange-safety disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-deep text-white font-bold py-4 rounded-sm transition-colors mt-6 text-sm uppercase tracking-widest"
                      >
                        Next Step
                      </button>
                    </div>
                  </FadeIn>
                )}

                {step === 2 && (
                  <FadeIn>
                    <div className="space-y-4">
                      <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Step 2: Timeline</label>
                      <div className="grid grid-cols-1 gap-4">
                        {['ASAP (Within 1-2 Weeks)', 'Flexible (Within 1-2 Months)', 'Just Getting Budget (3+ Months)'].map((time) => (
                          <label key={time} className={`cursor-pointer border border-white/10 p-4 rounded-sm hover:border-orange-safety transition-colors flex items-center gap-3 ${formData.timeline === time ? 'bg-orange-safety/10 border-orange-safety text-white' : 'bg-black-primary text-gray-300'}`}>
                            <input 
                              type="radio" 
                              name="timeline" 
                              value={time} 
                              checked={formData.timeline === time} 
                              onChange={() => setFormData({ ...formData, timeline: time })} 
                              className="hidden"
                            />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.timeline === time ? 'border-orange-safety' : 'border-gray-500'}`}>
                              {formData.timeline === time && <div className="w-2 h-2 rounded-full bg-orange-safety"></div>}
                            </div>
                            <span className="font-bold uppercase tracking-wide text-sm">{time}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-6">
                        <button 
                          type="button" 
                          onClick={() => setStep(1)} 
                          className="w-1/3 bg-black-primary border border-white/20 hover:border-orange-safety text-white font-bold py-4 rounded-sm transition-colors text-sm uppercase tracking-widest"
                        >
                          Back
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setStep(3)} 
                          disabled={!formData.timeline}
                          className="w-2/3 bg-orange-safety disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-deep text-white font-bold py-4 rounded-sm transition-colors text-sm uppercase tracking-widest"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  </FadeIn>
                )}

                {step === 3 && (
                  <FadeIn>
                    <div className="space-y-6">
                      <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Step 3: Contact Details</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <input type="text" className="w-full border-b border-white/20 bg-black-primary p-3 outline-none focus:border-orange-safety transition-colors text-white placeholder-gray-600 font-medium" required disabled={formStatus === 'submitting'} placeholder="Full Name" />
                          </div>
                          <div>
                            <input type="tel" className="w-full border-b border-white/20 bg-black-primary p-3 outline-none focus:border-orange-safety transition-colors text-white placeholder-gray-600 font-medium" required disabled={formStatus === 'submitting'} placeholder="Phone Number" />
                          </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <input type="email" className="w-full border-b border-white/20 bg-black-primary p-3 outline-none focus:border-orange-safety transition-colors text-white placeholder-gray-600 font-medium" required disabled={formStatus === 'submitting'} placeholder="Email Address" />
                        </div>
                        <div>
                          <input type="text" className="w-full border-b border-white/20 bg-black-primary p-3 outline-none focus:border-orange-safety transition-colors text-white placeholder-gray-600 font-medium" required disabled={formStatus === 'submitting'} placeholder="Zip Code" />
                        </div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <button 
                          type="button" 
                          onClick={() => setStep(2)} 
                          disabled={formStatus === 'submitting'}
                          className="w-1/3 bg-black-primary border border-white/20 hover:border-orange-safety text-white font-bold py-4 rounded-sm transition-colors text-sm uppercase tracking-widest"
                        >
                          Back
                        </button>
                        <button type="submit" className="w-2/3 bg-orange-safety hover:bg-orange-deep text-white font-bold py-4 rounded-sm transition-colors text-sm uppercase tracking-widest shadow-sm flex justify-center items-center gap-2" disabled={formStatus === 'submitting'}>
                          {formStatus === 'submitting' ? (
                            <>
                               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                               Sending...
                            </>
                          ) : 'Submit Request'}
                        </button>
                      </div>
                    </div>
                  </FadeIn>
                )}
                  
                  <p className="text-center text-xs text-gray-500 mt-4 font-mono uppercase">We'll use your details only to respond about your project. No spam.</p>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
