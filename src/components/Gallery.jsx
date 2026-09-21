// ============================================================
//  Gallery — Editorial asymmetric / masonry-inspired layout
//  Varied frame sizes, slight offsets, lazy loading
//  All images from siteData.gallery — easily replaceable
// ============================================================
import React, { useState } from 'react';
import { gallery } from '../data/siteData';
import SectionHeading from './SectionHeading';
import FramedImage from './FramedImage';
import Lightbox from './Lightbox';
import Reveal from './Reveal';

// Size → max-width mapping for varied editorial feel
const SIZE_WIDTH = { large: '340px', medium: '260px', small: '200px' };

export default function Gallery() {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  const openLightbox = (src) => {
    const idx = gallery.findIndex(g => g.image === src);
    setLightbox({ open: true, index: idx >= 0 ? idx : 0 });
  };
  const closeLightbox = () => setLightbox(s => ({ ...s, open: false }));
  const prevImg = () => setLightbox(s => ({ ...s, index: (s.index - 1 + gallery.length) % gallery.length }));
  const nextImg = () => setLightbox(s => ({ ...s, index: (s.index + 1) % gallery.length }));

  const lightboxImages = gallery.map(g => ({ src: g.image, alt: g.alt }));

  return (
    <>
      <section
        id="gallery"
        aria-labelledby="gallery-heading"
        className="bg-ink"
        style={{
          padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <SectionHeading
              label="Visual Journal"
              heading="Gallery"
              subtext="A glimpse of the colours, textures and stories that await."
              theme="dark"
            />
          </Reveal>

          {/* Editorial asymmetric gallery grid */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            {gallery.map((item, i) => (
              <Reveal key={item.id} className={`reveal-delay-${(i % 4) + 1}`}>
                <div
                  style={{
                    width: SIZE_WIDTH[item.size] || '240px',
                    // Stagger vertical offset for masonry feel
                    marginTop: i % 3 === 1 ? '2rem' : i % 3 === 2 ? '4rem' : '0',
                  }}
                  className="gallery-item"
                >
                  {/* TRIAL IMAGE — see siteData.gallery[*].image */}
                  <FramedImage
                    src={item.image}
                    alt={item.alt}
                    rotation={item.rotation}
                    onOpen={openLightbox}
                  />
                </div>
              </Reveal>
            ))}
          </div>

          {/* Caption */}
          <Reveal>
            <p style={{
              textAlign: 'center',
              fontFamily: 'var(--font-script)',
              fontSize: '1.2rem',
              color: 'rgba(200,134,26,0.6)',
              marginTop: '3rem',
            }}>
              More memories in the making...
            </p>
          </Reveal>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .gallery-item { width: 100% !important; max-width: 340px; margin-top: 0 !important; }
          }
        `}</style>
      </section>

      <Lightbox
        isOpen={lightbox.open}
        images={lightboxImages}
        currentIndex={lightbox.index}
        onClose={closeLightbox}
        onPrev={prevImg}
        onNext={nextImg}
      />
    </>
  );
}
