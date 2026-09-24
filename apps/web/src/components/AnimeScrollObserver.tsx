'use client';

import { useEffect } from 'react';

export function AnimeScrollObserver() {
  useEffect(() => {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let isMounted = true;

    // Load animejs dynamically in browser
    import('animejs').then((mod) => {
      if (!isMounted) return;
      const anime = mod.default;

      // Select all scroll-animated targets
      const scrollElements = document.querySelectorAll<HTMLElement>('[data-anime-scroll]');
      if (!scrollElements.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              const animationType = el.getAttribute('data-anime-scroll') || 'reveal';

              if (animationType === 'stagger') {
                // Stagger animate all direct children
                const children = el.children;
                if (children.length) {
                  anime({
                    targets: children,
                    translateY: [36, 0],
                    opacity: [0, 1],
                    scale: [0.96, 1],
                    delay: anime.stagger(90, { start: 100 }),
                    duration: 900,
                    easing: 'easeOutCubic',
                  });
                }
              } else if (animationType === 'scale') {
                anime({
                  targets: el,
                  scale: [0.92, 1],
                  opacity: [0, 1],
                  duration: 800,
                  easing: 'easeOutExpo',
                });
              } else if (animationType === 'counter') {
                // Count up numbers like Anime.js metrics
                const targetVal = parseFloat(el.getAttribute('data-counter-target') || '0');
                const suffix = el.getAttribute('data-counter-suffix') || '';
                const obj = { val: 0 };
                anime({
                  targets: obj,
                  val: targetVal,
                  round: 1,
                  duration: 1800,
                  easing: 'easeOutExpo',
                  update: () => {
                    el.textContent = `${Math.round(obj.val)}${suffix}`;
                  },
                });
              } else {
                // Default clean fade-and-slide up reveal
                anime({
                  targets: el,
                  translateY: [30, 0],
                  opacity: [0, 1],
                  duration: 850,
                  easing: 'easeOutCubic',
                });
              }

              // Only trigger once per section
              observer.unobserve(el);
            }
          });
        },
        {
          rootMargin: '0px 0px -60px 0px',
          threshold: 0.1,
        }
      );

      scrollElements.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
