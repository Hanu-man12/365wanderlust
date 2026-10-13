// ============================================================
//  Preloader — 365 Wanderlust branded launch animation
//
//  Sequence:
//  1. White background. "365 Wanderlust" heading + logo + counter
//     appear. Counter counts 0→100 tied to real page readiness.
//  2. Counter hits 100 → brief hold (0.6s).
//  3. Heading letters disappear individually (scattered stagger).
//     "Grab Your Leisure" caption fades out simultaneously.
//  4. Logo mark fades out last.
//  5. Brief blank white pause (0.3s).
//  6. Background transitions white → crimson.
//  7. Preloader fades out → real site revealed.
//
//  Reduced-motion: simple fade instead of letter-by-letter.
//  Safeguard: preloader always resolves within MAX_WAIT ms.
//
//  Uses: motion@14.2.0 (already installed).
//  Does NOT install or import framer-motion.
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import logoMark from '../assets/brand/logo-mark.png';

// ── Constants ──────────────────────────────────────────────────
const BRAND_RED    = '#D0112B';
const BRAND_WHITE  = '#ffffff';
const MIN_DISPLAY  = 2200;   // ms — minimum time preloader shows even if page loads instantly
const MAX_WAIT     = 8000;   // ms — safeguard: reveal site no matter what after this
const HOLD_AFTER_100 = 600; // ms — pause at 100% before disassembly

// Heading string split into chars for per-letter animation
const HEADING = '365 Wanderlust';
const CHARS   = HEADING.split('');

// Scattered exit order — indices in a non-uniform order so letters
// don't all disappear left-to-right (feels random but is deterministic)
const SCATTER_ORDER = [2, 8, 0, 12, 5, 10, 3, 13, 1, 7, 11, 4, 6, 9];
// Exit delay (seconds) per character, derived from scatter order
const EXIT_DELAYS = CHARS.map((_, i) => {
  const pos = SCATTER_ORDER.indexOf(i);
  return (pos >= 0 ? pos : i) * 0.055; // ~55ms between each disappearance
});

// ── Loading progress hook ──────────────────────────────────────
// Tracks real page readiness and returns a progress value 0-100.
// Ties to: document.readyState, window 'load', hero image load.
function useLoadingProgress(onComplete) {
  const [progress, setProgress] = useState(0);
  const resolvedRef    = useRef(false);
  const startTimeRef   = useRef(Date.now());
  const progressRef    = useRef(0);
  const rafRef         = useRef(null);
  const safeguardRef   = useRef(null);

  const resolve = useCallback(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    if (safeguardRef.current) clearTimeout(safeguardRef.current);
    if (rafRef.current)        cancelAnimationFrame(rafRef.current);
    // Smoothly animate remaining progress → 100
    // Never let it jump; just accelerate to 100 over 400ms
    const from = progressRef.current;
    const start = performance.now();
    const duration = 400;
    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const val = from + (100 - from) * t;
      progressRef.current = val;
      setProgress(Math.round(val));
      if (t < 1) { rafRef.current = requestAnimationFrame(tick); }
      else        { setProgress(100); onComplete(); }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [onComplete]);

  useEffect(() => {
    // React Strict Mode guard — only run once
    let cancelled = false;

    // Safeguard: always resolve after MAX_WAIT ms
    safeguardRef.current = setTimeout(() => {
      if (!cancelled) resolve();
    }, MAX_WAIT);

    // Smooth progress toward ~85% while waiting for real load signal.
    // Uses eased ramp so it looks responsive but never falsely hits 100.
    const SOFT_TARGET  = 82;   // never exceeds this on fake easing
    const SOFT_SPEED   = 0.06; // lower = slower ramp
    function easeProgress() {
      if (resolvedRef.current || cancelled) return;
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      // Sigmoid-like easing: fast early, slows near target
      const natural = SOFT_TARGET * (1 - Math.exp(-SOFT_SPEED * elapsed * 60));
      progressRef.current = Math.max(progressRef.current, Math.min(natural, SOFT_TARGET));
      setProgress(Math.round(progressRef.current));
      rafRef.current = requestAnimationFrame(easeProgress);
    }
    rafRef.current = requestAnimationFrame(easeProgress);

    // Real readiness signals
    const checkReady = () => {
      if (cancelled) return;
      // Only resolve once MIN_DISPLAY has passed AND page is ready
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= MIN_DISPLAY) {
        resolve();
      } else {
        setTimeout(() => { if (!cancelled) resolve(); }, MIN_DISPLAY - elapsed);
      }
    };

    if (document.readyState === 'complete') {
      checkReady();
    } else {
      window.addEventListener('load', checkReady, { once: true });
    }

    return () => {
      cancelled = true;
      if (rafRef.current)     cancelAnimationFrame(rafRef.current);
      if (safeguardRef.current) clearTimeout(safeguardRef.current);
      window.removeEventListener('load', checkReady);
    };
  }, [resolve]);

  return progress;
}

