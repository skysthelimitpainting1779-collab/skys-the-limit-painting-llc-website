import { useRef, useState, ReactNode, MouseEvent } from 'react';
import { motion, useSpring } from 'motion/react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  pullFactor?: number;
}

export default function MagneticButton({ children, className = '', pullFactor = 0.5 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isHovered }, setHovered] = useState({ isHovered: false });
  
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * pullFactor);
    y.set((clientY - centerY) * pullFactor);
  };

  const handleMouseEnter = () => setHovered({ isHovered: true });
  
  const handleMouseLeave = () => {
    setHovered({ isHovered: false });
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
