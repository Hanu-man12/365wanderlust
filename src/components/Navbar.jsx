// ============================================================
//  Navbar — Fixed, transparent at top → glassmorphism on scroll
//  Active section highlighting via IntersectionObserver
//  ── Design ──
//  1. At top: fully transparent, hero image visible through it
//  2. On scroll: semi-transparent glass (rgba bg + backdrop-blur)
//     Crimson-red nav text stays readable via text-shadow
//  3. z-index: 100 — content sits below at z-index 0 (no overlap)
//  4. scroll-margin-top on sections (index.css) clears the 72px navbar
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Send } from 'lucide-react';
import { brand } from '../data/siteData';

const NAV_LINKS = [
  { label: 'Home',         href: '#home'         },
  { label: 'About',        href: '#about'        },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Gallery',      href: '#gallery'      },
  { label: 'Contact',      href: '#contact'      },
];

// Logo mark — uses brand.logo from siteData (single source)
// ⚠️ White background baked into PNG — supply transparent PNG to remove white box
function LogoMark({ size = 38 }) {
  return (
    <img
      src={brand.logo}
      alt={brand.logoAlt}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
        background: 'none',
        borderRadius: 0,
        padding: 0,
      }}
    />
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  // Track dark mode so glass color adapts when theme toggles
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );
  const menuRef       = useRef(null);
  const hamburgerRef  = useRef(null);

  // Detect scroll — switch to glass when user scrolls past 60px
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync with theme changes (when ThemeToggle clicks)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_LINKS.map(l => l.href.slice(1));
    const observers  = [];
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-30% 0px -60% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Focus trap + Escape key for mobile menu
  const handleKeyDown = useCallback((e) => {
    if (!mobileOpen) return;
    if (e.key === 'Escape') {
      setMobileOpen(false);
      hamburgerRef.current?.focus();
    }
    if (e.key === 'Tab') {
      const focusable = menuRef.current?.querySelectorAll('a, button');
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  }, [mobileOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header
        role="banner"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          // ── TRANSPARENT at top → GLASS on scroll ──
          //
          // LIGHT MODE scrolled: white frosted glass
          //   rgba(255,255,255,0.82) — milky-white, page subtly visible through
          //   backdrop-blur gives the frosted effect
          //   subtle bottom border + shadow for separation from content
          //
          // DARK MODE scrolled: dark black glass (unchanged)
          //   rgba(8,8,8,0.78) — same as before, user confirmed this is correct
          //
          // Mobile open: full-opacity dark overlay (both modes — menu is dark)
          background: mobileOpen
            ? (isDark ? 'rgba(8, 8, 8, 0.98)' : 'rgba(13,13,13,0.98)')
            : isScrolled
              ? (isDark
                  ? 'rgba(8, 8, 8, 0.78)'           // dark mode: dark glass (unchanged)
                  : 'rgba(255, 255, 255, 0.82)')      // light mode: WHITE frosted glass ✨
              : 'transparent',
          backdropFilter: isScrolled && !mobileOpen ? 'blur(16px) saturate(1.8)' : 'none',
          WebkitBackdropFilter: isScrolled && !mobileOpen ? 'blur(16px) saturate(1.8)' : 'none',
          borderBottom: isScrolled && !mobileOpen
            ? (isDark
                ? '1px solid rgba(208, 17, 43, 0.18)'     // dark: crimson tint border
                : '1px solid rgba(208, 17, 43, 0.12)')     // light: very subtle crimson border
            : 'none',
          boxShadow: isScrolled && !mobileOpen
            ? (isDark
                ? '0 2px 20px rgba(0,0,0,0.35)'           // dark: stronger shadow
                : '0 2px 16px rgba(0,0,0,0.08)')           // light: soft shadow (white glass)
            : 'none',
          transition: 'background 0.35s ease, backdrop-filter 0.35s ease, box-shadow 0.35s ease, border-bottom 0.35s ease',
        }}
      >
        <nav
          role="navigation"
          aria-label="Main navigation"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* ── Logo: image + "365 WANDERLUST" wordmark, NO tagline ── */}
          <a
            href="#home"
            aria-label="365 Wanderlust — Go to homepage"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <LogoMark size={38} />
            {/* Wordmark only — tagline REMOVED — full text crimson red */}
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontSize: '1.15rem',
              letterSpacing: '0.04em',
              lineHeight: 1,
              color: '#D0112B',
              textShadow: '0 1px 6px rgba(0,0,0,0.4)',
            }}>
              365 WANDERLUST
            </span>
          </a>

          {/* ── Desktop nav links — crimson-red, text-shadow for legibility ── */}
          <ul
            style={{
              display: 'flex',
              gap: '0.4rem',          // was 0.15rem — more breathing room for larger text
              listStyle: 'none',
              margin: 0, padding: 0,
              alignItems: 'center',
            }}
            className="hidden-mobile"
          >
            {NAV_LINKS.map(link => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.93rem',        // was 0.82rem — larger, easier to read
                      fontWeight: 600,
                      letterSpacing: '0.04em',    // was 0.06em — tighter to avoid overflow
                      textTransform: 'uppercase',
                      color: '#D0112B',
                      textDecoration: 'none',
                      padding: '0.4rem 0.6rem',   // was 0.7rem — slightly less side padding
                      borderRadius: '6px',
                      transition: 'color 0.2s, opacity 0.2s',
                      position: 'relative',
                      opacity: isActive ? 1 : 0.85,
                      // Text shadow adapts: light bg → dark shadow only; dark bg → both
                      // White glass: white shadow would wash out, so use dark shadow only
                      textShadow: isDark || !isScrolled
                        ? '0 1px 4px rgba(255,255,255,0.5), 0 1px 8px rgba(0,0,0,0.3)'
                        : '0 1px 4px rgba(0,0,0,0.15)',  // white glass: minimal shadow
                    }}
                    onMouseOver={e => { e.currentTarget.style.opacity = '1'; }}
                    onMouseOut={e => { e.currentTarget.style.opacity = isActive ? '1' : '0.85'; }}
                  >
                    {link.label}
                    {isActive && (
                      <span style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '0.6rem',
                        right: '0.6rem',
                        height: '2px',
                        background: '#D0112B',
                        borderRadius: '2px',
                        boxShadow: '0 1px 4px rgba(208,17,43,0.5)',
                      }} />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* ── Desktop CTA: "PLAN MY TRIP" → scrolls to #contact ── */}
          <a
            href="#contact"
            className="hidden-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#D0112B',
              color: 'white',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '0.55rem 1.2rem',
              borderRadius: '8px',
              transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
              whiteSpace: 'nowrap',
              minHeight: '44px',
              boxShadow: '0 2px 12px rgba(208,17,43,0.35)',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#a50e22';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(208,17,43,0.45)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#D0112B';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(208,17,43,0.35)';
            }}
          >
            <Send size={13} />
            Plan My Trip
          </a>

          {/* ── Mobile hamburger ── */}
          <button
            ref={hamburgerRef}
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="show-mobile"
            style={{
              background: 'none',
              border: 'none',
              // Crimson red — brand color, visible on both transparent and white-glass navbar
              color: '#D0112B',
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'none',
              minWidth: '44px',
              minHeight: '44px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(13,13,13,0.98)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            paddingTop: '72px',
          }}
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, textAlign: 'center', width: '100%' }}>
            {NAV_LINKS.map((link, i) => (
              <li key={link.href} style={{ animation: `fadeInDown 0.3s ease ${i * 0.05}s both` }}>
                <a
                  href={link.href}
                  onClick={closeMobile}
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.6rem, 7vw, 2.2rem)',
                    fontWeight: 600,
                    color: activeSection === link.href.slice(1) ? '#D0112B' : '#F8F6F3',
                    textDecoration: 'none',
                    padding: '0.6rem 2rem',
                    letterSpacing: '0.04em',
                    transition: 'color 0.2s',
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile CTA → Contact section */}
          <a
            href="#contact"
            onClick={closeMobile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#D0112B',
              color: 'white',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '0.85rem 2rem',
              borderRadius: '8px',
              marginTop: '1.5rem',
              minHeight: '52px',
              boxShadow: '0 4px 16px rgba(208,17,43,0.4)',
            }}
          >
            <Send size={16} />
            Plan My Trip
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile   { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
