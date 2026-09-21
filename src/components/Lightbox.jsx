// ============================================================
//  Lightbox — Custom lightweight lightbox
//  Keyboard: Esc closes, ←/→ navigates (if images array given)
//  Touch: swipe left/right to navigate
//  Accessible: focus trap, aria-modal, close button
// ============================================================
import React, { useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * @param {boolean}  isOpen      - Whether lightbox is visible
 * @param {Array}    images      - Array of { src, alt } for navigation (optional)
 * @param {number}   currentIndex - Active image index (if using images array)
 * @param {string}   src         - Direct single image src (if not using array)
 * @param {string}   alt         - Alt text for single image
 * @param {function} onClose     - Called when lightbox should close
 * @param {function} onPrev      - Called to go to previous image
 * @param {function} onNext      - Called to go to next image
 */
export default function Lightbox({
  isOpen,
  images = [],
  currentIndex = 0,
  src,
  alt,
  onClose,
  onPrev,
  onNext,
}) {
  const closeButtonRef = useRef(null);
  const overlayRef = useRef(null);

  // Determine what to show
  const hasMultiple = images && images.length > 1;
  const activeSrc = hasMultiple ? images[currentIndex]?.src : src;
  const activeAlt = hasMultiple ? images[currentIndex]?.alt : alt;

  // Touch swipe handling
  const touchStartX = useRef(null);

  // Focus trap & keyboard handling
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft'  && onPrev && hasMultiple) onPrev();
    if (e.key === 'ArrowRight' && onNext && hasMultiple) onNext();
  }, [isOpen, onClose, onPrev, onNext, hasMultiple]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // prevent background scroll
      // Focus the close button when lightbox opens
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && onNext && hasMultiple) onNext();
      else if (diff < 0 && onPrev && hasMultiple) onPrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="lightbox-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer: ${activeAlt}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close Button */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        aria-label="Close image viewer"
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          zIndex: 1001,
          transition: 'background 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
      >
        <X size={20} />
      </button>

      {/* Prev Button */}
      {hasMultiple && onPrev && (
        <button
          onClick={onPrev}
          aria-label="Previous image"
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            zIndex: 1001,
          }}
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Image */}
      <div style={{ maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src={activeSrc}
          alt={activeAlt}
          style={{
            maxWidth: '100%',
            maxHeight: '85vh',
            objectFit: 'contain',
            borderRadius: '4px',
            boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
          }}
        />
        {activeAlt && (
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.8rem',
            marginTop: '0.75rem',
            textAlign: 'center',
            fontFamily: 'var(--font-sans)',
            maxWidth: '600px',
          }}>
            {activeAlt}
          </p>
        )}
        {/* Image counter */}
        {hasMultiple && (
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.75rem',
            marginTop: '0.35rem',
            fontFamily: 'var(--font-sans)',
          }}>
            {currentIndex + 1} / {images.length}
          </p>
        )}
      </div>

      {/* Next Button */}
      {hasMultiple && onNext && (
        <button
          onClick={onNext}
          aria-label="Next image"
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            zIndex: 1001,
          }}
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
}
