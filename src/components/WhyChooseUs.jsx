// ============================================================
//  Why Choose Us — "Our Approach" section  (v7)
//
//  v7 changes:
//  - Card loop direction fixed: LEFT → RIGHT (conveyor belt).
//    Cards enter from the left edge, travel right, exit right.
//  - Seamless loop: track starts at -setWidth (off-screen left),
//    advances +SPEED per frame, resets to -setWidth once it
//    reaches 0 — no visible jump because duplicate set fills gap.
//  - Wave sine animation preserved, direction-corrected.
//  - All other styling, dark-mode, bg PNG, touch handlers intact.
// ============================================================
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Compass, Heart, Users, MapPin, Star, Shield } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { whyChooseUs } from '../data/siteData';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const ICON_MAP = { Compass, Heart, Users, MapPin, Star, Shield };

// ── Card sizing ────────────────────────────────────────────────
const CARD_WIDTH_DESKTOP = 300;
const CARD_GAP           = 20;

// ── Wave amplitude ─────────────────────────────────────────────
const WAVE_AMPLITUDE_DESKTOP = 55;
const WAVE_AMPLITUDE_TABLET  = 42;
const WAVE_AMPLITUDE_MOBILE  = 36;
const WAVE_PERIOD = 600;

// ── Speed (px per rAF frame) ───────────────────────────────────
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
        <div
          className="approach-card-icon-wrap"
          style={{
            width: '44px', height: '44px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.30)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.2rem',
          }}
        >
          <IconComponent size={18} color="white" aria-hidden="true" />
        </div>
      )}
      <h3
        className="approach-card-heading"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#ffffff',
          margin: '0 0 0.6rem 0',
        }}
      >
        {item.title}
      </h3>
      <p
        className="approach-card-body"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.88rem',
          lineHeight: 1.75,
          color: 'rgba(255,255,255,0.82)',
          margin: 0,
        }}
      >
        {item.description}
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function WhyChooseUs() {
  const trackRef    = useRef(null);
  const pausedRef   = useRef(false);
  // Start fully off-screen to the LEFT so cards enter from left edge
  const posRef      = useRef(0); // will be set to -setWidth on first render
  const rafRef      = useRef(null);
  const resumeTimer = useRef(null);

  // Initialise posRef to -setWidth once we know the card count
  // (done here so it's ready before the first rAF frame fires)
  const setWidthEarly = whyChooseUs.length * (CARD_WIDTH_DESKTOP + CARD_GAP);
  if (posRef.current === 0) posRef.current = -setWidthEarly;

  const prefersReduced = useReducedMotion();

  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // ── One set width = 6 cards × (card + gap) ─────────────────────
  // The track has TWO sets rendered side by side.
  // posRef starts at -setWidth (entire first set off-screen LEFT).
  // Each frame we ADD +SPEED (moves right).
  // When posRef reaches 0, one full set has passed → reset to -setWidth.
  // Because the second set is visually identical to the first,
  // the reset is invisible — seamless conveyor belt, left → right.
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
      // Move RIGHT (+SPEED). Reset after one full set has exited right.
      posRef.current += SPEED;
      if (posRef.current >= 0) posRef.current = -setWidth;
      trackRef.current.style.transform = `translateX(${posRef.current}px)`;

      // Wave sine — phase advances with position (now positive direction)
      const amp = getAmplitude();
      const allCards = trackRef.current.querySelectorAll('[data-card]');
      allCards.forEach((card, i) => {
        const phaseOffset = (2 * Math.PI / whyChooseUs.length) * (i % whyChooseUs.length);
        const t = (posRef.current / WAVE_PERIOD) * 2 * Math.PI;
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
    const newPos = touchStartPos.current + (e.touches[0].clientX - touchStartX.current);
    posRef.current = newPos;
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
      {/* ── PNG background illustration ── */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: prefersReduced ? 0.18 : 0.18 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={prefersReduced
          ? { duration: 0 }
          : { duration: 1.4, ease: 'easeOut' }
        }
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/our-approach-travel-lineart.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          pointerEvents: 'none',
          zIndex: 0,
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

          {/* Scrolling track — two identical sets side by side.
              posRef starts at -setWidth (set1 off-screen left).
              As pos advances toward 0, set1 travels right into view.
              When pos hits 0, reset to -setWidth — set2 was visually
              covering the gap, so the loop is seamless. */}
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

        /* ── Dark mode text colours — role-based, selective ─────────────
           The section has a crimson-red bg in BOTH light and dark modes.
           In dark mode (per screenshot reference):
             A. "Our Approach" heading        → deep black, bold
             B. "WHY TRAVEL WITH US" label    → keep existing golden (DO NOT TOUCH)
             C. Introductory subtext          → deep black, bold
             D. Card bg                       → lighter frosted white (matches ref)
             E. Card headings (h3)            → deep black, bold serif
             F. Card descriptions (p)         → deep black, readable weight
             G. Icon circle bg               → light pinkish-white (matches ref)
             H. Icons                         → solid deep black, thicker stroke
           Specificity: html.dark + #id + .section-heading--dark + .child
           beats SectionHeading's internal html.dark + .class + .child rule.
        ──────────────────────────────────────────────────────────────── */

        /* A. Main heading "Our Approach" — deep black, bold in dark mode */
        html.dark #why-choose-us .section-heading--dark .sh-heading,
        html.dark #why-choose-us .sh-heading {
          color: #0d0d0d !important;
          font-weight: 800 !important;
        }

        /* C. Introductory subtext — deep black, bold in dark mode */
        html.dark #why-choose-us .section-heading--dark .sh-subtext,
        html.dark #why-choose-us .sh-subtext {
          color: #111111 !important;
          font-weight: 600 !important;
        }

        /* D. Card background — lighter frosted white in dark mode
           Matches reference: cards read as light/white panels on crimson */
        html.dark #why-choose-us .approach-card {
          background: rgba(255, 255, 255, 0.22) !important;
          border-color: rgba(255, 255, 255, 0.35) !important;
        }

        /* E. Card headings — deep black, bold in dark mode */
        html.dark #why-choose-us .approach-card-heading {
          color: #0d0d0d !important;
          font-weight: 800 !important;
        }

        /* F. Card descriptions — deep black, medium weight in dark mode */
        html.dark #why-choose-us .approach-card-body {
          color: #111111 !important;
          font-weight: 400 !important;
        }

        /* G. Icon circle background — light pinkish-white in dark mode
           Matches reference: soft white/rose circle, not dark */
        html.dark #why-choose-us .approach-card-icon-wrap {
          background: rgba(255, 240, 240, 0.55) !important;
          border-color: rgba(255, 255, 255, 0.45) !important;
        }

        /* H. Icons — solid deep black, bolder stroke in dark mode.
           Lucide renders inline SVG — override stroke via CSS.
           stroke-width bumped to 2.4 for visual weight matching reference.
           Scoped to #why-choose-us only — cannot bleed to other sections. */
        html.dark #why-choose-us .approach-card-icon-wrap svg {
          stroke: #0a0a0a !important;
          color: #0a0a0a !important;
          stroke-width: 2.4px !important;
        }

        /* Note: .sh-label ("WHY TRAVEL WITH US") is deliberately excluded —
           its golden color rgba(240,192,96,0.85) is preserved as-is.      */

        /* ── No horizontal scroll bleed ── */
        #why-choose-us { max-width: 100vw; }
      `}</style>
    </section>
  );
}
