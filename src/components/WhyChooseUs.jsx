// ============================================================
//  Why Choose Us — "Our Approach" section
//
//  v4 changes (this pass):
//  1. Wave amplitude increased again: 42/32/28 → 55/42/36px
//     Peak-to-trough now: desktop 110px, tablet 84px, mobile 72px
//  2. Mobile gap tightened (20→14px) so more of next card peeks in
//     at 320px — clearer horizontal reference for wave perception.
//  3. Background line-art fully replaced: old tiled arch pattern
//     → new panoramic world landmark skyline SVG (inline, no asset file).
//     8 landmarks: Victoria Memorial · Qutub Minar · Statue of Unity ·
//     Christ the Redeemer · Taj Mahal · Eiffel Tower · Big Ben · Statue of Liberty
// ============================================================
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Compass, Heart, Users, MapPin, Star, Shield } from 'lucide-react';
import { whyChooseUs } from '../data/siteData';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const ICON_MAP = { Compass, Heart, Users, MapPin, Star, Shield };

// ── Card sizing ────────────────────────────────────────────────
const CARD_WIDTH_DESKTOP = 300;
const CARD_WIDTH_MOBILE  = 240;
const CARD_GAP           = 20;   // desktop gap; mobile uses 14px via CSS

// ── Wave amplitude (v4) ────────────────────────────────────────
// BEFORE this pass: desktop=42, tablet=32, mobile=28
// AFTER  this pass: desktop=55, tablet=42, mobile=36
// Peak-to-trough (2×amp): desktop 110px, tablet 84px, mobile 72px
// These values make the sine curve unmistakeable at every size.
const WAVE_AMPLITUDE_DESKTOP = 55;
const WAVE_AMPLITUDE_TABLET  = 42;
const WAVE_AMPLITUDE_MOBILE  = 36;

// WAVE_PERIOD: px per full sine cycle — unchanged.
const WAVE_PERIOD = 600;

// SPEED: px per rAF frame — unchanged.
const SPEED = 0.8;

