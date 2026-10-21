// ============================================================
//  FanDeck — Interactive playing-card fan deck
//  9 destinations fanning out from a centre pivot
//  Uses motion from 'motion/react'
// ============================================================
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getWhatsAppLink } from '../utils/contactLinks';

// ── Responsive sizes ────────────────────────────────────────
function useCardSize() {
  const [size, setSize] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth <= 640) return 'mobile';
    if (window.innerWidth <= 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth <= 640) setSize('mobile');
      else if (window.innerWidth <= 1024) setSize('tablet');
      else setSize('desktop');
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}

const SIZES = {
  desktop: { w: 220, h: 320, spread: [0, 120, 220, 300, 360], rot: [0, 8, 16, 24, 32] },
  tablet:  { w: 190, h: 280, spread: [0, 100, 185, 255, 310], rot: [0, 8, 16, 24, 32] },
  mobile:  { w: 160, h: 240, spread: [0, 80,  150, 200, 240], rot: [0, 6, 12, 18, 24] },
};

// ── Dark mode hook ───────────────────────────────────────────
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

// ── Single Card ──────────────────────────────────────────────
function DestCard({ dest, isActive, onClick, cardW, cardH, rotate, translateX, zIndex, reducedMotion }) {
  const [imgError, setImgError] = useState(false);
  const isAvailable = dest.status === 'available';

  const transition = reducedMotion
    ? { duration: 0.18 }
    : { type: 'spring', stiffness: 280, damping: 28 };

  return (
    <motion.div
      onClick={onClick}
      animate={reducedMotion
        ? { opacity: isActive ? 1 : 0.72 }
        : {
            rotate,
            x: translateX,
            scale: isActive ? 1.05 : 1,
            zIndex,
          }
      }
      initial={false}
      transition={transition}
      style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        marginLeft: -cardW / 2,
        width: cardW,
        height: cardH,
        transformOrigin: 'bottom center',
        cursor: 'pointer',
        borderRadius: 12,
        boxShadow: isActive
          ? '0 12px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)'
          : '0 8px 32px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
      aria-label={`${dest.name} — ${isAvailable ? 'Available' : 'Coming Soon'}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      {/* Gradient background (always rendered) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(160deg, #c0102a 0%, #8a0c1c 100%)',
        borderRadius: 12,
      }} />

      {/* Destination image (layered above gradient, hidden on error) */}
      {!imgError && (
        <img
          src={dest.image}
          alt={dest.name}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 12,
            opacity: isAvailable ? 1 : 0.75,
          }}
          loading="lazy"
        />
      )}

      {/* Coming soon overlay tint */}
      {!isAvailable && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(20,0,5,0.35)',
          borderRadius: 12,
        }} />
      )}

      {/* Dark gradient scrim at bottom for text legibility */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '55%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0) 100%)',
        borderRadius: '0 0 12px 12px',
      }} />

      {/* Status badge — top right */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        padding: '3px 8px',
        borderRadius: 20,
        fontSize: '0.58rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-sans)',
        background: isAvailable ? 'rgba(34,197,94,0.9)' : 'rgba(217,119,6,0.9)',
        color: 'white',
        backdropFilter: 'blur(4px)',
        whiteSpace: 'nowrap',
      }}>
        {isAvailable ? 'Available' : 'Coming Soon'}
      </div>

      {/* Text at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '0.75rem',
        borderRadius: '0 0 12px 12px',
      }}>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'white',
          margin: 0,
          lineHeight: 1.15,
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
        }}>
          {dest.name}
        </p>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.62rem',
          color: 'rgba(255,255,255,0.82)',
          margin: '2px 0 0 0',
          lineHeight: 1.3,
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        }}>
          {dest.tagline}
        </p>
      </div>
    </motion.div>
  );
}

// ── Info Panel ───────────────────────────────────────────────
function InfoPanel({ dest, isDark, onClose }) {
  const isAvailable = dest.status === 'available';
  const scrollTarget = dest.id === 'rajasthan' ? '#rajasthan-destinations' : `#${dest.id}-destinations`;
  const waMsg = `Hello! I am interested in exploring ${dest.name}. Please share details about your packages.`;

  const panelBg = isDark ? '#1a1a1a' : '#fff';
  const panelBorder = isDark ? 'rgba(208,17,43,0.25)' : 'rgba(208,17,43,0.15)';
  const headingColor = isDark ? '#F8F6F3' : '#2d2d2d';
  const textColor = isDark ? '#a0a0a0' : '#666';

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      style={{
        padding: '1.25rem 1.5rem',
        background: panelBg,
        border: `1px solid ${panelBorder}`,
        borderRadius: 12,
        maxWidth: 420,
        margin: '1.5rem auto 0',
        position: 'relative',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      }}
      role="region"
      aria-label={`Details for ${dest.name}`}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close details panel"
        style={{
          position: 'absolute',
          top: 10,
          right: 12,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.1rem',
          color: textColor,
          lineHeight: 1,
          minWidth: 32,
          minHeight: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
        }}
      >
        ×
      </button>

      {isAvailable ? (
        <>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#D0112B',
            margin: '0 0 0.2rem 0',
            lineHeight: 1.1,
          }}>
            {dest.name}
          </h3>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.82rem',
            color: textColor,
            margin: '0 0 1rem 0',
          }}>
            {dest.tagline}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {dest.id !== 'bengal' && dest.id !== 'rajasthan' && (
              <a
                href={getWhatsAppLink(waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#25D366',
                  color: 'white',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: '0.55rem 1rem',
                  borderRadius: 8,
                  minHeight: 44,
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#1da851'}
                onMouseOut={e => e.currentTarget.style.background = '#25D366'}
              >
                📱 Plan My Trip
              </a>
            )}
            <a
              href={scrollTarget}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'transparent',
                color: '#D0112B',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '0.55rem 1rem',
                borderRadius: 8,
                border: '1px solid #D0112B',
                minHeight: 44,
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#D0112B'; e.currentTarget.style.color = 'white'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#D0112B'; }}
            >
              Scroll to details ↓
            </a>
          </div>
        </>
      ) : (
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.88rem',
          color: textColor,
          margin: 0,
          textAlign: 'center',
          padding: '0.5rem 0',
        }}>
          <span style={{ fontSize: '1.2rem' }}>🗺️</span><br />
          <strong style={{ color: headingColor }}>{dest.name}</strong> — Coming Soon<br />
          <span style={{ fontSize: '0.78rem' }}>Check back soon for updates!</span>
        </p>
      )}
    </motion.div>
  );
}

