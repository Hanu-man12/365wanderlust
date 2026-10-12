// ============================================================
//  Why Choose Us — "Our Approach" section
//
//  CHANGES vs previous version:
//  1. Background: bg-ink (black) REMOVED. Now rich crimson gradient
//     applied directly via inline style — no class override needed.
//  2. White architectural line-art SVG added as absolute layer (z:0)
//     behind cards (z:1) — low opacity (8%) Indian palace/arch motifs.
//  3. Wave animation: JS RAF now drives BOTH translateX (linear scroll)
//     AND translateY (sine wave per card using index offset). 
//     No CSS keyframes needed — pure JS sine function.
//  4. Speed increased: SPEED token raised from 0.5 → 0.8 px/frame.
//  5. Card/text/icon colors updated for crimson background contrast.
// ============================================================
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Compass, Heart, Users, MapPin, Star, Shield } from 'lucide-react';
import { whyChooseUs } from '../data/siteData';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const ICON_MAP = { Compass, Heart, Users, MapPin, Star, Shield };

const CARD_WIDTH = 300;
const CARD_GAP   = 24;

// ── Wave settings ──────────────────────────────────────────────
// AMPLITUDE: max px a card travels up/down. 18px = visible but not chaotic.
// On narrow screens we reduce this via JS (see below).
const WAVE_AMPLITUDE_DESKTOP = 18;
const WAVE_AMPLITUDE_MOBILE  = 8;   // ≤ 640px viewport width

// WAVE_PERIOD: how many px of horizontal travel = one full sine cycle.
// 600px = one smooth wave per ~2 card widths.
const WAVE_PERIOD = 600;

// SPEED in px per rAF frame (~60fps). 0.8 = ~48px/s (was 0.5 before).
const SPEED = 0.8;

// ── Architectural line-art SVG ─────────────────────────────────
// Indian palace/arch motifs — white strokes, opacity set on outer group.
// Original design for 365 Wanderlust. Tiled horizontally via pattern.
const LINE_ART_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="220" viewBox="0 0 800 220">
  <defs>
    <pattern id="archPattern" x="0" y="0" width="200" height="220" patternUnits="userSpaceOnUse">
      <!-- Main arch -->
      <path d="M20 200 L20 100 Q20 40 60 40 Q100 40 100 100 L100 200" fill="none" stroke="white" stroke-width="1.2"/>
      <!-- Inner arch detail -->
      <path d="M34 200 L34 108 Q34 55 60 55 Q86 55 86 108 L86 200" fill="none" stroke="white" stroke-width="0.6"/>
      <!-- Dome top -->
      <path d="M45 40 Q60 18 75 40" fill="none" stroke="white" stroke-width="1"/>
      <!-- Dome finial -->
      <line x1="60" y1="18" x2="60" y2="8" stroke="white" stroke-width="0.8"/>
      <circle cx="60" cy="6" r="2.5" fill="none" stroke="white" stroke-width="0.8"/>
      <!-- Side minarets -->
      <line x1="10" y1="200" x2="10" y2="80" stroke="white" stroke-width="0.7"/>
      <path d="M5 80 Q10 65 15 80" fill="none" stroke="white" stroke-width="0.6"/>
      <line x1="10" y1="65" x2="10" y2="58" stroke="white" stroke-width="0.6"/>
      <line x1="110" y1="200" x2="110" y2="80" stroke="white" stroke-width="0.7"/>
      <path d="M105 80 Q110 65 115 80" fill="none" stroke="white" stroke-width="0.6"/>
      <line x1="110" y1="65" x2="110" y2="58" stroke="white" stroke-width="0.6"/>
      <!-- Ground line -->
      <line x1="0" y1="200" x2="200" y2="200" stroke="white" stroke-width="0.4" stroke-dasharray="4 6"/>
      <!-- Window jali (lattice) inside arch -->
      <line x1="46" y1="120" x2="74" y2="120" stroke="white" stroke-width="0.5"/>
      <line x1="44" y1="135" x2="76" y2="135" stroke="white" stroke-width="0.5"/>
      <line x1="60" y1="108" x2="60" y2="148" stroke="white" stroke-width="0.5"/>
      <line x1="52" y1="108" x2="52" y2="148" stroke="white" stroke-width="0.5"/>
      <line x1="68" y1="108" x2="68" y2="148" stroke="white" stroke-width="0.5"/>
      <!-- Small decorative corner rosette -->
      <circle cx="185" cy="15" r="6" fill="none" stroke="white" stroke-width="0.6"/>
      <circle cx="185" cy="15" r="3" fill="none" stroke="white" stroke-width="0.5"/>
      <line x1="185" y1="7" x2="185" y2="4" stroke="white" stroke-width="0.5"/>
      <line x1="185" y1="23" x2="185" y2="26" stroke="white" stroke-width="0.5"/>
      <line x1="177" y1="15" x2="174" y2="15" stroke="white" stroke-width="0.5"/>
      <line x1="193" y1="15" x2="196" y2="15" stroke="white" stroke-width="0.5"/>
    </pattern>
  </defs>
  <g opacity="0.08">
    <rect width="800" height="220" fill="url(#archPattern)"/>
  </g>
