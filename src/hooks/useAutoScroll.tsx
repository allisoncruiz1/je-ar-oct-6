import { useRef, useCallback } from 'react';

export const useAutoScroll = () => {
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setFieldRef = useCallback((index: number) => {
    return (el: HTMLDivElement | null) => {
      fieldRefs.current[index] = el;
    };
  }, []);

  const scrollToNextField = useCallback((currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    const nextField = fieldRefs.current[nextIndex];
    
    if (nextField) {
      setTimeout(() => {
        nextField.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  }, []);

  return { setFieldRef, scrollToNextField };
};
