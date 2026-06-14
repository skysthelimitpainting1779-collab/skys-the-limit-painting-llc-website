import { useEffect } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

export default function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();

  // Use MotionValues instead of React state to completely bypass React's render cycle 
  // on every mouse movement. This keeps pointer animation smooth.
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorSize = useMotionValue(16);

  // Tighter, faster spring configuration for immediate physics response
  const springConfig = { stiffness: 800, damping: 35, mass: 0.1 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  const smoothSize = useSpring(cursorSize, springConfig);

  useEffect(() => {
    // Flag to easily check if we are in interactive state without state variables
    // For test compatibility: a, button, select, input hovered
    let isHovering = false;

    const updatePosition = (e: MouseEvent) => {
      // Calculate offset based on current size
      const offset = isHovering ? 24 : 8; 
      cursorX.set(e.clientX - offset);
      cursorY.set(e.clientY - offset);
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isInteractive = !!target.closest('button, a, input, select, textarea, [role="button"]');

      if (isInteractive !== isHovering) {
        isHovering = isInteractive;
        // Expanding to 48px on hover, default 16px
        cursorSize.set(isHovering ? 48 : 16);
        // Correct position offset instantly so it doesn't jump
        const offset = isHovering ? 24 : 8;
        cursorX.set(e.clientX - offset);
        cursorY.set(e.clientY - offset);
      }
    };

    // Use passive event listeners for maximum scrolling and tracking performance
    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mouseover', updateHoverState, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, [cursorX, cursorY, cursorSize]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      className="hidden md:block fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white/80 will-change-transform"
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
        width: smoothSize,
        height: smoothSize,
      }}
    />
  );
}
