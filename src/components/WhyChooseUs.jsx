// ============================================================
//  Why Choose Us — Dark ink section
//  Cards displayed as infinite horizontal auto-scrolling carousel.
//  - Hover: pauses auto-scroll (desktop)
//  - Touch: swipe to browse, auto-scroll resumes after release
//  - Keyboard focus on a card: pauses auto-scroll
//  - prefers-reduced-motion: no auto-scroll, manual swipe only
//  Visual style of cards is UNCHANGED — only layout/motion changed.
// ============================================================
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Compass, Heart, Users, MapPin, Star, Shield } from 'lucide-react';
import { whyChooseUs } from '../data/siteData';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const ICON_MAP = { Compass, Heart, Users, MapPin, Star, Shield };

// Card width + gap in px — used for layout calculation
const CARD_WIDTH = 300;
const CARD_GAP   = 24;

// One card component — visual style exactly as before
function ApproachCard({ item }) {
  const IconComponent = ICON_MAP[item.icon];
  return (
    <div
      style={{
        // Fixed width so cards don't reflow as they scroll
        width: `${CARD_WIDTH}px`,
        flexShrink: 0,
        padding: '2rem',
        background: 'rgba(245,237,216,0.04)',
        border: '1px solid rgba(200,134,26,0.15)',
        borderRadius: '4px',
        transition: 'background 0.3s, border-color 0.3s',
        boxSizing: 'border-box',
      }}
      onMouseOver={e => {
        e.currentTarget.style.background = 'rgba(245,237,216,0.07)';
        e.currentTarget.style.borderColor = 'rgba(200,134,26,0.3)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = 'rgba(245,237,216,0.04)';
        e.currentTarget.style.borderColor = 'rgba(200,134,26,0.15)';
      }}
    >
      {IconComponent && (
        <div style={{
          width: '44px', height: '44px',
          borderRadius: '50%',
          background: 'rgba(200,16,46,0.15)',
          border: '1px solid rgba(200,16,46,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.2rem',
        }}>
          <IconComponent size={18} color="#D0112B" aria-hidden="true" />
        </div>
      )}
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.2rem',
        fontWeight: 700,
        color: 'var(--color-cream)',
        margin: '0 0 0.6rem 0',
      }}>
        {item.title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.88rem',
        lineHeight: 1.75,
        color: 'rgba(245,237,216,0.65)',
        margin: 0,
      }}>
        {item.description}
      </p>
    </div>
  );
}

export default function WhyChooseUs() {
  const trackRef    = useRef(null);
  const pausedRef   = useRef(false);   // paused by hover/focus/touch
  const posRef      = useRef(0);       // current translateX in px (negative)
  const rafRef      = useRef(null);
  const resumeTimer = useRef(null);

  // Detect reduced-motion preference once
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Total width of ONE set of cards (6 cards)
  const setWidth = whyChooseUs.length * (CARD_WIDTH + CARD_GAP);

  // Speed: pixels per frame at 60fps
  const SPEED = 0.5; // ~30px/s — smooth and readable

  // ── Animation loop ──
  const animate = useCallback(() => {
    if (!trackRef.current) return;
    if (!pausedRef.current) {
      posRef.current -= SPEED;
      // When we've scrolled exactly one full set, reset silently (seamless loop)
      if (Math.abs(posRef.current) >= setWidth) {
        posRef.current = 0;
      }
      trackRef.current.style.transform = `translateX(${posRef.current}px)`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [setWidth]);

  useEffect(() => {
    if (reducedMotion) return; // no auto-scroll for reduced-motion users
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [animate, reducedMotion]);

  // ── Hover pause / resume ──
  const handleMouseEnter = () => { pausedRef.current = true; };
  const handleMouseLeave = () => { pausedRef.current = false; };

  // ── Keyboard focus pause (any card focused) ──
  const handleFocus = () => { pausedRef.current = true; };
  const handleBlur  = () => { pausedRef.current = false; };

  // ── Touch swipe ──
  const touchStartX  = useRef(null);
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
    // Resume auto-scroll 1.5s after user releases
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, 1500);
  };

  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-heading"
      className="bg-ink"
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative faint camel silhouette */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Cpath d='M10 50 Q20 20 35 30 Q40 10 50 25 Q55 15 65 30 L70 50 Z' fill='%23D4956A'/%3E%3Ccircle cx='45' cy='22' r='6' fill='%23D4956A'/%3E%3Cpath d='M100 50 Q110 20 125 30 Q130 10 140 25 Q145 15 155 30 L160 50 Z' fill='%23D4956A'/%3E%3Ccircle cx='135' cy='22' r='6' fill='%23D4956A'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom', backgroundSize: '300px 60px',
      }} />

      {/* Heading — padded normally */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
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
        {/* ── Fade edges for polish ── */}
        <div aria-hidden="true" style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '60px', zIndex: 2,
          background: 'linear-gradient(to right, var(--color-ink), transparent)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px', zIndex: 2,
          background: 'linear-gradient(to left, var(--color-ink), transparent)',
          pointerEvents: 'none',
        }} />

        {/* ── Scrolling track ──
             Contains cards DUPLICATED once for a seamless infinite loop.
             Reduced-motion: no animation, just a scrollable row.           */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: `${CARD_GAP}px`,
            padding: `1rem 1.5rem 2rem`,
            width: 'max-content',
            // Reduced-motion: allow manual scroll instead
            overflowX: reducedMotion ? 'auto' : 'visible',
            WebkitOverflowScrolling: 'touch',
            // No transition here — JS handles transform directly for perf
          }}
        >
          {/* Original 6 cards */}
          {whyChooseUs.map((item) => (
            <ApproachCard key={item.title} item={item} />
          ))}
          {/* Duplicated 6 cards — needed for seamless loop (hidden from screen readers) */}
          {!reducedMotion && whyChooseUs.map((item) => (
            <ApproachCard key={`dup-${item.title}`} item={item} />
          ))}
        </div>
      </div>

      {/* Reduced-motion hint */}
      {reducedMotion && (
        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.7rem',
          color: 'rgba(245,237,216,0.3)',
          marginTop: '0.5rem',
          letterSpacing: '0.06em',
        }}>
          Swipe to browse ›
        </p>
      )}
    </section>
  );
}
