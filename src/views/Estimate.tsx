'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Calculator, ArrowRight, CheckCircle2, ShieldCheck, HelpCircle, Layers, Sliders, Settings } from 'lucide-react';
import PageTransition from '../components/PageTransition';
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
        <img
          src="/images/site/iphone-interior-painting-progress.webp"
          alt="Interior painting progress"
          className="absolute inset-0 h-full w-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/94 to-[#050505]"></div>
        <div className="blueprint-grid absolute inset-0 opacity-12"></div>
        <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-70"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 border border-[#f0c067]/30 bg-[#050505]/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#f0c067]">
              <Calculator size={12} /> Live Linear Cost Estimator
            </span>
            <h1 className="mt-6 font-display text-4xl font-black leading-none text-white sm:text-5xl text-wrap-balance uppercase">
              Room Cost Calculator
            </h1>
            <p className="mt-3 text-sm text-[#c9c1b4] max-w-2xl mx-auto">
              Tweak dimensions, trim level, and cabinets below. See your planning range update in real-time. Lock in your rate to request a confirmed owner-led site walkthrough.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Controls & Sliders */}
            <div className="col-span-12 lg:col-span-7 space-y-8">
              
              {/* Card 1: Presets & Room Type */}
              <div className="border border-white/10 bg-[#0B0B0D]/95 p-6 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Layers className="text-[#f0c067]" size={18} />
                  <h2 className="text-sm font-black uppercase tracking-widest text-white">01 // Select Room & Presets</h2>
                </div>

                <div>
                  <p className="block text-[11px] font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-3">
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
                  <p className="block text-[11px] font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-3">
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
              </div>

              {/* Card 2: Dimensions Sliders */}
              <div className="border border-white/10 bg-[#0B0B0D]/95 p-6 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Sliders className="text-[#f0c067]" size={18} />
                  <h2 className="text-sm font-black uppercase tracking-widest text-white">02 // Room Dimensions</h2>
                </div>

                <div className="space-y-6">
                  {/* Width Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-[#c9c1b4]">Width</span>
                      <span className="text-[#f0c067] font-mono">{dimensions.width} FT</span>
                    </div>
                    <input
                      id="room-width"
                      type="range"
                      min={5}
                      max={50}
                      value={dimensions.width}
                      onChange={(e) => setDimensionValue('width', Number(e.target.value), 5, 50)}
                      className="w-full accent-[#f0c067] bg-white/10 h-1 cursor-ew-resize focus-visible:outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>5 FT</span>
                      <span>50 FT</span>
                    </div>
                  </div>

                  {/* Length Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-[#c9c1b4]">Length</span>
                      <span className="text-[#f0c067] font-mono">{dimensions.length} FT</span>
                    </div>
                    <input
                      id="room-length"
                      type="range"
                      min={5}
                      max={50}
                      value={dimensions.length}
                      onChange={(e) => setDimensionValue('length', Number(e.target.value), 5, 50)}
                      className="w-full accent-[#f0c067] bg-white/10 h-1 cursor-ew-resize focus-visible:outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>5 FT</span>
                      <span>50 FT</span>
                    </div>
                  </div>

                  {/* Ceiling Height Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-[#c9c1b4]">Ceiling Height</span>
                      <span className="text-[#f0c067] font-mono">{dimensions.ceilingHeight} FT</span>
                    </div>
                    <input
                      id="room-height"
                      type="range"
                      min={7}
                      max={20}
                      value={dimensions.ceilingHeight}
                      onChange={(e) => setDimensionValue('ceilingHeight', Number(e.target.value), 7, 20)}
                      className="w-full accent-[#f0c067] bg-white/10 h-1 cursor-ew-resize focus-visible:outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>7 FT</span>
                      <span>20 FT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Trim Prep details */}
              <div className="border border-white/10 bg-[#0B0B0D]/95 p-6 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Settings className="text-[#f0c067]" size={18} />
                  <h2 className="text-sm font-black uppercase tracking-widest text-white">03 // Trim & Surface Prep</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-3">
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
                        <p className="font-bold text-white uppercase text-[11px] tracking-wider">Standard Prep</p>
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
                        <p className="font-bold text-white uppercase text-[11px] tracking-wider">Premium Detail Prep</p>
                        <p className="text-xs text-gray-400 mt-2">Elite multi-stage sanding, deep caulking, wood stabilization, 2 premium coats. Luxury finish.</p>
                      </button>
                    </div>
                  </div>

                  {/* Doors Count Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-[#c9c1b4]">Doors Count</span>
                      <span className="text-[#f0c067] font-mono">{trimPrep.doorsCount}</span>
                    </div>
                    <input
                      id="doors-count"
                      type="range"
                      min={0}
                      max={10}
                      value={trimPrep.doorsCount}
                      onChange={(e) => setTrimValue('doorsCount', Number(e.target.value), 0, 10)}
                      className="w-full accent-[#f0c067] bg-white/10 h-1 cursor-ew-resize focus-visible:outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>0</span>
                      <span>10</span>
                    </div>
                  </div>

                  {/* Windows Count Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-[#c9c1b4]">Windows Count</span>
                      <span className="text-[#f0c067] font-mono">{trimPrep.windowsCount}</span>
                    </div>
                    <input
                      id="windows-count"
                      type="range"
                      min={0}
                      max={10}
                      value={trimPrep.windowsCount}
                      onChange={(e) => setTrimValue('windowsCount', Number(e.target.value), 0, 10)}
                      className="w-full accent-[#f0c067] bg-white/10 h-1 cursor-ew-resize focus-visible:outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>0</span>
                      <span>10</span>
                    </div>
                  </div>

                  {/* Est. Trim Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-[#c9c1b4]">Est. Trim (linear ft)</span>
                      <span className="text-[#f0c067] font-mono">{trimPrep.trimLength} FT</span>
                    </div>
                    <input
                      id="trim-length"
                      type="range"
                      min={0}
                      max={200}
                      step={5}
                      value={trimPrep.trimLength}
                      onChange={(e) => setTrimValue('trimLength', Number(e.target.value), 0, 200)}
                      className="w-full accent-[#f0c067] bg-white/10 h-1 cursor-ew-resize focus-visible:outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>0 FT</span>
                      <span>200 FT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Optional Cabinets */}
              <div className="border border-white/10 bg-[#0B0B0D]/95 p-6 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Calculator className="text-[#f0c067]" size={18} />
                  <h2 className="text-sm font-black uppercase tracking-widest text-white">04 // Cabinets Painting Add-On</h2>
                </div>

                <div className="border-l-2 border-[#f0c067] bg-[#f0c067]/10 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#f0c067]">Optional High-Margin Scope</p>
                  <p className="text-xs text-gray-300 mt-2">Cabinet paint transformations can modernize a kitchen without full replacement. Add openings below if you want the range to include that scope.</p>
                </div>

                <div className="space-y-6">
                  {/* Cabinet Doors Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-[#c9c1b4]">Cabinet Doors</span>
                      <span className="text-[#f0c067] font-mono">{cabinets.cabinetDoors}</span>
                    </div>
                    <input
                      id="cabinet-doors"
                      type="range"
                      min={0}
                      max={60}
                      value={cabinets.cabinetDoors}
                      onChange={(e) => setCabinetValue('cabinetDoors', Number(e.target.value), 0, 60)}
                      className="w-full accent-[#f0c067] bg-white/10 h-1 cursor-ew-resize focus-visible:outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>0</span>
                      <span>60</span>
                    </div>
                  </div>

                  {/* Cabinet Drawers Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-[#c9c1b4]">Cabinet Drawers</span>
                      <span className="text-[#f0c067] font-mono">{cabinets.cabinetDrawers}</span>
                    </div>
                    <input
                      id="cabinet-drawers"
                      type="range"
                      min={0}
                      max={40}
                      value={cabinets.cabinetDrawers}
                      onChange={(e) => setCabinetValue('cabinetDrawers', Number(e.target.value), 0, 40)}
                      className="w-full accent-[#f0c067] bg-white/10 h-1 cursor-ew-resize focus-visible:outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>0</span>
                      <span>40</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Live Calculation Results & Rate-Lock Form */}
            <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              
              {/* Card 5: Real-time calculation */}
              <div className="border border-white/10 bg-[#0B0B0D]/95 p-6 backdrop-blur-md">
                <p className="text-xs font-black text-center uppercase tracking-[0.28em] text-[#f0c067]">Estimated Interior Price Range</p>
                <p className="mt-4 text-center font-display text-4xl font-black text-white md:text-5xl tracking-normal">
                  ${calculationResult.low.toLocaleString()} – ${calculationResult.high.toLocaleString()}
                </p>
                <p className="mt-2 text-center text-xs text-gray-400">
                  Approx. {calculationResult.wallArea} sq ft of wall surface area.
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
                  Direct owner-operator structure. This range represents estimated field labor and premium coatings (Benjamin Moore or Sherwin-Williams). No national franchise markups, middleman fees, or sales commissions.
                </div>
              </div>

              {/* Card 6: Live contact capture Form */}
              <div className="border border-white/10 bg-[#0B0B0D]/95 p-6 backdrop-blur-md">
                {status !== 'sent' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <form onSubmit={handleFinalSubmit} className="lg:col-span-7 space-y-4">
                      <h3 className="text-sm font-black uppercase text-[#f0c067] tracking-widest border-b border-white/5 pb-2">LOCK IN THIS RANGE</h3>
                      <p className="text-xs text-gray-300">
                        Send the calculated range with your details to request an on-site walkthrough and secure your rate.
                      </p>

                      {/* Honeypot field */}
                      <input type="text" style={{ display: 'none' }} name="bot_honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                      <div className="space-y-3">
                        <div>
                          <label htmlFor="client-name" className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-1">
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
                            className="w-full border border-white/10 bg-[#050505] p-3 text-sm text-white outline-none focus:border-[#f0c067]"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="client-phone" className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-1">
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
                            className="w-full border border-white/10 bg-[#050505] p-3 text-sm text-white outline-none focus:border-[#f0c067]"
                          />
                        </div>

                        <div>
                          <label htmlFor="client-email" className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-1">
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
                            className="w-full border border-white/10 bg-[#050505] p-3 text-sm text-white outline-none focus:border-[#f0c067]"
                          />
                        </div>

                        <div>
                          <label htmlFor="client-city" className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-1">
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
                            className="w-full border border-white/10 bg-[#050505] p-3 text-sm text-white outline-none focus:border-[#f0c067]"
                          />
                        </div>

                        <div>
                          <label htmlFor="client-address" className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-1">
                            Street Address (Optional)
                          </label>
                          <input
                            id="client-address"
                            type="text"
                            name="projectAddress"
                            aria-label="Project address or cross streets"
                            placeholder="123 Main St"
                            className="w-full border border-white/10 bg-[#050505] p-3 text-sm text-white outline-none focus:border-[#f0c067]"
                          />
                        </div>
                      </div>

                      {status === 'fallback' && (
                        <button
                          type="button"
                          onClick={handleEmailFallback}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#f0c067] px-7 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-[#050505] hover:bg-white transition-all cursor-pointer"
                        >
                          Open Email Draft
                        </button>
                      )}

                      {status !== 'fallback' && (
                        <button
                          type="submit"
                          disabled={status === 'submitting'}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#f0c067] px-7 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-[#050505] hover:bg-white hover:text-black transition-all disabled:opacity-55 cursor-pointer"
                        >
                          {status === 'submitting' ? 'Saving…' : 'LOCK IN YOUR ESTIMATE RANGE'} <ArrowRight size={14} />
                        </button>
                      )}

                      <p className="text-center text-[10px] font-black uppercase tracking-wider text-orange-safety py-1">
                        ★ Secure this linear price range for 30 days once submitted
                      </p>

                      <p className="flex items-start gap-2 text-[11px] leading-relaxed text-[#b9b2a6]" aria-live="polite">
                        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#f0c067]" />
                        {message || 'Your planning range routes with the room details. Final estimates are confirmed after surface condition and scope are reviewed.'}
                      </p>
                    </form>

                    {/* Testimonials Column */}
                    <div className="lg:col-span-5 flex flex-col justify-start space-y-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f0c067]">Local Service Proof</h4>
                      <div className="space-y-4">
                        <div className="border border-white/5 bg-white/2 p-4 text-[11px] leading-relaxed text-gray-300">
                          <div className="flex gap-1 text-[#f0c067] mb-1">★★★★★</div>
                          <p className="italic">"Anthony’s prep work is second to none. He kept the site perfectly clean and delivered flawless lines."</p>
                          <p className="mt-2 font-bold text-white">— Mark D., Inver Grove Heights</p>
                        </div>
                        <div className="border border-white/5 bg-white/2 p-4 text-[11px] leading-relaxed text-gray-300">
                          <div className="flex gap-1 text-[#f0c067] mb-1">★★★★★</div>
                          <p className="italic">"Extremely professional owner-operator. No middleman, great pricing, and outstanding finish quality."</p>
                          <p className="mt-2 font-bold text-white">— Sarah K., Eagan</p>
                        </div>
                      </div>
                      <div className="pt-2 text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 bg-orange-safety"></span>
                        <span>MN Reg ID: IR816596</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0c067]/10 text-[#f0c067] mb-6">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase">Range Sent!</h3>
                    <p className="mt-4 text-xs leading-relaxed text-[#c9c1b4]">
                      Thank you, {name}. Your planning range of ${calculationResult.low.toLocaleString()} - ${calculationResult.high.toLocaleString()} has been sent for review. Sky’s the Limit can follow up to confirm the final scope.
                    </p>
                  </div>
                )}
              </div>

              {/* Trust Badges & Registration Disclosures (Fogg Motivation) */}
              <div className="border border-white/10 bg-[#0B0B0D]/95 p-6 backdrop-blur-md grid grid-cols-1 gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-[#f0c067] shrink-0" />
                  <div>
                    <p className="text-white font-black text-[11px] leading-tight uppercase">Fully Insured</p>
                    <p className="text-[9px] lowercase tracking-normal font-normal text-gray-400 mt-0.5">coi available on request</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t border-white/5 pt-3">
                  <ShieldCheck size={18} className="text-[#f0c067] shrink-0" />
                  <div>
                    <p className="text-white font-black text-[11px] leading-tight uppercase">MN Contractor</p>
                    <p className="text-[9px] tracking-normal font-normal text-gray-400 mt-0.5">reg: ir816596 | painting</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t border-white/5 pt-3">
                  <ShieldCheck size={18} className="text-[#f0c067] shrink-0" />
                  <div>
                    <p className="text-white font-black text-[11px] leading-tight uppercase">Owner-Operated</p>
                    <p className="text-[9px] tracking-normal font-normal text-gray-400 mt-0.5">mn statute 176.041 exempt</p>
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
