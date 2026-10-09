// ============================================================
//  Hero Section — Full-bleed banner image + single Plan My Trip CTA
//  Banner image contains baked-in "#GrabYourLeisure" text — 
//  do NOT recreate that text as HTML on top of it.
//  CTA scrolls to #contact section (anchor link).
// ============================================================
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { hero } from '../data/siteData';

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="365 Wanderlust — Grab Your Leisure"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* ── Full-bleed banner image ── */}
      <img
        src={hero.heroImage}
        alt={hero.heroBannerAlt}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          // Center-top keeps "#GrabYourLeisure" text visible on all screen sizes
          objectPosition: 'center top',
          zIndex: 0,
        }}
      />

      {/* ── Gradient overlay — bottom only, for CTA readability ──
           Does NOT darken the banner text/imagery area              */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '45%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── CTA area — sits above gradient at bottom ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          paddingBottom: 'clamp(3rem, 8vw, 5rem)',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Single primary CTA — scrolls to Contact section */}
        <a
          href="#contact"
          aria-label="Plan My Trip — scroll to enquiry form"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#D0112B',
            color: '#ffffff',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            padding: 'clamp(0.85rem, 2vw, 1rem) clamp(2rem, 5vw, 3.5rem)',
            borderRadius: '4px',
            minHeight: '52px',
            minWidth: '200px',
            boxShadow: '0 4px 24px rgba(208,17,43,0.45), 0 2px 8px rgba(0,0,0,0.3)',
            transition: 'background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
            border: '2px solid rgba(255,255,255,0.15)',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#a50e22';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(208,17,43,0.5), 0 2px 12px rgba(0,0,0,0.35)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#D0112B';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(208,17,43,0.45), 0 2px 8px rgba(0,0,0,0.3)';
          }}
          onFocus={e => {
            e.currentTarget.style.outline = '3px solid #ffffff';
            e.currentTarget.style.outlineOffset = '3px';
          }}
          onBlur={e => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          {hero.ctaText}
        </a>

        {/* Scroll hint */}
        <a
          href="#about"
          aria-label="Scroll down to explore"
          style={{
            color: 'rgba(255,255,255,0.55)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            textDecoration: 'none',
            marginTop: '0.5rem',
            animation: 'heroBounce 2s ease-in-out infinite',
            transition: 'color 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
          onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
        >
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}>
            Explore
          </span>
          <ChevronDown size={16} />
        </a>
      </div>

      <style>{`
        @keyframes heroBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(5px); }
        }
        /* Reduce hero height on small short screens so CTA is always visible */
        @media (max-width: 480px) {
          #home { min-height: 85vh !important; }
        }
        @media (max-height: 600px) {
          #home { min-height: 100svh !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          #home a { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}
