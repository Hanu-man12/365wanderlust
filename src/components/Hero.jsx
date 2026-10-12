// ============================================================
//  Hero Section — "Grab Your Leisure" banner + PLAN MY TRIP CTA
//  Banner: 1600×900px (16:9 landscape).
//
//  ROOT CAUSE OF PREVIOUS BUG:
//  The image was "position: absolute; inset: 0; height: 100%"
//  inside a container with minHeight: calc(100vh - 120px).
//  On mobile (375px), contain-mode image = 211px tall, but
//  container = ~630px tall → ~419px of empty crimson below image.
//
//  FIX — TWO-LAYOUT STRATEGY (CSS shows/hides via breakpoint):
//
//  MOBILE (≤ 640px): "flow layout"
//    Image is in normal document flow: width:100%, height:auto.
//    Section height = image height + CTA area. Zero gap possible.
//    No absolute positioning. No fixed heights.
//
//  DESKTOP (> 640px): "viewport-fill layout"
//    Section fills near-full viewport. Image absolutely positioned,
//    object-fit:cover. CTA floats over gradient at bottom.
//    Works well because 16:9 image on wide screen looks great with cover.
//
//  Both layouts share the same id="home" via a wrapper — one DOM node,
//  two different inner renderings controlled by CSS display.
// ============================================================
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { hero } from '../data/siteData';

export default function Hero() {
  return (
    // Wrapper carries id="home" — single anchor target for navbar
    <div id="home">

      {/* ══════════════════════════════════════════════
          MOBILE LAYOUT (≤ 640px)
          Image in flow. Section height = image + CTA.
          No empty gap below the artwork.
      ══════════════════════════════════════════════ */}
      <section
        aria-label="365 Wanderlust — Grab Your Leisure"
        className="hero-mobile"
        style={{
          display: 'none',
          flexDirection: 'column',
          alignItems: 'stretch',
          background: '#D0112B', /* crimson bg — only visible if image fails */
        }}
      >
        {/* Image in FLOW — container height = image height. No gap. */}
        <img
          src={hero.heroImage}
          alt={hero.heroBannerAlt}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',       /* lets image set its own height from aspect ratio */
            objectFit: 'contain', /* full artwork visible, never cropped */
          }}
        />

        {/* CTA sits immediately below image — crimson band */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1.25rem 1rem 2rem',
          background: '#D0112B',
        }}>
          <a
            href="#contact"
            aria-label="Plan My Trip — scroll to enquiry form"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              color: '#D0112B',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '0.85rem 2.5rem',
              borderRadius: '8px',
              minHeight: '52px',
              minWidth: '200px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              border: '2px solid rgba(255,255,255,0.3)',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#ffe8eb'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {hero.ctaText}
          </a>

          <a href="#about" aria-label="Scroll down to explore"
            style={{ color: 'rgba(255,255,255,0.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem', textDecoration: 'none', animation: 'heroBounce 2s ease-in-out infinite' }}
          >
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Explore</span>
            <ChevronDown size={14} color="rgba(255,255,255,0.65)" />
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          DESKTOP / TABLET LAYOUT (> 640px)
          Viewport-height section. Image absolutely
          fills the section via cover mode.
      ══════════════════════════════════════════════ */}
      <section
        aria-label="365 Wanderlust — Grab Your Leisure"
        className="hero-desktop"
        style={{
          display: 'none',
          position: 'relative',
          minHeight: 'calc(100vh - 80px)',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #8a0c1c 0%, #D0112B 100%)',
        }}
      >
        {/* Absolutely positioned cover image */}
        <img
          src={hero.heroImage}
          alt={hero.heroBannerAlt}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="hero-img-desktop"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            /* 18% from top — keeps "#GrabYourLeisure" text + compass visible */
            objectPosition: '50% 18%',
            zIndex: 0,
          }}
        />

        {/* Dark-to-transparent gradient at bottom for CTA readability */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '45%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />

        {/* CTA over gradient */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '1rem',
          paddingBottom: 'clamp(3rem, 6vw, 5rem)',
          paddingLeft: '1rem', paddingRight: '1rem',
          width: '100%', textAlign: 'center',
        }}>
          <a
            href="#contact"
            aria-label="Plan My Trip — scroll to enquiry form"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: '#D0112B', color: '#ffffff',
              fontFamily: 'var(--font-sans)', fontWeight: 700,
              fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
              letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
              padding: 'clamp(0.85rem, 1.5vw, 1rem) clamp(2rem, 4vw, 3.5rem)',
              borderRadius: '8px', minHeight: '52px', minWidth: '200px',
              boxShadow: '0 4px 24px rgba(208,17,43,0.45), 0 2px 8px rgba(0,0,0,0.3)',
              transition: 'background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
              border: '2px solid rgba(255,255,255,0.15)',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#a50e22'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(208,17,43,0.5)'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#D0112B'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(208,17,43,0.45), 0 2px 8px rgba(0,0,0,0.3)'; }}
            onFocus={e => { e.currentTarget.style.outline = '3px solid #ffffff'; e.currentTarget.style.outlineOffset = '3px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            {hero.ctaText}
          </a>

          <a href="#about" aria-label="Scroll down to explore"
            style={{ color: 'rgba(255,255,255,0.55)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', textDecoration: 'none', marginTop: '0.5rem', animation: 'heroBounce 2s ease-in-out infinite', transition: 'color 0.2s' }}
            onMouseOver={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
            onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
          >
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Explore</span>
            <ChevronDown size={16} />
          </a>
        </div>
      </section>

      {/* ── Shared styles + responsive visibility ── */}
      <style>{`
        /* Mobile: show flow layout, hide desktop layout */
        @media (max-width: 640px) {
          .hero-mobile  { display: flex !important; }
          .hero-desktop { display: none !important; }
        }
        /* Desktop + tablet: show viewport layout, hide mobile layout */
        @media (min-width: 641px) {
          .hero-mobile  { display: none !important; }
          .hero-desktop { display: flex !important; }
        }
        /* Tablet: slightly shorter */
        @media (min-width: 641px) and (max-width: 1024px) {
          .hero-desktop { min-height: calc(100vh - 100px) !important; }
          .hero-img-desktop { object-position: 50% 12% !important; }
        }
        /* Short landscape screens */
        @media (max-height: 500px) and (min-width: 641px) {
          .hero-desktop { min-height: 85vh !important; }
          .hero-img-desktop { object-position: center center !important; }
        }
        @keyframes heroBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(5px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-mobile a, .hero-desktop a {
            animation: none !important; transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
