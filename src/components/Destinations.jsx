// ============================================================
//  Destinations Section  (v3)
//  Theme-aware background (light/dark).
//  Globe icon centered, EXPLORE INDIA above cards with spacing.
// ============================================================
import React, { useState, useEffect } from 'react';
import { exploreIndia } from '../data/siteData';
import FanDeck from './FanDeck';
import BengalCards from './BengalCards';
import Reveal from './Reveal';

// ── useDarkMode — watches html.dark (same pattern as Navbar/About) ──
function useDarkMode() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

// ── Globe SVG ────────────────────────────────────────────────
// Minimal line-art globe: latitude/longitude arcs on a circle.
// Gold/bronze color matching reference screenshot.
function GlobeIcon({ size = 48, color = '#C8921A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Outer circle */}
      <circle cx="24" cy="24" r="20" />
      {/* Vertical center line */}
      <line x1="24" y1="4" x2="24" y2="44" />
      {/* Horizontal equator */}
      <line x1="4" y1="24" x2="44" y2="24" />
      {/* Upper latitude arc */}
      <path d="M8 15 Q24 11 40 15" />
      {/* Lower latitude arc */}
      <path d="M8 33 Q24 37 40 33" />
      {/* Left longitude arc */}
      <path d="M24 4 Q14 24 24 44" />
      {/* Right longitude arc */}
      <path d="M24 4 Q34 24 24 44" />
      {/* Small star/dot at top */}
      <circle cx="24" cy="4" r="1.5" fill={color} stroke="none" />
    </svg>
  );
}

// ── Compass divider SVG ──────────────────────────────────────
// Minimal compass rose between heading and "EXPLORE INDIA"
function CompassDivider({ color = '#D0112B' }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="11" />
      <circle cx="14" cy="14" r="3" />
      {/* N/S/E/W points */}
      <line x1="14" y1="3" x2="14" y2="8" />
      <line x1="14" y1="20" x2="14" y2="25" />
      <line x1="3" y1="14" x2="8" y2="14" />
      <line x1="20" y1="14" x2="25" y2="14" />
      {/* Diagonal short ticks */}
      <line x1="6.2" y1="6.2" x2="9.5" y2="9.5" strokeWidth="1" opacity="0.6" />
      <line x1="21.8" y1="6.2" x2="18.5" y2="9.5" strokeWidth="1" opacity="0.6" />
      <line x1="6.2" y1="21.8" x2="9.5" y2="18.5" strokeWidth="1" opacity="0.6" />
      <line x1="21.8" y1="21.8" x2="18.5" y2="18.5" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

// ── Gold horizontal rule with text ───────────────────────────
function GoldRule({ text, color = '#C8921A' }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.8rem',
    }}>
      <div style={{
        flex: 1,
        maxWidth: 80,
        height: 1,
        background: `linear-gradient(to right, transparent, ${color})`,
      }} />
      <span style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'clamp(0.55rem, 1.2vw, 0.68rem)',
        fontWeight: 700,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: color,
        whiteSpace: 'nowrap',
      }}>
        {text}
      </span>
      <div style={{
        flex: 1,
        maxWidth: 80,
        height: 1,
        background: `linear-gradient(to left, transparent, ${color})`,
      }} />
    </div>
  );
}

export default function Destinations() {
  const isDark = useDarkMode();

  // Theme tokens
  const sectionBg      = isDark ? '#0a0a0a'   : '#F8F6F3';
  const headingColor   = isDark ? '#F8F4ED'   : '#1a1a1a';
  const compassLineBg  = isDark
    ? 'rgba(208,17,43,0.5)'
    : 'rgba(208,17,43,0.35)';

  return (
    <section
      id="destinations"
      aria-labelledby="destinations-heading"
      style={{
        padding: 'clamp(3.5rem, 7vw, 6rem) 1.5rem clamp(2rem, 4vw, 3rem)',
        background: sectionBg,
        transition: 'background 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Custom heading block ── */}
        <Reveal>
          <div style={{
            textAlign: 'center',
            paddingTop: 'clamp(30px, 2.5vw, 40px)',
            marginBottom: 'clamp(1.8rem, 3.5vw, 3rem)',
          }}>

            {/* Globe icon */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '0.9rem',
            }}>
              <GlobeIcon size={48} color="#C8921A" />
            </div>

            {/* JOURNEYS WITHOUT LIMITS tagline */}
            <GoldRule text="Journeys Without Limits" color="#C8921A" />

            {/* Main headline */}
            <h2
              id="destinations-heading"
              style={{ margin: '1rem 0 0 0' }}
            >
              {/* "Let Your Next Journey" — theme-aware */}
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
                fontWeight: 700,
                color: headingColor,
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}>
                Let Your Next Journey
              </span>
              {/* "Begin Here" — always crimson italic */}
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#D0112B',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}>
                Begin Here
              </span>
            </h2>

            {/* Crimson underline beneath "Begin Here" */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '0.6rem 0 1rem',
            }}>
              <div style={{
                width: 'clamp(120px, 20vw, 200px)',
                height: 2,
                background: 'linear-gradient(to right, transparent, #D0112B, transparent)',
              }} />
            </div>

            {/* Compass rose divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
            }}>
              <div style={{
                width: 36,
                height: 1,
                background: `linear-gradient(to right, transparent, ${compassLineBg})`,
              }} />
              <CompassDivider color="#D0112B" />
              <div style={{
                width: 36,
                height: 1,
                background: `linear-gradient(to left, transparent, ${compassLineBg})`,
              }} />
            </div>

          </div>
        </Reveal>

        {/* EXPLORE INDIA — clearly separated, sits just above cards */}
        <div style={{
          marginTop: 'clamp(1.8rem, 3vw, 2.8rem)',
          marginBottom: 'clamp(1rem, 2vw, 1.6rem)',
        }}>
          <GoldRule text="Explore India" color="#C8921A" />
        </div>

        {/* ── Fan deck cards ── */}
        <FanDeck destinations={exploreIndia} />

        {/* ── Bengal destination details ── */}
        <div id="bengal-destinations" style={{ scrollMarginTop: '80px' }} />

        <Reveal>
          <div style={{
            textAlign: 'center',
            marginTop: 'clamp(2.5rem, 5vw, 4rem)',
            marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
          }}>
            {/* subtle gold eyebrow label */}
            <GoldRule text="Bengal" color="#C8921A" />

            {/* serif crimson heading */}
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 700,
              color: '#D0112B',
              margin: '1rem 0 0.3rem',
              lineHeight: 1.1,
            }}>
              Bengal
            </h3>

            {/* sans muted subtitle */}
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
              color: isDark ? '#a0a0a0' : '#666',
              margin: 0,
            }}>
              Land of Culture & Rivers
            </p>
          </div>
        </Reveal>

        <BengalCards />

      </div>
    </section>
  );
}
