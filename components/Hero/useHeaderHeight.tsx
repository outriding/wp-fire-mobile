'use client';

import { useState, useEffect } from 'react';

const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return (...args) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        },
        Math.max(0, limit - (Date.now() - lastRan))
      );
    }
  };
};

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
