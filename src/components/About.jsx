// ============================================================
//  About / Who We Are Section  (v2)
//
//  Changes vs v1:
//  - Theme-based background image:
//      Light mode → /who-we-are-mountains-light.png
//      Dark mode  → /who-we-are-mountains-dark.jpg
//    Switches instantly via MutationObserver watching html.dark
//    (same mechanism Navbar uses — no separate theme system).
//  - Paragraph scroll animations via `motion` (whileInView, once):
//      P1 → slides in from left  + fade
//      P2 → slides in from right + fade
//      P3 → slides in from below + fade
//  - Tagline: fade only, no movement
//  - prefers-reduced-motion: fade-only for all elements
//  - Everything else (heading, text, layout, accents) unchanged
// ============================================================
import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const PARAGRAPHS = [
  '365 Wanderlust is a travel planning entity focused on offbeat, adventure, leisure, cultural & sustainable tour plans which is led by professional tourism experts throughout the year.',
  'We curate top notch tour plans with efficient team effort, real time critical thinking, in-depth travel planning knowledge & joy.',
  'We are promised to deliver an unbeatable experience under ideal pricing which will be beneficial to the eco-system, local communities & to the travellers as well.',
];

// Animation config per paragraph index
// [0] from left, [1] from right, [2] from below
const PARA_INITIAL = [
  { opacity: 0, x: -44, y: 0  },
  { opacity: 0, x:  44, y: 0  },
  { opacity: 0, x:   0, y: 36 },
];
const PARA_ANIMATE = { opacity: 1, x: 0, y: 0 };

const PARA_TRANSITION = (i) => ({
  duration: 0.65,
  delay: i * 0.12,
  ease: [0.22, 1, 0.36, 1],
});

// Reduced-motion variant: fade only, no translate
const PARA_INITIAL_RM = { opacity: 0 };
const PARA_TRANSITION_RM = (i) => ({ duration: 0.5, delay: i * 0.1 });

// ── useDarkMode — watches html.dark class, same pattern as Navbar ──
function useDarkMode() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

export default function About() {
  const isDark = useDarkMode();
  const prefersReduced = useReducedMotion();

  const bgImage = isDark
    ? '/who-we-are-mountains-dark.jpg'
    : '/who-we-are-mountains-light.png';

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="about-section"
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        // Background image — switches instantly on theme toggle
        backgroundImage: `url("${bgImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        // Smooth crossfade when image swaps
        transition: 'background-image 0.01s',
      }}
    >
      {/* ── Overlay — ensures text stays readable over the mountain image ── */}
      {/*
        Light mode: warm cream overlay at 0.82 opacity — mountains subtly
          visible through the cream wash, crimson accents pop cleanly.
        Dark mode: deep black overlay at 0.72 opacity — dark mountains/moon
          visible, light text and crimson accents stay legible.
        The overlay sits between the bg image and the content.
      */}
      <div
        aria-hidden="true"
        className="about-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Faint ornamental mandala — top-right decorative only */}
      <div aria-hidden="true" className="about-mandala" style={{
        position: 'absolute', top: '-60px', right: '-60px', opacity: 0.05,
        pointerEvents: 'none',
        width: 'min(320px, 55vw)',
        height: 'min(320px, 55vw)',
        overflow: 'hidden',
        zIndex: 1,
      }}>
        <svg width="320" height="320" viewBox="0 0 400 400">
          {[30,60,90,120,150,180].map(r => (
            <circle key={r} cx="200" cy="200" r={r} stroke="#D0112B" strokeWidth="0.8" fill="none"/>
          ))}
          {[45,135,225,315].map(a => (
            <line key={a}
              x1={200 + 180 * Math.cos(a * Math.PI/180)}
              y1={200 + 180 * Math.sin(a * Math.PI/180)}
              x2={200 + 30 * Math.cos(a * Math.PI/180)}
              y2={200 + 30 * Math.sin(a * Math.PI/180)}
              stroke="#D0112B" strokeWidth="0.6"
            />
          ))}
        </svg>
      </div>

      {/* ── All content above the overlay ── */}
      <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Section heading — existing Reveal wrapper preserved */}
        <Reveal>
          <SectionHeading
            label="Our Story"
            heading="Who We Are"
            align="center"
          />
        </Reveal>

        {/* Three paragraphs — motion scroll animations */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.6rem',
          maxWidth: '680px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          {PARAGRAPHS.map((text, i) => (
            <motion.p
              key={i}
              className="about-para"
              // Reduced-motion: fade only, no translate
              initial={prefersReduced ? PARA_INITIAL_RM : PARA_INITIAL[i]}
              whileInView={PARA_ANIMATE}
              viewport={{ once: true, amount: 0.3 }}
              transition={
                prefersReduced
                  ? PARA_TRANSITION_RM(i)
                  : PARA_TRANSITION(i)
              }
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(0.95rem, 2vw, 1.08rem)',
                lineHeight: 1.9,
                margin: 0,
                // Prevent horizontal overflow from x-translate on mobile
                willChange: 'opacity, transform',
              }}
            >
              {text}
            </motion.p>
          ))}
        </div>

        {/* Ornamental tagline rule — fade only, no movement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '3rem',
          }}
        >
          <div className="about-rule" />
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.1rem',
            fontStyle: 'italic',
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: 'var(--color-brand-red)',
          }}>
            Grab Your Leisure
          </span>
          <div className="about-rule" />
        </motion.div>
      </div>

      <style>{`
        /* ── Light mode overlay ── */
        .about-overlay {
          background: rgba(248, 246, 243, 0.83);
        }
        /* ── Light mode defaults ── */
        .about-section {
          background-color: var(--color-off-white);
        }
        .about-para {
          color: var(--color-dark-grey);
        }
        .about-rule {
          flex: 1;
          max-width: 80px;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--color-brand-red), transparent);
        }

        /* ── Dark mode overlay ── */
        .dark .about-overlay {
          background: rgba(10, 10, 10, 0.72);
        }
        /* ── Dark mode overrides ── */
        .dark .about-section {
          background-color: #111111;
        }
        .dark .about-para {
          color: rgba(245, 237, 216, 0.88);
        }
        .dark .about-mandala {
          opacity: 0.07;
        }

        /* ── Prevent horizontal scroll from paragraph x-translate ── */
        /* The section itself has overflow:hidden so this is belt+braces */
        #about {
          overflow-x: hidden;
        }
      `}</style>
    </section>
  );
}
