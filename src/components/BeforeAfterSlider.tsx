import { useState, useRef, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const clamp = (value: number) => Math.max(0, Math.min(100, value));

  const updatePosition = (value: number) => {
    setSliderPosition(clamp(value));
  };

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = clamp((x / rect.width) * 100);
    updatePosition(percent);
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: ReactTouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      updatePosition(sliderPosition - 5);
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      updatePosition(sliderPosition + 5);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      updatePosition(0);
    }
    if (event.key === 'End') {
      event.preventDefault();
      updatePosition(100);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative h-[350px] w-full overflow-hidden rounded-sm border border-white/10 select-none cursor-ew-resize"
        aria-label="Before and after image comparison"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
        onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
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

        <div
          className="absolute top-0 bottom-0 w-1 bg-orange-safety cursor-ew-resize z-20 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
          aria-hidden="true"
        >
          <div className="w-8 h-8 bg-white border-2 border-orange-safety rounded-full shadow-lg flex items-center justify-center text-orange-safety font-black">
            <span aria-hidden="true">&lt;&gt;</span>
          </div>
        </div>
      </div>

      <label className="block text-sm font-bold uppercase tracking-wider text-gray-300">
        Adjust before and after comparison
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={sliderPosition}
          onChange={(event) => updatePosition(Number(event.target.value))}
          onKeyDown={handleKeyDown}
          className="mt-2 w-full accent-orange-safety"
          aria-valuetext={`${Math.round(sliderPosition)} percent before image visible`}
        />
      </label>
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400" aria-hidden="true">
        <span>{beforeLabel}</span>
        <span>{afterLabel}</span>
      </div>
    </div>
  );
}
