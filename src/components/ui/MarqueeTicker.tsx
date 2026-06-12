import { useReducedMotion } from 'motion/react';

interface MarqueeTickerProps {
  items: string[];
  separator?: string;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

export default function MarqueeTicker({
  items,
  separator = '\u00B7',
  className = '',
  speed = 'normal',
}: MarqueeTickerProps) {
  const prefersReducedMotion = useReducedMotion();

  const durationMap = { slow: '38s', normal: '28s', fast: '18s' };
  const duration = durationMap[speed];

  // Duplicate items to create seamless loop
  const allItems = [...items, ...items];

  if (prefersReducedMotion) {
    return (
      <div className={`flex flex-wrap gap-4 px-4 py-3 ${className}`}>
        {items.map((item) => (
          <span key={item} className="text-xs font-black uppercase tracking-[0.22em] text-[#d8c7aa]">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="flex w-max"
        style={{
          animation: `marquee-left ${duration} linear infinite`,
          willChange: 'transform',
        }}
      >
        {allItems.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-5 px-5 text-[11px] font-black uppercase tracking-[0.22em] text-[#d8c7aa]/80"
          >
            {item}
            <span className="text-[#f0c067]/50">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
