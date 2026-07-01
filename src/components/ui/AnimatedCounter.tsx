'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useInView, useReducedMotion } from 'motion/react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

function AnimatedCounterItem({ target, suffix = '', prefix = '', label, duration = 1.8 }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 60, damping: 18 });
  const [displayValue, setDisplayValue] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      if (prefersReducedMotion) {
        setDisplayValue(target);
        return;
      }
      motionValue.set(target);
    }
  }, [isInView, motionValue, target, prefersReducedMotion]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (v) => {
      setDisplayValue(Math.round(v));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <div ref={ref} className="flex flex-col items-start gap-2">
      <div className="flex items-baseline gap-1">
        {prefix && (
          <span className="font-display text-xl font-black text-white">{prefix}</span>
        )}
        <span className="font-display text-5xl font-black leading-none text-white md:text-6xl">
          {displayValue}
        </span>
        {suffix && (
          <span className="font-display text-2xl font-black text-white">{suffix}</span>
        )}
      </div>
      <p className="text-xs font-medium text-[#9ca3af]">{label}</p>
    </div>
  );
}

interface StatsBarProps {
  stats: Array<{ target: number; suffix?: string; prefix?: string; label: string }>;
  className?: string;
}

export default function AnimatedStatsBar({ stats, className = '' }: StatsBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`grid grid-cols-2 gap-px bg-[#d8c7aa]/10 md:grid-cols-4 ${className}`}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.5 }}
          className="flex flex-col justify-center bg-[#0b0b0a] px-6 py-8 md:px-8"
        >
          <AnimatedCounterItem
            target={stat.target}
            suffix={stat.suffix}
            prefix={stat.prefix}
            label={stat.label}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
