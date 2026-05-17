import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef, ReactNode, Key } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  fullWidth?: boolean;
  className?: string;
  key?: Key;
}

export default function FadeIn({ children, delay = 0, direction = 'up', fullWidth = false, className = '' }: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const prefersReducedMotion = useReducedMotion();

  const directionOffset = {
    up: 20,
    down: -20,
    left: 20,
    right: -20,
    none: 0,
  };

  const xOffset = direction === 'left' || direction === 'right' ? directionOffset[direction] : 0;
  const yOffset = direction === 'up' || direction === 'down' ? directionOffset[direction] : 0;

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, x: xOffset, y: yOffset }}
      animate={prefersReducedMotion || isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: xOffset, y: yOffset }}
      transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20, delay }}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
