// ============================================================
//  Hero Section — Full-bleed banner image + single Plan My Trip CTA
//  Banner image: 1600×900 (16:9 landscape).
//  Key content — "#GrabYourLeisure" text + compass/airplane artwork —
//  is centered in the top half of the image.
//
//  Responsive strategy:
//  - Wide screens (≥769px): object-fit:cover, object-position:center top
//    → image fills width, top content stays visible
//  - Narrow mobile (<480px portrait): image is shown full-width at its
//    natural 16:9 ratio (contain + brand-red letterbox bg beneath it),
//    so NO content is cropped. CTA floats below.
//  - Landscape mobile / tablet (480-768px): cover + center top (wide
//    enough that 16:9 crop is manageable, artwork stays visible)
//  - Very short viewports (landscape phone): 80vh cap to keep CTA visible
// ============================================================
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { hero } from '../data/siteData';

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="365 Wanderlust — Grab Your Leisure"
      className="hero-section"
      style={{
        position: 'relative',
        /* Default (desktop): near-full viewport height with peek-through */
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        /* Crimson brand gradient bg — replaces near-black (#0D0D0D).
           On narrow mobile (contain mode) the image doesn't fill full
           height so background shows as letterbox. Crimson looks
           intentional and on-brand; black looked like a broken gap.    */
        background: 'linear-gradient(180deg, #8a0c1c 0%, #D0112B 60%, #a50e22 100%)',
      }}
    >
      {/* ── Full-bleed banner image ── */}
      <img
        src={hero.heroImage}
        alt={hero.heroBannerAlt}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="hero-img"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          /* Default (desktop ≥769px): cover + center-top
             Keeps artwork at top visible; bottom may be cropped (acceptable) */
          objectFit: 'cover',
          objectPosition: 'center top',
          zIndex: 0,
        }}
      />

      {/* ── Gradient overlay — bottom only, for CTA readability ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)',
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
            borderRadius: '8px',
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

        /* ── NARROW MOBILE (portrait ≤ 480px) ──────────────────────────────
           The 16:9 image is too wide relative to portrait height.
           Use object-fit:contain so the FULL image is visible — no content
           cropped. Crimson gradient bg fills letterbox areas above/below.
           Hero height = natural 16:9 height of the screen width.
           Formula: 100vw ÷ (16/9) = 56.25vw. Add 100px for CTA below.  */
        @media (max-width: 480px) {
          .hero-section {
            min-height: calc(56.25vw + 100px) !important;
            justify-content: flex-end !important;
          }
          .hero-img {
            object-fit: contain !important;
            object-position: center top !important;
          }
        }

        /* ── TABLET / WIDE MOBILE (481px – 768px) ──────────────────────────
           Landscape-ish viewports — cover works, center-top keeps artwork.
           Reduce height slightly so CTA always visible.                   */
        @media (min-width: 481px) and (max-width: 768px) {
          .hero-section {
            min-height: calc(100vh - 130px) !important;
          }
          .hero-img {
            object-fit: cover !important;
            object-position: center top !important;
          }
        }

        /* ── DESKTOP (≥ 769px) ─────────────────────────────────────────────
           Wide viewport — 16:9 image fills width nicely.
           object-position: 50% 15% shifts slightly above center so the
           "#GrabYourLeisure" heading and artwork are comfortably on-screen
           rather than the bottom half of the image dominating.            */
        @media (min-width: 769px) {
          .hero-section {
            min-height: calc(100vh - 120px) !important;
          }
          .hero-img {
            object-fit: cover !important;
            object-position: 50% 15% !important;
          }
        }

        /* ── VERY SHORT LANDSCAPE SCREENS ──────────────────────────────────
           e.g. phone in landscape (height < 500px). Cap at 80vh so the
           CTA button is never pushed off-screen.                          */
        @media (max-height: 500px) {
          .hero-section { min-height: 80vh !important; }
          .hero-img {
            object-fit: cover !important;
            object-position: center center !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          #home a { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}
