import { useEffect, useState } from 'react';
import { throttle } from '@/lib/throttle';

export function useScrollSpy(ids: readonly string[], offset = 0) {
  const [activeId, setActiveId] = useState('home');

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (scrollPosition < viewportHeight * 0.3) {
        setActiveId('home');
        return;
      }

      let newActive = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const elementHeight = rect.height || el.offsetHeight || 1;
        const visibleHeight = Math.min(
          elementHeight,
          Math.max(0, rect.bottom) - Math.max(0, rect.top)
        );
        const visiblePercentage = (visibleHeight / elementHeight) * 100;
        if (visiblePercentage > 30 && rect.top <= 200) {
          newActive = id;
          break;
        }
      }
      setActiveId(newActive || (scrollPosition < viewportHeight * 0.3 ? 'home' : ''));
    }, 100);

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ids, offset]);

  return activeId;
}
