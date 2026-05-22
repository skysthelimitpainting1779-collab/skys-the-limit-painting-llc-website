/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'motion/react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  
  // Motion values for hardware acceleration
  const x = useMotionValue(0);
  
  // Set initial position once container is measured
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      x.set(width / 2);
    }
  }, [x]);

  const handleDrag = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    const currentX = x.get();
    const percent = Math.max(0, Math.min(100, (currentX / width) * 100));
    setSliderPosition(percent);
  };

  // Sync width on window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        x.set((sliderPosition / 100) * width);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sliderPosition, x]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    let newPosition = sliderPosition;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      newPosition = Math.max(0, sliderPosition - 5);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      newPosition = Math.min(100, sliderPosition + 5);
    } else if (event.key === 'Home') {
      event.preventDefault();
      newPosition = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      newPosition = 100;
    }
    setSliderPosition(newPosition);
    x.set((newPosition / 100) * width);
  };

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative h-[350px] w-full overflow-hidden rounded-sm border border-white/10 select-none cursor-ew-resize focus-visible:ring-2 focus-visible:ring-orange-safety focus:outline-none"
        role="slider"
        aria-label="Before and after image comparison slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <ResponsiveImage src={afterImage} alt={afterLabel} width={1200} height={700} className="absolute inset-0 h-full w-full object-cover pointer-events-none" />

        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <ResponsiveImage src={beforeImage} alt={beforeLabel} width={1200} height={700} className="absolute inset-0 h-full w-full object-cover max-w-none" style={{ width: containerRef.current?.offsetWidth || '100vw' }} />
        </div>

        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-sm border border-white/20 text-white text-xs font-bold uppercase tracking-wider pointer-events-none shadow-md z-10 transition-opacity">
          {beforeLabel}
        </div>
        <div className="absolute top-4 right-4 bg-orange-safety/80 backdrop-blur-sm px-3 py-1 rounded-sm border border-orange-safety text-white text-xs font-bold uppercase tracking-wider pointer-events-none shadow-md z-10 transition-opacity">
          {afterLabel}
        </div>

        {/* Draggable Divider Handle */}
        <motion.div
          drag="x"
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={containerRef}
          onDrag={handleDrag}
          style={{ x }}
          className="absolute top-0 bottom-0 w-1 bg-orange-safety cursor-ew-resize z-20 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        >
          <motion.div 
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-white border-2 border-orange-safety rounded-full shadow-lg flex items-center justify-center text-orange-safety font-black"
          >
            <span aria-hidden="true">&lt;&gt;</span>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400" aria-hidden="true">
        <span>{beforeLabel} (Drag slider or use Arrow keys)</span>
        <span>{afterLabel}</span>
      </div>
    </div>
  );
}
