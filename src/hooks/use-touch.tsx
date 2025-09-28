import { useState, useEffect } from 'react';

export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    // Check for touch capability using multiple methods
    const checkTouch = () => {
      // Primary: CSS media queries for pointer/hover capabilities
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const hasNoHover = window.matchMedia('(hover: none)').matches;
      
      // Secondary: Check for touch events support
      const hasTouchEvents = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      return hasCoarsePointer || hasNoHover || hasTouchEvents;
    };

    setIsTouch(checkTouch());

    // Listen for changes in pointer/hover capabilities
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    const noHoverQuery = window.matchMedia('(hover: none)');
    
    const handleChange = () => setIsTouch(checkTouch());
    
    coarsePointerQuery.addEventListener('change', handleChange);
    noHoverQuery.addEventListener('change', handleChange);

    return () => {
      coarsePointerQuery.removeEventListener('change', handleChange);
      noHoverQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isTouch;
}