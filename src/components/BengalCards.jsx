// ============================================================
//  BengalCards — 3D depth destination cards (Barhanti + Teesta)
//  Two premium cards with a click-to-open modal popup.
//  Uses motion from 'motion/react'.
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { prefillDestination } from '../utils/prefillDestination';

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
function BengalCard({ card, index, isDark, reducedMotion, isMobile, activeIndex, onSelect, cardW, cardH, onOpen }) {
  const [imgError, setImgError] = useState(false);

  const cardBg = isDark ? '#1a1a1a' : '#ffffff';
  const titleColor = isDark ? '#F8F6F3' : '#1a1a1a';
  const descColor = isDark ? '#a0a0a0' : '#666';

  // prefers-reduced-motion: skip the rotateY, keep the translateY lift
  const hoverProps = reducedMotion
    ? { y: -6, boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }
    : { rotateY: index === 0 ? -3 : 3, y: -6, boxShadow: '0 30px 80px rgba(0,0,0,0.4)' };

  // ── Carousel: one active card centered, neighbors peek with 3D depth ──
  const offset = index - activeIndex;
  const isActive = offset === 0;

  const peekX = isMobile ? '55%' : '50%';
  const peekRotateY = isMobile ? 12 : 8;
  const peekScale = isMobile ? 0.85 : 0.8;
  const peekOpacity = isMobile ? 0.5 : 0.4;

  let animate;
  if (offset === 0) {
    animate = { x: 0, rotateY: 0, scale: 1, opacity: 1, zIndex: 3 };
  } else {
    animate = {
      x: offset > 0 ? peekX : `-${peekX}`,
      rotateY: offset > 0 ? -peekRotateY : peekRotateY,
      scale: peekScale,
      opacity: peekOpacity,
      zIndex: 1,
    };
  }
  if (reducedMotion) {
    animate = { ...animate, rotateY: 0 };
  }

  const handleClick = () => { if (isActive) onOpen(); else onSelect(); };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={card.title}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
      whileHover={!isMobile && isActive ? hoverProps : undefined}
      animate={animate}
      transition={{ type: 'spring', stiffness: isMobile ? 280 : 300, damping: isMobile ? 30 : 25 }}
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
        cursor: 'pointer',
        background: cardBg,
        boxShadow: isActive ? '0 20px 60px rgba(0,0,0,0.42)' : '0 12px 40px rgba(0,0,0,0.25)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Image area (top portion) */}
      <div style={{ position: 'relative', height: isMobile ? '55%' : '65%', width: '100%' }}>
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

      {/* Content area (bottom portion) */}
      <div style={{
        padding: isMobile ? '0.75rem 0.85rem' : '1rem 1.25rem',
        height: isMobile ? '45%' : '35%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: isMobile ? '0.25rem' : '0.35rem',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: isMobile ? '1.15rem' : '1.5rem',
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
          href="#contact"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); prefillDestination('India', 'Bengal', card.title); }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#25D366',
            color: 'white',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: isMobile ? '0.68rem' : '0.78rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            padding: isMobile ? '0.4rem 0.8rem' : '0.55rem 1.1rem',
            borderRadius: 10,
            minHeight: isMobile ? 38 : 44,
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
            href="#contact"
            onClick={(e) => { e.preventDefault(); onClose(); prefillDestination('India', 'Bengal', card.title); }}
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

// ── Shared arrow button style ────────────────────────────────
const arrowBtnStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 44,
  height: 44,
  borderRadius: '50%',
  border: 'none',
  background: '#D0112B',
  color: '#fff',
  zIndex: 10,
  fontSize: '1.4rem',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// ── Main component ──────────────────────────────────────────
export default function BengalCards() {
  const [selected, setSelected] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDark = useDarkMode();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const cardW = isMobile ? Math.min(window.innerWidth - 60, 300) : 420;
  const cardH = isMobile ? 440 : 520;

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
      setActiveIndex((i) => Math.min(BENGAL_CARDS.length - 1, i + 1));
    }
    touchStartX.current = null;
  };

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === BENGAL_CARDS.length - 1;

  return (
    <div style={{ position: 'relative' }}>
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          perspective: isMobile ? '1000px' : '1200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          height: cardH + (isMobile ? 80 : 120),
          overflow: 'hidden',
        }}
      >
        {BENGAL_CARDS.map((card, index) => (
          <BengalCard
            key={card.id}
            card={card}
            index={index}
            isDark={isDark}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
            activeIndex={activeIndex}
            onSelect={() => setActiveIndex(index)}
            cardW={cardW}
            cardH={cardH}
            onOpen={() => setSelected(card)}
          />
        ))}

        {/* Left navigation arrow */}
        <button
          onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
          disabled={atStart}
          aria-label="Previous card"
          style={{ ...arrowBtnStyle, left: 0, opacity: atStart ? 0.3 : 1, cursor: atStart ? 'default' : 'pointer' }}
        >‹</button>

        {/* Right navigation arrow */}
        <button
          onClick={() => setActiveIndex((i) => Math.min(BENGAL_CARDS.length - 1, i + 1))}
          disabled={atEnd}
          aria-label="Next card"
          style={{ ...arrowBtnStyle, right: 0, opacity: atEnd ? 0.3 : 1, cursor: atEnd ? 'default' : 'pointer' }}
        >›</button>
      </div>

      {/* Pagination dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
        {BENGAL_CARDS.map((card, i) => (
          <button
            key={card.id}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to ${card.title}`}
            style={{
              width: i === activeIndex ? 20 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              background: i === activeIndex ? '#D0112B' : 'rgba(208,17,43,0.3)',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.3s, background 0.3s',
            }}
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
