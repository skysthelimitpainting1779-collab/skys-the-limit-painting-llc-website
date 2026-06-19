'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ReactNode, Key } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  fullWidth?: boolean;
  className?: string;
  key?: Key;
}

export default function FadeIn({ children, delay = 0, direction = 'up', fullWidth = false, className = '' }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 125, damping: 22, delay }}
      data-motion-direction={direction}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
