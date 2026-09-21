// ============================================================
//  SectionHeading — Reusable section title with ornament
// ============================================================
import React from 'react';

/**
 * @param {string} label    - Small uppercase label above heading (optional)
 * @param {string} heading  - Main h2 heading text
 * @param {string} subtext  - Paragraph below heading (optional)
 * @param {string} align    - 'left' | 'center' (default 'center')
 * @param {string} theme    - 'light' (dark text on cream) | 'dark' (light text on ink)
 */
export default function SectionHeading({ label, heading, subtext, align = 'center', theme = 'light' }) {
  const isCenter = align === 'center';
  const isDark = theme === 'dark';

  return (
    <div style={{ textAlign: isCenter ? 'center' : 'left', marginBottom: '3rem' }}>
      {/* Label */}
      {label && (
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: isDark ? 'rgba(240,192,96,0.85)' : 'var(--color-sand)',
          marginBottom: '0.6rem',
        }}>
          {label}
        </p>
      )}

      {/* Heading */}
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 700,
        lineHeight: 1.1,
        color: isDark ? 'var(--color-cream)' : 'var(--color-brand-maroon)',
        margin: 0,
      }}>
        {heading}
      </h2>

      {/* Ornament divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCenter ? 'center' : 'flex-start',
        gap: '0.6rem',
        margin: '1rem 0',
      }}>
        <div style={{ height: '1px', width: '40px', background: `linear-gradient(to right, transparent, ${isDark ? 'rgba(200,134,26,0.5)' : 'var(--color-sand)'})` }} />
        {/* Ornament dot — small mandala / floral */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="2" fill={isDark ? '#C8861A' : 'var(--color-sand)'} />
          <circle cx="8" cy="8" r="5" stroke={isDark ? '#C8861A' : 'var(--color-sand)'} strokeWidth="0.8" fill="none" />
          <line x1="8" y1="1" x2="8" y2="4" stroke={isDark ? '#C8861A' : 'var(--color-sand)'} strokeWidth="0.8" />
          <line x1="8" y1="12" x2="8" y2="15" stroke={isDark ? '#C8861A' : 'var(--color-sand)'} strokeWidth="0.8" />
          <line x1="1" y1="8" x2="4" y2="8" stroke={isDark ? '#C8861A' : 'var(--color-sand)'} strokeWidth="0.8" />
          <line x1="12" y1="8" x2="15" y2="8" stroke={isDark ? '#C8861A' : 'var(--color-sand)'} strokeWidth="0.8" />
        </svg>
        <div style={{ height: '1px', width: '40px', background: `linear-gradient(to left, transparent, ${isDark ? 'rgba(200,134,26,0.5)' : 'var(--color-sand)'})` }} />
      </div>

      {/* Subtext */}
      {subtext && (
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
          color: isDark ? 'rgba(245,237,216,0.7)' : 'var(--color-brown-light)',
          lineHeight: 1.7,
          maxWidth: '560px',
          margin: isCenter ? '0 auto' : '0',
        }}>
          {subtext}
        </p>
      )}
    </div>
  );
}
