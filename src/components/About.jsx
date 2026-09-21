// ============================================================
//  About / Our Story Section
//  Warm cream background, asymmetric layout, pull-quote
// ============================================================
import React, { useState } from 'react';
import { about } from '../data/siteData';
import SectionHeading from './SectionHeading';
import FramedImage from './FramedImage';
import Lightbox from './Lightbox';
import Reveal from './Reveal';

export default function About() {
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' });
  const openLightbox = (src, alt) => setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox({ open: false, src: '', alt: '' });

  return (
    <>
      <section
        id="about"
        aria-labelledby="about-heading"
        className="bg-parchment"
        style={{
          padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Faint ornamental mandala top-right */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-80px', right: '-80px', opacity: 0.04,
        }}>
          <svg width="400" height="400" viewBox="0 0 400 400">
            {[30,60,90,120,150,180].map(r => (
              <circle key={r} cx="200" cy="200" r={r} stroke="#8B1A2E" strokeWidth="0.8" fill="none"/>
            ))}
          </svg>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <SectionHeading
              label="Our Story"
              heading="Who We Are"
              subtext="Crafting meaningful journeys across the land of kings."
              align="center"
            />
          </Reveal>

          {/* Main content grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
          }} className="about-grid">

            {/* Left: Framed poster + decorative elements */}
            <Reveal className="reveal-delay-1">
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                {/* Background decorative block */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  right: '-20px',
                  bottom: '-20px',
                  background: 'linear-gradient(135deg, rgba(200,134,26,0.12), rgba(212,149,106,0.08))',
                  borderRadius: '4px',
                  zIndex: 0,
                }} />

                {/* TRIAL IMAGE — replace with: lifestyle/portrait photo 1:1 or 4:5 */}
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '340px', width: '100%' }}>
                  <FramedImage
                    src={about.image}
                    alt={about.imageAlt}
                    rotation="-1.5deg"
                    caption="Rajasthan • The Feeling Stays"
                    onOpen={openLightbox}
                  />
                </div>

                {/* Small decorative quote card */}
                <div style={{
                  position: 'absolute',
                  bottom: '-16px',
                  right: '0',
                  background: 'var(--color-brand-maroon)',
                  color: 'var(--color-cream)',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '3px',
                  maxWidth: '200px',
                  zIndex: 2,
                  boxShadow: '0 4px 16px rgba(28,15,10,0.2)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-script)',
                    fontSize: '0.95rem',
                    color: 'var(--color-gold-light)',
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    {about.scriptLine}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Right: Text content */}
            <div>
              {/* Pull quote */}
              <Reveal className="reveal-delay-1">
                <blockquote style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.3rem, 3vw, 1.9rem)',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: 'var(--color-brand-maroon)',
                  lineHeight: 1.3,
                  borderLeft: '3px solid var(--color-brand-red)',
                  paddingLeft: '1.2rem',
                  margin: '0 0 2rem 0',
                }}>
                  "{about.pullQuote}"
                </blockquote>
              </Reveal>

              {/* Story paragraph 1 — placeholder if not supplied */}
              <Reveal className="reveal-delay-2">
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  lineHeight: 1.85,
                  color: 'var(--color-brown)',
                  marginBottom: '1.2rem',
                  fontStyle: about.storyParagraph1.startsWith('[') ? 'italic' : 'normal',
                  opacity: about.storyParagraph1.startsWith('[') ? 0.55 : 1,
                }}>
                  {about.storyParagraph1}
                </p>
              </Reveal>

              {/* Story paragraph 2 — from poster copy */}
              <Reveal className="reveal-delay-3">
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  lineHeight: 1.85,
                  color: 'var(--color-brown)',
                  marginBottom: '2rem',
                }}>
                  {about.storyParagraph2}
                </p>
              </Reveal>

              {/* Brand tagline line */}
              <Reveal className="reveal-delay-4">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <div style={{
                    width: '30px', height: '1px',
                    background: 'var(--color-sand)',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-sand)',
                  }}>
                    Grab Your Leisure
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .about-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      <Lightbox
        isOpen={lightbox.open}
        src={lightbox.src}
        alt={lightbox.alt}
        onClose={closeLightbox}
      />
    </>
  );
}
