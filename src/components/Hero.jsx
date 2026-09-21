// ============================================================
//  Hero Section
//  - CSS/SVG brand background (no photo required, beautiful as-is)
//  - heroImage field in siteData adds background photo when ready
//  - Small framed trial posters arranged editorially
//  - WhatsApp CTA + Plan My Trip CTA
// ============================================================
import React, { useState } from 'react';
import { Send, ChevronDown } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { hero, brand } from '../data/siteData';
import { getWhatsAppLink } from '../utils/contactLinks';
import FramedImage from './FramedImage';
import Lightbox from './Lightbox';

export default function Hero() {
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' });

  const openLightbox = (src, alt) => setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox({ open: false, src: '', alt: '' });

  return (
    <>
      <section
        id="home"
        aria-label="Hero — 365 Wanderlust, Rajasthan travel"
        style={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          /* CSS gradient background — Rajasthan sunset palette */
          background: hero.heroImage
            ? `url(${hero.heroImage}) center/cover no-repeat`
            : `linear-gradient(135deg,
                #1C0F0A 0%,
                #2E1A10 35%,
                #3D2015 55%,
                #2A1208 75%,
                #1C0F0A 100%
              )`,
        }}
      >
        {/* Decorative SVG sand-dune pattern overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.06,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60'%3E%3Cellipse cx='50' cy='60' rx='60' ry='30' fill='%23D4956A'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 100px',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'bottom',
          }}
        />

        {/* Warm radial glow — like a desert sunset */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '20%',
            right: '20%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,134,26,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Subtle mandala / ornamental SVG pattern top-left */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-60px',
            left: '-60px',
            opacity: 0.06,
          }}
        >
          <svg width="300" height="300" viewBox="0 0 300 300">
            {[20,40,60,80,100,120].map(r => (
              <circle key={r} cx="150" cy="150" r={r} stroke="#C8861A" strokeWidth="0.5" fill="none" />
            ))}
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
              const rad = deg * Math.PI / 180;
              return (
                <line key={deg}
                  x1={150} y1={150}
                  x2={150 + 140 * Math.cos(rad)}
                  y2={150 + 140 * Math.sin(rad)}
                  stroke="#C8861A" strokeWidth="0.4"
                />
              );
            })}
          </svg>
        </div>

        {/* Main Hero Content */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: 'clamp(6rem, 12vw, 8rem) 1.5rem 4rem',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '3rem',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left: Text content */}
          <div style={{ maxWidth: '640px' }}>
            {/* Travel Journal badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(200,134,26,0.15)',
              border: '1px solid rgba(200,134,26,0.3)',
              borderRadius: '2px',
              padding: '0.3rem 0.8rem',
              marginBottom: '1.5rem',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#C8861A', display: 'inline-block',
              }} />
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#C8861A',
              }}>
                Travel Journal • Rajasthan, India
              </span>
            </div>

            {/* Main Heading */}
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              color: 'var(--color-cream)',
              margin: '0 0 0.3rem 0',
              letterSpacing: '-0.01em',
            }}>
              {hero.headline}
            </h1>

            {/* Subline in brand-red italic */}
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
              fontWeight: 400,
              color: 'var(--color-brand-red)',
              margin: '0 0 1.5rem 0',
              lineHeight: 1.2,
            }}>
              {hero.subline}
            </p>

            {/* Tagline */}
            <p style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              color: 'rgba(200,134,26,0.9)',
              marginBottom: '2.5rem',
              letterSpacing: '0.02em',
            }}>
              — {hero.tagline}
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Primary CTA */}
              <a
                href="#contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--color-brand-red)',
                  color: 'white',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: '0.9rem 1.8rem',
                  borderRadius: '3px',
                  minHeight: '52px',
                  transition: 'background 0.2s, transform 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#a00d24'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'var(--color-brand-red)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Send size={14} />
                {hero.ctaText}
              </a>

              {/* WhatsApp CTA */}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'transparent',
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  letterSpacing: '0.06em',
                  textDecoration: 'none',
                  padding: '0.9rem 1.5rem',
                  borderRadius: '3px',
                  border: '1px solid rgba(245,237,216,0.3)',
                  minHeight: '52px',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(245,237,216,0.6)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(245,237,216,0.3)'; }}
              >
                <FaWhatsapp size={18} style={{ color: '#25D366' }} />
                Chat on WhatsApp
              </a>
            </div>

            {/* Contact strip */}
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(245,237,216,0.12)',
            }}>
              {['7425010750', '7890387923'].map(num => (
                <a
                  key={num}
                  href={`tel:+91${num}`}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    color: 'rgba(245,237,216,0.6)',
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = '#C8861A'}
                  onMouseOut={e => e.currentTarget.style.color = 'rgba(245,237,216,0.6)'}
                >
                  +91 {num}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Framed trial posters — editorial arrangement */}
          {/* TRIAL IMAGES — replace with hero portrait photos later */}
          <div
            style={{
              position: 'relative',
              width: '260px',
              height: '340px',
              flexShrink: 0,
            }}
            className="hero-frames"
            aria-hidden="true"
          >
            {hero.heroFrames.map((frame, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: i === 0 ? '0' : '80px',
                  left: i === 0 ? '0' : '50px',
                  width: i === 0 ? '180px' : '170px',
                  zIndex: i === 0 ? 1 : 2,
                }}
              >
                <FramedImage
                  src={frame.image}
                  alt={frame.alt}
                  rotation={frame.rotation}
                  onOpen={openLightbox}
                  eager={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#about"
          aria-label="Scroll to About section"
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(245,237,216,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
            textDecoration: 'none',
            animation: 'bounce 2s ease-in-out infinite',
          }}
        >
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Explore
          </span>
          <ChevronDown size={18} />
        </a>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(6px); }
          }
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-frames { display: none !important; }
          }
        `}</style>
      </section>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightbox.open}
        src={lightbox.src}
        alt={lightbox.alt}
        onClose={closeLightbox}
      />
    </>
  );
}
