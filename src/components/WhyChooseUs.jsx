// ============================================================
//  Why Choose Us — "Our Approach" section  (v5)
//
//  v5 changes:
//  - Inline SVG landmark illustration (from /landmark-skyline.svg
//    fetched and rendered as actual DOM <svg>) so Vivus can animate it.
//  - Vivus line-drawing animation: triggers once via IntersectionObserver
//    when section scrolls into view. prefers-reduced-motion: skip anim.
//  - SVG positioned absolutely, full width/height, pointer-events:none.
//  - All carousel, wave, and motion logic unchanged.
// ============================================================
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Compass, Heart, Users, MapPin, Star, Shield } from 'lucide-react';
import Vivus from 'vivus';
import { whyChooseUs } from '../data/siteData';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const ICON_MAP = { Compass, Heart, Users, MapPin, Star, Shield };

// ── Card sizing ────────────────────────────────────────────────
const CARD_WIDTH_DESKTOP = 300;
const CARD_WIDTH_MOBILE  = 240;
const CARD_GAP           = 20;   // desktop gap; mobile uses 14px via CSS

// ── Wave amplitude (v4) ────────────────────────────────────────
// BEFORE this pass: desktop=42, tablet=32, mobile=28
// AFTER  this pass: desktop=55, tablet=42, mobile=36
// Peak-to-trough (2×amp): desktop 110px, tablet 84px, mobile 72px
// These values make the sine curve unmistakeable at every size.
const WAVE_AMPLITUDE_DESKTOP = 55;
const WAVE_AMPLITUDE_TABLET  = 42;
const WAVE_AMPLITUDE_MOBILE  = 36;

// WAVE_PERIOD: px per full sine cycle — unchanged.
const WAVE_PERIOD = 600;

// SPEED: px per rAF frame — unchanged.
const SPEED = 0.8;

