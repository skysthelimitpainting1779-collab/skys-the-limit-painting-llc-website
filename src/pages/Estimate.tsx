/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Calculator, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageMeta from '../components/PageMeta';
import { trackEvent } from '../lib/analytics';
import { buildEstimateMailto } from '../lib/contact';

type Step = 1 | 2 | 3 | 4;

interface Dimensions {
  width: number;
  length: number;
  ceilingHeight: number;
  roomType: string;
}

interface TrimPrep {
  prepLevel: 'standard' | 'premium';
  doorsCount: number;
  windowsCount: number;
  trimLength: number;
}

interface Cabinets {
  cabinetDoors: number;
  cabinetDrawers: number;
}

export default function EstimatePage() {
  const [step, setStep] = useState<Step>(1);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 12,
    length: 14,
    ceilingHeight: 8,
    roomType: 'Bedroom',
  });
  const [trimPrep, setTrimPrep] = useState<TrimPrep>({
    prepLevel: 'standard',
    doorsCount: 1,
    windowsCount: 1,
    trimLength: 50,
  });
  const [cabinets, setCabinets] = useState<Cabinets>({
    cabinetDoors: 0,
    cabinetDrawers: 0,
  });

  // Lead contact form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'fallback' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 4) as Step);
    trackEvent('estimate_step_next', { currentStep: step });
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1) as Step);
    trackEvent('estimate_step_prev', { currentStep: step });
  };

  // Perform dynamic linear calculations
  const calculateCosts = () => {
    // Wall surface area: perimeter * height
    const wallArea = 2 * (dimensions.width + dimensions.length) * dimensions.ceilingHeight;
    // Base rate is $3.50 per sq ft
    let baseCost = wallArea * 3.50;

    // Prep level multipliers
    const prepMultiplier = trimPrep.prepLevel === 'premium' ? 1.35 : 1.0;
    baseCost *= prepMultiplier;

    // Add doors ($150 each) and windows ($100 each)
    const openingsCost = trimPrep.doorsCount * 150 + trimPrep.windowsCount * 100;

    // Trim painting cost: linear feet * $4.00 per foot
    const trimCost = trimPrep.trimLength * 4.00;

    // Cabinets: $125 per opening (door or drawer)
    const cabinetCost = (cabinets.cabinetDoors + cabinets.cabinetDrawers) * 125;

    const totalEstimate = baseCost + openingsCost + trimCost + cabinetCost;

    // Return ranges
    const lowRange = Math.round(totalEstimate * 0.90);
    const highRange = Math.round(totalEstimate * 1.15);

    return {
      low: lowRange,
      high: highRange,
      wallArea: Math.round(wallArea),
      totalEstimate: Math.round(totalEstimate),
    };
  };

  const calculationResult = calculateCosts();

  const handleFinalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Anti-Spam Honeypot Check
    const form = e.currentTarget;
    const data = new FormData(form);
    const botHoneypot = String(data.get('bot_honeypot') || '');
    if (botHoneypot) {
      setStatus('sent');
      setMessage('Your detailed cost breakdown has been reserved. Anthony will reach out to schedule your final site confirmation.');
      return;
    }

    const payload = {
      source: 'Estimate Calculator',
      page: '/estimate',
      name,
      phone,
      email,
      city,
      market: 'Residential',
      projectType: 'Interior',
      propertyType: 'Single-family home',
      timeline: 'ASAP',
      budget: `${calculationResult.low}-${calculationResult.high}`,
      contactMethod: 'Text',
      notes: `Interactive Room Estimate Request
Room Type: ${dimensions.roomType}
Dimensions: ${dimensions.width}x${dimensions.length}x${dimensions.ceilingHeight}
Prep level: ${trimPrep.prepLevel}
Doors: ${trimPrep.doorsCount}, Windows: ${trimPrep.windowsCount}, Trim: ${trimPrep.trimLength} ft
Cabinets: ${cabinets.cabinetDoors} doors, ${cabinets.cabinetDrawers} drawers
Calculated Range: $${calculationResult.low} - $${calculationResult.high}`,
    };

    // Offline lead saving
    if (typeof window !== 'undefined' && !navigator.onLine) {
      const pendingLeads = JSON.parse(localStorage.getItem('pending_leads') || '[]');
      pendingLeads.push(payload);
      localStorage.setItem('pending_leads', JSON.stringify(pendingLeads));

      setStatus('fallback');
      setMessage('Offline Mode: Your estimate calculation is saved locally. Anthony will review it once your connection returns.');
      trackEvent('lead_offline_queued', { source: 'Estimate Calculator', budget: payload.budget });
      return;
    }

    setStatus('submitting');
    trackEvent('estimate_lead_submit_start', { budget: payload.budget });

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result?.ok === true) {
        setStatus('sent');
        setMessage('Your detailed cost breakdown has been reserved. Anthony has been notified and will text you to confirm scheduling.');
        trackEvent('estimate_lead_submit_success', { budget: payload.budget });
      } else {
        setStatus('fallback');
        setMessage('Lead service is currently starting. Tap the button below to draft your request directly in your email client.');
      }
    } catch {
      setStatus('fallback');
      setMessage('Lead service is currently starting. Tap the button below to draft your request directly in your email client.');
    }
  };

  const handleEmailFallback = () => {
    window.location.href = buildEstimateMailto({
      Source: 'Estimate Calculator',
      Name: name,
      Phone: phone,
      Email: email,
      City: city,
      Market: 'Residential',
      'Project type': 'Interior',
      Budget: `$${calculationResult.low} - $${calculationResult.high}`,
      Notes: `Room Type: ${dimensions.roomType} (${dimensions.width}x${dimensions.length}x${dimensions.ceilingHeight})
Prep: ${trimPrep.prepLevel} (Doors: ${trimPrep.doorsCount}, Windows: ${trimPrep.windowsCount}, Trim: ${trimPrep.trimLength} ft)
Cabinets: ${cabinets.cabinetDoors} doors, ${cabinets.cabinetDrawers} drawers`,
    });
  };

  return (
    <PageTransition>
      <PageMeta
        title="Interactive Room Paint Cost Calculator | Sky's the Limit Painting LLC"
        description="Estimate your residential room interior painting and trim prep cost ranges instantly across the Twin Cities."
        path="/estimate"
      />

      <section className="relative min-h-[calc(100svh-116px)] bg-[#070706] py-16 px-4 text-white sm:px-6 lg:px-8">
        <div className="blueprint-grid absolute inset-0 opacity-10"></div>
        <div className="relative z-10 mx-auto max-w-3xl border border-[#d8c7aa]/16 bg-[#11100d]/95 p-6 md:p-10 backdrop-blur-md">
          
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 border border-[#f0c067]/30 bg-[#070706]/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#f0c067]">
              <Calculator size={12} /> Linear Cost Estimator
            </span>
            <h1 className="mt-6 font-display text-3xl font-black leading-none text-white sm:text-4xl text-wrap-balance">
              Room Cost Calculator
            </h1>
            <p className="mt-3 text-sm text-[#c9c1b4]">
              Obtain instant price transparency based on room dimensions, trim levels, and high-margin cabinet scope.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex justify-between text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
              <span>Step {step} of 4</span>
              <span>
                {step === 1 && 'Room Dimensions'}
                {step === 2 && 'Trim & Prep Details'}
                {step === 3 && 'High-Margin Cabinets'}
                {step === 4 && 'Estimate Results'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-safety transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Dimensions */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-3">
                  Room Type
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {['Bedroom', 'Living Room', 'Kitchen', 'Bathroom', 'Hallway', 'Custom'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDimensions({ ...dimensions, roomType: type })}
                      className={`p-3 border text-sm font-bold transition-all ${
                        dimensions.roomType === type
                          ? 'border-orange-safety bg-orange-safety/10 text-white'
                          : 'border-white/10 bg-[#070706] text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="room-width" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                    Width (feet)
                  </label>
                  <input
                    id="room-width"
                    type="number"
                    min="5"
                    max="50"
                    inputMode="numeric"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
                    className="w-full border border-white/15 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="room-length" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                    Length (feet)
                  </label>
                  <input
                    id="room-length"
                    type="number"
                    min="5"
                    max="50"
                    inputMode="numeric"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({ ...dimensions, length: Number(e.target.value) })}
                    className="w-full border border-white/15 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="room-height" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                    Ceiling Height (feet)
                  </label>
                  <input
                    id="room-height"
                    type="number"
                    min="7"
                    max="20"
                    inputMode="numeric"
                    value={dimensions.ceilingHeight}
                    onChange={(e) => setDimensions({ ...dimensions, ceilingHeight: Number(e.target.value) })}
                    className="w-full border border-white/15 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 bg-orange-safety px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-white hover:text-black transition-all"
                >
                  Next Step <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Trim & Prep */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-3">
                  Trim Prep Level
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setTrimPrep({ ...trimPrep, prepLevel: 'standard' })}
                    className={`p-4 border text-left transition-all ${
                      trimPrep.prepLevel === 'standard'
                        ? 'border-orange-safety bg-orange-safety/10'
                        : 'border-white/10 bg-[#070706]'
                    }`}
                  >
                    <p className="font-bold text-white uppercase text-xs tracking-wider">Standard Prep</p>
                    <p className="text-xs text-gray-400 mt-2">Light sanding, minor caulk, 1 coat primer & topcoat. Great for minor refreshes.</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrimPrep({ ...trimPrep, prepLevel: 'premium' })}
                    className={`p-4 border text-left transition-all ${
                      trimPrep.prepLevel === 'premium'
                        ? 'border-orange-safety bg-orange-safety/10'
                        : 'border-white/10 bg-[#070706]'
                    }`}
                  >
                    <p className="font-bold text-white uppercase text-xs tracking-wider">Premium Detail Prep</p>
                    <p className="text-xs text-gray-400 mt-2">Elite multi-stage sanding, deep caulking, wood stabilization, 2 premium coats. Luxury finish.</p>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="doors-count" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                    Doors Count
                  </label>
                  <input
                    id="doors-count"
                    type="number"
                    min="0"
                    max="10"
                    inputMode="numeric"
                    value={trimPrep.doorsCount}
                    onChange={(e) => setTrimPrep({ ...trimPrep, doorsCount: Math.max(0, Number(e.target.value)) })}
                    className="w-full border border-white/15 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="windows-count" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                    Windows Count
                  </label>
                  <input
                    id="windows-count"
                    type="number"
                    min="0"
                    max="10"
                    inputMode="numeric"
                    value={trimPrep.windowsCount}
                    onChange={(e) => setTrimPrep({ ...trimPrep, windowsCount: Math.max(0, Number(e.target.value)) })}
                    className="w-full border border-white/15 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="trim-length" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                    Est. Trim (linear ft)
                  </label>
                  <input
                    id="trim-length"
                    type="number"
                    min="0"
                    max="200"
                    inputMode="numeric"
                    value={trimPrep.trimLength}
                    onChange={(e) => setTrimPrep({ ...trimPrep, trimLength: Math.max(0, Number(e.target.value)) })}
                    className="w-full border border-white/15 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 border border-white/10 bg-[#070706] px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-white hover:border-white transition-all"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 bg-orange-safety px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-white hover:text-black transition-all"
                >
                  Next Step <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Cabinets */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-l-2 border-orange-safety bg-orange-safety/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#f0c067]">High-Margin Specialty Cabinet Painting</p>
                <p className="text-xs text-gray-300 mt-2">Cabinet paint transformations cost significantly less than replacements while delivering stunning luxury upgrades.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="cabinet-doors" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                    Cabinet Doors
                  </label>
                  <input
                    id="cabinet-doors"
                    type="number"
                    min="0"
                    max="60"
                    inputMode="numeric"
                    value={cabinets.cabinetDoors}
                    onChange={(e) => setCabinets({ ...cabinets, cabinetDoors: Math.max(0, Number(e.target.value)) })}
                    className="w-full border border-white/15 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="cabinet-drawers" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                    Cabinet Drawers
                  </label>
                  <input
                    id="cabinet-drawers"
                    type="number"
                    min="0"
                    max="40"
                    inputMode="numeric"
                    value={cabinets.cabinetDrawers}
                    onChange={(e) => setCabinets({ ...cabinets, cabinetDrawers: Math.max(0, Number(e.target.value)) })}
                    className="w-full border border-white/15 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 border border-white/10 bg-[#070706] px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-white hover:border-white transition-all"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 bg-orange-safety px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-white hover:text-black transition-all"
                >
                  Calculate Cost <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Results & Lead Capture */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border border-white/10 bg-[#070706] p-6 text-center">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-safety">Estimated Interior Price Range</p>
                <p className="mt-4 font-display text-4xl font-black text-white md:text-5xl tracking-normal">
                  ${calculationResult.low.toLocaleString()} – ${calculationResult.high.toLocaleString()}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Approx. {calculationResult.wallArea} sq ft of wall surface area measured.
                </p>
              </div>

              {status !== 'sent' ? (
                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  <h3 className="text-lg font-black uppercase text-white tracking-wide">Lock In This Estimate</h3>
                  <p className="text-xs text-gray-300">
                    To receive a detailed PDF estimate breakdown and secure priority scheduling on Anthony's calendar, enter your contact information below.
                  </p>

                  {/* Honeypot field */}
                  <input type="text" style={{ display: 'none' }} name="bot_honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="client-name" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                        Full Name
                      </label>
                      <input
                        id="client-name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-white/15 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="client-phone" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                        Phone Number
                      </label>
                      <input
                        id="client-phone"
                        type="tel"
                        required
                        placeholder="651-555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-white/15 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="client-email" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                        Email Address
                      </label>
                      <input
                        id="client-email"
                        type="email"
                        required
                        spellCheck={false}
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-white/15 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="client-city" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                        City
                      </label>
                      <input
                        id="client-city"
                        type="text"
                        required
                        placeholder="Eagan"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-white/15 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
                      />
                    </div>
                  </div>

                  {status === 'fallback' && (
                    <button
                      type="button"
                      onClick={handleEmailFallback}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#f0c067] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#15110a] hover:bg-white transition-all"
                    >
                      Open Email Draft
                    </button>
                  )}

                  {status !== 'fallback' && (
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#f0c067] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#15110a] hover:bg-white transition-all disabled:opacity-55"
                    >
                      {status === 'submitting' ? 'Saving…' : 'Lock In My Estimate'} <ArrowRight size={18} />
                    </button>
                  )}

                  <p className="flex items-start gap-2 text-xs font-semibold text-[#b9b2a6]" aria-live="polite">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-orange-safety" />
                    {message || 'Your cost calculation will be locked in and routed to Anthony Briseno. Specialty Contractor registration details are fully verified.'}
                  </p>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-safety/10 text-orange-safety mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white">Estimate Reserved!</h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#c9c1b4]">
                    Thank you, {name}. Your estimate range of ${calculationResult.low.toLocaleString()} - ${calculationResult.high.toLocaleString()} is locked in. Anthony has been notified privately and will follow up by text shortly.
                  </p>
                </div>
              )}

              <div className="flex justify-start pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 border border-white/10 bg-[#070706] px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-white hover:border-white transition-all"
                >
                  <ArrowLeft size={16} /> Recalculate
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </PageTransition>
  );
}
