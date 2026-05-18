import { FormEvent, useMemo, useState } from 'react';
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

export default function LeadForm({ source, defaultMarket = 'Residential', compact = false }: LeadFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const utm = useMemo(() => (typeof window === 'undefined' ? null : readUtmParams()), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
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
      ...utm,
    };

    if (payload.website) {
      setStatus('fallback');
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
        setMessage('Your request was sent. Anthony can follow up by your preferred contact method.');
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
    <form className={`grid grid-cols-1 gap-4 ${compact ? 'md:grid-cols-2' : ''}`} onSubmit={handleSubmit}>
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input name="name" type="text" placeholder="Full name" aria-label="Full name" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f]" required />
      <input name="phone" type="tel" placeholder="Phone" aria-label="Phone" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f]" required />
      <input name="email" type="email" placeholder="Email" aria-label="Email" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f]" required />
      <input name="city" type="text" placeholder="City" aria-label="City" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f]" required />
      <input name="projectAddress" type="text" placeholder="Project address or cross streets" aria-label="Project address or cross streets" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f]" />
      <select name="market" aria-label="Market" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none focus:border-[#bf6f2f]" required defaultValue={defaultMarket}>
        <option>Residential</option>
        <option>Commercial</option>
        <option>Public Sector</option>
      </select>
      <select name="projectType" aria-label="Project type" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none focus:border-[#bf6f2f]" required defaultValue="">
        <option value="" disabled>Project type</option>
        {projectOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select name="propertyType" aria-label="Property type" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none focus:border-[#bf6f2f]" defaultValue="">
        <option value="" disabled>Property type</option>
        {propertyOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select name="timeline" aria-label="Timeline" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none focus:border-[#bf6f2f]" required defaultValue="">
        <option value="" disabled>Timeline</option>
        {timelineOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select name="budget" aria-label="Budget range" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none focus:border-[#bf6f2f]" defaultValue="">
        <option value="" disabled>Budget range</option>
        {budgetOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select name="contactMethod" aria-label="Preferred contact method" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none focus:border-[#bf6f2f]" required defaultValue="">
        <option value="" disabled>Preferred contact</option>
        <option>Call</option>
        <option>Text</option>
        <option>Email</option>
      </select>
      <input name="photosUrl" type="url" placeholder="Project photo link (Google Drive, iCloud, Dropbox)" aria-label="Project photo link" className={`border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f] ${compact ? 'md:col-span-2' : ''}`} />
      <textarea name="notes" rows={5} placeholder="Project details, surfaces, timeline, COI needs, or photo link" aria-label="Project details" className={`border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f] ${compact ? 'md:col-span-2' : ''}`} required />
      <button type="submit" disabled={status === 'submitting'} className={`inline-flex items-center justify-center gap-2 bg-[#171512] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#bf6f2f] disabled:cursor-not-allowed disabled:opacity-60 ${compact ? 'md:col-span-2' : ''}`}>
        {status === 'submitting' ? 'Sending...' : 'Send Project Details'} <ArrowRight size={18} />
      </button>
      <p className={`flex items-start gap-2 text-sm font-semibold text-[#4c453d] ${compact ? 'md:col-span-2' : ''}`} aria-live="polite">
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#bf6f2f]" />
        {message || 'Submissions use server-side validation. If email delivery is not configured, the form opens a prepared email draft instead of pretending it sent.'}
      </p>
    </form>
  );
}
