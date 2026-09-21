// ============================================================
//  Journey / Travel Experience Section
//  Storytelling with supplied narrative: The Journey Begins →
//  Where Every Journey Becomes A Story → The Feeling Stays
//  Framed polaroid images + live HTML text (not image-reliant)
// ============================================================
import React, { useState } from 'react';
import { journey } from '../data/siteData';
import SectionHeading from './SectionHeading';
import FramedImage from './FramedImage';
import Lightbox from './Lightbox';
import Reveal from './Reveal';

export default function Journey() {
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });

  const openLightbox = (src) => {
    const idx = journey.findIndex(j => j.image === src);
    setLightbox({
      open: true,
      images: journey.map(j => ({ src: j.image, alt: j.imageAlt })),
      index: idx >= 0 ? idx : 0,
    });
  };
  const closeLightbox = () => setLightbox(s => ({ ...s, open: false }));
  const prevImg = () => setLightbox(s => ({ ...s, index: (s.index - 1 + s.images.length) % s.images.length }));
  const nextImg = () => setLightbox(s => ({ ...s, index: (s.index + 1) % s.images.length }));

  return (
    <>
      <section
        id="journey"
        aria-labelledby="journey-heading"
        className="bg-parchment"
        style={{
          padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative vertical timeline line */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          left: '50%',
          top: '200px',
          bottom: '200px',
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, rgba(212,149,106,0.3), transparent)',
          transform: 'translateX(-50%)',
        }} className="timeline-line" />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
          <Reveal>
            <SectionHeading
              label="The Travel Experience"
              heading="The Story of Every Journey"
              subtext="Three chapters. One unforgettable Rajasthan."
            />
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4rem, 8vw, 7rem)' }}>
            {journey.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <Reveal key={item.id} className={`reveal-delay-${i + 1}`}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'clamp(2rem, 5vw, 4rem)',
                    alignItems: 'center',
                  }} className="journey-row">

                    {/* Image side */}
                    <div style={{
                      order: isEven ? 0 : 1,
                      display: 'flex',
                      justifyContent: 'center',
                    }} className="journey-img">
                      {/* TRIAL IMAGE — see siteData.journey[*].image */}
                      <div style={{ maxWidth: '280px', width: '100%' }}>
                        <FramedImage
                          src={item.image}
                          alt={item.imageAlt}
                          rotation={item.rotation}
                          caption={`Travel Journal • ${item.label}`}
                          onOpen={openLightbox}
                        />
                      </div>
                    </div>

                    {/* Text side */}
                    <div style={{ order: isEven ? 1 : 0 }}>
                      {/* Chapter label */}
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'var(--color-sand)',
                        marginBottom: '0.6rem',
                      }}>
                        Chapter {i + 1} of {journey.length}
                      </p>

                      {/* Heading — live HTML text, not image */}
                      <h3 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                        fontWeight: 700,
                        color: 'var(--color-brand-maroon)',
                        lineHeight: 1.1,
                        margin: '0 0 0.8rem 0',
                      }}>
                        {item.heading}
                      </h3>

                      {/* Thin ornament line */}
                      <div style={{
                        width: '40px', height: '1px',
                        background: 'var(--color-brand-red)',
                        marginBottom: '1.2rem',
                      }} />

                      {/* Body copy — live HTML text */}
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(0.88rem, 2vw, 0.98rem)',
                        lineHeight: 1.85,
                        color: 'var(--color-brown)',
                        marginBottom: item.scriptLine ? '1.5rem' : 0,
                      }}>
                        {item.body}
                      </p>

                      {/* Script accent — "Until the next journey..." */}
                      {item.scriptLine && (
                        <p style={{
                          fontFamily: 'var(--font-script)',
                          fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                          color: 'var(--color-brand-maroon)',
                          margin: 0,
                          lineHeight: 1.3,
                        }}>
                          {item.scriptLine}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .journey-row { grid-template-columns: 1fr !important; }
            .journey-img { order: 0 !important; }
            .timeline-line { display: none !important; }
          }
        `}</style>
      </section>

      <Lightbox
        isOpen={lightbox.open}
        images={lightbox.images}
        currentIndex={lightbox.index}
        onClose={closeLightbox}
        onPrev={prevImg}
        onNext={nextImg}
      />
    </>
  );
}
