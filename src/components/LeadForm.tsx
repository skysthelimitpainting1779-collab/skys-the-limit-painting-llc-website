import { FormEvent, useMemo, useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { buildEstimateMailto } from '../lib/contact';
import { readUtmParams, trackEvent } from '../lib/analytics';

interface LeadFormProps {
  source: string;
  defaultMarket?: 'Residential' | 'Commercial' | 'Public Sector';
  compact?: boolean;
}

type Status = 'idle' | 'submitting' | 'sent' | 'fallback' | 'error';

const projectOptions = ['Interior', 'Exterior', 'Facility', 'Striping', 'Pavement Marking', 'Other'];
const propertyOptions = ['Single-family home', 'Townhome / condo', 'Retail / storefront', 'Office / commercial', 'Facility / public property', 'Other'];
const timelineOptions = ['ASAP', '1-4 weeks', '1-3 months', 'Planning ahead'];
const budgetOptions = ['Under $2,500', '$2,500-$7,500', '$7,500-$20,000', '$20,000+', 'Not sure yet'];
const fieldClass = 'border border-white/10 bg-white/5 p-4 text-white outline-none placeholder:text-white/40 transition-colors focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20';
const selectClass = 'border border-white/10 bg-white/5 p-4 text-white outline-none transition-colors focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20 [&>option]:bg-[#0B0B0D] [&>option]:text-white';

export default function LeadForm({ source, defaultMarket = 'Residential', compact = false }: LeadFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const utm = useMemo(() => (typeof window === 'undefined' ? null : readUtmParams()), []);

  useEffect(() => {
    const syncOfflineLeads = async () => {
      if (typeof window === 'undefined' || !navigator.onLine) return;
      const pending = localStorage.getItem('pending_leads');
      if (!pending) return;

      try {
        const leads = JSON.parse(pending);
        if (!Array.isArray(leads) || leads.length === 0) return;

        console.log(`[Offline Sync] Syncing ${leads.length} pending leads...`);
        for (const lead of leads) {
          await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead),
          });
        }
        localStorage.removeItem('pending_leads');
        trackEvent('lead_offline_sync_success', { count: leads.length });
      } catch (err) {
        console.error('Failed to sync offline leads:', err);
      }
    };

    window.addEventListener('online', syncOfflineLeads);
    syncOfflineLeads();

    return () => {
      window.removeEventListener('online', syncOfflineLeads);
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const hubspotutk = typeof document !== 'undefined' ? document.cookie.match(/hubspotutk=([^;]+)/)?.[1] : undefined;
    
    const botHoneypot = String(data.get('bot_honeypot') || '');
    if (botHoneypot) {
      setStatus('sent');
      setMessage('Your estimate request was received. Sky’s the Limit can follow up by your preferred contact method, confirm scope, and walk through scheduling next steps.');
      form.reset();
      return;
    }

    const referrerEmail = typeof window !== 'undefined' ? localStorage.getItem('referrer_email') : null;
    const payload = {
      source,
      page: window.location.pathname,
      name: String(data.get('name') || ''),
      phone: String(data.get('phone') || ''),
      email: String(data.get('email') || ''),
      city: String(data.get('city') || ''),
      projectAddress: String(data.get('projectAddress') || ''),
      market: String(data.get('market') || defaultMarket),
      projectType: String(data.get('projectType') || ''),
      propertyType: String(data.get('propertyType') || ''),
      timeline: String(data.get('timeline') || ''),
      budget: String(data.get('budget') || ''),
      contactMethod: String(data.get('contactMethod') || ''),
      photosUrl: String(data.get('photosUrl') || ''),
      notes: String(data.get('notes') || ''),
      company: String(data.get('company') || ''),
      website: String(data.get('website') || ''),
      hubspotutk,
      ...(referrerEmail ? { referrerEmail } : {}),
      ...utm,
    };

    if (payload.website) {
      setStatus('fallback');
      return;
    }

    if (typeof window !== 'undefined' && !navigator.onLine) {
      const pendingLeads = JSON.parse(localStorage.getItem('pending_leads') || '[]');
      pendingLeads.push(payload);
      localStorage.setItem('pending_leads', JSON.stringify(pendingLeads));

      setStatus('fallback');
      setMessage('Offline Mode: Your estimate request was saved locally. It will sync automatically as soon as your internet connection is restored.');
      trackEvent('lead_offline_queued', { source, market: payload.market });
      form.reset();
      return;
    }

    setStatus('submitting');
    trackEvent('lead_form_start', { source, market: payload.market });
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result?.ok === true) {
        setStatus('sent');
        setMessage('Your estimate request was received. Sky’s the Limit can follow up by your preferred contact method, confirm scope, and walk through scheduling next steps.');
        trackEvent('lead_form_submit_success', { source, market: payload.market });
        form.reset();
        return;
      }

      if (response.status === 501 || response.status === 502 || result?.fallback === 'email') {
        setStatus('fallback');
        setMessage('Email delivery needs provider setup. Open the prepared email draft to send your request now.');
        trackEvent('lead_form_submit_error', { source, market: payload.market, reason: response.status === 502 ? 'lead_delivery_failed' : 'email_provider_missing' });
        trackEvent('lead_mailto_fallback_opened', { source, market: payload.market, reason: response.status === 502 ? 'lead_delivery_failed' : 'email_provider_missing' });
        window.location.href = buildEstimateMailto({
          Source: source,
          Name: payload.name,
          Phone: payload.phone,
          Email: payload.email,
          City: payload.city,
          'Project address': payload.projectAddress,
          Market: payload.market,
          'Project type': payload.projectType,
          'Property type': payload.propertyType,
          Timeline: payload.timeline,
          Budget: payload.budget,
          'Preferred contact': payload.contactMethod,
          'Photo link': payload.photosUrl,
          Notes: payload.notes,
        });
        return;
      }

      if (response.ok && result?.ok !== true) {
        setStatus('fallback');
        setMessage('Lead delivery is not available in this environment. Open the prepared email draft to send your request now.');
        trackEvent('lead_form_submit_error', { source, market: payload.market, reason: 'lead_endpoint_unavailable' });
        trackEvent('lead_mailto_fallback_opened', { source, market: payload.market, reason: 'lead_endpoint_unavailable' });
        window.location.href = buildEstimateMailto({
          Source: source,
          Name: payload.name,
          Phone: payload.phone,
          Email: payload.email,
          City: payload.city,
          'Project address': payload.projectAddress,
          Market: payload.market,
          'Project type': payload.projectType,
          'Property type': payload.propertyType,
          Timeline: payload.timeline,
          Budget: payload.budget,
          'Preferred contact': payload.contactMethod,
          'Photo link': payload.photosUrl,
          Notes: payload.notes,
        });
        return;
      }

      setStatus('error');
      setMessage(result?.error || 'The request could not be sent. Please call, text, or email Anthony directly.');
      trackEvent('lead_form_submit_error', { source, market: payload.market, status: response.status });
    } catch {
      setStatus('fallback');
      setMessage('The lead endpoint did not respond. Open the prepared email draft or call/text Anthony directly.');
      trackEvent('lead_form_submit_error', { source, reason: 'network' });
      trackEvent('lead_mailto_fallback_opened', { source, reason: 'network' });
      window.location.href = buildEstimateMailto({
        Source: source,
        Name: payload.name,
        Phone: payload.phone,
        Email: payload.email,
        City: payload.city,
        'Project address': payload.projectAddress,
        Market: payload.market,
        'Project type': payload.projectType,
        'Property type': payload.propertyType,
        'Photo link': payload.photosUrl,
        Notes: payload.notes,
      });
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} aria-busy={status === 'submitting'}>
      <input type="text" style={{ display: 'none' }} name="bot_honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      
      {/* Bento Section 01: Project Scope */}
      <div className="border border-white/10 bg-[#0B0B0D]/50 p-6 flex flex-col gap-4">
        <div className="border-b border-white/10 pb-3 mb-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f0c067]">01 // SCOPE SELECTION</span>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mt-1">Project Parameters</h4>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hidden sm:inline">Reconnaissance</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Market Lane</label>
            <select name="market" aria-label="Market" className={selectClass} required defaultValue={defaultMarket}>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Public Sector</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Project Type</label>
            <select name="projectType" aria-label="Project type" className={selectClass} required defaultValue="">
              <option value="" disabled>Select Type</option>
              {projectOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Property Class</label>
            <select name="propertyType" aria-label="Property type" className={selectClass} defaultValue="">
              <option value="" disabled>Select Class</option>
              {propertyOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Required Timeline</label>
            <select name="timeline" aria-label="Timeline" className={selectClass} required defaultValue="">
              <option value="" disabled>Select Timeline</option>
              {timelineOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-1 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Budget Estimate</label>
            <select name="budget" aria-label="Budget range" className={selectClass} defaultValue="">
              <option value="" disabled>Select Budget Range</option>
              {budgetOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Bento Section 02: Contact Channels & Routing */}
      <div className="border border-white/10 bg-[#0B0B0D]/50 p-6 flex flex-col gap-4">
        <div className="border-b border-white/10 pb-3 mb-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f0c067]">02 // DIRECT CHANNELS</span>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mt-1">Client Routing & Verification</h4>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hidden sm:inline">Security</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Full Name</label>
            <input name="name" type="text" placeholder="e.g. Johnny Cage" aria-label="Full name" autoComplete="name" className={fieldClass} required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">City / Municipality</label>
            <input name="city" type="text" placeholder="e.g. Inver Grove Heights" aria-label="City" autoComplete="address-level2" className={fieldClass} required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Phone</label>
            <input name="phone" type="tel" placeholder="e.g. 651-410-4196" aria-label="Phone" autoComplete="tel" inputMode="tel" className={fieldClass} required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Email Address</label>
            <input name="email" type="email" placeholder="e.g. johnny@fight.com" aria-label="Email" autoComplete="email" className={fieldClass} required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Preferred Contact Method</label>
            <select name="contactMethod" aria-label="Preferred contact method" className={selectClass} required defaultValue="">
              <option value="" disabled>Select Method</option>
              <option>Call</option>
              <option>Text</option>
              <option>Email</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Project Address / Cross Streets</label>
            <input name="projectAddress" type="text" placeholder="e.g. 100 Main St" aria-label="Project address or cross streets" autoComplete="street-address" className={fieldClass} />
          </div>
        </div>
      </div>

      {/* Bento Section 03: Craft Details & Photo Proof */}
      <div className="border border-white/10 bg-[#0B0B0D]/50 p-6 flex flex-col gap-4">
        <div className="border-b border-white/10 pb-3 mb-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f0c067]">03 // SURFACE STORY & MEDIA</span>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mt-1">Scope Documentation</h4>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hidden sm:inline">Verification</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Project Photo Link (Google Drive, iCloud, Dropbox, or public album)</label>
          <input name="photosUrl" type="url" placeholder="https://drive.google.com/..." aria-label="Project photo link" className={fieldClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Project Scope Notes</label>
          <textarea name="notes" rows={4} placeholder="Describe rooms, siding, cabinet count, trim detail, prep concerns, or access limits..." aria-label="Project details" className={fieldClass} required />
        </div>
      </div>

      {/* Form Submission Action */}
      <div className="flex flex-col gap-4">
        <button type="submit" disabled={status === 'submitting'} className="inline-flex items-center justify-center gap-2 bg-[#f0c067] px-7 py-4.5 text-sm font-black uppercase tracking-[0.2em] text-[#050505] transition-colors hover:bg-white hover:text-[#050505] disabled:cursor-not-allowed disabled:opacity-60 w-full">
          {status === 'submitting' ? 'Transmitting Scope...' : 'LOCK IN YOUR ESTIMATE RANGE'} <ArrowRight size={18} />
        </button>
        
        <p className="flex items-start gap-2 text-xs font-semibold text-gray-400 leading-relaxed" aria-live="polite">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#f0c067]" />
          {message || 'Your request routes through the live lead endpoint when available. If the provider is unavailable, the form opens a prepared email draft so your details are not lost.'}
        </p>
      </div>
    </form>
  );
}
