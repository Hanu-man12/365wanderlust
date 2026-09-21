// ============================================================
//  Travel Packages Section — Premium data-driven cards
//  Expandable itinerary, WhatsApp CTA per package
// ============================================================
import React, { useState } from 'react';
import { Clock, MapPin, ChevronDown, ChevronUp, Send, Star } from 'lucide-react';
import { packages } from '../data/siteData';
import { getWhatsAppLink } from '../utils/contactLinks';
import SectionHeading from './SectionHeading';
import FramedImage from './FramedImage';
import Lightbox from './Lightbox';
import Reveal from './Reveal';

function PackageCard({ pkg, onOpenImage }) {
  const [itineraryOpen, setItineraryOpen] = useState(false);

  return (
    <article
      aria-label={`Package: ${pkg.name}`}
      style={{
        background: 'white',
        border: '1px solid rgba(212,149,106,0.2)',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 2px 20px rgba(28,15,10,0.06)',
        transition: 'box-shadow 0.3s, transform 0.3s',
      }}
      onMouseOver={e => {
        e.currentTarget.style.boxShadow = '0 8px 40px rgba(28,15,10,0.12)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.boxShadow = '0 2px 20px rgba(28,15,10,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Featured badge */}
      {pkg.featured && (
        <div style={{
          background: 'var(--color-brand-red)',
          color: 'white',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          padding: '0.3rem 1rem',
          textAlign: 'center',
        }}>
          ✦ Featured Package
        </div>
      )}

      {/* Image — framed poster */}
      {/* TRIAL IMAGE — see siteData.packages[*].image */}
      <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '320px' }}>
          <FramedImage
            src={pkg.image}
            alt={pkg.imageAlt}
            rotation="0deg"
            onOpen={onOpenImage}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem' }}>
        {/* Meta info */}
        <div style={{
          display: 'flex',
          gap: '1.2rem',
          flexWrap: 'wrap',
          marginBottom: '0.8rem',
        }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            fontFamily: 'var(--font-sans)', fontSize: '0.72rem',
            color: 'var(--color-sand)', fontWeight: 500,
          }}>
            <MapPin size={11} /> {pkg.destination}
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            fontFamily: 'var(--font-sans)', fontSize: '0.72rem',
            color: 'var(--color-sand)', fontWeight: 500,
          }}>
            <Clock size={11} /> {pkg.duration}
          </span>
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
          fontWeight: 700,
          color: 'var(--color-brand-maroon)',
          margin: '0 0 0.7rem 0',
          lineHeight: 1.2,
        }}>
          {pkg.name}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.88rem',
          lineHeight: 1.75,
          color: 'var(--color-brown)',
          marginBottom: '1.2rem',
          fontStyle: pkg.description.startsWith('[') ? 'italic' : 'normal',
          opacity: pkg.description.startsWith('[') ? 0.55 : 1,
        }}>
          {pkg.description}
        </p>

        {/* Highlights */}
        {pkg.highlights && pkg.highlights.length > 0 && !pkg.highlights[0].startsWith('[') && (
          <ul style={{ listStyle: 'none', margin: '0 0 1.2rem 0', padding: 0 }}>
            {pkg.highlights.slice(0, 5).map(h => (
              <li key={h} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.82rem',
                color: 'var(--color-brown)',
                lineHeight: 1.5,
                marginBottom: '0.3rem',
              }}>
                <span style={{ color: 'var(--color-brand-red)', marginTop: '2px', flexShrink: 0 }}>✦</span>
                {h}
              </li>
            ))}
          </ul>
        )}

        {/* Price */}
        <div style={{
          marginBottom: '1.2rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(212,149,106,0.18)',
        }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-brown-light)',
          }}>
            Starting from
          </span>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: pkg.price ? 'var(--color-brand-maroon)' : 'var(--color-brown-light)',
            margin: '0.1rem 0 0',
            fontStyle: pkg.price ? 'normal' : 'italic',
          }}>
            {pkg.price || 'Price on Request'}
          </p>
        </div>

        {/* Itinerary toggle — only show if itinerary exists */}
        {pkg.itinerary && pkg.itinerary.length > 0 && (
          <div style={{ marginBottom: '1.2rem' }}>
            <button
              onClick={() => setItineraryOpen(o => !o)}
              aria-expanded={itineraryOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'none',
                border: '1px solid rgba(212,149,106,0.3)',
                borderRadius: '3px',
                padding: '0.5rem 0.9rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-brown-light)',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'space-between',
                transition: 'background 0.2s',
                minHeight: '44px',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(212,149,106,0.06)'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
            >
              <span>View Day-by-Day Itinerary</span>
              {itineraryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {itineraryOpen && (
              <div style={{ marginTop: '0.8rem' }}>
                {pkg.itinerary.map(day => (
                  <div key={day.day} style={{
                    marginBottom: '1rem',
                    paddingLeft: '1rem',
                    borderLeft: day.note
                      ? '2px dashed rgba(212,149,106,0.3)'
                      : '2px solid var(--color-brand-red)',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: day.note ? 'var(--color-brown-light)' : 'var(--color-brand-red)',
                      margin: '0 0 0.2rem 0',
                    }}>
                      Day {day.day} — {day.title}
                    </p>
                    {day.note && (
                      <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        fontStyle: 'italic',
                        color: 'var(--color-brown-light)',
                        margin: '0 0 0.3rem 0',
                        opacity: 0.7,
                      }}>
                        [{day.note}]
                      </p>
                    )}
                    <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
                      {day.activities.map((act, i) => (
                        <li key={i} style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.8rem',
                          color: 'var(--color-brown)',
                          lineHeight: 1.6,
                          fontStyle: act.startsWith('[') ? 'italic' : 'normal',
                          opacity: act.startsWith('[') ? 0.5 : 1,
                        }}>
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WhatsApp CTA */}
        <a
          href={getWhatsAppLink(pkg.ctaMessage)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: 'var(--color-brand-red)',
            color: 'white',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            padding: '0.85rem 1.5rem',
            borderRadius: '3px',
            minHeight: '48px',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#a00d24'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--color-brand-red)'}
        >
          <Send size={14} />
          Enquire on WhatsApp
        </a>
      </div>
    </article>
  );
}

export default function Packages() {
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' });
  const openLightbox = (src, alt) => setLightbox({ open: true, src, alt });
  const closeLightbox = () => setLightbox({ open: false, src: '', alt: '' });

  return (
    <>
      <section
        id="packages"
        aria-labelledby="packages-heading"
        className="bg-parchment"
        style={{ padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <SectionHeading
              label="Curated Experiences"
              heading="Travel Packages"
              subtext="Hand-crafted itineraries built for those who seek more than sightseeing."
            />
          </Reveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {packages.map((pkg, i) => (
              <Reveal key={pkg.id} className={`reveal-delay-${(i % 3) + 1}`}>
                <PackageCard pkg={pkg} onOpenImage={openLightbox} />
              </Reveal>
            ))}
          </div>
        </div>
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
