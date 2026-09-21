// ============================================================
//  FramedImage — Polaroid / Postcard Style Image Frame
//  Reusable everywhere framed images appear (hero, about,
//  journey, gallery, destinations, packages).
//  Accepts any aspect ratio — never distorts or crops.
//  Click opens lightbox (if onOpen prop provided).
// ============================================================
import React from 'react';

/**
 * @param {string}   src        - Image URL / imported asset
 * @param {string}   alt        - Descriptive alt text (required for a11y)
 * @param {string}   rotation   - CSS rotation e.g. '-3deg' (optional)
 * @param {string}   caption    - Small caption below the image (optional)
 * @param {string}   className  - Extra Tailwind/CSS classes on wrapper (optional)
 * @param {function} onOpen     - Callback when frame is clicked (opens lightbox)
 * @param {boolean}  eager      - true = eager loading (above fold); default lazy
 * @param {object}   style      - Extra inline styles on wrapper (optional)
 */
export default function FramedImage({
  src,
  alt,
  rotation = '0deg',
  caption = '',
  className = '',
  onOpen,
  eager = false,
  style = {},
}) {
  const handleClick = () => {
    if (onOpen) onOpen(src, alt);
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && onOpen) {
      e.preventDefault();
      onOpen(src, alt);
    }
  };

  return (
    <div
      className={`framed-image ${className}`}
      style={{
        transform: `rotate(${rotation})`,
        ...style,
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `View full image: ${alt}` : undefined}
    >
      {/* Image — object-contain keeps full poster visible, never crops */}
      <div
        style={{
          width: '100%',
          lineHeight: 0,
        }}
      >
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : undefined}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',       // preserves native aspect ratio — no distortion
            objectFit: 'contain', // entire poster visible, never cropped
          }}
        />
      </div>

      {/* Caption area (polaroid bottom strip) */}
      {caption && (
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            color: 'var(--color-brown-light)',
            textAlign: 'center',
            marginTop: '6px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
