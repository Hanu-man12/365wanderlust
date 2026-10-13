// ============================================================
//  Preloader — 365 Wanderlust branded launch animation  (v2)
//
//  Fixes applied vs v1:
//  1. Tagline "Grab Your Leisure" — was invisible due to opacity
//     conflict on parent/child elements. Fixed: opacity on motion
//     wrapper only, children inherit correctly.
//  2. Sliding-door reveal — was instant flash. Fixed: separate
//     motion.div crimson panel animates scaleY 0→1 (transform-origin
//     center), then preloader wrapper fades out on top of it.
//  3. Color — was light pink because opacity was animating to 0
//     on top of the crimson bg, making it translucent over white.
//     Fixed: crimson panel is a separate opaque full-cover div.
//  4. Desktop sizing — heading/logo/counter row was cramped.
//     Fixed: larger clamp maxes, bigger gap, bolder counter.
//
//  Sequence:
//  1. White bg. "365 Wanderlust" [logo] [counter] build in.
//     "Grab Your Leisure" caption appears beneath.
//     Counter counts 0→100 tied to real page readiness.
//  2. Counter hits 100 → 600ms hold.
//  3. Letters disassemble scattered. Caption fades. Logo fades.
//  4. Brief blank white pause.
//  5. SLIDING DOOR: thin crimson strip at center expands
//     vertically (scaleY 0→1, transform-origin center) to fill screen.
//  6. Once crimson fills screen → preloader unmounts, real site shows.
//
//  Loading sync: window 'load' + MIN_DISPLAY minimum + MAX_WAIT safeguard.
//  Reduced-motion: simple branded fade.
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoMark from '../assets/brand/logo-mark.png';

// ── Brand constants ────────────────────────────────────────────
const BRAND_RED   = '#D0112B';  // #D0112B — same token used site-wide
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
// Ties counter to real page readiness. Unchanged from v1 (confirmed working).
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

  // sliding → done  (sliding door expands 600ms + brief hold 200ms)
  useEffect(() => {
    if (phase !== 'sliding') return;
    const t = setTimeout(() => {
      advancePhase('done');
      onDone();
    }, 900); // door expand 600ms + 300ms before unmount
    return () => clearTimeout(t);
  }, [phase, advancePhase, onDone]);

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
          <img src={logoMark} alt="" aria-hidden="true"
            style={{ width: 48, height: 48, objectFit: 'contain' }} />
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
        {/*
          ── SIZING STRATEGY ─────────────────────────────────────────────
          Problem: independently-scaled vw values caused total row width
          to overflow viewport on mobile, and logo to collide with heading.

          Solution: one CSS custom property --h acts as the "base unit"
          (= heading font-size). All other sizes derive from it as fractions
          using calc(), so they scale together:
            Logo   = ~0.75× heading cap height ≈ 0.75 × 0.72 × --h = ~0.54×
            Counter= ~0.70× heading size
            Gaps   = proportional to --h so they grow/shrink with text

          --h values at each breakpoint:
            375px : clamp min = 1.6rem = 25.6px  → row ≈ 290px fits in ~310px ✓
            768px : 5.8vw = 44.5px               → row ≈ 510px fits in ~660px ✓
            1024px: 5.8vw = 59.4px               → row ≈ 680px fits in ~880px ✓
            1440px: 5.8vw = 83.5px               → row ≈ 960px fits in ~1300px ✓
            1920px: clamp max = 6rem = 96px       → row ≈ 1100px fits in ~1720px ✓

          "365 Wanderlust" has 14 chars (incl space).
          At --h=96px, avg char width ~0.55×96=52.8px → 14×52.8=739px heading
          + logo(~52px) + counter(~67px) + gaps(~60px) = ~918px
          Usable width at 1920px = 1920 - 2×(7rem≈112px) = 1696px → fine ✓

          At --h=25.6px (375px mobile):
          14×0.55×25.6=197px + logo(~14px) + counter(~18px) + gaps(~16px) = ~245px
          Usable = 375 - 2×24px = 327px → fine ✓
          ─────────────────────────────────────────────────────────────────
        */}

        {/* ── Main row: Heading + Logo + Counter ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'baseline',
          flexWrap: 'nowrap',
          maxWidth: '100%',
          // CSS custom property --h as base font size for proportional scaling.
          // All children reference it via 1em (since heading sets font-size = --h).
          '--pl-h': 'clamp(1.6rem, 5.8vw, 6rem)',
        }}>

          {/* ── Heading letters ── */}
          <div
            role="heading" aria-level={1} aria-label={HEADING}
            style={{
              display: 'flex', flexDirection: 'row', alignItems: 'baseline',
              flexShrink: 1, minWidth: 0,
              fontSize: 'var(--pl-h)',
              // Gap after heading group before logo: 0.35em of heading size
              marginRight: '0.35em',
            }}
          >
            {CHARS.map((char, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontStyle: 'italic',
                  fontSize: 'inherit',   // inherits --pl-h from parent div
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
            ))}
          </div>

          {/* ── Logo mark ──
              Size = 0.72em relative to heading (72% of heading cap-height area).
              marginRight = 0.5em gap before counter — LARGER than heading gap. */}
          <motion.div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              fontSize: 'var(--pl-h)',
              // Gap BETWEEN logo and counter — deliberately larger than heading→logo
              marginRight: '0.5em',
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
              src={logoMark}
              alt=""
              aria-hidden="true"
              style={{
                // 0.72em = proportional to heading, scales with it automatically
                width:  '0.72em',
                height: '0.72em',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </motion.div>

          {/* ── Counter ──
              0.75em relative to heading = slightly smaller, bold, prominent.
              No additional marginLeft needed — logo's marginRight handles gap. */}
          <motion.div
            style={{
              flexShrink: 0,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontStyle:  'normal',
              fontSize:   'calc(var(--pl-h) * 0.75)',
              color:      BRAND_RED,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              // Shift baseline up slightly so counter aligns with heading baseline
              alignSelf: 'baseline',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLogoFading ? 0 : 1 }}
            transition={
              isLogoFading
                ? { duration: 0.35, delay: 0.05 }
                : { duration: 0.4, delay: 0.32 }
            }
            aria-live="polite"
            aria-label={`Loading ${progress} percent`}
          >
            {String(progress).padStart(2, '0')}
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

      {/* ── LAYER 2: Crimson sliding-door panel ──────────────────
          Sits at z-index 9999 (above the white content panel).
          Starts as a thin horizontal strip at the vertical center
          and expands to fill the full screen vertically.

          Technique:
          - Full-width, full-height div with background BRAND_RED
          - scaleY starts at 0, animates to 1
          - transformOrigin: 'center' → expands both up AND down
            simultaneously from the center seam (sliding-door effect)
          - Only mounts/starts when phase === 'sliding'
          ────────────────────────────────────────────────────────*/}
      <AnimatePresence>
        {isSliding && (
          <motion.div
            key="sliding-door"
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: BRAND_RED,
              transformOrigin: 'center center',
              // No border-radius, no filter, no box-shadow — pure rectangle.
              borderRadius: 0,
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              duration: 0.45,
              // LINEAR easing = constant velocity = perfectly mechanical straight-edge wipe.
              // No acceleration/deceleration = no "organic" or "bouncy" look.
              // Game-style transitions always use linear or fast-easeIn here.
              ease: 'linear',
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
