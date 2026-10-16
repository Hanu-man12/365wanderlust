// ============================================================
//  Preloader — 365 Wanderlust branded launch animation  (v3)
//
//  Refinements applied vs v2:
//  1. CRIMSON FLASH REMOVED — onDone() is now called via
//     onAnimationComplete on the door-open animation, no setTimeout.
//  2. Z-SHAPED INTERLOCKING DOOR EDGES — two clip-path panels
//     (top + bottom) with a matching zigzag seam that interlock
//     when closed, then slide apart (top up, bottom down) to
//     reveal the already-mounted site beneath.
//  3. "365" IN HEADING IS THE COUNTER — the separate counter
//     element is removed. The "365" part of the heading itself
//     counts from 1 → 365, tied to real page readiness.
//     tabular-nums + min-width prevents layout shift.
//  4. LOGO IMPORT — now uses brand.logo from siteData (same
//     source as Navbar), not a local direct asset import.
//
//  Sequence:
//  1. White bg. "[1→365] Wanderlust" + logo build in.
//     "Grab Your Leisure" caption appears beneath.
//     "365" counts up tied to real page readiness.
//  2. Counter hits 365 → 650ms hold.
//  3. Letters disassemble scattered. Caption fades. Logo fades.
//  4. Brief blank white pause.
//  5. TWO DOOR PANELS: crimson top panel slides UP, bottom panel
//     slides DOWN simultaneously, revealing the real site.
//  6. onAnimationComplete fires → onDone() → preloader unmounts.
//     No extra crimson flash — site was already rendered beneath.
//
//  Loading sync: window 'load' + MIN_DISPLAY minimum + MAX_WAIT safeguard.
//  Reduced-motion: simple branded fade.
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { brand } from '../data/siteData';

// ── Brand constants ────────────────────────────────────────────
const BRAND_RED   = '#D0112B';
const BRAND_WHITE = '#ffffff';

// ── Timing ────────────────────────────────────────────────────
const MIN_DISPLAY    = 2400;  // ms — minimum preloader display time
const MAX_WAIT       = 8000;  // ms — safeguard: always reveal within this
const HOLD_AFTER_100 =  650;  // ms — pause at 100% before disassembly

// ── Heading / scatter ─────────────────────────────────────────
const HEADING      = '365 Wanderlust';
const CHARS        = HEADING.split('');
// Non-uniform scatter order (deterministic "random" feel)
const SCATTER_ORDER = [2, 8, 0, 12, 5, 10, 3, 13, 1, 7, 11, 4, 6, 9];
const EXIT_DELAYS  = CHARS.map((_, i) => {
  const pos = SCATTER_ORDER.indexOf(i);
  return (pos >= 0 ? pos : i) * 0.055;
});
const MAX_EXIT_DELAY = Math.max(...EXIT_DELAYS);

// ── useLoadingProgress hook ────────────────────────────────────
function useLoadingProgress(onComplete) {
  const [progress, setProgress]  = useState(0);
  const resolvedRef   = useRef(false);
  const startTimeRef  = useRef(Date.now());
  const progressRef   = useRef(0);
  const rafRef        = useRef(null);
  const safeguardRef  = useRef(null);

  const resolve = useCallback(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    if (safeguardRef.current) clearTimeout(safeguardRef.current);
    if (rafRef.current)       cancelAnimationFrame(rafRef.current);
    const from  = progressRef.current;
    const start = performance.now();
    const dur   = 400;
    function tick(now) {
      const t   = Math.min((now - start) / dur, 1);
      const val = from + (100 - from) * t;
      progressRef.current = val;
      setProgress(Math.round(val));
      if (t < 1) { rafRef.current = requestAnimationFrame(tick); }
      else        { setProgress(100); onComplete(); }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [onComplete]);

  useEffect(() => {
    let cancelled = false;
    safeguardRef.current = setTimeout(() => { if (!cancelled) resolve(); }, MAX_WAIT);

    const SOFT_TARGET = 82;
    const SOFT_SPEED  = 0.06;
    function easeProgress() {
      if (resolvedRef.current || cancelled) return;
      const elapsed  = (Date.now() - startTimeRef.current) / 1000;
      const natural  = SOFT_TARGET * (1 - Math.exp(-SOFT_SPEED * elapsed * 60));
      progressRef.current = Math.max(progressRef.current, Math.min(natural, SOFT_TARGET));
      setProgress(Math.round(progressRef.current));
      rafRef.current = requestAnimationFrame(easeProgress);
    }
    rafRef.current = requestAnimationFrame(easeProgress);

    const checkReady = () => {
      if (cancelled) return;
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= MIN_DISPLAY) { resolve(); }
      else { setTimeout(() => { if (!cancelled) resolve(); }, MIN_DISPLAY - elapsed); }
    };

    if (document.readyState === 'complete') { checkReady(); }
    else { window.addEventListener('load', checkReady, { once: true }); }

    return () => {
      cancelled = true;
      if (rafRef.current)       cancelAnimationFrame(rafRef.current);
      if (safeguardRef.current) clearTimeout(safeguardRef.current);
      window.removeEventListener('load', checkReady);
    };
  }, [resolve]);

  return progress;
}