</svg>
`;

const LINE_ART_DATA_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(LINE_ART_SVG)}`;

// ── Card component ─────────────────────────────────────────────
// Colors designed for readability on crimson red background:
//   card bg: white at 12% opacity (glass effect)
//   border:  white at 20%
//   title:   pure white
//   body:    white at 82%
//   icon bg: white at 15%
function ApproachCard({ item }) {
  const IconComponent = ICON_MAP[item.icon];
  return (
    <div
      style={{
        width: `${CARD_WIDTH}px`,
        flexShrink: 0,
        padding: '1.8rem',
        background: 'rgba(255,255,255,0.10)',
        border: '1px solid rgba(255,255,255,0.20)',
        borderRadius: '10px',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        transition: 'background 0.3s, border-color 0.3s, transform 0.3s',
        boxSizing: 'border-box',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      }}
      onMouseOver={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
      }}
    >
      {IconComponent && (
        <div style={{
          width: '44px', height: '44px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.30)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.2rem',
        }}>
          <IconComponent size={18} color="white" aria-hidden="true" />
        </div>
      )}
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.2rem',
        fontWeight: 700,
        color: '#ffffff',
        margin: '0 0 0.6rem 0',
      }}>
        {item.title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.88rem',
        lineHeight: 1.75,
        color: 'rgba(255,255,255,0.82)',
        margin: 0,
      }}>
        {item.description}
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function WhyChooseUs() {
  const trackRef     = useRef(null);
  const pausedRef    = useRef(false);
  const posRef       = useRef(0);       // horizontal scroll position (px, grows negative)
  const rafRef       = useRef(null);
  const resumeTimer  = useRef(null);

  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Total px width of ONE complete set of cards (6 cards + gaps)
  const setWidth = whyChooseUs.length * (CARD_WIDTH + CARD_GAP);

  // ── Wave animation via rAF ─────────────────────────────────
  // Each card gets its own <div ref> so we can set translateY individually.
  // trackRef scrolls horizontally; per-card refs get a sine-wave translateY.
  const cardRefs = useRef([]);

  const getAmplitude = () =>
    window.innerWidth <= 640 ? WAVE_AMPLITUDE_MOBILE : WAVE_AMPLITUDE_DESKTOP;

  const animate = useCallback(() => {
    if (!trackRef.current) return;

    if (!pausedRef.current) {
      posRef.current -= SPEED;
      // Seamless reset: when one full set has scrolled past, jump back silently
      if (Math.abs(posRef.current) >= setWidth) {
        posRef.current = 0;
      }
      // Apply horizontal scroll to the track
      trackRef.current.style.transform = `translateX(${posRef.current}px)`;

      // Apply per-card vertical sine wave
      // Each card is offset by its index so they ride different phases of the wave,
      // creating the flowing ∿∿∿ visual.
      const amp = getAmplitude();
      const allCards = trackRef.current.querySelectorAll('[data-card]');
      allCards.forEach((card, i) => {
        // Phase offset per card: 2π/numCards * i  →  cards spread evenly across the wave
        const phaseOffset = (2 * Math.PI / whyChooseUs.length) * (i % whyChooseUs.length);
        // posRef drives time; dividing by WAVE_PERIOD controls how tightly the wave cycles
        const t = (-posRef.current / WAVE_PERIOD) * 2 * Math.PI;
        const y = amp * Math.sin(t + phaseOffset);
        card.style.transform = `translateY(${y}px)`;
      });
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [setWidth]);

  useEffect(() => {
    if (reducedMotion) return;
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [animate, reducedMotion]);

  // Hover pause/resume
  const handleMouseEnter = () => { pausedRef.current = true; };
  const handleMouseLeave = () => { pausedRef.current = false; };

  // Keyboard focus pause
  const handleFocus = () => { pausedRef.current = true; };
  const handleBlur  = () => { pausedRef.current = false; };

  // Touch swipe
  const touchStartX   = useRef(null);
  const touchStartPos = useRef(0);

  const handleTouchStart = (e) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    pausedRef.current = true;
    touchStartX.current   = e.touches[0].clientX;
    touchStartPos.current = posRef.current;
  };
  const handleTouchMove = (e) => {
    if (touchStartX.current === null || !trackRef.current) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    posRef.current = touchStartPos.current + delta;
    trackRef.current.style.transform = `translateX(${posRef.current}px)`;
  };
  const handleTouchEnd = () => {
    touchStartX.current = null;
    resumeTimer.current = setTimeout(() => { pausedRef.current = false; }, 1500);
  };

  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-heading"
      style={{
        // ── CRIMSON GRADIENT background — replaces bg-ink (black) ──
        // Two close crimson shades: brand red center, slightly darker edges.
        background: 'linear-gradient(135deg, #a50e22 0%, #D0112B 45%, #b8102a 100%)',
        padding: 'clamp(4rem, 8vw, 7rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Architectural line-art layer — z:0, behind everything ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${LINE_ART_DATA_URI}")`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center bottom',
          backgroundSize: 'auto 70%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ── Content sits at z:1 above line art ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Section heading */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <Reveal>
            {/* Use theme="dark" so heading text is white/light — matches crimson bg */}
            <SectionHeading
              label="Why Travel With Us"
              heading="Our Approach"
              subtext="We believe great travel is about depth, not distance."
              theme="dark"
            />
          </Reveal>
        </div>

        {/* ── Carousel viewport ── */}
        <div
          style={{ position: 'relative', overflow: 'hidden', width: '100%' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-label="Our approach — scrolling carousel"
        >
          {/* Fade edges — now crimson-matching gradients */}
          <div aria-hidden="true" style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
            background: 'linear-gradient(to right, #a50e22, transparent)',
            pointerEvents: 'none',
          }} />
          <div aria-hidden="true" style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
            background: 'linear-gradient(to left, #b8102a, transparent)',
            pointerEvents: 'none',
          }} />

          {/* Scrolling track — horizontal position driven by JS */}
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: `${CARD_GAP}px`,
              // Extra top/bottom padding to accommodate wave amplitude
              padding: `${WAVE_AMPLITUDE_DESKTOP + 8}px 1.5rem ${WAVE_AMPLITUDE_DESKTOP + 16}px`,
              width: 'max-content',
              // Reduced-motion only: allow manual horizontal scroll
              overflowX: reducedMotion ? 'auto' : 'visible',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Original 6 cards — each wrapped in a data-card div for per-card wave Y */}
            {whyChooseUs.map((item) => (
              <div key={item.title} data-card="true" style={{ flexShrink: 0 }}>
                <ApproachCard item={item} />
              </div>
            ))}
            {/* Duplicated 6 cards for seamless infinite loop */}
            {!reducedMotion && whyChooseUs.map((item) => (
              <div key={`dup-${item.title}`} data-card="true" style={{ flexShrink: 0 }}>
                <ApproachCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Reduced-motion: static grid fallback */}
        {reducedMotion && (
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {whyChooseUs.map(item => (
              <ApproachCard key={item.title} item={item} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        /* Dark mode: keep crimson bg as-is — it's already a dark accent */
        html.dark #why-choose-us {
          background: linear-gradient(135deg, #8a0c1c 0%, #b8102a 45%, #9e0e24 100%) !important;
        }

        /* Reduce wave amplitude on small screens via a data attribute approach */
        @media (max-width: 640px) {
          #why-choose-us [data-card] {
            /* Wave amplitude is reduced by JS already; this just ensures no overflow */
            overflow: visible;
          }
        }

        /* Ensure section never causes horizontal page scroll */
        #why-choose-us {
          max-width: 100vw;
        }
      `}</style>
    </section>
  );
}
