// ============================================================
//  Navbar — Sticky, transparent-to-solid, mobile hamburger
//  Active section highlighting via IntersectionObserver
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Send } from 'lucide-react';
import { brand } from '../data/siteData';
import { getWhatsAppLink } from '../utils/contactLinks';
// Logo image imported via brand.logo (siteData) — not hard-coded here

const NAV_LINKS = [
  { label: 'Home',         href: '#home'         },
  { label: 'About',        href: '#about'        },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Packages',     href: '#packages'     },
  { label: 'Gallery',      href: '#gallery'      },
  { label: 'Contact',      href: '#contact'      },
];

// Logo — uses real logo-mark image from siteData.brand.logo
// NOTE: The white background on this logo is BAKED INTO the PNG file,
// not CSS. To get a clean transparent logo on dark navbars, please supply
// a transparent-background version of logo-mark.png.
// There is NO CSS background box here — the <img> sits directly on the navbar.
// TO REVERT any spacing change: restore the padding value below to '0'.
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
        // No background-color, no border-radius box — logo sits directly on navbar
        background: 'none',
        borderRadius: 0,
        padding: 0,
      }}
    />
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Solid background after scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_LINKS.map(l => l.href.slice(1));
    const observers = [];

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

  // Close mobile menu on Escape key / focus trap
  const handleKeyDown = useCallback((e) => {
    if (!mobileOpen) return;
    if (e.key === 'Escape') {
      setMobileOpen(false);
      hamburgerRef.current?.focus();
    }
    // Basic focus trap: Tab
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

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const navBg = isScrolled || mobileOpen
    ? 'rgba(28,15,10,0.97)'
    : 'transparent';

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header
        role="banner"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: navBg,
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(200,134,26,0.2)' : 'none',
          transition: 'background 0.4s ease, border-color 0.4s ease',
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
          {/* Logo */}
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
            <div style={{ lineHeight: 1 }}>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                fontSize: '1.15rem',
                color: 'white',
                letterSpacing: '0.04em',
              }}>
                <span style={{ color: 'white' }}>365 </span>
                <span style={{ color: '#C8102E' }}>WANDERLUST</span>
              </span>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontWeight: 400,
                fontSize: '0.58rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(200,134,26,0.9)',
                marginTop: '1px',
              }}>
                {brand.tagline}
              </span>
            </div>
          </a>

          {/* Desktop nav links */}
          <ul
            style={{
              display: 'flex',
              gap: '0.25rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              alignItems: 'center',
            }}
            className="hidden-mobile"
          >
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: activeSection === link.href.slice(1)
                      ? '#C8861A'
                      : 'rgba(245,237,216,0.85)',
                    textDecoration: 'none',
                    padding: '0.4rem 0.7rem',
                    borderRadius: '3px',
                    transition: 'color 0.2s',
                    position: 'relative',
                  }}
                  aria-current={activeSection === link.href.slice(1) ? 'page' : undefined}
                >
                  {link.label}
                  {/* Active underline */}
                  {activeSection === link.href.slice(1) && (
                    <span style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0.7rem',
                      right: '0.7rem',
                      height: '1px',
                      background: '#C8861A',
                      borderRadius: '1px',
                    }} />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#C8102E',
              color: 'white',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '0.55rem 1.1rem',
              borderRadius: '3px',
              transition: 'background 0.2s, transform 0.2s',
              whiteSpace: 'nowrap',
              minHeight: '44px',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#a00d24'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#C8102E'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Send size={13} />
            Plan My Trip
          </a>

          {/* Mobile hamburger */}
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
              color: 'white',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'none', // shown via CSS media query
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

      {/* Mobile Menu Overlay */}
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
            background: 'rgba(28,15,10,0.98)',
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
                    color: activeSection === link.href.slice(1) ? '#C8861A' : 'var(--color-cream)',
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

          {/* Mobile CTA */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#C8102E',
              color: 'white',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '0.85rem 2rem',
              borderRadius: '4px',
              marginTop: '1.5rem',
              minHeight: '52px',
            }}
          >
            <Send size={16} />
            Plan My Trip on WhatsApp
          </a>

          {/* Decorative script line */}
          <p style={{
            fontFamily: 'var(--font-script)',
            fontSize: '1.1rem',
            color: 'rgba(200,134,26,0.5)',
            marginTop: '2rem',
          }}>
            Grab Your Leisure
          </p>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
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