// ── Card component (unchanged from v3) ────────────────────────
function ApproachCard({ item }) {
  const IconComponent = ICON_MAP[item.icon];
  return (
    <div
      className="approach-card"
      style={{
        flexShrink: 0,
        padding: '1.8rem',
        background: 'rgba(255,255,255,0.10)',
        border: '1px solid rgba(255,255,255,0.20)',
        borderRadius: '10px',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        transition: 'background 0.3s, border-color 0.3s',
        boxSizing: 'border-box',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      }}
      onMouseOver={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
      }}
    >
      {IconComponent && (
        <div
          className="approach-card-icon-wrap"
          style={{
            width: '44px', height: '44px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.30)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.2rem',
          }}
        >
          <IconComponent size={18} color="white" aria-hidden="true" />
        </div>
      )}
      <h3
        className="approach-card-heading"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#ffffff',
          margin: '0 0 0.6rem 0',
        }}
      >
        {item.title}
      </h3>
      <p
        className="approach-card-body"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.88rem',
          lineHeight: 1.75,
          color: 'rgba(255,255,255,0.82)',
          margin: 0,
        }}
      >
        {item.description}
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function WhyChooseUs() {
  const trackRef    = useRef(null);
  const pausedRef   = useRef(false);
  const posRef      = useRef(0);
  const rafRef      = useRef(null);
  const resumeTimer = useRef(null);

  // Vivus refs
  const sectionRef  = useRef(null);
  const svgRef      = useRef(null);
  const vivusRef    = useRef(null);
  const vivusFiredRef = useRef(false);

  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const setWidth = whyChooseUs.length * (CARD_WIDTH_DESKTOP + CARD_GAP);

  // Three-tier amplitude lookup
  const getAmplitude = () => {
    const w = window.innerWidth;
    if (w <= 640)  return WAVE_AMPLITUDE_MOBILE;
    if (w <= 1024) return WAVE_AMPLITUDE_TABLET;
    return WAVE_AMPLITUDE_DESKTOP;
  };

  const animate = useCallback(() => {
    if (!trackRef.current) return;
    if (!pausedRef.current) {
      posRef.current -= SPEED;
      if (Math.abs(posRef.current) >= setWidth) posRef.current = 0;
      trackRef.current.style.transform = `translateX(${posRef.current}px)`;

      const amp = getAmplitude();
      const allCards = trackRef.current.querySelectorAll('[data-card]');
      allCards.forEach((card, i) => {
        const phaseOffset = (2 * Math.PI / whyChooseUs.length) * (i % whyChooseUs.length);
        const t = (-posRef.current / WAVE_PERIOD) * 2 * Math.PI;
        card.style.transform = `translateY(${amp * Math.sin(t + phaseOffset)}px)`;
      });
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [setWidth]);

  useEffect(() => {
    if (reducedMotion) return;
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [animate, reducedMotion]);

  // ── Vivus: draw SVG lines once when section enters viewport ──
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    // If reduced motion: make SVG fully visible immediately, skip Vivus
    if (reducedMotion) {
      svgEl.style.visibility = 'visible';
      // Set all strokes to their final state
      const paths = svgEl.querySelectorAll('path, line, circle, rect, ellipse, polyline, polygon');
      paths.forEach(el => {
        el.style.strokeDashoffset = '0';
      });
      return;
    }

    // Hide SVG until Vivus is ready to draw (avoids flash of full illustration)
    svgEl.style.visibility = 'hidden';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !vivusFiredRef.current) {
          vivusFiredRef.current = true;
          observer.disconnect();

          svgEl.style.visibility = 'visible';

          // Vivus requires the SVG to have an id
          if (!svgEl.id) svgEl.id = 'landmark-skyline-svg';

          vivusRef.current = new Vivus(svgEl.id, {
            type: 'delayed',       // draws all paths, staggered
            duration: 280,         // ~4.7s at 60fps — cinematic but not slow
            animTimingFunction: Vivus.EASE_OUT,
            start: 'autostart',
          });
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      if (vivusRef.current) {
        try { vivusRef.current.stop(); } catch (_) {}
        vivusRef.current = null;
      }
    };
  }, [reducedMotion]);

  const handleMouseEnter = () => { pausedRef.current = true; };
  const handleMouseLeave = () => { pausedRef.current = false; };
  const handleFocus      = () => { pausedRef.current = true; };
  const handleBlur       = () => { pausedRef.current = false; };

  const touchStartX   = useRef(null);
  const touchStartPos = useRef(0);
  const handleTouchStart = (e) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    pausedRef.current = true;
    touchStartX.current   = e.touches[0].clientX;
    touchStartPos.current = posRef.current;
  };
  const handleTouchMove = (e) => {
    if (touchStartX.current === null || !trackRef.current) return;
    posRef.current = touchStartPos.current + (e.touches[0].clientX - touchStartX.current);
    trackRef.current.style.transform = `translateX(${posRef.current}px)`;
  };
  const handleTouchEnd = () => {
    touchStartX.current = null;
    resumeTimer.current = setTimeout(() => { pausedRef.current = false; }, 1500);
  };

  // ── IMPORTANT: SVG rendered as real inline JSX element ──────
  // Previous approach used encodeURIComponent() → data URI → CSS backgroundImage.
  // That fails silently: encoding edge-cases + backgroundSize:contain on a
  // 1600:280 aspect-ratio SVG in a percentage-height container collapses the
  // rendered size to near-invisible on typical viewports.
  //
  // Fix: render the SVG as a real <svg> JSX element, absolutely positioned,
  // width=100% height=auto, anchored to the section bottom.
  // This is GUARANTEED to appear in the DOM — no encoding, no asset path,
  // no CSS sizing ambiguity. Opacity on the <g> wrapper set to 0.18 (was
  // 0.11) so it's clearly visible against the crimson red background.

  return (
    <section
      ref={sectionRef}
      id="why-choose-us"
      aria-labelledby="why-heading"
      style={{
        background: 'linear-gradient(135deg, #a50e22 0%, #D0112B 45%, #b8102a 100%)',
        padding: 'clamp(4rem, 8vw, 7rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/*
        ══════════════════════════════════════════════════════════
        INLINE SVG ILLUSTRATION — Vivus animated line-drawing
        
        Rendered as actual <svg> JSX (ref={svgRef}) so Vivus can
        directly access and animate its paths via DOM id.
        
        Positioning: absolute, inset 0, 100% width, auto height,
        anchored to section bottom (bottom:0). This prevents it
        from stretching the section height.
        
        preserveAspectRatio="xMidYMax meet": scales the full
        1600×520 panorama to fit the section width without cropping.
        "meet" = contain (never crops), "YMax" = anchor to bottom
        so the ground baseline stays at the section floor.
        
        pointer-events:none — never blocks carousel interaction.
        opacity 0.22 on the SVG — clear enough to see landmarks,
        subtle enough not to fight with card content readability.
        ══════════════════════════════════════════════════════════
      */}
      <svg
        ref={svgRef}
        id="landmark-skyline-svg"
        aria-hidden="true"
        viewBox="0 0 1600 520"
        preserveAspectRatio="xMidYMax meet"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.22,
          // Prevent any overflow bleed on mobile
          overflow: 'visible',
        }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* ─── SKY: Airplane + flight path ─────────────────── */}
        <g id="airplane" strokeWidth="2" opacity="0.85">
          <path d="M1380 55 C1400 52 1430 50 1450 52 C1460 53 1462 58 1450 60 C1430 62 1400 62 1380 65 Z"/>
          <path d="M1405 55 C1400 40 1392 30 1388 28 C1390 38 1400 50 1405 55"/>
          <path d="M1405 62 C1400 74 1392 82 1388 84 C1390 74 1400 66 1405 62"/>
          <path d="M1382 57 C1376 50 1372 45 1370 44 C1372 50 1375 54 1378 58"/>
          <path d="M1382 60 C1376 66 1372 70 1370 72 C1372 66 1375 62 1378 58"/>
        </g>
        <path id="flight-path" d="M940 90 C1040 72 1160 60 1370 58" strokeWidth="1.5" strokeDasharray="8,10" opacity="0.5"/>

        {/* ─── SKY: Clouds ─────────────────────────────────── */}
        <g id="cloud1" strokeWidth="1.8" opacity="0.7">
          <path d="M60 85 C60 70 74 62 86 65 C88 54 100 46 114 50 C118 40 130 36 142 42 C154 36 168 42 170 54 C182 56 190 66 186 78 C190 86 186 96 178 96 L70 96 C62 96 56 92 60 85Z"/>
        </g>
        <g id="cloud2" strokeWidth="1.8" opacity="0.65">
          <path d="M640 48 C640 36 652 28 662 30 C664 20 676 14 688 18 C692 10 702 6 712 11 C720 4 732 9 734 20 C744 22 752 30 748 42 C752 50 748 58 740 58 L648 58 C640 58 636 54 640 48Z"/>
        </g>
        <g id="cloud3" strokeWidth="1.8" opacity="0.7">
          <path d="M1240 70 C1240 58 1252 50 1264 53 C1266 42 1278 36 1290 40 C1294 30 1306 26 1318 32 C1328 26 1340 32 1342 43 C1352 45 1358 55 1355 65 C1358 73 1354 82 1346 82 L1248 82 C1240 82 1236 78 1240 70Z"/>
        </g>
        <g id="cloud4" strokeWidth="1.6" opacity="0.55">
          <path d="M1480 100 C1480 92 1488 86 1496 88 C1498 80 1508 76 1516 80 C1519 74 1526 72 1533 76 C1539 72 1547 76 1547 84 C1553 86 1557 92 1554 99 C1556 104 1553 110 1548 110 L1486 110 C1480 110 1476 107 1480 100Z"/>
        </g>

        {/* ─── SKY: Birds ──────────────────────────────────── */}
        <g id="birds" strokeWidth="1.6" opacity="0.7">
          <path d="M200 110 C204 105 208 105 212 110"/>
          <path d="M215 103 C219 98 223 98 227 103"/>
          <path d="M222 112 C226 107 230 107 234 112"/>
          <path d="M1100 90 C1104 85 1108 85 1112 90"/>
          <path d="M1116 82 C1120 77 1124 77 1128 82"/>
          <path d="M1108 98 C1112 93 1116 93 1120 98"/>
          <path d="M1124 94 C1128 89 1132 89 1136 94"/>
          <path d="M800 38 C803 34 806 34 809 38"/>
          <path d="M812 32 C815 28 818 28 821 32"/>
        </g>

        {/* ─── Hot air balloon LEFT ─────────────────────────── */}
        <g id="balloon-left" strokeWidth="1.8" opacity="0.8">
          <ellipse cx="320" cy="145" rx="32" ry="40"/>
          <line x1="320" y1="105" x2="320" y2="185" strokeWidth="1"/>
          <path d="M290 130 C305 115 335 115 350 130" strokeWidth="1"/>
          <path d="M290 160 C305 175 335 175 350 160" strokeWidth="1"/>
          <line x1="304" y1="183" x2="308" y2="200"/>
          <line x1="336" y1="183" x2="332" y2="200"/>
          <rect x="305" y="200" width="30" height="18" rx="3"/>
          <line x1="308" y1="200" x2="308" y2="218"/>
          <line x1="320" y1="200" x2="320" y2="218"/>
          <line x1="332" y1="200" x2="332" y2="218"/>
        </g>

        {/* ─── Hot air balloon RIGHT ────────────────────────── */}
        <g id="balloon-right" strokeWidth="1.8" opacity="0.75">
          <ellipse cx="1195" cy="128" rx="26" ry="34"/>
          <line x1="1195" y1="94" x2="1195" y2="162" strokeWidth="1"/>
          <path d="M1170 116 C1182 103 1208 103 1220 116" strokeWidth="1"/>
          <path d="M1170 144 C1182 157 1208 157 1220 144" strokeWidth="1"/>
          <line x1="1182" y1="161" x2="1185" y2="175"/>
          <line x1="1208" y1="161" x2="1205" y2="175"/>
          <rect x="1182" y="175" width="26" height="15" rx="2"/>
        </g>

        {/* ─── LEFT: Big Ben ────────────────────────────────── */}
        <g id="big-ben" strokeWidth="2" opacity="0.9">
          <rect x="50" y="210" width="56" height="270" rx="2"/>
          <path d="M50 210 L78 85 L106 210"/>
          <line x1="78" y1="85" x2="78" y2="210" strokeWidth="1"/>
          <line x1="62" y1="150" x2="94" y2="150" strokeWidth="1"/>
          <line x1="65" y1="122" x2="91" y2="122" strokeWidth="1"/>
          <line x1="78" y1="85" x2="78" y2="65"/>
          <circle cx="78" cy="61" r="4"/>
          <path d="M44 210 L50 192 L56 210"/>
          <path d="M100 210 L106 192 L112 210"/>
          <rect x="44" y="210" width="68" height="55" rx="1"/>
          <path d="M54 265 L54 232 C54 220 65 216 68 216 C71 216 82 220 82 232 L82 265"/>
          <path d="M74 265 L74 232 C74 220 82 216 85 216 C88 216 102 220 102 232 L102 265"/>
          <rect x="40" y="265" width="76" height="68" rx="1"/>
          <circle cx="78" cy="299" r="24"/>
          <line x1="78" y1="299" x2="78" y2="280" strokeWidth="2.5"/>
          <line x1="78" y1="299" x2="95" y2="299" strokeWidth="2"/>
          <line x1="78" y1="276" x2="78" y2="280"/>
          <line x1="78" y1="319" x2="78" y2="323"/>
          <line x1="55" y1="299" x2="59" y2="299"/>
          <line x1="98" y1="299" x2="102" y2="299"/>
          <rect x="24" y="340" width="28" height="140" rx="2"/>
          <rect x="104" y="340" width="28" height="140" rx="2"/>
          <path d="M24 340 L38 322 L52 340"/>
          <path d="M104 340 L118 322 L132 340"/>
          <rect x="22" y="390" width="28" height="90" rx="1"/>
          <rect x="106" y="390" width="28" height="90" rx="1"/>
          <rect x="20" y="478" width="116" height="8" rx="1"/>
        </g>

        {/* ─── LEFT: Colosseum ──────────────────────────────── */}
        <g id="colosseum" strokeWidth="2" opacity="0.88">
          <path d="M152 480 C152 440 168 400 195 375 C220 352 258 340 280 340 C302 340 336 350 354 373 C374 398 386 440 388 480"/>
          <path d="M168 480 L168 438 C168 426 176 418 184 418 C192 418 200 426 200 438 L200 480"/>
          <path d="M200 480 L200 438 C200 426 208 418 216 418 C224 418 232 426 232 438 L232 480"/>
          <path d="M232 480 L232 438 C232 426 240 418 248 418 C256 418 264 426 264 438 L264 480"/>
          <path d="M264 480 L264 438 C264 426 272 418 280 418 C288 418 296 426 296 438 L296 480"/>
          <path d="M296 480 L296 438 C296 426 304 418 312 418 C320 418 328 426 328 438 L328 480"/>
          <path d="M328 480 L328 438 C328 426 336 418 344 418 C352 418 360 426 360 438 L360 480"/>
          <path d="M162 420 C190 415 260 412 310 415 C340 417 360 420 380 420" strokeWidth="1.5"/>
          <path d="M175 418 L175 385 C175 374 182 368 188 368 C194 368 201 374 201 385 L201 418"/>
          <path d="M207 418 L207 385 C207 374 214 368 220 368 C226 368 233 374 233 385 L233 418"/>
          <path d="M239 418 L239 385 C239 374 246 368 252 368 C258 368 265 374 265 385 L265 418"/>
          <path d="M271 418 L271 385 C271 374 278 368 284 368 C290 368 297 374 297 385 L297 418"/>
          <path d="M303 418 L303 385 C303 374 310 368 316 368 C322 368 329 374 329 385 L329 418"/>
          <path d="M335 418 L335 385 C335 374 342 368 348 368 C354 368 360 374 360 385 L360 418"/>
          <path d="M168 370 C194 365 262 362 322 365 C348 367 366 370 378 372" strokeWidth="1.5"/>
          <path d="M195 368 L195 350 C195 341 201 336 207 336 C213 336 219 341 219 350 L219 368"/>
          <path d="M223 368 L223 350 C223 341 229 336 235 336 C241 336 247 341 247 350 L247 368"/>
          <path d="M255 368 L255 350 C255 341 261 336 267 336 C273 336 279 341 279 350 L279 368"/>
          <path d="M285 368 L285 352 C285 343 291 338 297 338 C303 338 309 343 309 352 L309 368"/>
          <path d="M200 340 L210 328 L220 335 L230 325 L240 333 L252 326 L264 335 L276 327 L288 336 L300 328 L310 340"/>
        </g>

        {/* ─── LEFT: Eiffel Tower ───────────────────────────── */}
        <g id="eiffel-tower" strokeWidth="2" opacity="0.9">
          <path d="M402 480 C412 440 430 390 440 340 C446 308 452 270 460 230 C465 200 472 170 480 140"/>
          <path d="M548 480 C538 440 520 390 510 340 C504 308 498 270 490 230 C485 200 478 170 480 140"/>
          <path d="M416 480 C428 446 464 418 480 408"/>
          <path d="M534 480 C522 446 496 418 480 408"/>
          <rect x="428" y="326" width="104" height="14" rx="2"/>
          <path d="M430 328 L446 340 L462 328" strokeWidth="1.2"/>
          <path d="M500 328 L516 340 L530 328" strokeWidth="1.2"/>
          <rect x="448" y="228" width="64" height="12" rx="2"/>
          <path d="M460 228 C464 200 472 168 480 140"/>
          <path d="M500 228 C496 200 488 168 480 140"/>
          <path d="M474 140 C472 118 480 106 480 106 C480 106 488 118 486 140 Z"/>
          <line x1="480" y1="106" x2="480" y2="62"/>
          <circle cx="480" cy="58" r="4"/>
          <line x1="408" y1="460" x2="432" y2="338" strokeWidth="1" opacity="0.6"/>
          <line x1="426" y1="460" x2="434" y2="380" strokeWidth="1" opacity="0.6"/>
          <line x1="542" y1="460" x2="518" y2="338" strokeWidth="1" opacity="0.6"/>
          <line x1="524" y1="460" x2="516" y2="380" strokeWidth="1" opacity="0.6"/>
        </g>

        {/* ─── LEFT: Christ the Redeemer ────────────────────── */}
        <g id="christ-redeemer" strokeWidth="2" opacity="0.88">
          <path d="M572 480 C590 460 608 430 622 400 L638 400 C652 430 668 460 686 480 Z" strokeWidth="1.5"/>
          <rect x="620" y="328" width="40" height="74" rx="2"/>
          <rect x="614" y="400" width="52" height="10" rx="1"/>
          <path d="M626 328 C624 298 626 264 630 238 L648 238 C652 264 654 298 652 328 Z"/>
          <path d="M572 272 C590 268 614 260 630 256" strokeWidth="3"/>
          <path d="M648 256 C664 260 688 268 706 272" strokeWidth="3"/>
          <circle cx="573" cy="272" r="5"/>
          <circle cx="705" cy="272" r="5"/>
          <line x1="637" y1="238" x2="637" y2="220"/>
          <line x1="641" y1="238" x2="641" y2="220"/>
          <ellipse cx="639" cy="208" rx="18" ry="22"/>
          <path d="M622 196 C622 176 639 165 639 165 C639 165 656 176 656 196" strokeWidth="1.5"/>
          <line x1="632" y1="326" x2="629" y2="242" strokeWidth="1" opacity="0.7"/>
          <line x1="639" y1="328" x2="639" y2="240" strokeWidth="1" opacity="0.7"/>
          <line x1="646" y1="326" x2="649" y2="242" strokeWidth="1" opacity="0.7"/>
        </g>

        {/* ─── CENTER: India Gate ───────────────────────────── */}
        <g id="india-gate" strokeWidth="2" opacity="0.88">
          <path d="M502 480 L502 360 C502 310 530 280 565 272 C600 280 628 310 628 360 L628 480"/>
          <path d="M518 480 L518 370 C518 328 540 304 565 298 C590 304 612 328 612 370 L612 480" strokeWidth="1.5"/>
          <rect x="496" y="356" width="138" height="22" rx="2"/>
          <line x1="502" y1="364" x2="628" y2="364" strokeWidth="1"/>
          <line x1="502" y1="370" x2="628" y2="370" strokeWidth="1"/>
          <path d="M554 270 L554 252 L576 252 L576 270"/>
          <path d="M558 252 C556 240 565 228 565 228 C565 228 574 240 572 252 Z"/>
          <rect x="488" y="460" width="154" height="10" rx="1"/>
          <rect x="480" y="470" width="170" height="10" rx="1"/>
        </g>

        {/* ─── CENTER: Lotus Temple ─────────────────────────── */}
        <g id="lotus-temple" strokeWidth="1.8" opacity="0.82">
          <path d="M712 350 C702 336 698 316 706 304 C710 298 712 296 712 296 C712 296 714 298 718 304 C726 316 722 336 712 350Z"/>
          <path d="M696 360 C680 352 671 332 676 318 C678 311 681 308 681 308 C681 308 685 309 688 315 C697 328 696 352 696 360Z"/>
          <path d="M728 360 C744 352 753 332 748 318 C746 311 743 308 743 308 C743 308 739 309 736 315 C727 328 728 352 728 360Z"/>
          <path d="M687 375 C671 373 658 356 660 340 C661 333 664 329 664 329 C664 329 668 330 672 336 C680 348 684 368 687 375Z"/>
          <path d="M737 375 C753 373 766 356 764 340 C763 333 760 329 760 329 C760 329 756 330 752 336 C744 348 740 368 737 375Z"/>
          <path d="M712 342 C706 330 706 315 712 308 C718 315 718 330 712 342Z" strokeWidth="1.2"/>
          <path d="M700 352 C694 340 697 325 704 319 C707 328 706 342 700 352Z" strokeWidth="1.2"/>
          <path d="M724 352 C730 340 727 325 720 319 C717 328 718 342 724 352Z" strokeWidth="1.2"/>
          <path d="M672 390 C672 382 688 376 712 376 C736 376 752 382 752 390 C752 398 736 404 712 404 C688 404 672 398 672 390Z"/>
          <path d="M696 404 L692 420 L732 420 L728 404"/>
          <path d="M690 420 L686 438 L738 438 L734 420"/>
          <line x1="686" y1="438" x2="686" y2="480"/>
          <line x1="738" y1="438" x2="738" y2="480"/>
        </g>

        {/* ─── CENTER: Rajasthan Fort ───────────────────────── */}
        <g id="rajasthan-fort" strokeWidth="2" opacity="0.88">
          <path d="M730 380 C744 365 760 355 780 350 C800 345 820 342 840 345 C860 348 876 358 888 372 L888 480 L730 480 Z" strokeWidth="1.5"/>
          <rect x="740" y="310" width="140" height="72" rx="2"/>
          <path d="M740 310 L740 298 L750 298 L750 310 L760 310 L760 298 L770 298 L770 310 L780 310 L780 298 L790 298 L790 310 L800 310 L800 298 L810 298 L810 310 L820 310 L820 298 L830 298 L830 310 L840 310 L840 298 L850 298 L850 310 L860 310 L860 298 L870 298 L870 310 L880 310"/>
          <rect x="785" y="245" width="50" height="68" rx="2"/>
          <path d="M782 245 C782 228 810 215 810 215 C810 215 838 228 838 245Z"/>
          <line x1="810" y1="215" x2="810" y2="200"/>
          <circle cx="810" cy="196" r="5"/>
          <rect x="750" y="268" width="32" height="44" rx="2"/>
          <path d="M748 268 C748 254 766 246 766 246 C766 246 784 254 784 268Z"/>
          <line x1="766" y1="246" x2="766" y2="233"/>
          <circle cx="766" cy="229" r="4"/>
          <rect x="838" y="268" width="32" height="44" rx="2"/>
          <path d="M836 268 C836 254 854 246 854 246 C854 246 872 254 872 268Z"/>
          <line x1="854" y1="246" x2="854" y2="233"/>
          <circle cx="854" cy="229" r="4"/>
          <path d="M752 340 L752 322 C752 314 758 310 764 310 C770 310 776 314 776 322 L776 340"/>
          <path d="M792 340 L792 320 C792 311 799 307 806 307 C813 307 820 311 820 320 L820 340"/>
          <path d="M842 340 L842 322 C842 314 848 310 854 310 C860 310 866 314 866 322 L866 340"/>
          <rect x="738" y="346" width="18" height="36" rx="1"/>
          <rect x="864" y="346" width="18" height="36" rx="1"/>
        </g>

        {/* ─── CENTER: Taj Mahal ────────────────────────────── */}
        <g id="taj-mahal" strokeWidth="2" opacity="0.92">
          <path d="M965 238 C943 238 925 218 925 196 C925 176 937 158 950 148 C955 144 960 141 965 140 C970 141 975 144 980 148 C993 158 1005 176 1005 196 C1005 218 987 238 965 238Z"/>
          <line x1="965" y1="140" x2="965" y2="120"/>
          <circle cx="965" cy="114" r="7"/>
          <line x1="965" y1="107" x2="965" y2="93"/>
          <circle cx="965" cy="88" r="5"/>
          <line x1="965" y1="83" x2="965" y2="70"/>
          <rect x="943" y="238" width="44" height="20" rx="3"/>
          <path d="M937 258 C945 266 955 270 965 270 C975 270 985 266 993 258"/>
          <path d="M921 378 L921 298 C921 266 943 252 965 252 C987 252 1009 266 1009 298 L1009 378"/>
          <path d="M931 378 L931 304 C931 276 948 264 965 264 C982 264 999 276 999 304 L999 378" strokeWidth="1.2"/>
          <rect x="915" y="378" width="100" height="26" rx="1"/>
          <rect x="862" y="404" width="206" height="22" rx="2"/>
          <rect x="874" y="396" width="182" height="12" rx="1"/>
          <rect x="856" y="426" width="218" height="14" rx="1"/>
          {/* Minarets far left */}
          <path d="M862 426 L866 354 L874 354 L878 426"/>
          <path d="M862 390 C862 384 870 380 878 384 L878 392 C870 398 862 392 Z" strokeWidth="1.2"/>
          <path d="M863 354 C863 341 870 334 870 334 C870 334 877 341 877 354 Z"/>
          <line x1="870" y1="334" x2="870" y2="320"/>
          <circle cx="870" cy="316" r="4"/>
          {/* Minarets inner left */}
          <path d="M896 404 L900 340 L908 340 L912 404"/>
          <path d="M896 372 C896 366 904 362 912 366 L912 374 C904 380 896 374 Z" strokeWidth="1.2"/>
          <path d="M897 340 C897 328 904 321 904 321 C904 321 911 328 911 340 Z"/>
          <line x1="904" y1="321" x2="904" y2="307"/>
          <circle cx="904" cy="303" r="4"/>
          {/* Minarets inner right */}
          <path d="M1018 404 L1022 340 L1030 340 L1034 404"/>
          <path d="M1018 372 C1018 366 1026 362 1034 366 L1034 374 C1026 380 1018 374 Z" strokeWidth="1.2"/>
          <path d="M1019 340 C1019 328 1026 321 1026 321 C1026 321 1033 328 1033 340 Z"/>
          <line x1="1026" y1="321" x2="1026" y2="307"/>
          <circle cx="1026" cy="303" r="4"/>
          {/* Minarets far right */}
          <path d="M1052 426 L1056 354 L1064 354 L1068 426"/>
          <path d="M1052 390 C1052 384 1060 380 1068 384 L1068 392 C1060 398 1052 392 Z" strokeWidth="1.2"/>
          <path d="M1053 354 C1053 341 1060 334 1060 334 C1060 334 1067 341 1067 354 Z"/>
          <line x1="1060" y1="334" x2="1060" y2="320"/>
          <circle cx="1060" cy="316" r="4"/>
        </g>

        {/* ─── CENTER: Water + sailboat ─────────────────────── */}
        <g id="water" strokeWidth="1.2" opacity="0.5">
          <path d="M500 465 C530 460 570 462 610 458 C650 454 700 456 750 452 C800 448 860 450 920 455 C960 459 1000 457 1040 460"/>
          <path d="M510 472 C540 468 580 469 620 466 C660 463 710 465 760 462 C810 459 870 462 930 466 C965 469 1005 468 1045 470"/>
          <path d="M808 455 L808 415 L840 450 Z"/>
          <path d="M808 455 L808 425 L780 450 Z"/>
          <line x1="808" y1="415" x2="808" y2="455"/>
          <path d="M788 450 C788 460 820 464 832 458 L820 450 Z"/>
        </g>

        {/* ─── RIGHT: Hindu Temple Gopuram ──────────────────── */}
        <g id="gopuram" strokeWidth="2" opacity="0.88">
          <rect x="1078" y="380" width="90" height="100" rx="2"/>
          <rect x="1086" y="332" width="74" height="52" rx="2"/>
          <rect x="1094" y="292" width="58" height="44" rx="2"/>
          <rect x="1102" y="258" width="42" height="38" rx="2"/>
          <rect x="1108" y="230" width="30" height="30" rx="2"/>
          <path d="M1110 230 C1108 218 1123 208 1123 208 C1123 208 1138 218 1136 230Z"/>
          <line x1="1123" y1="208" x2="1123" y2="196"/>
          <circle cx="1123" cy="192" r="6"/>
          <line x1="1123" y1="186" x2="1123" y2="175"/>
          <line x1="1078" y1="420" x2="1168" y2="420" strokeWidth="1.2"/>
          <line x1="1078" y1="450" x2="1168" y2="450" strokeWidth="1.2"/>
          <line x1="1086" y1="358" x2="1160" y2="358" strokeWidth="1.2"/>
          <line x1="1094" y1="312" x2="1152" y2="312" strokeWidth="1.2"/>
          <path d="M1098 480 L1098 420 C1098 410 1106 404 1114 404 C1122 404 1130 410 1130 420 L1130 480"/>
          <rect x="1082" y="392" width="10" height="16" rx="1" strokeWidth="1"/>
          <rect x="1095" y="392" width="10" height="16" rx="1" strokeWidth="1"/>
          <rect x="1142" y="392" width="10" height="16" rx="1" strokeWidth="1"/>
          <rect x="1155" y="392" width="10" height="16" rx="1" strokeWidth="1"/>
          <rect x="1072" y="478" width="104" height="6" rx="1"/>
        </g>

        {/* ─── RIGHT: Elephant ──────────────────────────────── */}
        <g id="elephant" strokeWidth="2" opacity="0.82">
          <path d="M1090 450 C1088 430 1090 410 1098 400 C1106 390 1118 386 1130 388 C1142 390 1152 398 1156 410 C1160 422 1158 440 1154 452"/>
          <path d="M1090 450 C1084 438 1082 422 1086 410 C1090 398 1100 392 1108 394 C1116 396 1120 404 1118 414 C1116 424 1110 430 1102 434 C1096 436 1090 440 1090 450"/>
          <path d="M1086 428 C1072 432 1064 440 1066 452 C1068 460 1076 464 1082 460 C1086 456 1084 450 1080 448"/>
          <path d="M1086 410 C1074 404 1068 394 1072 384 C1076 374 1088 372 1096 378 C1102 384 1100 396 1090 402"/>
          <circle cx="1094" cy="406" r="4"/>
          <path d="M1090 420 C1080 424 1072 428 1068 436" strokeWidth="1.5"/>
          <line x1="1100" y1="450" x2="1098" y2="480"/>
          <line x1="1114" y1="452" x2="1113" y2="480"/>
          <line x1="1136" y1="452" x2="1136" y2="480"/>
          <line x1="1150" y1="450" x2="1151" y2="480"/>
          <path d="M1154 418 C1162 420 1166 428 1162 436"/>
        </g>

        {/* ─── RIGHT: Buddha Statue ─────────────────────────── */}
        <g id="buddha" strokeWidth="2" opacity="0.85">
          <path d="M1218 480 L1218 456 L1340 456 L1340 480"/>
          <path d="M1222 456 L1228 438 L1330 438 L1336 456"/>
          <path d="M1234 438 C1230 428 1233 418 1240 416 C1244 424 1242 434 1234 438Z"/>
          <path d="M1252 438 C1248 427 1252 417 1259 415 C1263 423 1261 434 1252 438Z"/>
          <path d="M1270 438 C1268 427 1272 417 1279 416 C1282 424 1279 434 1270 438Z"/>
          <path d="M1288 438 C1287 427 1292 418 1299 417 C1301 425 1298 435 1288 438Z"/>
          <path d="M1306 438 C1306 427 1312 418 1319 418 C1320 426 1316 436 1306 438Z"/>
          <path d="M1322 438 C1323 428 1329 420 1336 421 C1336 429 1331 437 1322 438Z"/>
          <path d="M1226 438 C1228 410 1240 395 1255 388 L1303 388 C1318 395 1330 410 1332 438 Z"/>
          <path d="M1232 425 C1244 415 1260 410 1279 410 C1298 410 1314 415 1326 425" strokeWidth="1.2"/>
          <path d="M1255 388 C1253 365 1255 345 1257 328 L1301 328 C1303 345 1305 365 1303 388 Z"/>
          <path d="M1255 380 C1244 380 1236 384 1232 390" strokeWidth="1.8"/>
          <path d="M1303 380 C1314 380 1322 384 1326 390" strokeWidth="1.8"/>
          <path d="M1303 360 C1316 350 1328 340 1334 326" strokeWidth="2"/>
          <path d="M1330 326 L1330 308 C1334 306 1338 308 1338 312 L1338 328" strokeWidth="1.5"/>
          <ellipse cx="1279" cy="314" rx="24" ry="28"/>
          <path d="M1263 296 C1263 280 1279 268 1279 268 C1279 268 1295 280 1295 296Z"/>
          <line x1="1279" y1="268" x2="1279" y2="256"/>
          <circle cx="1279" cy="252" r="4"/>
          <path d="M1270 318 C1273 322 1279 324 1285 322 C1282 326 1276 326 1270 318" strokeWidth="1"/>
          <circle cx="1279" cy="308" r="44" strokeWidth="1" opacity="0.45"/>
        </g>

        {/* ─── RIGHT: Pagoda ────────────────────────────────── */}
        <g id="pagoda" strokeWidth="2" opacity="0.88">
          <path d="M1362 480 L1362 450 L1348 444 L1480 444 L1466 450 L1466 480"/>
          <path d="M1348 444 L1360 430 L1468 430 L1480 444"/>
          <path d="M1368 430 L1368 404 L1358 398 L1470 398 L1460 404 L1460 430"/>
          <path d="M1358 398 L1368 385 L1460 385 L1470 398"/>
          <path d="M1374 385 L1374 360 L1366 354 L1462 354 L1454 360 L1454 385"/>
          <path d="M1366 354 L1376 342 L1452 342 L1462 354"/>
          <path d="M1381 342 L1381 320 L1374 314 L1454 314 L1447 320 L1447 342"/>
          <path d="M1374 314 L1382 303 L1446 303 L1454 314"/>
          <path d="M1388 303 L1388 284 L1382 278 L1446 278 L1440 284 L1440 303"/>
          <path d="M1382 278 L1390 268 L1438 268 L1446 278"/>
          <line x1="1414" y1="268" x2="1414" y2="220"/>
          <path d="M1408 268 L1414 250 L1420 268Z"/>
          <circle cx="1414" cy="242" r="4"/>
          <circle cx="1414" cy="232" r="3"/>
          <path d="M1348 444 C1342 440 1340 436 1344 432" strokeWidth="1.5"/>
          <path d="M1480 444 C1486 440 1488 436 1484 432" strokeWidth="1.5"/>
          <path d="M1358 398 C1352 394 1350 390 1354 386" strokeWidth="1.5"/>
          <path d="M1470 398 C1476 394 1478 390 1474 386" strokeWidth="1.5"/>
          <rect x="1376" y="454" width="16" height="22" rx="2"/>
          <rect x="1436" y="454" width="16" height="22" rx="2"/>
          {/* Torii gate */}
          <line x1="1490" y1="480" x2="1490" y2="408"/>
          <line x1="1520" y1="480" x2="1520" y2="408"/>
          <line x1="1484" y1="416" x2="1526" y2="416"/>
          <path d="M1484 416 L1484 424 C1484 424 1505 428 1526 424 L1526 416" strokeWidth="1.2"/>
          <line x1="1484" y1="432" x2="1526" y2="432" strokeWidth="1.2"/>
        </g>

        {/* ─── RIGHT: Palm trees ────────────────────────────── */}
        <g id="palms" strokeWidth="1.8" opacity="0.75">
          <path d="M1544 480 C1542 455 1538 428 1536 405 C1534 388 1535 375 1538 368"/>
          <path d="M1538 368 C1524 355 1512 352 1506 355 C1514 360 1524 366 1538 374"/>
          <path d="M1538 368 C1528 350 1524 340 1527 333 C1533 342 1535 355 1540 366"/>
          <path d="M1538 368 C1546 350 1548 340 1545 333 C1539 342 1537 355 1538 368"/>
          <path d="M1538 368 C1552 358 1562 356 1568 360 C1558 364 1548 368 1538 372"/>
          <circle cx="1536" cy="374" r="5"/>
          <circle cx="1543" cy="372" r="5"/>
          <path d="M1580 480 C1578 462 1576 444 1575 430 C1574 418 1575 408 1577 402"/>
          <path d="M1577 402 C1566 392 1558 390 1554 392 C1561 396 1570 400 1577 406"/>
          <path d="M1577 402 C1570 390 1568 382 1570 376 C1575 384 1576 394 1578 402"/>
          <path d="M1577 402 C1584 392 1590 390 1594 392 C1588 396 1581 400 1577 404"/>
          <circle cx="1576" cy="408" r="4"/>
          <circle cx="1581" cy="406" r="4"/>
        </g>

        {/* ─── LEFT foreground: Suitcase ────────────────────── */}
        <g id="suitcase" strokeWidth="1.8" opacity="0.88">
          <rect x="22" y="400" width="52" height="68" rx="6"/>
          <rect x="30" y="400" width="36" height="68" rx="4" strokeWidth="1.2"/>
          <path d="M36 400 L36 386 L52 386 L52 400"/>
          <circle cx="32" cy="470" r="6"/>
          <circle cx="62" cy="470" r="6"/>
          <line x1="22" y1="424" x2="74" y2="424" strokeWidth="1.2"/>
          <line x1="22" y1="444" x2="74" y2="444" strokeWidth="1.2"/>
          <rect x="42" y="428" width="12" height="10" rx="2"/>
        </g>

        {/* ─── LEFT foreground: Camera ──────────────────────── */}
        <g id="camera" strokeWidth="1.8" opacity="0.88">
          <rect x="155" y="424" width="55" height="40" rx="5"/>
          <circle cx="182" cy="444" r="13"/>
          <circle cx="182" cy="444" r="8"/>
          <rect x="176" y="416" width="18" height="10" rx="3"/>
          <circle cx="200" cy="420" r="4"/>
          <rect x="157" y="418" width="12" height="8" rx="2"/>
        </g>

        {/* ─── LEFT foreground: Map + pin ───────────────────── */}
        <g id="map-pin" strokeWidth="1.8" opacity="0.88">
          <path d="M240 438 L240 480 L310 480 L310 438 Z"/>
          <line x1="265" y1="438" x2="265" y2="480" strokeWidth="1"/>
          <line x1="287" y1="438" x2="287" y2="480" strokeWidth="1"/>
          <line x1="240" y1="456" x2="310" y2="456" strokeWidth="1"/>
          <path d="M244 448 C252 445 260 449 268 446 C276 443 284 447 292 444" strokeWidth="0.9"/>
          <path d="M274 440 C274 432 280 426 286 426 C292 426 298 432 298 440 C298 448 286 460 286 460 C286 460 274 448 274 440Z"/>
          <circle cx="286" cy="440" r="5"/>
        </g>

        {/* ─── LEFT foreground: Compass ─────────────────────── */}
        <g id="compass" strokeWidth="1.8" opacity="0.88">
          <circle cx="345" cy="455" r="24"/>
          <circle cx="345" cy="455" r="18"/>
          <path d="M345 437 L349 455 L345 473 L341 455 Z"/>
          <line x1="345" y1="432" x2="345" y2="436"/>
          <line x1="345" y1="474" x2="345" y2="478"/>
          <line x1="322" y1="455" x2="326" y2="455"/>
          <line x1="364" y1="455" x2="368" y2="455"/>
        </g>

        {/* ─── RIGHT foreground: Passport ───────────────────── */}
        <g id="passport" strokeWidth="1.8" opacity="0.88">
          <rect x="1186" y="438" width="46" height="60" rx="4"/>
          <rect x="1190" y="442" width="38" height="52" rx="2" strokeWidth="1.2"/>
          <circle cx="1209" cy="460" r="10"/>
          <line x1="1209" y1="450" x2="1209" y2="470" strokeWidth="0.8"/>
          <line x1="1200" y1="460" x2="1218" y2="460" strokeWidth="0.8"/>
          <line x1="1192" y1="478" x2="1226" y2="478" strokeWidth="1.2"/>
          <line x1="1192" y1="484" x2="1220" y2="484" strokeWidth="1"/>
        </g>

        {/* ─── RIGHT foreground: Sun hat ────────────────────── */}
        <g id="sun-hat" strokeWidth="1.8" opacity="0.88">
          <path d="M1508 438 C1484 438 1466 444 1466 452 C1466 460 1484 464 1508 464 C1532 464 1550 460 1550 452 C1550 444 1532 438 1508 438Z"/>
          <path d="M1486 438 C1486 418 1494 410 1508 410 C1522 410 1530 418 1530 438Z"/>
          <path d="M1487 434 C1495 432 1521 432 1529 434" strokeWidth="1.5"/>
        </g>

        {/* ─── RIGHT foreground: Sunglasses ────────────────── */}
        <g id="sunglasses" strokeWidth="1.8" opacity="0.88">
          <path d="M1492 478 C1489 470 1490 462 1498 460 C1506 458 1512 462 1512 470 C1512 462 1518 458 1526 460 C1534 462 1535 470 1532 478"/>
          <line x1="1490" y1="468" x2="1486" y2="464"/>
          <line x1="1534" y1="468" x2="1538" y2="464"/>
        </g>

        {/* ─── Ground baseline ──────────────────────────────── */}
        <line id="ground-line" x1="0" y1="482" x2="1600" y2="482" stroke="white" strokeWidth="1.5" opacity="0.4"/>

        {/* ─── Terrain bumps ────────────────────────────────── */}
        <g id="terrain" strokeWidth="1.2" opacity="0.3">
          <path d="M140 480 C180 472 220 468 280 470 C320 472 360 475 400 472 C440 469 480 465 520 468 C560 471 600 473 640 470"/>
          <path d="M640 470 C680 467 720 462 770 460 C820 458 870 462 920 460 C960 458 1000 462 1040 465 C1080 468 1120 466 1160 462"/>
          <path d="M1160 462 C1200 459 1240 462 1280 460 C1320 458 1360 462 1400 465 C1440 468 1480 466 1530 462 C1560 460 1580 461 1600 462"/>
        </g>
      </svg>

      {/* ── All content above the line-art — z:1 ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <Reveal>
            <SectionHeading
              label="Why Travel With Us"
              heading="Our Approach"
              subtext="We believe great travel is about depth, not distance."
              theme="dark"
            />
          </Reveal>
        </div>

        {/* ── Carousel viewport ── */}
        <div
          style={{ position: 'relative', overflow: 'hidden', width: '100%' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-label="Our approach — scrolling carousel"
        >
          {/* Edge fade — crimson-matching */}
          <div aria-hidden="true" style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
            background: 'linear-gradient(to right, #a50e22, transparent)',
            pointerEvents: 'none',
          }} />
          <div aria-hidden="true" style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
            background: 'linear-gradient(to left, #b8102a, transparent)',
            pointerEvents: 'none',
          }} />

          {/* Scrolling track */}
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: `${CARD_GAP}px`,
              // Padding = max amplitude + comfortable breathing room.
              // Desktop amplitude = 55px → top 68px, bottom 76px.
              padding: `${WAVE_AMPLITUDE_DESKTOP + 13}px 1.5rem ${WAVE_AMPLITUDE_DESKTOP + 21}px`,
              width: 'max-content',
              overflowX: reducedMotion ? 'auto' : 'visible',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {whyChooseUs.map((item) => (
              <div key={item.title} data-card="true" style={{ flexShrink: 0 }}>
                <ApproachCard item={item} />
              </div>
            ))}
            {!reducedMotion && whyChooseUs.map((item) => (
              <div key={`dup-${item.title}`} data-card="true" style={{ flexShrink: 0 }}>
                <ApproachCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Reduced-motion static grid */}
        {reducedMotion && (
          <div style={{
            maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {whyChooseUs.map(item => <ApproachCard key={item.title} item={item} />)}
          </div>
        )}
      </div>

      <style>{`
        /* ── Card widths — responsive ── */
        .approach-card { width: 300px; }

        @media (max-width: 640px) {
          /* 240px card on 375px screen → ~135px of next card peeks in.
             On 320px: 240px card + 14px gap → 66px peek. */
          .approach-card { width: 240px; }

          /* Tighter gap on mobile so more next-card peek at 320px */
          #why-choose-us [data-card] + [data-card] { margin-left: -6px; }
        }

        /* ── Section minimum height — prevents clipping at wave extremes ──
           Card ~220px + 2×amplitude + padding = safe floor.
           Mobile: 220 + 72 + 80 = 372 → use 500px for comfort.
           Desktop: handled by track padding (55+13 top, 55+21 bottom). */
        @media (max-width: 640px) {
          #why-choose-us { min-height: 500px; }
        }

        /* ── Dark mode: slightly deeper crimson ── */
        html.dark #why-choose-us {
          background: linear-gradient(135deg, #8a0c1c 0%, #b8102a 45%, #9e0e24 100%) !important;
        }

        /* ── Dark mode text colours — role-based, selective ─────────────
           The section has a crimson-red bg in BOTH light and dark modes.
           In dark mode the user wants:
             A. "Our Approach" heading        → white  ✓ (already set below)
             B. "WHY TRAVEL WITH US" label    → keep existing golden (DO NOT TOUCH)
             C. Introductory subtext          → dark / near-black
             D. Card headings (h3)            → dark / near-black
             E. Card descriptions (p)         → dark / near-black
           Cards have rgba(255,255,255,0.10) translucent bg — dark text
           will read against this better than white in dark mode.
        ──────────────────────────────────────────────────────────────── */

        /* A. Main heading "Our Approach" — BLACK in dark mode */
        html.dark #why-choose-us .sh-heading {
          color: #111111 !important;
        }

        /* C. Introductory subtext — dark/near-black in dark mode */
        html.dark #why-choose-us .sh-subtext {
          color: #1a1a1a !important;
        }

        /* D. Card headings — dark in dark mode */
        html.dark #why-choose-us .approach-card-heading {
          color: #111111 !important;
        }

        /* E. Card descriptions — dark in dark mode */
        html.dark #why-choose-us .approach-card-body {
          color: rgba(20, 20, 20, 0.88) !important;
        }

        /* F. Card icons — black in dark mode.
           Lucide icons render as inline SVG with stroke="white" set via
           the color prop. CSS cannot override an inline color="" prop
           via the color property, but CAN override the SVG stroke attribute
           using the svg stroke rule below — this is the correct technique
           for lucide-react icons.
           Scoped tightly to #why-choose-us .approach-card-icon-wrap so
           it CANNOT affect icons in the navbar, footer, or any other section. */
        html.dark #why-choose-us .approach-card-icon-wrap svg {
          stroke: #111111 !important;
          color: #111111 !important;
        }

        /* Note: .sh-label ("WHY TRAVEL WITH US") is deliberately excluded —
           its golden color rgba(240,192,96,0.85) is preserved as-is.      */

        /* ── No horizontal scroll bleed ── */
        #why-choose-us { max-width: 100vw; }
      `}</style>
    </section>
  );
}
