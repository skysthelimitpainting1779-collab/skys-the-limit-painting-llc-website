/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from 'react';
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

type NumericDimensionKey = 'width' | 'length' | 'ceilingHeight';
type NumericTrimKey = 'doorsCount' | 'windowsCount' | 'trimLength';
type CabinetKey = keyof Cabinets;

const roomPresets = [
  { label: 'Bedroom', width: 12, length: 14, ceilingHeight: 8 },
  { label: 'Living Room', width: 16, length: 20, ceilingHeight: 8 },
  { label: 'Kitchen', width: 12, length: 16, ceilingHeight: 8 },
  { label: 'Basement', width: 22, length: 26, ceilingHeight: 8 },
];

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
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

  // Persist progress in localStorage (Zeigarnik Effect)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sky_estimate_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step) setStep(parsed.step);
        if (parsed.dimensions) setDimensions(parsed.dimensions);
        if (parsed.trimPrep) setTrimPrep(parsed.trimPrep);
        if (parsed.cabinets) setCabinets(parsed.cabinets);
        if (parsed.name) setName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.city) setCity(parsed.city);
        if (parsed.message) setMessage(parsed.message);
      }
    } catch (err) {
      console.error('Failed to load saved estimate progress:', err);
    }
  }, []);

  useEffect(() => {
    try {
      const progress = {
        step,
        dimensions,
        trimPrep,
        cabinets,
        name,
        phone,
        email,
        city,
        message,
      };
      localStorage.setItem('sky_estimate_progress', JSON.stringify(progress));
    } catch (err) {
      console.error('Failed to save estimate progress:', err);
    }
  }, [step, dimensions, trimPrep, cabinets, name, phone, email, city, message]);

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
    const wallBase = wallArea * 3.50;
    const wallPrepValue = trimPrep.prepLevel === 'premium' ? wallBase * 0.35 : 0;
    const wallCost = wallBase + wallPrepValue;

    // Add doors ($150 each) and windows ($100 each)
    const openingsCost = trimPrep.doorsCount * 150 + trimPrep.windowsCount * 100;

    // Trim painting cost: linear feet * $4.00 per foot
    const trimCost = trimPrep.trimLength * 4.00;

    // Cabinets: $125 per opening (door or drawer)
    const cabinetCost = (cabinets.cabinetDoors + cabinets.cabinetDrawers) * 125;

    const totalEstimate = wallCost + openingsCost + trimCost + cabinetCost;

    // Return ranges
    const lowRange = Math.round(totalEstimate * 0.90);
    const highRange = Math.round(totalEstimate * 1.15);

    return {
      low: lowRange,
      high: highRange,
      wallArea: Math.round(wallArea),
      totalEstimate: Math.round(totalEstimate),
      wallCost: Math.round(wallCost),
      openingsCost: Math.round(openingsCost),
      trimCost: Math.round(trimCost),
      cabinetCost: Math.round(cabinetCost),
    };
  };

  const calculationResult = calculateCosts();

  const setDimensionValue = (key: NumericDimensionKey, value: number, min: number, max: number) => {
    setDimensions((prev) => ({ ...prev, [key]: clampNumber(value, min, max) }));
  };

  const setTrimValue = (key: NumericTrimKey, value: number, min: number, max: number) => {
    setTrimPrep((prev) => ({ ...prev, [key]: clampNumber(value, min, max) }));
  };

  const setCabinetValue = (key: CabinetKey, value: number, min: number, max: number) => {
    setCabinets((prev) => ({ ...prev, [key]: clampNumber(value, min, max) }));
  };

  const applyRoomPreset = (preset: (typeof roomPresets)[number]) => {
    setDimensions((prev) => ({
      ...prev,
      roomType: preset.label,
      width: preset.width,
      length: preset.length,
      ceilingHeight: preset.ceilingHeight,
    }));
    trackEvent('estimate_room_preset_select', { roomType: preset.label });
  };

  const handleFinalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Anti-Spam Honeypot Check
    const form = e.currentTarget;
    const data = new FormData(form);
    const botHoneypot = String(data.get('bot_honeypot') || '');
    if (botHoneypot) {
      setStatus('sent');
      setMessage('Your planning range was received. Sky’s the Limit can follow up to confirm surface condition and final scope.');
      return;
    }

    const referrerEmail = typeof window !== 'undefined' ? localStorage.getItem('referrer_email') : null;
    const projectAddress = String(data.get('projectAddress') || '');
    const payload = {
      source: 'Estimate Calculator',
      page: '/estimate',
      name,
      phone,
      email,
      city,
      projectAddress,
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
Calculated Range: $${calculationResult.low} - $${calculationResult.high}${projectAddress ? `\nAddress: ${projectAddress}` : ''}`,
      ...(referrerEmail ? { referrerEmail } : {}),
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
        setMessage('Your planning range was received. Sky’s the Limit can follow up to confirm surface condition and final scope.');
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
    const addressInput = document.getElementById('client-address') as HTMLInputElement | null;
    const projectAddress = addressInput?.value || '';
    window.location.href = buildEstimateMailto({
      Source: 'Estimate Calculator',
      Name: name,
      Phone: phone,
      Email: email,
      City: city,
      'Project address': projectAddress,
      Market: 'Residential',
      'Project type': 'Interior',
      Budget: `$${calculationResult.low} - $${calculationResult.high}`,
      Notes: `Room Type: ${dimensions.roomType} (${dimensions.width}x${dimensions.length}x${dimensions.ceilingHeight})
Prep: ${trimPrep.prepLevel} (Doors: ${trimPrep.doorsCount}, Windows: ${trimPrep.windowsCount}, Trim: ${trimPrep.trimLength} ft)
Cabinets: ${cabinets.cabinetDoors} doors, ${cabinets.cabinetDrawers} drawers${projectAddress ? `\nAddress: ${projectAddress}` : ''}`,
    });
  };

  return (
    <PageTransition>
      <PageMeta
        title="Interactive Room Paint Cost Calculator | Sky's the Limit Painting LLC"
        description="Estimate your residential room interior painting and trim prep cost ranges instantly across the Twin Cities."
        path="/estimate"
      />

      <section className="relative min-h-[calc(100svh-116px)] overflow-hidden bg-[#050505] py-16 px-4 text-white sm:px-6 lg:px-8">
        <img
          src="/images/site/iphone-interior-painting-progress.webp"
          alt="Interior painting progress"
          className="absolute inset-0 h-full w-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/94 to-[#050505]"></div>
        <div className="blueprint-grid absolute inset-0 opacity-12"></div>
        <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-70"></div>
        
        <div className="relative z-10 mx-auto max-w-3xl border border-white/10 bg-[#0B0B0D]/95 p-6 md:p-10 backdrop-blur-md">
          
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 border border-[#f0c067]/30 bg-[#050505]/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#f0c067]">
              <Calculator size={12} /> Linear Cost Estimator
            </span>
            <h1 className="mt-6 font-display text-3xl font-black leading-none text-white sm:text-4xl text-wrap-balance uppercase">
              Room Cost Calculator
            </h1>
            <p className="mt-3 text-sm text-[#c9c1b4]">
              Build a realistic planning range from room dimensions, trim detail, prep level, and cabinet openings before requesting a final site-confirmed estimate.
            </p>
          </div>

          {/* Segmented Timeline Stepper */}
          <div className="mb-10 border border-white/10 bg-[#050505] p-4">
            <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-black uppercase tracking-wider md:text-[10px]">
              {[
                { label: '01 // Dimensions', active: step >= 1 },
                { label: '02 // Trim & Prep', active: step >= 2 },
                { label: '03 // Cabinets', active: step >= 3 },
                { label: '04 // Results', active: step >= 4 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className={`h-1.5 w-full transition-all duration-300 ${item.active ? 'bg-[#f0c067]' : 'bg-white/10'}`}></div>
                  <span className={item.active ? 'text-[#f0c067]' : 'text-gray-500'}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Dimensions */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-3">
                  Quick Room Presets
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {roomPresets.map((preset) => {
                    const isActive = dimensions.roomType === preset.label;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyRoomPreset(preset)}
                        className={`border p-3 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                          isActive
                            ? 'border-[#f0c067] bg-[#f0c067]/10 text-[#f0c067] backdrop-blur-md'
                            : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-3">
                  Room Type
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {['Bedroom', 'Living Room', 'Kitchen', 'Bathroom', 'Hallway', 'Custom'].map((type) => {
                    const isActive = dimensions.roomType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setDimensions({ ...dimensions, roomType: type })}
                        className={`p-3 border text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                          isActive
                            ? 'border-[#f0c067] bg-[#f0c067]/10 text-[#f0c067] backdrop-blur-md'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
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
                    onChange={(e) => setDimensionValue('width', Number(e.target.value), 5, 50)}
                    className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
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
                    onChange={(e) => setDimensionValue('length', Number(e.target.value), 5, 50)}
                    className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
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
                    onChange={(e) => setDimensionValue('ceilingHeight', Number(e.target.value), 7, 20)}
                    className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 bg-[#f0c067] px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-[#050505] hover:bg-white hover:text-[#050505] transition-all cursor-pointer"
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
                        ? 'border-[#f0c067] bg-[#f0c067]/10'
                        : 'border-white/10 bg-white/5'
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
                        ? 'border-[#f0c067] bg-[#f0c067]/10'
                        : 'border-white/10 bg-white/5'
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
                    onChange={(e) => setTrimValue('doorsCount', Number(e.target.value), 0, 10)}
                    className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
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
                    onChange={(e) => setTrimValue('windowsCount', Number(e.target.value), 0, 10)}
                    className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
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
                    onChange={(e) => setTrimValue('trimLength', Number(e.target.value), 0, 200)}
                    className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-white hover:border-white transition-all cursor-pointer"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 bg-[#f0c067] px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-[#050505] hover:bg-white hover:text-black transition-all cursor-pointer"
                >
                  Next Step <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Cabinets */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-l-2 border-[#f0c067] bg-[#f0c067]/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#f0c067]">Optional Cabinet Painting Add-On</p>
                <p className="text-xs text-gray-300 mt-2">Cabinet paint transformations can modernize a kitchen without full replacement. Add openings here if you want the range to include that scope.</p>
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
                    onChange={(e) => setCabinetValue('cabinetDoors', Number(e.target.value), 0, 60)}
                    className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
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
                    onChange={(e) => setCabinetValue('cabinetDrawers', Number(e.target.value), 0, 40)}
                    className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-white hover:border-white transition-all cursor-pointer"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 bg-[#f0c067] px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-[#050505] hover:bg-white hover:text-black transition-all cursor-pointer"
                >
                  Calculate Cost <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Results & Lead Capture */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border border-white/10 bg-[#050505] p-6">
                <p className="text-xs font-black text-center uppercase tracking-[0.28em] text-[#f0c067]">Estimated Interior Price Range</p>
                <p className="mt-4 text-center font-display text-4xl font-black text-white md:text-5xl tracking-normal">
                  ${calculationResult.low.toLocaleString()} – ${calculationResult.high.toLocaleString()}
                </p>
                <p className="mt-2 text-center text-xs text-gray-400">
                  Approx. {calculationResult.wallArea} sq ft of wall surface area measured.
                </p>

                {/* Cost Breakdown */}
                <div className="mt-6 border-t border-white/10 pt-5 space-y-3 text-xs">
                  <p className="font-black uppercase tracking-wider text-white">Estimated Cost Breakdown</p>
                  
                  <div className="flex justify-between text-[#c9c1b4] border-b border-white/5 pb-2">
                     <span>Wall prep, priming, and coatings ({dimensions.roomType})</span>
                    <span className="font-bold text-white">${calculationResult.wallCost.toLocaleString()}</span>
                  </div>

                  {calculationResult.openingsCost > 0 && (
                    <div className="flex justify-between text-[#c9c1b4] border-b border-white/5 pb-2">
                       <span>Doors ({trimPrep.doorsCount}) & Windows ({trimPrep.windowsCount}) detailing</span>
                      <span className="font-bold text-white">${calculationResult.openingsCost.toLocaleString()}</span>
                    </div>
                  )}

                  {calculationResult.trimCost > 0 && (
                    <div className="flex justify-between text-[#c9c1b4] border-b border-white/5 pb-2">
                      <span>Baseboards & trim ({trimPrep.trimLength} linear ft)</span>
                      <span className="font-bold text-white">${calculationResult.trimCost.toLocaleString()}</span>
                    </div>
                  )}

                  {calculationResult.cabinetCost > 0 && (
                    <div className="flex justify-between text-[#c9c1b4] border-b border-white/5 pb-2">
                      <span>Cabinets ({cabinets.cabinetDoors + cabinets.cabinetDrawers} openings)</span>
                      <span className="font-bold text-white">${calculationResult.cabinetCost.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold border-b border-white/10 pb-2 text-[#f0c067]">
                    <span>Total Linear Base Estimate</span>
                    <span>${calculationResult.totalEstimate.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-5 border border-[#f0c067]/20 bg-[#f0c067]/5 p-4 text-[11px] leading-relaxed text-[#c9c1b4]">
                  <p className="font-black uppercase tracking-wider text-[#f0c067] mb-1">Direct Contractor Advantage</p>
                  Direct owner-operator structure. This range represents estimated field labor and premium coatings (Benjamin Moore or Sherwin-Williams). No national franchise markups, middleman fees, or sales commissions are included.
                </div>

                <p className="mt-4 text-left text-[11px] leading-relaxed text-gray-400">
                  Planning range only. Final pricing depends on wall condition, furniture protection, structural repairs, color changes, and site-confirmed scope.
                </p>
              </div>

              {status !== 'sent' ? (
                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  <h3 className="text-lg font-black uppercase text-white tracking-wide">Send This Range For Review</h3>
                  <p className="text-xs text-gray-300">
                    Send the calculated range with your contact details so Sky’s the Limit can confirm surfaces, prep, timing, and next steps.
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
                        aria-label="Full name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
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
                        aria-label="Phone"
                        placeholder="651-555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="client-email" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                        Email Address
                      </label>
                      <input
                        id="client-email"
                        type="email"
                        required
                        aria-label="Email"
                        spellCheck={false}
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
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
                        aria-label="City"
                        placeholder="Eagan"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="client-address" className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                        Street Address (Optional)
                      </label>
                      <input
                        id="client-address"
                        type="text"
                        name="projectAddress"
                        aria-label="Project address or cross streets"
                        placeholder="123 Main St"
                        className="w-full border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#f0c067] focus-visible:ring-2 focus-visible:ring-[#f0c067]/20"
                      />
                    </div>
                  </div>

                  {status === 'fallback' && (
                    <button
                      type="button"
                      onClick={handleEmailFallback}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#f0c067] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#050505] hover:bg-white transition-all cursor-pointer"
                    >
                      Open Email Draft
                    </button>
                  )}

                  {status !== 'fallback' && (
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#f0c067] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#050505] hover:bg-white hover:text-black transition-all disabled:opacity-55 cursor-pointer"
                    >
                      {status === 'submitting' ? 'Saving…' : 'LOCK IN YOUR ESTIMATE RANGE'} <ArrowRight size={18} />
                    </button>
                  )}

                  <p className="flex items-start gap-2 text-xs font-semibold text-[#b9b2a6]" aria-live="polite">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#f0c067]" />
                    {message || 'Your planning range routes with the room details. Final estimates are confirmed after surface condition and scope are reviewed.'}
                  </p>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0c067]/10 text-[#f0c067] mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase">Range Sent!</h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#c9c1b4]">
                    Thank you, {name}. Your planning range of ${calculationResult.low.toLocaleString()} - ${calculationResult.high.toLocaleString()} has been sent for review. Sky’s the Limit can follow up to confirm the final scope.
                  </p>
                </div>
              )}

              <div className="flex justify-start pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-white hover:border-white transition-all cursor-pointer"
                >
                  <ArrowLeft size={16} /> Recalculate
                </button>
              </div>
            </div>
          )}

          {/* Trust Badges & Registration Disclosures (Fogg Motivation) */}
          <div className="mt-10 border-t border-white/10 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-[#f0c067] shrink-0" />
              <div>
                <p className="text-white font-black text-[12px] leading-tight uppercase">Fully Insured</p>
                <p className="text-[10px] lowercase tracking-normal font-normal text-gray-500 mt-0.5">coi available on request</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4">
              <ShieldCheck size={20} className="text-[#f0c067] shrink-0" />
              <div>
                <p className="text-white font-black text-[12px] leading-tight uppercase">MN Contractor</p>
                <p className="text-[10px] tracking-normal font-normal text-gray-500 mt-0.5">reg: ir816596 | painting</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4">
              <ShieldCheck size={20} className="text-[#f0c067] shrink-0" />
              <div>
                <p className="text-white font-black text-[12px] leading-tight uppercase">Owner-Operated</p>
                <p className="text-[10px] tracking-normal font-normal text-gray-500 mt-0.5">mn statute 176.041 exempt</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </PageTransition>
  );
}
