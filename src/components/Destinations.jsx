// ============================================================
//  Destinations Section  (v2)
//  Custom heading: globe icon → "JOURNEYS WITHOUT LIMITS" →
//  "Let Your Next Journey / Begin Here" → compass divider →
//  "EXPLORE INDIA" → fan deck cards.
// ============================================================
import React from 'react';
import { exploreIndia } from '../data/siteData';
import FanDeck from './FanDeck';
import Reveal from './Reveal';

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
  return (
    <section
      id="destinations"
      aria-labelledby="destinations-heading"
      style={{
        padding: 'clamp(3.5rem, 7vw, 6rem) 1.5rem clamp(2rem, 4vw, 3rem)',
        background: '#0a0a0a',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Custom heading block ── */}
        <Reveal>
          <div style={{
            textAlign: 'center',
            marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
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
              {/* "Let Your Next Journey" — cream white, serif bold */}
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
                fontWeight: 700,
                color: '#F8F4ED',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}>
                Let Your Next Journey
              </span>
              {/* "Begin Here" — crimson, italic, serif */}
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
              marginBottom: '1.2rem',
            }}>
              <div style={{
                width: 36,
                height: 1,
                background: 'linear-gradient(to right, transparent, rgba(208,17,43,0.5))',
              }} />
              <CompassDivider color="#D0112B" />
              <div style={{
                width: 36,
                height: 1,
                background: 'linear-gradient(to left, transparent, rgba(208,17,43,0.5))',
              }} />
            </div>

          </div>
        </Reveal>

        {/* EXPLORE INDIA — immediately above the cards */}
        <div style={{ marginBottom: 'clamp(1.2rem, 2.5vw, 2rem)' }}>
          <GoldRule text="Explore India" color="#C8921A" />
        </div>

        {/* ── Fan deck cards ── */}
        <FanDeck destinations={exploreIndia} />

      </div>
    </section>
  );
}
