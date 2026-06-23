'use client';

import React, { useState } from 'react';
import ResponsiveImage from './ResponsiveImage';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = 'Before', 
  afterLabel = 'After' 
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      setSliderPosition((pos) => Math.max(0, pos - 5));
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      setSliderPosition((pos) => Math.min(100, pos + 5));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setSliderPosition(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setSliderPosition(100);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="relative h-[350px] w-full overflow-hidden rounded-none border border-white/10 select-none cursor-ew-resize focus-visible:ring-2 focus-visible:ring-[#FF5A00] focus:outline-none"
      >
        {/* Underlay Image: After */}
        <div className="absolute inset-0 h-full w-full">
          <ResponsiveImage 
            src={afterImage} 
            alt={afterLabel} 
            width={1200} 
            height={700} 
            className="h-full w-full object-cover pointer-events-none" 
          />
        </div>

        {/* Overlay Image: Before (clipped) */}
        <div 
          className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <ResponsiveImage 
            src={beforeImage} 
            alt={beforeLabel} 
            width={1200} 
            height={700} 
            className="h-full w-full object-cover pointer-events-none" 
          />
        </div>

        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-none border border-white/20 text-white text-xs font-bold uppercase tracking-wider pointer-events-none shadow-md z-10">
          {beforeLabel}
        </div>
        <div className="absolute top-4 right-4 bg-[#FF5A00] backdrop-blur-sm px-3 py-1 rounded-none border border-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-wider pointer-events-none shadow-md z-10">
          {afterLabel}
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(sliderPosition)}
          aria-label="Before and after image comparison slider"
          aria-valuetext={`${Math.round(sliderPosition)} percent ${beforeLabel} visible`}
          onChange={(event) => setSliderPosition(Number(event.target.value))}
          onKeyDown={handleKeyDown}
          onMouseDown={(event) => event.currentTarget.focus()}
          onTouchStart={(event) => event.currentTarget.focus()}
          className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
        />

        {/* Draggable Divider Handle */}
        <div
          style={{ left: `${sliderPosition}%` }}
          className="absolute top-0 bottom-0 w-1 bg-[#FF5A00] cursor-ew-resize z-20 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] -translate-x-1/2"
        >
          <div 
            className="w-8 h-8 bg-[#FF5A00] border border-white/20 shadow-lg flex items-center justify-center text-[#050505] font-black transition-transform duration-100 active:scale-95 hover:scale-110"
          >
            <span aria-hidden="true" className="font-mono text-xs select-none">||</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400" aria-hidden="true">
        <span>{beforeLabel} (Drag slider or use Arrow keys)</span>
        <span>{afterLabel}</span>
      </div>
    </div>
  );
}
