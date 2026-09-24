'use client';

import { useEffect, useRef } from 'react';

export function AnimeGlowHero({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let isMounted = true;
    import('animejs').then((mod) => {
      if (!isMounted || !rootRef.current) return;
      const anime = mod.default;

      // Anime.js smooth entrance and stagger animation
      anime({
        targets: rootRef.current.querySelectorAll('.anime-reveal'),
        translateY: [24, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1200,
        delay: anime.stagger(150, { start: 200 }),
      });

      // Subtle breathing pulse on the glowing accents
      anime({
        targets: rootRef.current.querySelectorAll('.anime-glow-pulse'),
        scale: [1, 1.05, 1],
        opacity: [0.7, 1, 0.7],
        easing: 'easeInOutSine',
        duration: 3500,
        loop: true,
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
