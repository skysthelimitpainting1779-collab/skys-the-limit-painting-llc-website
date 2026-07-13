'use client';

import { useState } from 'react';
import Image from 'next/image';

const stages = [
  {
    id: '01',
    title: 'Protect',
    label: 'Containment / site control',
    image: '/images/site/marketing-hero-exterior-painting.webp',
    detail: 'Floors, furniture, landscaping, and adjacent surfaces are masked before prep begins.',
    output: 'Protected work envelope',
  },
  {
    id: '02',
    title: 'Correct',
    label: 'Substrate / defect correction',
    image: '/images/site/iphone-exterior-prep-front-entry.webp',
    detail: 'Failed coating, open seams, dents, and substrate issues are identified in the written scope.',
    output: 'Sound, profile-ready surface',
  },
  {
    id: '03',
    title: 'Coat',
    label: 'Primer / finish application',
    image: '/images/site/iphone-interior-painting-progress.webp',
    detail: 'Primer and finish coats are matched to the surface, exposure, and selected coating system.',
    output: 'Specified coating system',
  },
  {
    id: '04',
    title: 'Verify',
    label: 'Walkthrough / closeout',
    image: '/images/services/interior/sky-work-01-finished-kitchen.webp',
    detail: 'The job closes with a walkthrough against the agreed scope—not a rushed handoff.',
    output: 'Documented final detail',
  },
] as const;

export default function PrepProtocolStage() {
  const [activeId, setActiveId] = useState('01');
  const active = stages.find((stage) => stage.id === activeId) ?? stages[0];

  return (
    <section aria-labelledby="prep-standard" className="border-b border-zinc-800 bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid border border-zinc-700 lg:grid-cols-[minmax(19rem,0.72fr)_minmax(0,1.28fr)]">
          <div className="flex flex-col border-b border-zinc-700 lg:border-b-0 lg:border-r">
            <header className="border-b border-zinc-800 p-6 sm:p-8">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5A00]">02 / Preparation protocol</p>
              <h2 id="prep-standard" className="mt-5 text-4xl font-black uppercase leading-[0.85] tracking-[-0.065em] text-white sm:text-5xl">Select a work control.</h2>
              <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">Each stage changes the field canvas. This is the preparation work a written scope is designed to expose.</p>
            </header>
            <div className="grid">
              {stages.map((stage) => {
                const selected = active.id === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveId(stage.id)}
                    onMouseEnter={() => setActiveId(stage.id)}
                    aria-pressed={selected}
                    className={`grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-b border-zinc-800 px-6 py-5 text-left transition-colors last:border-b-0 sm:px-8 ${selected ? 'bg-[#FF5A00] text-white' : 'bg-[#0A0A0A] text-zinc-300 hover:bg-zinc-900'}`}
                  >
                    <span className={`font-mono text-xs font-bold tracking-widest ${selected ? 'text-white' : 'text-[#FF5A00]'}`}>{stage.id}</span>
                    <span><span className="block text-lg font-black uppercase tracking-tight">{stage.title}</span><span className={`mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] ${selected ? 'text-white/75' : 'text-zinc-500'}`}>{stage.label}</span></span>
                    <span className="font-mono text-[10px] font-bold tracking-widest">{selected ? 'ACTIVE' : 'LOAD'}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-auto grid grid-cols-2 border-t border-zinc-800">
              <div className="p-5"><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-500">Method</p><p className="mt-2 text-xs font-bold uppercase text-white">Prep-first scope</p></div>
              <div className="border-l border-zinc-800 p-5"><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-500">Status</p><p className="mt-2 text-xs font-bold uppercase text-[#FF5A00]">Field verified</p></div>
            </div>
          </div>

          <div className="relative min-h-[36rem] overflow-hidden bg-black">
            <Image src={active.image} alt={`${active.title}: ${active.detail}`} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover grayscale contrast-125 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/20 bg-black/65 px-5 py-4 sm:px-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white">Field viewer / stage {active.id}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-300">Live scope reference</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 grid border-t border-white/20 bg-[#0A0A0A]/95 sm:grid-cols-[1fr_auto]">
              <div className="p-6 sm:p-8"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5A00]">{active.label}</p><h3 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.05em] text-white">{active.title}</h3><p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300">{active.detail}</p></div>
              <div className="border-t border-white/15 p-6 sm:border-l sm:border-t-0 sm:p-8"><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-500">Control output</p><p className="mt-3 max-w-[12rem] text-sm font-bold uppercase leading-5 text-white">{active.output}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