// ── Main FanDeck component ───────────────────────────────────
export default function FanDeck({ destinations }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const isDark = useDarkMode();
  const sizeKey = useCardSize();
  const reducedMotion = usePrefersReducedMotion();
  const { w: cardW, h: cardH, spread, rot } = SIZES[sizeKey];

  const deckRef = useRef(null);
  const dragStart = useRef(null);
  const touchStart = useRef(null);
  const isDragging = useRef(false);

  // Container needs enough height to show the full card height plus some padding
  // Cards pivot from bottom-center so height = cardH + some top buffer for rotated edges
  const containerH = cardH + 60;
  // Container width for the fan spread — must fit ±maxSpread + half card width
  const maxSpread = spread[spread.length - 1];
  const containerW = (maxSpread + cardW / 2) * 2 + 40;

  const getCardTransform = useCallback((destIndex) => {
    const offset = destIndex - activeIndex;
    const absOffset = Math.abs(offset);
    // Positions for offsets 0,1,2,3,4; clamp beyond 4
    const idx = Math.min(absOffset, spread.length - 1);
    const tx = offset >= 0 ? spread[idx] : -spread[idx];
    const r = offset >= 0 ? rot[idx] : -rot[idx];
    const z = 10 - absOffset;
    return { tx, r, z };
  }, [activeIndex, spread, rot]);

  const handleCardClick = (index) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      setPanelOpen(false);
    } else {
      // Toggle panel for active card
      setPanelOpen(p => !p);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, destinations.length - 1));
      setPanelOpen(false);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
      setPanelOpen(false);
    }
  };

  // Mouse drag
  const handleMouseDown = (e) => {
    dragStart.current = e.clientX;
    isDragging.current = false;
  };
  const handleMouseMove = (e) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    if (Math.abs(dx) > 8) isDragging.current = true;
  };
  const handleMouseUp = (e) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    if (Math.abs(dx) >= 50) {
      if (dx < 0) setActiveIndex(i => Math.min(i + 1, destinations.length - 1));
      else setActiveIndex(i => Math.max(i - 1, 0));
      setPanelOpen(false);
    }
    dragStart.current = null;
    setTimeout(() => { isDragging.current = false; }, 0);
  };

  // Touch swipe
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) >= 50) {
      if (dx < 0) setActiveIndex(i => Math.min(i + 1, destinations.length - 1));
      else setActiveIndex(i => Math.max(i - 1, 0));
      setPanelOpen(false);
    }
    touchStart.current = null;
  };

  if (reducedMotion) {
    // Reduced motion: simple horizontal list with opacity highlight
    return (
      <div
        style={{
          padding: '2rem 1rem',
          overflowX: 'auto',
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="group"
        aria-label="Explore India destinations"
      >
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {destinations.map((dest, i) => (
            <div
              key={dest.id}
              onClick={() => handleCardClick(i)}
              style={{
                width: cardW,
                height: cardH,
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: i === activeIndex ? 1 : 0.7,
                boxShadow: i === activeIndex
                  ? '0 8px 32px rgba(0,0,0,0.4)'
                  : '0 4px 16px rgba(0,0,0,0.2)',
                flexShrink: 0,
                position: 'relative',
                transition: 'opacity 0.18s',
              }}
              role="button"
              tabIndex={0}
              aria-label={`${dest.name} — ${dest.status === 'available' ? 'Available' : 'Coming Soon'}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(i); } }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #c0102a 0%, #8a0c1c 100%)' }} />
              <img
                src={dest.image}
                alt={dest.name}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: dest.status === 'available' ? 1 : 0.75 }}
                loading="lazy"
              />
              {dest.status !== 'available' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,0,5,0.35)' }} />
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0) 100%)' }} />
              <div style={{ position: 'absolute', top: 10, right: 10, padding: '3px 8px', borderRadius: 20, fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-sans)', background: dest.status === 'available' ? 'rgba(34,197,94,0.9)' : 'rgba(217,119,6,0.9)', color: 'white' }}>
                {dest.status === 'available' ? 'Available' : 'Coming Soon'}
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.75rem' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, color: 'white', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{dest.name}</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.82)', margin: '2px 0 0 0', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{dest.tagline}</p>
              </div>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {panelOpen && (
            <InfoPanel
              dest={destinations[activeIndex]}
              isDark={isDark}
              onClose={() => setPanelOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div>
      {/* Fan deck area — needs explicit height so cards don't collapse the container */}
      <div
        ref={deckRef}
        tabIndex={0}
        role="group"
        aria-label="Explore India destinations — use arrow keys to browse"
        aria-roledescription="fan deck"
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { dragStart.current = null; }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: containerW,
          height: containerH,
          margin: '0 auto',
          overflow: 'hidden',
          cursor: 'grab',
          touchAction: 'pan-y',
          outline: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {destinations.map((dest, i) => {
          const { tx, r, z } = getCardTransform(i);
          return (
            <DestCard
              key={dest.id}
              dest={dest}
              isActive={i === activeIndex}
              onClick={() => { if (!isDragging.current) handleCardClick(i); }}
              cardW={cardW}
              cardH={cardH}
              rotate={r}
              translateX={tx}
              zIndex={z}
              reducedMotion={false}
            />
          );
        })}
      </div>

      {/* Navigation dots */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.4rem',
          marginTop: '1rem',
        }}
        role="tablist"
        aria-label="Destination navigation"
      >
        {destinations.map((dest, i) => (
          <button
            key={dest.id}
            onClick={() => { setActiveIndex(i); setPanelOpen(false); }}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Select ${dest.name}`}
            style={{
              width: i === activeIndex ? 20 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              background: i === activeIndex ? '#D0112B' : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.2s, background 0.2s',
              minWidth: 8,
              minHeight: 8,
            }}
          />
        ))}
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {panelOpen && (
          <InfoPanel
            dest={destinations[activeIndex]}
            isDark={isDark}
            onClose={() => setPanelOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
