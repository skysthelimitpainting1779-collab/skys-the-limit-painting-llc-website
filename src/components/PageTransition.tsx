'use client';

import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export default function PageTransition({
  children,
  className = '',
}: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={className}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}