// ══════════════════════════════════════════════════════════════
//  PRELOADER COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Preloader({ onDone }) {
  // phases: 'counting' → 'disassembling' → 'logoFading' → 'sliding' → 'done'
  const [phase, setPhase]  = useState('counting');
  const phaseRef           = useRef('counting');
  const reducedMotion      = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const advancePhase = useCallback((next) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  // ── Counter complete → hold → disassemble ──
  const handleLoadComplete = useCallback(() => {
    if (phaseRef.current !== 'counting') return;
    setTimeout(() => {
      if (reducedMotion) {
        advancePhase('sliding'); // skip letter disassembly for reduced-motion
      } else {
        advancePhase('disassembling');
      }
    }, HOLD_AFTER_100);
  }, [advancePhase, reducedMotion]);

  const progress = useLoadingProgress(handleLoadComplete);

  // disassembling → logoFading  (wait for last letter to exit)
  useEffect(() => {
    if (phase !== 'disassembling') return;
    const ms = (MAX_EXIT_DELAY + 0.35) * 1000;
    const t  = setTimeout(() => advancePhase('logoFading'), ms);
    return () => clearTimeout(t);
  }, [phase, advancePhase]);

  // logoFading → sliding  (logo fade 400ms + 200ms pause)
  useEffect(() => {
    if (phase !== 'logoFading') return;
    const t = setTimeout(() => advancePhase('sliding'), 600);
    return () => clearTimeout(t);
  }, [phase, advancePhase]);

  // NOTE: sliding → done is now handled by onAnimationComplete on
  // the door panels (see JSX below). No setTimeout here — this
  // removes the ~300ms crimson flash that was caused by the old
  // setTimeout(onDone, 900) firing AFTER the door animation finished.

  // Lock scroll + pointer events while preloader is active
  useEffect(() => {
    document.body.style.overflow       = 'hidden';
    document.body.style.pointerEvents  = 'none';
    return () => {
      document.body.style.overflow      = '';
      document.body.style.pointerEvents = '';
    };
  }, []);

  // ── Derived flags ──
  const isDisassembling = phase === 'disassembling' || phase === 'logoFading' || phase === 'sliding';
  const isLogoFading    = phase === 'logoFading'    || phase === 'sliding';
  const isSliding       = phase === 'sliding';

  // ── Counter value: progress 0→100 maps to display 1→365 ──
  const counterValue = Math.round(1 + (Math.min(progress, 100) / 100) * 364);

  // ══════════════════════════════════════════════
  //  REDUCED-MOTION: simple branded fade
  // ══════════════════════════════════════════════
  if (reducedMotion) {
    return (
      <motion.div
        key="preloader-rm"
        initial={{ opacity: 1 }}
        animate={{ opacity: isSliding ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        onAnimationComplete={() => {
          if (isSliding) {
            advancePhase('done');
            onDone();
          }
        }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: isSliding ? BRAND_RED : BRAND_WHITE,
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
          padding: 'clamp(2rem, 8vw, 6rem)',
          transition: 'background 0.4s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={brand.logo} alt="" aria-hidden="true"
            style={{ width: 64, height: 64, objectFit: 'contain' }} />
          <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800, fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 6vw, 3.5rem)',
            color: BRAND_RED, letterSpacing: '-0.02em', lineHeight: 1,
          }}>
            365 Wanderlust
          </span>
        </div>
        <div style={{
          marginTop: '1rem',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: 'clamp(0.7rem, 1.8vw, 1rem)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: BRAND_RED,
        }}>
          Grab Your Leisure
        </div>
      </motion.div>
    );
  }

  // ══════════════════════════════════════════════
  //  FULL ANIMATION
  // ══════════════════════════════════════════════
  return (
    <>
      {/* ── LAYER 1: White preloader content panel ── */}
      <motion.div
        key="preloader-content"
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: BRAND_WHITE,
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
          paddingLeft:   'clamp(1.5rem, 6vw, 7rem)',
          paddingRight:  'clamp(1.5rem, 6vw, 7rem)',
          paddingTop:    'clamp(1.5rem, 4vw, 4rem)',
          paddingBottom: 'clamp(1.5rem, 4vw, 4rem)',
          overflow: 'hidden',
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isSliding ? 0 : 1 }}
        transition={{ duration: 0.35, ease: 'easeIn' }}
      >
        {/* ── Main row: Heading (with animated counter) + Logo ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'nowrap',
          maxWidth: '100%',
          '--pl-h': 'clamp(1.6rem, 5.8vw, 6rem)',
        }}>

          {/* ── Heading: [animated 365] + [ Wanderlust chars] ── */}
          <div
            role="heading" aria-level={1} aria-label={HEADING}
            style={{
              display: 'flex', flexDirection: 'row', alignItems: 'center',
              flexShrink: 1, minWidth: 0,
              fontSize: 'var(--pl-h)',
              marginRight: '0.15em',
            }}
          >
            {/*
              ── ANIMATED COUNTER REPLACING "365" CHARS ──────────────────
              Replaces individual char spans for indices 0,1,2 ('3','6','5').
              - tabular-nums: prevents layout shift as digit count changes
              - minWidth: '2.2ch' holds space for 3 digits so " Wanderlust"
                doesn't jump sideways during 1→9 (1 digit) → 10→99 (2 digits)
                → 100→365 (3 digits)
              - Uses EXIT_DELAYS[0] for the exit scatter (earliest exit)
              - Same font, color, style, size as the rest of the heading
              ─────────────────────────────────────────────────────────────
            */}
            <motion.span
              key="counter"
              aria-hidden="true"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontStyle: 'italic',
                fontSize: 'inherit',
                lineHeight: 1,
                color: BRAND_RED,
                letterSpacing: '-0.02em',
                display: 'inline-block',
                minWidth: '2.2ch',
                fontVariantNumeric: 'tabular-nums',
              }}
              initial={{ opacity: 0, y: 22 }}
              animate={{
                opacity: isDisassembling ? 0 : 1,
                y:       isDisassembling ? -20 : 0,
                scale:   isDisassembling ? 0.82 : 1,
              }}
              transition={
                isDisassembling
                  ? {
                      opacity: { duration: 0.28, delay: EXIT_DELAYS[0] },
                      y:       { duration: 0.28, delay: EXIT_DELAYS[0] },
                      scale:   { duration: 0.28, delay: EXIT_DELAYS[0] },
                    }
                  : {
                      opacity: { duration: 0.45, delay: 0.05 },
                      y:       { duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] },
                    }
              }
            >
              {counterValue}
            </motion.span>

            {/* ── " Wanderlust" chars (CHARS[3..13], i.e. space + W-a-n-d-e-r-l-u-s-t) ── */}
            {CHARS.slice(3).map((char, relIdx) => {
              const i = relIdx + 3; // original index in CHARS / EXIT_DELAYS
              return (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontStyle: 'italic',
                    fontSize: 'inherit',
                    lineHeight: 1,
                    color: BRAND_RED,
                    letterSpacing: char === ' ' ? '0.18em' : '-0.02em',
                    display: 'inline-block',
                    whiteSpace: 'pre',
                    minWidth: char === ' ' ? '0.18em' : 'auto',
                  }}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{
                    opacity: isDisassembling ? 0 : 1,
                    y:       isDisassembling ? -20 : 0,
                    scale:   isDisassembling ? 0.82 : 1,
                  }}
                  transition={
                    isDisassembling
                      ? {
                          opacity: { duration: 0.28, delay: EXIT_DELAYS[i] },
                          y:       { duration: 0.28, delay: EXIT_DELAYS[i] },
                          scale:   { duration: 0.28, delay: EXIT_DELAYS[i] },
                        }
                      : {
                          opacity: { duration: 0.45, delay: 0.05 + i * 0.035 },
                          y:       { duration: 0.45, delay: 0.05 + i * 0.035, ease: [0.22, 1, 0.36, 1] },
                        }
                  }
                >
                  {char}
                </motion.span>
              );
            })}
          </div>

          {/* ── Logo mark ──
              Same asset as Navbar (brand.logo from siteData).
              marginLeft provides gap from heading text. */}
          <motion.div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              fontSize: 'var(--pl-h)',
              marginLeft: '0.15em',
            }}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{
              opacity: isLogoFading ? 0 : 1,
              scale:   isLogoFading ? 0.65 : 1,
            }}
            transition={
              isLogoFading
                ? { duration: 0.4, ease: 'easeOut' }
                : { duration: 0.5, delay: 0.18, ease: [0.34, 1.56, 0.64, 1] }
            }
          >
            <img
              src={brand.logo}
              alt=""
              aria-hidden="true"
              style={{
                width:  '1.15em',
                height: '1.15em',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </motion.div>
        </div>

        {/* ── Tagline: "Grab Your Leisure" ── */}
        <motion.div
          style={{
            fontSize: 'var(--pl-h)',
            marginTop: '0.5em',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isDisassembling ? 0 : 0.72 }}
          transition={
            isDisassembling
              ? { duration: 0.3, delay: EXIT_DELAYS[4] }
              : { duration: 0.55, delay: 0.65 }
          }
        >
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(0.6rem, 1.2vw, 1.1rem)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: BRAND_RED,
            lineHeight: 1.6,
          }}>
            Grab Your
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(0.6rem, 1.2vw, 1.1rem)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: BRAND_RED,
            lineHeight: 1.6,
          }}>
            Leisure
          </div>
        </motion.div>

        {/* ── Progress bar (bottom edge) ── */}
        <motion.div
          style={{
            position: 'absolute', bottom: 0, left: 0,
            height: '3px',
            background: BRAND_RED,
          }}
          initial={{ width: '0%', opacity: 0.4 }}
          animate={{
            width:   isDisassembling ? '100%' : `${progress}%`,
            opacity: isDisassembling ? 0 : 0.4,
          }}
          transition={{
            width:   { duration: isDisassembling ? 0.25 : 0.12, ease: 'easeOut' },
            opacity: { duration: 0.28 },
          }}
        />
      </motion.div>

      {/*
        ── LAYER 2: Z-SHAPED INTERLOCKING DOOR PANELS ────────────────────
        Two crimson panels that interlock along a zigzag seam at the
        vertical center of the screen. When closed (phase !== 'sliding')
        they cover the entire viewport with no gap. When isSliding fires,
        the top panel translates -100% (up) and the bottom panel +100%
        (down) simultaneously, revealing the already-mounted site beneath.

        CLIP-PATH GEOMETRY:
        ─────────────────────────────────────────────────────────────────
        Top panel — covers the upper half with a zigzag BOTTOM edge:
          polygon(
            0% 0%,      ← top-left corner
            100% 0%,    ← top-right corner
            100% 55%,   ← bottom-right starts at 55% height (below center)
            60% 45%,    ← steps up to 45% at 60% width
            40% 55%,    ← steps down to 55% at 40% width (Z middle step)
            0% 45%      ← bottom-left ends at 45% height (above center)
          )

        Bottom panel — covers the lower half with a zigzag TOP edge that
        is a PERFECT COMPLEMENT of the top panel bottom edge:
          polygon(
            0% 45%,     ← top-left starts at 45% (same as top panel left)
            40% 55%,    ← steps down to 55% at 40% width
            60% 45%,    ← steps up to 45% at 60% width
            100% 55%,   ← top-right at 55% (same as top panel right)
            100% 100%,  ← bottom-right corner
            0% 100%     ← bottom-left corner
          )

        The seam reads as:
          Left edge:  45% — steps to 55% — steps back to 45% — Right: 55%
          This creates a Z-shape rotated 90°, like a bolt/gate panel edge.

        Both panels use the full viewport (position:fixed, inset:0) as
        their coordinate space. The polygon percentages are viewport-
        relative so the geometry holds correctly at every screen size
        with no overflow or gap on resize.

        WHY NOT ANIMATE clip-path: The clip-path stays constant; only
        translateY is animated. This avoids the "same point count" motion
        interpolation requirement and gives a cleaner mechanical slide.
        ─────────────────────────────────────────────────────────────────
      */}

      {/* TOP DOOR PANEL — slides up */}
      {isSliding && (
        <motion.div
          key="door-top"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: BRAND_RED,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 55%, 60% 45%, 40% 55%, 0% 45%)',
            willChange: 'transform',
          }}
          initial={{ y: 0 }}
          animate={{ y: '-100%' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            // Fire onDone once both panels are off-screen.
            // Both panels have identical duration/easing, so top panel
            // completing = both panels done. Guard against double-fire
            // with phaseRef.
            if (phaseRef.current === 'sliding') {
              advancePhase('done');
              onDone();
            }
          }}
        />
      )}

      {/* BOTTOM DOOR PANEL — slides down */}
      {isSliding && (
        <motion.div
          key="door-bottom"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: BRAND_RED,
            clipPath: 'polygon(0% 45%, 40% 55%, 60% 45%, 100% 55%, 100% 100%, 0% 100%)',
            willChange: 'transform',
          }}
          initial={{ y: 0 }}
          animate={{ y: '100%' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        />
      )} 
    </>
  );
}