// ── Card component (unchanged from v3) ────────────────────────
function ApproachCard({ item }) {
  const IconComponent = ICON_MAP[item.icon];
  return (
    <div
      className="approach-card"
      style={{
        flexShrink: 0,
        padding: '1.8rem',
        background: 'rgba(255,255,255,0.10)',
        border: '1px solid rgba(255,255,255,0.20)',
        borderRadius: '10px',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        transition: 'background 0.3s, border-color 0.3s',
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
  const trackRef    = useRef(null);
  const pausedRef   = useRef(false);
  const posRef      = useRef(0);
  const rafRef      = useRef(null);
  const resumeTimer = useRef(null);

  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const setWidth = whyChooseUs.length * (CARD_WIDTH_DESKTOP + CARD_GAP);

  // Three-tier amplitude lookup
  const getAmplitude = () => {
    const w = window.innerWidth;
    if (w <= 640)  return WAVE_AMPLITUDE_MOBILE;
    if (w <= 1024) return WAVE_AMPLITUDE_TABLET;
    return WAVE_AMPLITUDE_DESKTOP;
  };

  const animate = useCallback(() => {
    if (!trackRef.current) return;
    if (!pausedRef.current) {
      posRef.current -= SPEED;
      if (Math.abs(posRef.current) >= setWidth) posRef.current = 0;
      trackRef.current.style.transform = `translateX(${posRef.current}px)`;

      const amp = getAmplitude();
      const allCards = trackRef.current.querySelectorAll('[data-card]');
      allCards.forEach((card, i) => {
        const phaseOffset = (2 * Math.PI / whyChooseUs.length) * (i % whyChooseUs.length);
        const t = (-posRef.current / WAVE_PERIOD) * 2 * Math.PI;
        card.style.transform = `translateY(${amp * Math.sin(t + phaseOffset)}px)`;
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

  const handleMouseEnter = () => { pausedRef.current = true; };
  const handleMouseLeave = () => { pausedRef.current = false; };
  const handleFocus      = () => { pausedRef.current = true; };
  const handleBlur       = () => { pausedRef.current = false; };

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
    posRef.current = touchStartPos.current + (e.touches[0].clientX - touchStartX.current);
    trackRef.current.style.transform = `translateX(${posRef.current}px)`;
  };
  const handleTouchEnd = () => {
    touchStartX.current = null;
    resumeTimer.current = setTimeout(() => { pausedRef.current = false; }, 1500);
  };

  // ── IMPORTANT: SVG rendered as real inline JSX element ──────
  // Previous approach used encodeURIComponent() → data URI → CSS backgroundImage.
  // That fails silently: encoding edge-cases + backgroundSize:contain on a
  // 1600:280 aspect-ratio SVG in a percentage-height container collapses the
  // rendered size to near-invisible on typical viewports.
  //
  // Fix: render the SVG as a real <svg> JSX element, absolutely positioned,
  // width=100% height=auto, anchored to the section bottom.
  // This is GUARANTEED to appear in the DOM — no encoding, no asset path,
  // no CSS sizing ambiguity. Opacity on the <g> wrapper set to 0.18 (was
  // 0.11) so it's clearly visible against the crimson red background.

  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-heading"
      style={{
        background: 'linear-gradient(135deg, #a50e22 0%, #D0112B 45%, #b8102a 100%)',
        padding: 'clamp(4rem, 8vw, 7rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ══════════════════════════════════════════════════════════
          PANORAMIC LANDMARK LINE-ART
          
          Served from /landmark-skyline.svg (public/ folder).
          Rendered as a CSS background-image on an absolutely-
          positioned div that fills the FULL section height/width.
          
          Why this approach instead of inline JSX SVG:
          - The SVG file is 1600×500px viewBox — at typical desktop
            widths the inline SVG would be ~500px tall and cover only
            the bottom portion. Using background-size: cover + 
            background-position: center bottom fills the entire section.
          - Keeps the component JSX clean.
          - File lives in /public so it's served as a static asset
            with the correct MIME type — no encoding issues.
          
          Sizing: background-size: cover fills the section completely.
          Position: center bottom anchors ground baseline to section floor.
          Opacity: controlled by the SVG file's own <g opacity="0.22">.
          z-index 0: behind all other content.
      ══════════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/landmark-skyline.svg)',
          backgroundRepeat: 'no-repeat',
          // 'contain' ensures the FULL panorama is always visible at any
          // viewport size — the whole 1600×500 composition scales down
          // proportionally to fit within the container.
          // 'cover' caused mobile to zoom in on one fragment because the
          // 3.2:1 aspect SVG overflowed a portrait container's width.
          backgroundPosition: 'center bottom',
          backgroundSize: 'contain',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ── All content above the line-art — z:1 ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <Reveal>
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
          {/* Edge fade — crimson-matching */}
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

          {/* Scrolling track */}
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: `${CARD_GAP}px`,
              // Padding = max amplitude + comfortable breathing room.
              // Desktop amplitude = 55px → top 68px, bottom 76px.
              padding: `${WAVE_AMPLITUDE_DESKTOP + 13}px 1.5rem ${WAVE_AMPLITUDE_DESKTOP + 21}px`,
              width: 'max-content',
              overflowX: reducedMotion ? 'auto' : 'visible',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {whyChooseUs.map((item) => (
              <div key={item.title} data-card="true" style={{ flexShrink: 0 }}>
                <ApproachCard item={item} />
              </div>
            ))}
            {!reducedMotion && whyChooseUs.map((item) => (
              <div key={`dup-${item.title}`} data-card="true" style={{ flexShrink: 0 }}>
                <ApproachCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Reduced-motion static grid */}
        {reducedMotion && (
          <div style={{
            maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {whyChooseUs.map(item => <ApproachCard key={item.title} item={item} />)}
          </div>
        )}
      </div>

      <style>{`
        /* ── Card widths — responsive ── */
        .approach-card { width: 300px; }

        @media (max-width: 640px) {
          /* 240px card on 375px screen → ~135px of next card peeks in.
             On 320px: 240px card + 14px gap → 66px peek. */
          .approach-card { width: 240px; }

          /* Tighter gap on mobile so more next-card peek at 320px */
          #why-choose-us [data-card] + [data-card] { margin-left: -6px; }
        }

        /* ── Section minimum height — prevents clipping at wave extremes ──
           Card ~220px + 2×amplitude + padding = safe floor.
           Mobile: 220 + 72 + 80 = 372 → use 500px for comfort.
           Desktop: handled by track padding (55+13 top, 55+21 bottom). */
        @media (max-width: 640px) {
          #why-choose-us { min-height: 500px; }
        }

        /* ── Dark mode: slightly deeper crimson ── */
        html.dark #why-choose-us {
          background: linear-gradient(135deg, #8a0c1c 0%, #b8102a 45%, #9e0e24 100%) !important;
        }

        /* ── Dark mode: fix heading/subtext that uses var(--color-cream) ──
           In html.dark, --color-cream is remapped to near-black (#141414),
           making the heading invisible on crimson. Force it back to white.
           Exception: sh-label ("WHY TRAVEL WITH US") keeps its existing
           golden color — do NOT include .sh-label in this rule.          */
        html.dark #why-choose-us .sh-heading {
          color: #ffffff !important;
        }
        html.dark #why-choose-us .sh-subtext {
          color: rgba(255, 255, 255, 0.80) !important;
        }
        /* Card headings and descriptions are already hardcoded white/rgba-white
           in the ApproachCard component — no override needed there.       */

        /* ── No horizontal scroll bleed ── */
        #why-choose-us { max-width: 100vw; }

        /* ── On very wide screens (>1600px), scale SVG to cover width ──
           background-size:contain leaves gaps on ultra-wide; use cover
           for screens wider than the SVG's native 1600px viewBox. */
        @media (min-width: 1600px) {
          #why-choose-us > div[aria-hidden] {
            background-size: cover !important;
          }
        }
      `}</style>
    </section>
  );
}
