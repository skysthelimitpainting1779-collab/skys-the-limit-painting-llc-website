import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Flame, RefreshCw, EyeOff } from 'lucide-react';

interface ClickPoint {
  x: number;
  y: number;
  path: string;
  timestamp: number;
}

export default function HeatmapOverlay() {
  const [heatmapActive, setHeatmapActive] = useState(false);
  const [clicks, setClicks] = useState<ClickPoint[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load initial clicks from localStorage
    const saved = localStorage.getItem('sky_heatmap_clicks');
    if (saved) {
      try {
        setClicks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse heatmap clicks:', e);
      }
    }

    const handleClick = (e: MouseEvent) => {
      // Avoid tracking clicks on the heatmap dashboard control panel itself
      const target = e.target as HTMLElement;
      if (target.closest('.heatmap-control-panel')) return;

      const scrollWidth = Math.max(
        document.documentElement.scrollWidth,
        document.body.scrollWidth,
        window.innerWidth
      );
      const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight
      );

      const xPercent = (e.pageX / scrollWidth) * 100;
      const yPercent = (e.pageY / scrollHeight) * 100;

      const newPoint: ClickPoint = {
        x: xPercent,
        y: yPercent,
        path: window.location.pathname,
        timestamp: Date.now(),
      };

      setClicks((prev) => {
        const updated = [...prev, newPoint].slice(-150); // limit to 150 points
        localStorage.setItem('sky_heatmap_clicks', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleReset = () => {
    localStorage.removeItem('sky_heatmap_clicks');
    setClicks([]);
  };

  const activeClicksOnPath = clicks.filter((c) => c.path === location.pathname);

  return (
    <>
      {/* Floating Control Panel */}
      <div className="heatmap-control-panel fixed bottom-20 right-4 z-50 flex items-center gap-2 border border-[#f0c067]/35 bg-[#0B0B0D]/95 p-2.5 text-xs text-white shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur transition-all duration-300">
        <button
          type="button"
          onClick={() => setHeatmapActive(!heatmapActive)}
          className={`flex items-center gap-2 px-3 py-1.5 font-black uppercase tracking-wider transition-colors cursor-pointer ${
            heatmapActive ? 'bg-[#f0c067] text-[#050505]' : 'bg-white/5 text-white hover:bg-white/10'
          }`}
        >
          <Flame size={14} className={heatmapActive ? 'animate-pulse' : ''} />
          {heatmapActive ? 'Heatmap: ON' : 'Heatmap: OFF'}
        </button>

        <span className="text-[10px] font-bold text-gray-400 px-1 border-r border-white/10">
          {activeClicksOnPath.length} Clicks here
        </span>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center justify-center p-1.5 text-gray-400 hover:text-[#f0c067] transition-colors cursor-pointer"
          title="Reset click data"
        >
          <RefreshCw size={12} />
        </button>

        {heatmapActive && (
          <button
            type="button"
            onClick={() => setHeatmapActive(false)}
            className="flex items-center justify-center p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Hide heatmap overlay"
          >
            <EyeOff size={12} />
          </button>
        )}
      </div>

      {/* Visual Heatmap Overlay */}
      {heatmapActive && (
        <div 
          className="absolute inset-0 z-40 pointer-events-none w-full h-full overflow-hidden"
          style={{ mixBlendMode: 'screen' }}
        >
          {activeClicksOnPath.map((click, index) => (
            <div
              key={index}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${click.x}%`,
                top: `${click.y}%`,
                width: '32px',
                height: '32px',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(240,192,103,0.9) 0%, rgba(240,192,103,0.3) 50%, rgba(240,192,103,0) 80%)',
                boxShadow: '0 0 12px rgba(240,192,103,0.15)',
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