// ── Main Preloader component ───────────────────────────────────
export default function Preloader({ onDone }) {
  const [phase, setPhase]     = useState('counting');
  // phases: 'counting' → 'disassembling' → 'logoFading' → 'transitioning' → 'done'
  const [bgColor, setBgColor] = useState(BRAND_WHITE);
  const phaseRef              = useRef('counting');
  const reducedMotion         = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const advancePhase = useCallback((next) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const handleLoadComplete = useCallback(() => {
    if (phaseRef.current !== 'counting') return;
    // Hold at 100 briefly, then start disassembly
    setTimeout(() => {
      if (reducedMotion) {
        // Skip elaborate animation — go straight to done
        advancePhase('done');
        onDone();
        return;
      }
      advancePhase('disassembling');
    }, HOLD_AFTER_100);
  }, [advancePhase, onDone, reducedMotion]);

  const progress = useLoadingProgress(handleLoadComplete);

  // After disassembly → logo fades (timed via the last letter's exit delay + duration)
  useEffect(() => {
    if (phase !== 'disassembling') return;
    const lastLetterDelay = Math.max(...EXIT_DELAYS);
    const totalDisassembly = (lastLetterDelay + 0.35) * 1000; // lastDelay + exit duration
    const t = setTimeout(() => advancePhase('logoFading'), totalDisassembly);
    return () => clearTimeout(t);
  }, [phase, advancePhase]);

  // After logo fades → brief pause → crimson bg transition
  useEffect(() => {
    if (phase !== 'logoFading') return;
    const t = setTimeout(() => {
      advancePhase('transitioning');
      setBgColor(BRAND_RED);
    }, 600); // logo fade duration 400ms + 200ms pause
    return () => clearTimeout(t);
  }, [phase, advancePhase]);

  // After crimson transition → call onDone to unmount preloader
  useEffect(() => {
    if (phase !== 'transitioning') return;
    const t = setTimeout(() => {
      advancePhase('done');
      onDone();
    }, 700); // crimson bg transition 500ms + 200ms overlap
    return () => clearTimeout(t);
  }, [phase, advancePhase, onDone]);

  // Lock scroll while preloader is showing
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    return () => {
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    };
  }, []);

  // ── Reduced-motion: simple branded fade ──
  if (reducedMotion) {
    return (
      <motion.div
        key="preloader-reduced"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: BRAND_WHITE,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={logoMark} alt="" aria-hidden="true" style={{ width: 40, height: 40, objectFit: 'contain' }} />
          <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800, fontStyle: 'italic',
            fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
            color: BRAND_RED, letterSpacing: '-0.02em',
          }}>
            365 Wanderlust
          </span>
        </div>
      </motion.div>
    );
  }

  // ── Full animation ──
  const isDisassembling = phase === 'disassembling' || phase === 'logoFading' || phase === 'transitioning';
  const isLogoFading    = phase === 'logoFading' || phase === 'transitioning';

  return (
    <motion.div
      key="preloader"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'center',
        padding: 'clamp(2rem, 8vw, 6rem)',
        overflow: 'hidden',
        background: bgColor,
        transition: 'background 0.5s ease',
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'transitioning' ? 0 : 1 }}
      transition={{ duration: 0.5, delay: phase === 'transitioning' ? 0.2 : 0 }}
    >
      {/* ── Main row: Heading + Logo + Counter ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'nowrap',
        gap: 'clamp(0.4rem, 1.5vw, 0.9rem)',
        maxWidth: '100%',
        overflow: 'visible',
      }}>

        {/* ── Heading letters (individually animated) ── */}
        <div
          role="heading" aria-level={1} aria-label={HEADING}
          style={{
            display: 'flex', flexDirection: 'row', alignItems: 'baseline',
            flexShrink: 1, minWidth: 0,
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
                fontSize: 'clamp(2rem, 7.5vw, 5.5rem)',
                lineHeight: 1,
                color: BRAND_RED,
                letterSpacing: char === ' ' ? '0.2em' : '-0.01em',
                display: 'inline-block',
                whiteSpace: 'pre',
                // Prevent layout shift during exit — keep space holding
                minWidth: char === ' ' ? '0.2em' : 'auto',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isDisassembling ? 0 : 1,
                y: isDisassembling ? -18 : 0,
                scale: isDisassembling ? 0.85 : 1,
              }}
              transition={
                isDisassembling
                  ? {
                      opacity:  { duration: 0.28, delay: EXIT_DELAYS[i] },
                      y:        { duration: 0.28, delay: EXIT_DELAYS[i] },
                      scale:    { duration: 0.28, delay: EXIT_DELAYS[i] },
                    }
                  : {
                      opacity: { duration: 0.45, delay: 0.05 + i * 0.035 },
                      y:       { duration: 0.45, delay: 0.05 + i * 0.035 },
                    }
              }
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* ── Logo mark ── */}
        <motion.div
          style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isLogoFading ? 0 : 1,
            scale:   isLogoFading ? 0.7 : 1,
          }}
          transition={
            isLogoFading
              ? { duration: 0.4, ease: 'easeOut' }
              : { duration: 0.5, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }
          }
        >
          <img
            src={logoMark}
            alt=""
            aria-hidden="true"
            style={{
              width: 'clamp(2rem, 5vw, 3.8rem)',
              height: 'clamp(2rem, 5vw, 3.8rem)',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </motion.div>

        {/* ── Counter ── */}
        <motion.div
          style={{
            flexShrink: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(1.2rem, 4vw, 3rem)',
            color: BRAND_RED,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            opacity: 0.85,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLogoFading ? 0 : 0.85 }}
          transition={
            isLogoFading
              ? { duration: 0.35, delay: 0.05 }
              : { duration: 0.4, delay: 0.3 }
          }
          aria-live="polite"
          aria-label={`Loading ${progress} percent`}
        >
          {progress}
        </motion.div>
      </div>

      {/* ── Caption: "Grab Your Leisure" ── */}
      <motion.div
        style={{
          marginTop: 'clamp(0.8rem, 2.5vw, 1.4rem)',
          paddingLeft: '0.1em',  // subtle left indent aligning with heading baseline
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isDisassembling ? 0 : 1 }}
        transition={
          isDisassembling
            ? { duration: 0.35, delay: EXIT_DELAYS[4] } // fades with early-mid letters
            : { duration: 0.5, delay: 0.55 }
        }
      >
        {/* Line 1 */}
        <div style={{
          fontFamily: "'DM Sans', monospace",
          fontWeight: 400,
          fontSize: 'clamp(0.65rem, 1.6vw, 1rem)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: BRAND_RED,
          opacity: 0.7,
          lineHeight: 1.5,
        }}>
          Grab Your
        </div>
        {/* Line 2 */}
        <div style={{
          fontFamily: "'DM Sans', monospace",
          fontWeight: 400,
          fontSize: 'clamp(0.65rem, 1.6vw, 1rem)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: BRAND_RED,
          opacity: 0.7,
          lineHeight: 1.5,
        }}>
          Leisure
        </div>
      </motion.div>

      {/* ── Thin progress bar at bottom ── */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0, left: 0,
          height: '2px',
          background: BRAND_RED,
          opacity: 0.35,
        }}
        initial={{ width: '0%' }}
        animate={{
          width: isDisassembling ? '100%' : `${progress}%`,
          opacity: isDisassembling ? 0 : 0.35,
        }}
        transition={{
          width:   { duration: isDisassembling ? 0.3 : 0.15, ease: 'easeOut' },
          opacity: { duration: 0.3, delay: isDisassembling ? 0 : 0 },
        }}
      />
    </motion.div>
  );
}
