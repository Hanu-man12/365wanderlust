// ============================================================
//  Destinations Section — Editorial staggered cards
//  Each card: framed poster, name, description, WhatsApp CTA
// ============================================================
import React, { useState } from 'react';
import { MapPin, Send } from 'lucide-react';
import { destinations } from '../data/siteData';
import { getWhatsAppLink } from '../utils/contactLinks';
import SectionHeading from './SectionHeading';
import FramedImage from './FramedImage';
import Lightbox from './Lightbox';
import Reveal from './Reveal';
import FanDeck from './FanDeck';
import { exploreIndia } from '../data/siteData';

function DestinationCard({ dest, onOpenImage, index }) {
  const isEven = index % 2 === 0;

  return (
    <Reveal className={`reveal-delay-${(index % 4) + 1}`}>
      <article
        aria-label={`Destination: ${dest.name}`}
        style={{
          display: 'grid',
          gridTemplateColumns: isEven ? '1fr 1.2fr' : '1.2fr 1fr',
          gap: 'clamp(1.5rem, 4vw, 3.5rem)',
          alignItems: 'center',
          padding: 'clamp(2rem, 4vw, 3rem) 0',
          borderBottom: '1px solid rgba(212,149,106,0.2)',
        }}
        className="dest-card"
      >
        {/* Image side */}
        <div
          style={{
            order: isEven ? 0 : 1,
            display: 'flex',
            justifyContent: 'center',
          }}
          className="dest-image"
        >
          {/* TRIAL IMAGE — see siteData.destinations[*].image */}
          <div style={{ maxWidth: '280px', width: '100%' }}>
            <FramedImage
              src={dest.image}
              alt={dest.imageAlt}
              rotation={isEven ? '-2deg' : '2deg'}
              onOpen={onOpenImage}
            />
          </div>
        </div>

        {/* Text side */}
        <div style={{ order: isEven ? 1 : 0 }}>
          {/* Location badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginBottom: '0.6rem',
          }}>
            <MapPin size={12} color="var(--color-sand)" />
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-sand)',
            }}>
              Rajasthan, India
            </span>
          </div>

          {/* Name */}
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            color: 'var(--color-brand-maroon)',
            margin: '0 0 0.2rem 0',
            lineHeight: 1.05,
          }}>
            {dest.name}
          </h3>

          {/* Subtitle */}
          <p style={{
            fontFamily: 'var(--font-script)',
            fontSize: '1.1rem',
            color: 'var(--color-sand)',
            margin: '0 0 1rem 0',
          }}>
            {dest.subtitle}
          </p>

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            lineHeight: 1.8,
            color: 'var(--color-brown)',
            marginBottom: '1.2rem',
            maxWidth: '420px',
          }}>
            {dest.description}
          </p>

          {/* Highlights */}
          <ul style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            listStyle: 'none',
            margin: '0 0 1.5rem 0',
            padding: 0,
          }}>
            {dest.highlights.map(h => (
              <li key={h} style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.06em',
                color: 'var(--color-brown-light)',
                background: 'rgba(212,149,106,0.12)',
                border: '1px solid rgba(212,149,106,0.25)',
                padding: '0.25rem 0.65rem',
                borderRadius: '2px',
              }}>
                {h}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href={getWhatsAppLink(dest.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-brand-red)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderBottom: '1px solid var(--color-brand-red)',
              paddingBottom: '2px',
              transition: 'opacity 0.2s',
              minHeight: '44px',
              alignItems: 'center',
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Enquire about {dest.name}
            <Send size={12} />
          </a>
        </div>
      </article>
    </Reveal>
  );
}

export default function Destinations() {
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });

  const openLightbox = (src, alt) => {
    const idx = destinations.findIndex(d => d.image === src);
    setLightbox({
      open: true,
      images: destinations.map(d => ({ src: d.image, alt: d.imageAlt })),
      index: idx >= 0 ? idx : 0,
    });
  };
  const closeLightbox = () => setLightbox(s => ({ ...s, open: false }));
  const prevImg = () => setLightbox(s => ({ ...s, index: (s.index - 1 + s.images.length) % s.images.length }));
  const nextImg = () => setLightbox(s => ({ ...s, index: (s.index + 1) % s.images.length }));

  return (
    <>
      <section
        id="destinations"
        aria-labelledby="destinations-heading"
        style={{
          padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
          background: 'white',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* ── Explore India fan deck ── */}
          <div style={{ marginBottom: '5rem' }}>
            <Reveal>
              <SectionHeading
                label="Explore India"
                heading="Where Do You Want To Go?"
                subtext="Nine incredible destinations. Your next adventure starts here."
                align="center"
              />
            </Reveal>
            <FanDeck destinations={exploreIndia} />
          </div>

          <Reveal>
            <SectionHeading
              label="Explore Rajasthan"
              heading="Our Destinations"
              subtext="Five extraordinary places. Infinite stories waiting to be lived."
            />
          </Reveal>

          {/* Bengal navigation anchor */}
          <div id="bengal-destinations" style={{ scrollMarginTop: '80px' }} />

          <div>
            {destinations.map((dest, i) => (
              <DestinationCard
                key={dest.id}
                dest={dest}
                index={i}
                onOpenImage={openLightbox}
              />
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .dest-card { grid-template-columns: 1fr !important; }
            .dest-image { order: 0 !important; }
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
