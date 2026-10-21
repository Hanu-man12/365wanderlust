// ============================================================
//  RajasthanCards — Cover Flow destination cards (Pushkar + Alwar)
//  Two premium cards in a Cover Flow carousel with click-to-open modal.
//  Uses motion from 'motion/react'.
//  Structure mirrors BengalCards.jsx; only the animation differs
//  (Cover Flow instead of 3D depth cards).
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
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
const RAJASTHAN_CARDS = [
  {
    id: 'pushkar',
    image: '/destinations/pushkar.jpg',
    title: 'Pushkar Desert Escape',
    subtitle: 'Rajasthan',
    description: 'Desert camp, camel safari, golden-hour landscape.',
    whatsappMsg: 'Hello! I am interested in the Pushkar Desert Escape, Rajasthan. Please share travel package details.',
  },
  {
    id: 'alwar',
    image: '/destinations/alwar.png',
    title: 'Alwar + Sariska',
    subtitle: 'Rajasthan',
    description: 'Aravalli hills, Siliserh Lake, forest safari and heritage architecture.',
    whatsappMsg: 'Hello! I am interested in Alwar + Sariska, Rajasthan. Please share travel package details.',
  },
];

// ── Single Cover Flow card ──────────────────────────────────
function RajasthanCard({ card, index, activeIndex, isDark, reducedMotion, cardW, cardH, onOpen, onSelect }) {
  const [imgError, setImgError] = useState(false);

  const offset = index - activeIndex;
  const isActive = offset === 0;

  const cardBg = isDark ? '#1a1a1a' : '#ffffff';
  const mutedColor = isDark ? '#a0a0a0' : '#666';

  // Build the Cover Flow animate object per branch
  let animate;
  if (offset === 0) {
    animate = { x: 0, rotateY: 0, scale: 1.05, opacity: 1, zIndex: 3 };
  } else if (offset === -1) {
    animate = { x: '-52%', rotateY: 28, scale: 0.82, opacity: 0.65, zIndex: 2 };
  } else if (offset === 1) {
    animate = { x: '52%', rotateY: -28, scale: 0.82, opacity: 0.65, zIndex: 2 };
  } else {
    animate = {
      x: offset < 0 ? '-85%' : '85%',
      rotateY: offset < 0 ? 40 : -40,
      scale: 0.65,
      opacity: 0,
      zIndex: 1,
    };
  }
  // prefers-reduced-motion: skip rotation, keep x/scale/opacity
  if (reducedMotion) {
    animate = { ...animate, rotateY: 0 };
  }

  const handleSelect = () => {
    if (offset === 0) onOpen();
    else onSelect();
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={card.title}
      onClick={handleSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(); } }}
      initial={false}
      animate={animate}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -cardW / 2,
        marginTop: -cardH / 2,
        width: cardW,
        height: cardH,
        borderRadius: 20,
        overflow: 'hidden',
        transformOrigin: 'center center',
        cursor: 'pointer',
        boxShadow: isActive
          ? '0 24px 80px rgba(0,0,0,0.45)'
          : '0 12px 40px rgba(0,0,0,0.25)',
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
        background: cardBg,
      }}>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.4rem',
          fontWeight: 700,
          color: '#D0112B',
          margin: 0,
          lineHeight: 1.15,
        }}>{card.title}</h3>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.8rem',
          color: mutedColor,
          margin: 0,
        }}>{card.subtitle}</p>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.85rem',
          color: mutedColor,
          margin: 0,
          lineHeight: 1.6,
        }}>{card.description}</p>
        {/* stopPropagation so opening WhatsApp does NOT also open the modal */}
        <a
          href={getWhatsAppLink(card.whatsappMsg)}
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
function RajasthanModal({ card, isDark, onClose }) {
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
            href={getWhatsAppLink(card.whatsappMsg)}
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
export default function RajasthanCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const isDark = useDarkMode();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const CARD_W = isMobile ? Math.min(window.innerWidth - 40, 340) : 400;
  const CARD_H = isMobile ? 480 : 520;

  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx >= 50) {
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (dx <= -50) {
      setActiveIndex((i) => Math.min(RAJASTHAN_CARDS.length - 1, i + 1));
    }
    touchStartX.current = null;
  };

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === RAJASTHAN_CARDS.length - 1;

  return (
    <div style={{ position: 'relative' }}>
      {/* Cover Flow carousel — perspective + overflow hidden clip the cards */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          perspective: '1200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          height: CARD_H + 80,
          overflow: 'hidden',
        }}
      >
        {RAJASTHAN_CARDS.map((card, i) => (
          <RajasthanCard
            key={card.id}
            card={card}
            index={i}
            activeIndex={activeIndex}
            isDark={isDark}
            reducedMotion={reducedMotion}
            cardW={CARD_W}
            cardH={CARD_H}
            onOpen={() => setSelected(card)}
            onSelect={() => setActiveIndex(i)}
          />
        ))}

        {/* Left navigation arrow */}
        <button
          onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
          disabled={atStart}
          aria-label="Previous card"
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            background: '#D0112B',
            color: '#fff',
            cursor: atStart ? 'default' : 'pointer',
            opacity: atStart ? 0.3 : 1,
            zIndex: 10,
            fontSize: '1.4rem',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >‹</button>

        {/* Right navigation arrow */}
        <button
          onClick={() => setActiveIndex((i) => Math.min(RAJASTHAN_CARDS.length - 1, i + 1))}
          disabled={atEnd}
          aria-label="Next card"
          style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            background: '#D0112B',
            color: '#fff',
            cursor: atEnd ? 'default' : 'pointer',
            opacity: atEnd ? 0.3 : 1,
            zIndex: 10,
            fontSize: '1.4rem',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >›</button>
      </div>

      {/* Modal — rendered OUTSIDE the perspective container so the fixed
          overlay is anchored to the viewport (perspective would otherwise
          establish a containing block and overflow:hidden would clip it) */}
      <AnimatePresence>
        {selected && (
          <RajasthanModal
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
