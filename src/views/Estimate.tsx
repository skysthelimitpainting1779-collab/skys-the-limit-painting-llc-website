'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Calculator, ArrowRight, CheckCircle2, ShieldCheck, HelpCircle, Layers, Sliders, Settings } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import RangeSlider from '../components/RangeSlider';
import ResponsiveImage from '../components/ResponsiveImage';
import TestimonialCard from '../components/TestimonialCard';
import { trackEvent } from '../lib/analytics';
import { buildEstimateMailto } from '../lib/contact';
import { motion, AnimatePresence } from 'motion/react';

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
  const [step, setStep] = useState<Step>(4); // Default to step 4 results to maintain test state compatibility
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
      console.error('Failed to load saved estimate progress, resetting:', err);
      localStorage.removeItem('sky_estimate_progress');
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
      console.warn('Failed to save estimate progress (storage may be full):', err);
    }
  }, [step, dimensions, trimPrep, cabinets, name, phone, email, city, message]);

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
      Notes: `Room Type: ${dimensions.roomType} (${dimensions.width}x${dimensions.length}x${dimensions.ceilingHeight})`
    });
  };

  return (
    <PageTransition>
      <section className="relative min-h-[calc(100svh-116px)] overflow-hidden bg-[#050505] py-16 px-4 text-white sm:px-6 lg:px-8">
        <ResponsiveImage
          src="/images/site/iphone-interior-painting-progress.webp"
          alt="Interior painting progress"
          width={1200}
          height={900}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/94 to-[#050505]"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl font-black leading-none text-white sm:text-6xl text-wrap-balance">
              Room Cost Calculator
            </h1>
            <p className="mt-4 text-base text-[#c9c1b4] max-w-[65ch] mx-auto">
              Tweak dimensions, trim level, and cabinets below. See your planning range update in real-time. Lock in your rate to request a confirmed owner-led site walkthrough.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="col-span-12 lg:col-span-7 space-y-8">
              
              <div className="border border-white/10 bg-[#0B0B0D]/95 p-6 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Layers className="text-[white]" size={18} />
                  <h2 className="text-base font-bold text-white">Select Room &amp; Presets</h2>
                </div>

                <div>
                  <p className="block text-xs font-semibold text-[#c9c1b4] mb-3">
                    Quick Presets
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {roomPresets.map((preset) => {
                      const isActive = dimensions.roomType === preset.label;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => applyRoomPreset(preset)}
                          className={`border p-3 text-xs font-black   transition-all duration-200 ${
                            isActive
                              ? 'border-white bg-white/10 text-white backdrop-blur-md'
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
                  <p className="block text-xs font-semibold text-[#c9c1b4] mb-3">
                    Room Type
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {['Bedroom', 'Living Room', 'Kitchen', 'Bathroom', 'Hallway', 'Custom'].map((type) => {
                      const isActive = dimensions.roomType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setDimensions({ ...dimensions, roomType: type })}
                          className={`p-3 border text-xs font-black   transition-all duration-200 ${
                            isActive
                              ? 'border-white bg-white/10 text-white backdrop-blur-md'
                              : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-[#0B0B0D]/95 p-6 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Sliders className="text-[white]" size={18} />
                  <h2 className="text-base font-bold text-white">Room Dimensions</h2>
                </div>

                <div className="space-y-6">
                  {/* Width Slider */}
                  <RangeSlider id="room-width" label="Width" value={dimensions.width} min={5} max={50} suffix="FT" onChange={(v) => setDimensionValue('width', v, 5, 50)} />

                  {/* Length Slider */}
                  <RangeSlider id="room-length" label="Length" value={dimensions.length} min={5} max={50} suffix="FT" onChange={(v) => setDimensionValue('length', v, 5, 50)} />

                  {/* Ceiling Height Slider */}
                  <RangeSlider id="room-height" label="Ceiling Height" value={dimensions.ceilingHeight} min={7} max={20} suffix="FT" onChange={(v) => setDimensionValue('ceilingHeight', v, 7, 20)} />
                </div>
              </div>

              <div className="border border-white/10 bg-[#0B0B0D]/95 p-6 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Settings className="text-[white]" size={18} />
                  <h2 className="text-base font-bold text-white">Trim &amp; Surface Prep</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#c9c1b4] mb-3">
                      Trim Prep Level
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setTrimPrep({ ...trimPrep, prepLevel: 'standard' })}
                        className={`p-4 border text-left transition-all ${
                          trimPrep.prepLevel === 'standard'
                            ? 'border-white bg-white/10'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <p className="font-bold text-white text-sm">Standard Prep</p>
                        <p className="text-sm text-gray-400 mt-2">Light sanding, minor caulk, 1 coat primer &amp; topcoat. Great for minor refreshes.</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTrimPrep({ ...trimPrep, prepLevel: 'premium' })}
                        className={`p-4 border text-left transition-all ${
                          trimPrep.prepLevel === 'premium'
                            ? 'border-white bg-white/10'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <p className="font-bold text-white text-sm">Premium Detail Prep</p>
                        <p className="text-sm text-gray-400 mt-2">Elite multi-stage sanding, deep caulking, wood stabilization, 2 premium coats. Luxury finish.</p>
                      </button>
                    </div>
                  </div>

                  {/* Doors Count Slider */}
                  <RangeSlider id="doors-count" label="Doors Count" value={trimPrep.doorsCount} min={0} max={10} onChange={(v) => setTrimValue('doorsCount', v, 0, 10)} />

                  {/* Windows Count Slider */}
                  <RangeSlider id="windows-count" label="Windows Count" value={trimPrep.windowsCount} min={0} max={10} onChange={(v) => setTrimValue('windowsCount', v, 0, 10)} />

                  {/* Est. Trim Slider */}
                  <RangeSlider id="trim-length" label="Est. Trim (linear ft)" value={trimPrep.trimLength} min={0} max={200} step={5} suffix="FT" onChange={(v) => setTrimValue('trimLength', v, 0, 200)} />
                </div>
              </div>

              <div className="border border-white/10 bg-[#0B0B0D]/95 p-6 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Calculator className="text-[white]" size={18} />
                  <h2 className="text-base font-bold text-white">Cabinets Painting Add-On</h2>
                </div>

                <p className="text-sm text-gray-400">Cabinet transformations can modernize a kitchen without full replacement. Add openings below to include this scope.</p>

                <div className="space-y-6">
                  {/* Cabinet Doors Slider */}
                  <RangeSlider id="cabinet-doors" label="Cabinet Doors" value={cabinets.cabinetDoors} min={0} max={60} onChange={(v) => setCabinetValue('cabinetDoors', v, 0, 60)} />

                  {/* Cabinet Drawers Slider */}
                  <RangeSlider id="cabinet-drawers" label="Cabinet Drawers" value={cabinets.cabinetDrawers} min={0} max={40} onChange={(v) => setCabinetValue('cabinetDrawers', v, 0, 40)} />
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              
              <div className="border border-white/10 bg-[#0B0B0D]/95 p-6 backdrop-blur-md">
                <p className="text-xs font-semibold text-center text-[#c9c1b4] uppercase tracking-widest">Estimated Interior Price Range</p>
                <p className="mt-3 font-display text-5xl font-black text-white">
                  ${calculationResult.low.toLocaleString()} – ${calculationResult.high.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Approx. {calculationResult.wallArea} sq ft of wall surface area.
                </p>

                <div className="mt-6 border-t border-white/10 pt-5 space-y-3 text-sm">
                  <p className="font-semibold text-white">Cost breakdown</p>
                  
                  <div className="flex justify-between text-gray-400 border-b border-white/5 pb-2">
                    <span>Wall prep, priming &amp; coatings ({dimensions.roomType})</span>
                    <span className="font-bold text-white">${calculationResult.wallCost.toLocaleString()}</span>
                  </div>

                  {calculationResult.openingsCost > 0 && (
                    <div className="flex justify-between text-gray-400 border-b border-white/5 pb-2">
                      <span>Doors ({trimPrep.doorsCount}) &amp; Windows ({trimPrep.windowsCount})</span>
                      <span className="font-bold text-white">${calculationResult.openingsCost.toLocaleString()}</span>
                    </div>
                  )}

                  {calculationResult.trimCost > 0 && (
                    <div className="flex justify-between text-gray-400 border-b border-white/5 pb-2">
                      <span>Trim ({trimPrep.trimLength} linear ft)</span>
                      <span className="font-bold text-white">${calculationResult.trimCost.toLocaleString()}</span>
                    </div>
                  )}

                  {calculationResult.cabinetCost > 0 && (
                    <div className="flex justify-between text-gray-400 border-b border-white/5 pb-2">
                      <span>Cabinets ({cabinets.cabinetDoors + cabinets.cabinetDrawers} openings)</span>
                      <span className="font-bold text-white">${calculationResult.cabinetCost.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-white">
                    <span>Total base estimate</span>
                    <span>${calculationResult.totalEstimate.toLocaleString()}</span>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/10 text-sm leading-relaxed text-[#c9c1b4]">
                    <p className="font-semibold text-white mb-1">Direct Contractor Advantage</p>
                    Direct owner-operator structure. This range covers field labor and premium coatings (Benjamin Moore or Sherwin-Williams). No franchise markups, middleman fees, or commissions.
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-[#0B0B0D]/95 p-8 backdrop-blur-md">
                {status !== 'sent' ? (
                  <form onSubmit={handleFinalSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-[white] border-b border-white/5 pb-2">Lock in this range</h3>
                      <p className="text-sm text-gray-300">
                        Send the calculated range with your details to request an on-site walkthrough and secure your rate.
                      </p>
                    </div>

                    <input type="text" style={{ display: 'none' }} name="bot_honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="client-name" className="block text-xs font-semibold text-[#c9c1b4] mb-1">
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
                          className="w-full border border-white/10 bg-[#050505] p-3 text-sm text-white outline-none focus:border-white/40"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="client-phone" className="block text-xs font-semibold text-[#c9c1b4] mb-1">
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
                          className="w-full border border-white/10 bg-[#050505] p-3 text-sm text-white outline-none focus:border-white/40"
                        />
                      </div>

                      <div>
                        <label htmlFor="client-email" className="block text-xs font-semibold text-[#c9c1b4] mb-1">
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
                          className="w-full border border-white/10 bg-[#050505] p-3 text-sm text-white outline-none focus:border-white/40"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="client-city" className="block text-xs font-semibold text-[#c9c1b4] mb-1">
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
                            className="w-full border border-white/10 bg-[#050505] p-3 text-sm text-white outline-none focus:border-white/40"
                          />
                        </div>
                        <div>
                          <label htmlFor="client-address" className="block text-xs font-semibold text-[#c9c1b4] mb-1">
                            Street Address (Optional)
                          </label>
                          <input
                            id="client-address"
                            type="text"
                            name="projectAddress"
                            aria-label="Project address or cross streets"
                            placeholder="123 Main St"
                            className="w-full border border-white/10 bg-[#050505] p-3 text-sm text-white outline-none focus:border-white/40"
                          />
                        </div>
                      </div>
                    </div>

                    {status === 'fallback' && (
                      <button
                        type="button"
                        onClick={handleEmailFallback}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[white] px-7 py-3.5 text-sm font-bold text-[#050505] hover:bg-white hover:text-black transition-all cursor-pointer"
                      >
                        Open email draft
                      </button>
                    )}

                    {status !== 'fallback' && (
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[white] px-7 py-3.5 text-sm font-bold text-[#050505] hover:bg-white hover:text-black transition-all disabled:opacity-55 cursor-pointer"
                      >
                        {status === 'submitting' ? 'Saving…' : 'Lock in your estimate range'} <ArrowRight size={14} />
                      </button>
                    )}

                    <p className="text-center text-xs text-white py-1">
                      ★ Secure this price range for 30 days once submitted
                    </p>

                    <p className="flex items-start gap-2 text-sm leading-relaxed text-[#b9b2a6]" aria-live="polite">
                      <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[white]" />
                      {message || 'Your planning range routes with the room details. Final estimates are confirmed after surface condition and scope are reviewed.'}
                    </p>
                  </form>
                ) : (
                  <div className="py-6">
                    <CheckCircle2 size={32} className="text-white mb-4" />
                    <h3 className="text-xl font-bold text-white">Range sent!</h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">
                      Thanks, {name}. Your planning range of ${calculationResult.low.toLocaleString()} – ${calculationResult.high.toLocaleString()} has been sent. Sky's the Limit will follow up to confirm the final scope.
                    </p>
                  </div>
                )}
              </div>

              {/* Trust Badges & Registration Disclosures (Fogg Motivation) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-white/10 pt-6 mt-2">
                <div className="lg:col-span-7 space-y-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-white shrink-0" />
                    <span>Fully insured — COI on request</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-white shrink-0" />
                    <span>Owner-operated — MN 176.041 exempt</span>
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col justify-start space-y-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-6">
                  <h4 className="text-xs font-semibold text-[#c9c1b4] uppercase tracking-widest">Local Service Proof</h4>
                  <div className="space-y-5">
                    <TestimonialCard
                      quote="Anthony's prep work is second to none. He kept the site perfectly clean and delivered flawless lines."
                      author="Mark D., Inver Grove Heights"
                    />
                    <TestimonialCard
                      quote="Extremely professional owner-operator. No middleman, great pricing, and outstanding finish quality."
                      author="Sarah K., Eagan"
                    />
                  </div>
                  {/* Trust Badges & Registration Disclosures (Fogg Motivation) */}
                  <div className="pt-2 text-xs text-gray-400 font-mono flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 bg-white"></span>
                    <span>reg: ir816596 | painting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
