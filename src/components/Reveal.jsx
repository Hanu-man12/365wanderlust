// ============================================================
//  Reveal — IntersectionObserver scroll reveal wrapper
//  Adds 'visible' class when element enters the viewport.
//  CSS handles the animation in index.css (.reveal / .visible)
//  Respects prefers-reduced-motion (CSS media query handles it)
// ============================================================
import React, { useEffect, useRef } from 'react';

/**
 * @param {React.ReactNode} children  - Content to animate
 * @param {string}          className - Extra classes (e.g. 'reveal-delay-2')
 * @param {string}          as        - HTML tag to render (default 'div')
 */
export default function Reveal({ children, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el); // only trigger once
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
