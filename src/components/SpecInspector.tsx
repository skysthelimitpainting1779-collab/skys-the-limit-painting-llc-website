'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, CheckCircle } from 'lucide-react';

export default function SpecInspector() {
  const [isActive, setIsActive] = useState(false);
  const [mousePos, setPosition] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ w: 1024, h: 768 });

  // Play a retro industrial-synth calibration click
  const playCalibrateSound = (high = false) => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(high ? 900 : 380, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Set initial size
    handleResize();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);

  const toggleInspector = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    playCalibrateSound(nextState);

    if (nextState) {
      document.documentElement.classList.add('spec-mode-active');
    } else {
      document.documentElement.classList.remove('spec-mode-active');
    }
  };

  return (
    <>
      {/* HUD Overlay when Inspector Mode is Active */}
      <AnimatePresence>
        {isActive && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden font-mono select-none text-[10px] text-[#f0c067]/75">
            {/* Horizontal tracking line */}
            <div 
              className="absolute left-0 w-full border-t border-dashed border-[#f0c067]/15 transition-all duration-75 ease-out"
              style={{ top: mousePos.y }}
            />
            {/* Vertical tracking line */}
            <div 
              className="absolute top-0 h-full border-l border-dashed border-[#f0c067]/15 transition-all duration-75 ease-out"
              style={{ left: mousePos.x }}
            />

            {/* Pointer Coordinates Box */}
            <div 
              className="absolute bg-[#050505] border border-[#f0c067]/30 px-2 py-1 flex flex-col gap-0.5 z-[99] select-none text-[#f0c067] shadow-lg pointer-events-none transition-all duration-75 ease-out"
              style={{ 
                left: mousePos.x + 15, 
                top: mousePos.y + 15,
                // Stay on screen if cursor is too close to margins
                transform: `${mousePos.x > viewport.w - 140 ? 'translateX(-120%)' : ''} ${mousePos.y > viewport.h - 80 ? 'translateY(-120%)' : ''}`
              }}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f0c067] animate-pulse"></span>
                <span>POINT TARGET</span>
              </div>
              <div className="text-white">X: {mousePos.x}px</div>
              <div className="text-white">Y: {mousePos.y}px</div>
            </div>

            {/* TOP LEFT METRICS PANEL */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-6 top-6 bg-[#050505]/90 border border-[#f0c067]/30 p-4 w-60 flex flex-col gap-2 shadow-2xl backdrop-blur-md pointer-events-auto"
            >
              <div className="flex items-center justify-between border-b border-[#f0c067]/20 pb-2">
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <Terminal size={12} className="text-[#f0c067]" />
                  SPEC CALIBRATOR
                </span>
                <span className="text-emerald-500 font-bold bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 text-[8px] animate-pulse">
                  SYSTEM READY
                </span>
              </div>
              <div className="space-y-1 text-gray-400">
                <div className="flex justify-between">
                  <span>VIEWPORT:</span>
                  <span className="text-white">{viewport.w}W x {viewport.h}H</span>
                </div>
                <div className="flex justify-between">
                  <span>GRID SNAP:</span>
                  <span className="text-[#f0c067]">42px [BLUEPRINT]</span>
                </div>
                <div className="flex justify-between">
                  <span>SCALE FACTOR:</span>
                  <span className="text-white">1:1 CRITICAL</span>
                </div>
                <div className="flex justify-between">
                  <span>M2 AUDIT STATUS:</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={10} /> PASSED
                  </span>
                </div>
              </div>
            </motion.div>

            {/* BOTTOM LEFT REPUTATION HUD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute left-6 bottom-24 bg-[#050505]/90 border border-white/10 p-4 w-60 flex flex-col gap-2 shadow-2xl backdrop-blur-md pointer-events-auto"
            >
              <div className="flex items-center gap-1.5 font-bold text-white border-b border-white/10 pb-2">
                <Cpu size={12} className="text-[#f0c067]" />
                CRAFTSMAN OVERLAYS
              </div>
              <p className="text-[9px] text-gray-400 leading-normal">
                This mode overlays raw mechanical trade lines, demonstrating our strict blueprint layout discipline.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toggle Control Button */}
      <div className="fixed bottom-6 left-6 z-[99]">
        <button
          onClick={toggleInspector}
          className={`flex items-center gap-2 px-3 py-2 text-[10px] font-mono font-black uppercase tracking-wider border rounded-none shadow-xl transition-all duration-300 ${
            isActive
              ? 'bg-[#f0c067] border-[#f0c067] text-[#050505] hover:bg-white hover:border-white scale-105'
              : 'bg-[#050505] border-[#f0c067]/30 text-[#f0c067] hover:border-[#f0c067] hover:bg-[#111]'
          }`}
        >
          <span className={`relative flex h-2 w-2 shrink-0`}>
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isActive ? 'bg-black animate-ping' : 'bg-[#f0c067] animate-pulse-ring'
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? 'bg-black' : 'bg-[#f0c067]'}`} />
          </span>
          {isActive ? 'SPEC INSPECTION [ON]' : 'SPEC CALIBRATOR'}
        </button>
      </div>
    </>
  );
}
