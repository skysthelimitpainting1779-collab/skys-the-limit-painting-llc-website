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
      market: String(data.get('market') || defaultMarket),
      projectType: String(data.get('projectType') || ''),
      timeline: String(data.get('timeline') || ''),
      budget: String(data.get('budget') || ''),
      contactMethod: String(data.get('contactMethod') || ''),
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
    trackEvent('form_start', { source, market: payload.market });

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
        trackEvent('form_submit_success', { source, market: payload.market });
        form.reset();
        return;
      }

      if (response.status === 501 || result?.fallback === 'email') {
        setStatus('fallback');
        setMessage('Email delivery needs provider setup. Open the prepared email draft to send your request now.');
        trackEvent('form_submit_error', { source, market: payload.market, reason: 'email_provider_missing' });
        window.location.href = buildEstimateMailto({
          Source: source,
          Name: payload.name,
          Phone: payload.phone,
          Email: payload.email,
          City: payload.city,
          Market: payload.market,
          'Project type': payload.projectType,
          Timeline: payload.timeline,
          Budget: payload.budget,
          'Preferred contact': payload.contactMethod,
          Notes: payload.notes,
        });
        return;
      }

      if (response.ok && result?.ok !== true) {
        setStatus('fallback');
        setMessage('Lead delivery is not available in this environment. Open the prepared email draft to send your request now.');
        trackEvent('form_submit_error', { source, market: payload.market, reason: 'lead_endpoint_unavailable' });
        window.location.href = buildEstimateMailto({
          Source: source,
          Name: payload.name,
          Phone: payload.phone,
          Email: payload.email,
          City: payload.city,
          Market: payload.market,
          'Project type': payload.projectType,
          Timeline: payload.timeline,
          Budget: payload.budget,
          'Preferred contact': payload.contactMethod,
          Notes: payload.notes,
        });
        return;
      }

      setStatus('error');
      setMessage(result?.error || 'The request could not be sent. Please call, text, or email Anthony directly.');
      trackEvent('form_submit_error', { source, market: payload.market, status: response.status });
    } catch {
      setStatus('fallback');
      setMessage('The lead endpoint did not respond. Open the prepared email draft or call/text Anthony directly.');
      trackEvent('form_submit_error', { source, reason: 'network' });
      window.location.href = buildEstimateMailto({
        Source: source,
        Name: payload.name,
        Phone: payload.phone,
        Email: payload.email,
        City: payload.city,
        Market: payload.market,
        'Project type': payload.projectType,
        Notes: payload.notes,
      });
    }
  };

  return (
    <form className={`grid grid-cols-1 gap-4 ${compact ? 'md:grid-cols-2' : ''}`} onSubmit={handleSubmit}>
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input name="name" type="text" placeholder="Full name" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f]" required />
      <input name="phone" type="tel" placeholder="Phone" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f]" required />
      <input name="email" type="email" placeholder="Email" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f]" required />
      <input name="city" type="text" placeholder="City" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f]" required />
      <select name="market" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none focus:border-[#bf6f2f]" required defaultValue={defaultMarket}>
        <option>Residential</option>
        <option>Commercial</option>
        <option>Public Sector</option>
      </select>
      <select name="projectType" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none focus:border-[#bf6f2f]" required defaultValue="">
        <option value="" disabled>Project type</option>
        {projectOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select name="timeline" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none focus:border-[#bf6f2f]" required defaultValue="">
        <option value="" disabled>Timeline</option>
        {timelineOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select name="budget" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none focus:border-[#bf6f2f]" defaultValue="">
        <option value="" disabled>Budget range</option>
        {budgetOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <select name="contactMethod" className="border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none focus:border-[#bf6f2f]" required defaultValue="">
        <option value="" disabled>Preferred contact</option>
        <option>Call</option>
        <option>Text</option>
        <option>Email</option>
      </select>
      <textarea name="notes" rows={5} placeholder="Project details, surfaces, timeline, COI needs, or photo link" className={`border border-[#171512]/20 bg-white p-4 text-[#171512] outline-none placeholder:text-[#7d7469] focus:border-[#bf6f2f] ${compact ? 'md:col-span-2' : ''}`} required />
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
