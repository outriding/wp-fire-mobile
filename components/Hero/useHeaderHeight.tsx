'use client';

import { useState, useEffect } from 'react';
import { throttle } from '@/lib/throttle';

export const useHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeaderHeight = throttle(() => {
      const header = document.querySelector('header');
      if (header) setHeaderHeight(header.clientHeight);
    }, 200);

    requestAnimationFrame(updateHeaderHeight);
    window.addEventListener('resize', updateHeaderHeight);

    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return headerHeight;
};
