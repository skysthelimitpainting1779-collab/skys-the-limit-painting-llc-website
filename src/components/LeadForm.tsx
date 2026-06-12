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
const fieldClass = 'border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] transition-colors focus:border-[#bf6f2f] focus-visible:ring-2 focus-visible:ring-[#bf6f2f]/20';
const selectClass = 'border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none transition-colors focus:border-[#bf6f2f] focus-visible:ring-2 focus-visible:ring-[#bf6f2f]/20';

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

        console.log(`🧬 [Offline Sync] Syncing ${leads.length} pending leads...`);
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
    <form className={`grid grid-cols-1 gap-4 ${compact ? 'md:grid-cols-2' : ''}`} onSubmit={handleSubmit} aria-busy={status === 'submitting'}>
      <input type="text" style={{ display: 'none' }} name="bot_honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className={`border-l border-[#bf6f2f]/45 bg-white/70 p-4 ${compact ? 'md:col-span-2' : ''}`}>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8b4d20]">Fast estimate intake</p>
        <p className="mt-2 text-sm leading-relaxed text-[#4c453d]">
          Add the basics now. A photo link and clear surface notes make the first scope review tighter and reduce back-and-forth.
        </p>
      </div>
      <input name="name" type="text" placeholder="Full name" aria-label="Full name" autoComplete="name" className={fieldClass} required />
      <input name="phone" type="tel" placeholder="Phone" aria-label="Phone" autoComplete="tel" inputMode="tel" className={fieldClass} required />
      <input name="email" type="email" placeholder="Email" aria-label="Email" autoComplete="email" className={fieldClass} required />
      <input name="city" type="text" placeholder="City" aria-label="City" autoComplete="address-level2" className={fieldClass} required />
      <input name="projectAddress" type="text" placeholder="Project address or cross streets" aria-label="Project address or cross streets" autoComplete="street-address" className={fieldClass} />
      <select name="market" aria-label="Market" className={selectClass} required defaultValue={defaultMarket}>
        <option>Residential</option>
        <option>Commercial</option>
        <option>Public Sector</option>
      </select>
      <select name="projectType" aria-label="Project type" className={selectClass} required defaultValue="">
        <option value="" disabled>Project type</option>
        {projectOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select name="propertyType" aria-label="Property type" className={selectClass} defaultValue="">
        <option value="" disabled>Property type</option>
        {propertyOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select name="timeline" aria-label="Timeline" className={selectClass} required defaultValue="">
        <option value="" disabled>Timeline</option>
        {timelineOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select name="budget" aria-label="Budget range" className={selectClass} defaultValue="">
        <option value="" disabled>Budget range</option>
        {budgetOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select name="contactMethod" aria-label="Preferred contact method" className={selectClass} required defaultValue="">
        <option value="" disabled>Preferred contact</option>
        <option>Call</option>
        <option>Text</option>
        <option>Email</option>
      </select>
      <input name="photosUrl" type="url" placeholder="Project photo link (Google Drive, iCloud, Dropbox)" aria-label="Project photo link" className={`${fieldClass} ${compact ? 'md:col-span-2' : ''}`} />
      <textarea name="notes" rows={5} placeholder="Rooms, exterior surfaces, repairs, timeline, access notes, or anything Anthony should know" aria-label="Project details" className={`${fieldClass} ${compact ? 'md:col-span-2' : ''}`} required />
      <button type="submit" disabled={status === 'submitting'} className={`inline-flex items-center justify-center gap-2 bg-[#171512] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#bf6f2f] disabled:cursor-not-allowed disabled:opacity-60 ${compact ? 'md:col-span-2' : ''}`}>
        {status === 'submitting' ? 'Sending...' : 'Request My Estimate'} <ArrowRight size={18} />
      </button>
      <p className={`flex items-start gap-2 text-sm font-semibold text-[#4c453d] ${compact ? 'md:col-span-2' : ''}`} aria-live="polite">
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#bf6f2f]" />
        {message || 'Your request routes through the live lead endpoint when available. If the provider is unavailable, the form opens a prepared email draft so your details are not lost.'}
      </p>
    </form>
  );
}
