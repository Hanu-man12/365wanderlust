// ============================================================
//  BengalCards — 3D depth destination cards (Barhanti + Teesta)
//  Two premium cards with a click-to-open modal popup.
//  Uses motion from 'motion/react'.
// ============================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getWhatsAppLink } from '../utils/contactLinks';

// ── Dark mode hook (same pattern as About.jsx / FanDeck.jsx) ──
function useDarkMode() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

// ── Reduced motion hook ──────────────────────────────────────
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

// ── Mobile hook (≤640px) ─────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 640;
  });
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

// ── Card data ────────────────────────────────────────────────
const BENGAL_CARDS = [
  {
    id: 'barhanti',
    image: '/destinations/barhanti.png',
    title: 'Barhanti',
    subtitle: 'Baranti',
    description: 'Lake, green hills, sunset.',
    whatsappMessage: 'Hello! I am interested in visiting Barhanti / Baranti, Bengal. Please share travel package details.',
  },
  {
    id: 'teesta',
    image: '/destinations/teesta.png',
    title: 'Teesta',
    subtitle: 'River Valley, North Bengal',
    description: 'Flowing river, Himalayan foothills, scenic North Bengal landscapes.',
    whatsappMessage: 'Hello! I am interested in visiting Teesta / Teeshta, North Bengal. Please share travel package details.',
  },
];

// ── Single 3D card ───────────────────────────────────────────
function BengalCard({ card, index, isDark, reducedMotion, maxWidth, onOpen }) {
  const [imgError, setImgError] = useState(false);

  const cardBg = isDark ? '#1a1a1a' : '#ffffff';
  const titleColor = isDark ? '#F8F6F3' : '#1a1a1a';
  const descColor = isDark ? '#a0a0a0' : '#666';

  // prefers-reduced-motion: skip the rotateY, keep the translateY lift
  const hoverProps = reducedMotion
    ? { y: -6, boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }
    : { rotateY: index === 0 ? -3 : 3, y: -6, boxShadow: '0 30px 80px rgba(0,0,0,0.4)' };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={card.title}
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
      whileHover={hoverProps}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        width: '100%',
        maxWidth,
        height: 520,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        background: cardBg,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        transformStyle: 'preserve-3d',
        position: 'relative',
      }}
    >
      {/* Image area (top 65%) */}
      <div style={{ position: 'relative', height: '65%', width: '100%' }}>
        {/* crimson gradient fallback (shown when image fails) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(160deg, #c0102a 0%, #8a0c1c 100%)',
        }} />
        {!imgError && (
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            onError={() => setImgError(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        {/* scrim blending image into card body */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '55%',
          background: `linear-gradient(to top, ${cardBg} 0%, rgba(0,0,0,0) 100%)`,
        }} />
      </div>

      {/* Content area (bottom 35%) */}
      <div style={{
        padding: '1rem 1.25rem',
        height: '35%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.35rem',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: titleColor,
          margin: 0,
          lineHeight: 1.15,
        }}>{card.title}</h3>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#D0112B',
          margin: 0,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>{card.subtitle}</p>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.82rem',
          color: descColor,
          margin: 0,
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{card.description}</p>
        {/* stopPropagation so opening WhatsApp does NOT also open the modal */}
        <a
          href={getWhatsAppLink(card.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#25D366',
            color: 'white',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: '0.78rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            padding: '0.55rem 1.1rem',
            borderRadius: 10,
            minHeight: 44,
            alignSelf: 'flex-start',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#1da851'}
          onMouseOut={(e) => e.currentTarget.style.background = '#25D366'}
        >
          📱 Plan My Trip
        </a>
      </div>
    </motion.div>
  );
}

// ── Modal popup ──────────────────────────────────────────────
function BengalModal({ card, isDark, onClose }) {
  const [imgError, setImgError] = useState(false);

  const cardBg = isDark ? '#1a1a1a' : '#ffffff';
  const descColor = isDark ? '#a0a0a0' : '#666';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: cardBg,
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.4rem',
            color: isDark ? '#a0a0a0' : '#666',
            lineHeight: 1,
            minWidth: 36,
            minHeight: 36,
            zIndex: 2,
          }}
        >×</button>

        {/* Image */}
        <div style={{ position: 'relative', height: 260, width: '100%' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(160deg, #c0102a 0%, #8a0c1c 100%)',
          }} />
          {!imgError && (
            <img
              src={card.image}
              alt={card.title}
              onError={() => setImgError(true)}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '55%',
            background: `linear-gradient(to top, ${cardBg} 0%, rgba(0,0,0,0) 100%)`,
          }} />
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#D0112B',
            margin: '0 0 0.3rem 0',
            lineHeight: 1.15,
          }}>{card.title}</h3>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#D0112B',
            margin: '0 0 0.8rem 0',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>{card.subtitle}</p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.92rem',
            color: descColor,
            margin: '0 0 1.2rem 0',
            lineHeight: 1.6,
          }}>{card.description}</p>
          <a
            href={getWhatsAppLink(card.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              background: '#25D366',
              color: 'white',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '0.7rem 1.4rem',
              borderRadius: 10,
              minHeight: 48,
              width: '100%',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1da851'}
            onMouseOut={(e) => e.currentTarget.style.background = '#25D366'}
          >
            📱 Plan My Trip
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main component ──────────────────────────────────────────
export default function BengalCards() {
  const [selected, setSelected] = useState(null);
  const isDark = useDarkMode();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const maxWidth = isMobile ? 380 : 420;

  return (
    <div style={{ perspective: '1000px' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
      }}>
        {BENGAL_CARDS.map((card, index) => (
          <BengalCard
            key={card.id}
            card={card}
            index={index}
            isDark={isDark}
            reducedMotion={reducedMotion}
            maxWidth={maxWidth}
            onOpen={() => setSelected(card)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <BengalModal
            key={selected.id}
            card={selected}
            isDark={isDark}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
