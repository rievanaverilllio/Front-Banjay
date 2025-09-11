// Lenis smooth scroll initialization for Next.js/React
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export function useLenisSmoothScroll() {
  useEffect(() => {
    // Don't initialize Lenis on touch devices / mobile — let native scrolling handle touch.
    if (typeof window !== 'undefined') {
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
      if (isTouch) return;
    }
    
    const lenis = new Lenis({
      duration: 0.5, // slow and smooth
      // smooth: true, // Not needed for Lenis v1+, default is smooth
      gestureOrientation: 'vertical',
      // smoothTouch: true, // Not needed for Lenis v1+, removed for compatibility
      touchMultiplier: 0.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 2), // easeOutQuad
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}
