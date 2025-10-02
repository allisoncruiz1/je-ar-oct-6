import { useEffect, useState, useRef } from 'react';

export const useViewportSticky = () => {
  const [isSticky, setIsSticky] = useState(false);
  const formRef = useRef<HTMLFormElement | HTMLDivElement>(null);
  const actionBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIfSticky = () => {
      if (!formRef.current || !actionBarRef.current) return;

      const formHeight = formRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;
      
      // Make sticky if form content extends below viewport
      setIsSticky(formHeight > viewportHeight - 100);
    };

    checkIfSticky();
    window.addEventListener('resize', checkIfSticky);

    return () => window.removeEventListener('resize', checkIfSticky);
  }, []);

  return { isSticky, formRef, actionBarRef };
};
