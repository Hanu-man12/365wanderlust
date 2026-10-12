// ============================================================
//  Why Choose Us — "Our Approach" section
//
//  v4 changes (this pass):
//  1. Wave amplitude increased again: 42/32/28 → 55/42/36px
//     Peak-to-trough now: desktop 110px, tablet 84px, mobile 72px
//  2. Mobile gap tightened (20→14px) so more of next card peeks in
//     at 320px — clearer horizontal reference for wave perception.
//  3. Background line-art fully replaced: old tiled arch pattern
//     → new panoramic world landmark skyline SVG (inline, no asset file).
//     8 landmarks: Victoria Memorial · Qutub Minar · Statue of Unity ·
//     Christ the Redeemer · Taj Mahal · Eiffel Tower · Big Ben · Statue of Liberty
// ============================================================
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Compass, Heart, Users, MapPin, Star, Shield } from 'lucide-react';
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
        <div style={{
          width: '44px', height: '44px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.30)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.2rem',
        }}>
          <IconComponent size={18} color="white" aria-hidden="true" />
        </div>
      )}
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.2rem',
        fontWeight: 700,
        color: '#ffffff',
        margin: '0 0 0.6rem 0',
      }}>
        {item.title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.88rem',
        lineHeight: 1.75,
        color: 'rgba(255,255,255,0.82)',
        margin: 0,
      }}>
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
      id="why-choose-us"
      aria-labelledby="why-heading"
      style={{
        background: 'linear-gradient(135deg, #a50e22 0%, #D0112B 45%, #b8102a 100%)',
        padding: 'clamp(4rem, 8vw, 7rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ══════════════════════════════════════════════════════════
          PANORAMIC LANDMARK LINE-ART — inline SVG (not background-image)
          
          Rendered as a real DOM element: <svg> absolutely positioned,
          pinned to the bottom of the section, spanning full width.
          
          viewBox="0 0 1600 280": the SVG's internal coordinate space.
          width="100%": SVG stretches to fill any viewport width.
          height="auto": SVG height scales proportionally with width.
          preserveAspectRatio="xMidYMax meet": keeps composition intact,
            aligns ground baseline to the bottom of the SVG element.
          
          All 8 landmarks drawn as white outline paths.
          Opacity 0.18 on the <g> wrapper — clearly visible but subtle.
          z-index 0: behind all other content (cards at z:1).
          pointer-events none: doesn't interfere with card interaction.
      ══════════════════════════════════════════════════════════ */}
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 280"
        preserveAspectRatio="xMidYMax meet"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 'auto',
          zIndex: 0,
          pointerEvents: 'none',
          display: 'block',
        }}
      >
        <g
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.18"
        >
          {/* ═══════════════════════════════════════════════════
              1. VICTORIA MEMORIAL — Kolkata
              Central dome, colonnade, wide wings, corner domes.
              x: 20–170
          ═══════════════════════════════════════════════════ */}
          {/* Central dome */}
          <path d="M95 145 Q82 120 78 100 Q74 78 95 68 Q116 78 112 100 Q108 120 95 145" />
          {/* Finial */}
          <line x1="95" y1="68" x2="95" y2="54" />
          <circle cx="95" cy="52" r="3" strokeWidth="1" />
          {/* Drum */}
          <rect x="76" y="145" width="38" height="13" />
          {/* Colonnade */}
          <rect x="48" y="158" width="94" height="11" />
          {/* Wings */}
          <rect x="22" y="169" width="146" height="17" />
          {/* Left corner dome */}
          <path d="M38 169 Q30 155 38 144 Q46 133 54 144 Q62 133 62 144 Q54 155 54 169" />
          <line x1="46" y1="144" x2="46" y2="136" />
          <circle cx="46" cy="134" r="2" strokeWidth="0.8" />
          {/* Right corner dome */}
          <path d="M136 169 Q128 155 136 144 Q144 133 152 144 Q160 133 160 144 Q152 155 152 169" />
          <line x1="144" y1="144" x2="144" y2="136" />
          <circle cx="144" cy="134" r="2" strokeWidth="0.8" />
          {/* Steps */}
          <rect x="16" y="186" width="158" height="5" />
          <rect x="12" y="191" width="166" height="5" />
          {/* Ground */}
          <line x1="10" y1="196" x2="180" y2="196" />

          {/* ═══════════════════════════════════════════════════
              2. QUTUB MINAR — Delhi
              Tall tapered cylinder, balcony rings, fluting.
              x: 198–240
          ═══════════════════════════════════════════════════ */}
          {/* Tapered tower outline */}
          <path d="M198 250 L204 118 Q219 106 234 118 L240 250" />
          {/* Balcony ring 1 */}
          <path d="M201 216 Q219 208 237 216 L237 223 Q219 231 201 223 Z" />
          {/* Balcony ring 2 */}
          <path d="M203 174 Q219 166 235 174 L235 181 Q219 189 203 181 Z" />
          {/* Balcony ring 3 */}
          <path d="M205 138 Q219 130 233 138 L233 145 Q219 153 205 145 Z" />
          {/* Tapering contour lines */}
          <path d="M202 195 Q219 188 236 195" strokeWidth="0.6" />
          <path d="M204 155 Q219 149 234 155" strokeWidth="0.6" />
          {/* Cap */}
          <path d="M211 118 Q219 102 227 118 Q219 113 211 118" />
          <line x1="219" y1="102" x2="219" y2="92" />
          <circle cx="219" cy="90" r="2.5" />
          {/* Vertical fluting */}
          <line x1="210" y1="116" x2="200" y2="250" strokeWidth="0.5" />
          <line x1="219" y1="106" x2="219" y2="250" strokeWidth="0.5" />
          <line x1="228" y1="116" x2="238" y2="250" strokeWidth="0.5" />

          {/* ═══════════════════════════════════════════════════
              3. STATUE OF UNITY — Gujarat
              Heroic standing figure on tall plinth.
              x: 262–310
          ═══════════════════════════════════════════════════ */}
          {/* Plinth */}
          <rect x="270" y="200" width="36" height="50" />
          <rect x="264" y="194" width="48" height="9" />
          {/* Torso */}
          <rect x="277" y="162" width="22" height="34" />
          {/* Head */}
          <ellipse cx="288" cy="153" rx="9" ry="10" />
          {/* Cap */}
          <path d="M279 147 Q288 138 297 147" />
          <line x1="288" y1="143" x2="288" y2="135" />
          {/* Arms */}
          <line x1="277" y1="172" x2="264" y2="183" />
          <line x1="299" y1="172" x2="312" y2="183" />
          {/* Legs */}
          <line x1="283" y1="196" x2="279" y2="200" />
          <line x1="293" y1="196" x2="297" y2="200" />
          {/* Plinth details */}
          <line x1="270" y1="212" x2="306" y2="212" strokeWidth="0.7" />
          <line x1="270" y1="226" x2="306" y2="226" strokeWidth="0.7" />
          <line x1="270" y1="238" x2="306" y2="238" strokeWidth="0.7" />

          {/* ═══════════════════════════════════════════════════
              4. CHRIST THE REDEEMER — Brazil
              Open arms on mountain / pedestal. The wingspan
              is the key recognisable silhouette.
              x: 330–440
          ═══════════════════════════════════════════════════ */}
          {/* Pedestal / mountain plinth */}
          <path d="M372 250 L376 218 L380 210 L384 218 L388 250" />
          <rect x="374" y="205" width="18" height="8" />
          {/* Body */}
          <rect x="382" y="176" width="8" height="32" />
          {/* Head */}
          <circle cx="386" cy="169" r="7" />
          {/* Wide outstretched arms — signature silhouette */}
          <line x1="330" y1="192" x2="442" y2="192" strokeWidth="1.5" />
          <circle cx="330" cy="192" r="2.5" />
          <circle cx="442" cy="192" r="2.5" />
          {/* Robe drape */}
          <line x1="382" y1="188" x2="373" y2="208" strokeWidth="0.7" />
          <line x1="390" y1="188" x2="399" y2="208" strokeWidth="0.7" />

          {/* ═══════════════════════════════════════════════════
              5. TAJ MAHAL
              Onion dome + 4 minarets + iwan arch + side wings.
              x: 460–600
          ═══════════════════════════════════════════════════ */}
          {/* Main onion dome */}
          <path d="M530 100 Q518 80 516 66 Q514 46 530 38 Q546 30 548 46 Q550 62 548 66 Q544 80 530 100" />
          {/* Lotus base */}
          <path d="M516 100 Q530 108 544 100" />
          {/* Drum */}
          <rect x="517" y="108" width="26" height="13" />
          {/* Chattris (corner kiosks) */}
          <path d="M484 132 Q484 122 490 118 Q496 114 502 118 Q508 122 508 132" strokeWidth="1" />
          <path d="M552 132 Q552 122 558 118 Q564 114 570 118 Q576 122 576 132" strokeWidth="1" />
          {/* Main iwan arch */}
          <path d="M510 185 L510 148 Q510 126 530 126 Q550 126 550 148 L550 185" />
          {/* Inner arch */}
          <path d="M516 185 L516 154 Q516 136 530 136 Q544 136 544 154 L544 185" strokeWidth="0.7" />
          {/* Platform */}
          <rect x="464" y="185" width="132" height="13" />
          {/* Side wings */}
          <rect x="460" y="158" width="40" height="40" />
          <rect x="560" y="158" width="40" height="40" />
          {/* Wing arched windows */}
          <path d="M469 185 L469 172 Q476 164 483 172 L483 185" strokeWidth="0.8" />
          <path d="M577 185 L577 172 Q584 164 591 172 L591 185" strokeWidth="0.8" />
          {/* Four minarets */}
          <rect x="464" y="116" width="7" height="45" />
          <rect x="589" y="116" width="7" height="45" />
          {/* Minaret caps */}
          <path d="M461 116 Q467 104 473 116" />
          <path d="M586 116 Q592 104 598 116" />
          <line x1="467" y1="104" x2="467" y2="96" />
          <circle cx="467" cy="94" r="2" />
          <line x1="592" y1="104" x2="592" y2="96" />
          <circle cx="592" cy="94" r="2" />
          {/* Taj finial */}
          <line x1="530" y1="38" x2="530" y2="28" />
          <circle cx="530" cy="26" r="2.5" />
          {/* Reflecting pool */}
          <line x1="500" y1="202" x2="560" y2="202" strokeWidth="0.6" strokeDasharray="5 4" />

          {/* ═══════════════════════════════════════════════════
              6. EIFFEL TOWER — Paris
              Four-legged lattice tower. Instantly recognisable.
              x: 622–720
          ═══════════════════════════════════════════════════ */}
          {/* Left outer leg */}
          <path d="M622 250 L644 183 L654 128 L664 68" />
          {/* Right outer leg */}
          <path d="M720 250 L698 183 L688 128 L678 68" />
          {/* First floor platform */}
          <rect x="641" y="179" width="60" height="8" />
          {/* Second floor platform */}
          <rect x="651" y="124" width="40" height="7" />
          {/* Top taper to antenna */}
          <path d="M664 68 Q671 52 671 42" />
          <path d="M678 68 Q671 52 671 42" />
          <line x1="671" y1="42" x2="671" y2="26" />
          <circle cx="671" cy="24" r="2" />
          {/* Arch between base legs */}
          <path d="M630 250 Q671 216 712 250" strokeWidth="1" />
          {/* Cross-bracing details */}
          <line x1="626" y1="238" x2="644" y2="188" strokeWidth="0.6" />
          <line x1="716" y1="238" x2="698" y2="188" strokeWidth="0.6" />
          <line x1="644" y1="188" x2="652" y2="133" strokeWidth="0.6" />
          <line x1="698" y1="188" x2="690" y2="133" strokeWidth="0.6" />

          {/* ═══════════════════════════════════════════════════
              7. BIG BEN — London
              Tall clock tower, Gothic spire, clock face, turrets.
              x: 740–818
          ═══════════════════════════════════════════════════ */}
          {/* Main tower body */}
          <rect x="755" y="76" width="46" height="168" />
          {/* Gothic spire */}
          <path d="M755 76 L778 22 L801 76" />
          {/* Spire centre rib */}
          <line x1="778" y1="22" x2="778" y2="76" strokeWidth="0.6" />
          {/* Clock belfry box */}
          <rect x="750" y="108" width="56" height="48" rx="2" />
          {/* Clock face */}
          <circle cx="778" cy="132" r="19" />
          {/* Clock hands */}
          <line x1="778" y1="132" x2="778" y2="117" strokeWidth="1.4" />
          <line x1="778" y1="132" x2="792" y2="132" strokeWidth="1.2" />
          {/* Hour markers */}
          <line x1="778" y1="114" x2="778" y2="117" strokeWidth="0.8" />
          <line x1="778" y1="148" x2="778" y2="151" strokeWidth="0.8" />
          <line x1="760" y1="132" x2="763" y2="132" strokeWidth="0.8" />
          <line x1="795" y1="132" x2="798" y2="132" strokeWidth="0.8" />
          {/* Corner turrets */}
          <rect x="744" y="86" width="12" height="90" />
          <rect x="800" y="86" width="12" height="90" />
          <path d="M744 86 L750 76 L756 86" />
          <path d="M800 86 L806 76 L812 86" />
          {/* Base plinth */}
          <rect x="740" y="244" width="76" height="6" />
          {/* Parliament wing suggestion */}
          <rect x="740" y="214" width="18" height="30" />
          <rect x="798" y="214" width="20" height="30" />

          {/* ═══════════════════════════════════════════════════
              8. STATUE OF LIBERTY — New York
              Crown + raised torch arm + flowing robe + pedestal.
              x: 838–924
          ═══════════════════════════════════════════════════ */}
          {/* Two-tier pedestal */}
          <rect x="852" y="204" width="50" height="46" />
          <rect x="845" y="197" width="64" height="10" />
          {/* Robe / lower body */}
          <path d="M856 197 L860 152 L894 152 L898 197" />
          {/* Robe folds */}
          <line x1="864" y1="197" x2="862" y2="152" strokeWidth="0.6" />
          <line x1="877" y1="197" x2="877" y2="152" strokeWidth="0.6" />
          <line x1="890" y1="197" x2="892" y2="152" strokeWidth="0.6" />
          {/* Torso */}
          <rect x="868" y="126" width="18" height="28" />
          {/* Head */}
          <circle cx="877" cy="118" r="9" />
          {/* Crown spikes — 7 rays */}
          <line x1="877" y1="109" x2="877" y2="96" />
          <line x1="870" y1="111" x2="864" y2="99" />
          <line x1="884" y1="111" x2="890" y2="99" />
          <line x1="868" y1="115" x2="859" y2="107" />
          <line x1="886" y1="115" x2="895" y2="107" />
          <line x1="866" y1="119" x2="857" y2="114" />
          <line x1="888" y1="119" x2="897" y2="114" />
          {/* Raised right arm + torch */}
          <line x1="886" y1="136" x2="904" y2="108" />
          <path d="M900 108 L904 100 L908 108" />
          <line x1="904" y1="100" x2="904" y2="92" />
          {/* Torch flame */}
          <path d="M900 92 Q904 82 908 92 Q904 87 900 92" />
          {/* Left arm + tablet */}
          <line x1="868" y1="136" x2="856" y2="150" />
          <rect x="850" y="148" width="9" height="13" rx="1" />

          {/* ═══════════════════════════════════════════════════
              CONTINUOUS GROUND BASELINE
          ═══════════════════════════════════════════════════ */}
          <line x1="10" y1="250" x2="1590" y2="250" strokeWidth="0.6" />

          {/* ═══════════════════════════════════════════════════
              DECORATIVE ARCH FILL — x: 940–1590
              Arch motifs with domes to fill the panorama
              and keep the skyline feeling continuous.
          ═══════════════════════════════════════════════════ */}
          <path d="M940 250 L940 218 Q956 200 972 218 L972 250" strokeWidth="0.9" />
          <line x1="956" y1="200" x2="956" y2="190" />
          <circle cx="956" cy="188" r="2" />
          <path d="M984 250 L984 232 Q994 220 1004 232 L1004 250" strokeWidth="0.9" />
          <path d="M1016 250 L1016 215 Q1034 196 1052 215 L1052 250" strokeWidth="0.9" />
          <line x1="1034" y1="196" x2="1034" y2="184" />
          <circle cx="1034" cy="182" r="2.5" />
          <path d="M1064 250 L1064 236 Q1074 224 1084 236 L1084 250" strokeWidth="0.9" />
          <path d="M1096 250 L1096 222 Q1112 203 1128 222 L1128 250" strokeWidth="0.9" />
          <line x1="1112" y1="203" x2="1112" y2="192" />
          <circle cx="1112" cy="190" r="2" />
          <path d="M1140 250 L1140 235 Q1150 223 1160 235 L1160 250" strokeWidth="0.9" />
          <path d="M1172 250 L1172 218 Q1188 200 1204 218 L1204 250" strokeWidth="0.9" />
          <line x1="1188" y1="200" x2="1188" y2="189" />
          <circle cx="1188" cy="187" r="2" />
          <path d="M1216 250 L1216 234 Q1226 222 1236 234 L1236 250" strokeWidth="0.9" />
          <path d="M1248 250 L1248 218 Q1264 200 1280 218 L1280 250" strokeWidth="0.9" />
          <line x1="1264" y1="200" x2="1264" y2="190" />
          <circle cx="1264" cy="188" r="2" />
          <path d="M1292 250 L1292 234 Q1302 222 1312 234 L1312 250" strokeWidth="0.9" />
          <path d="M1324 250 L1324 218 Q1340 200 1356 218 L1356 250" strokeWidth="0.9" />
          <line x1="1340" y1="200" x2="1340" y2="189" />
          <circle cx="1340" cy="187" r="2.5" />
          <path d="M1368 250 L1368 235 Q1378 223 1388 235 L1388 250" strokeWidth="0.9" />
          <path d="M1400 250 L1400 218 Q1416 200 1432 218 L1432 250" strokeWidth="0.9" />
          <line x1="1416" y1="200" x2="1416" y2="188" />
          <circle cx="1416" cy="186" r="2" />
          <path d="M1444 250 L1444 234 Q1454 222 1464 234 L1464 250" strokeWidth="0.9" />
          <path d="M1476 250 L1476 220 Q1490 202 1504 220 L1504 250" strokeWidth="0.9" />
          <path d="M1516 250 L1516 235 Q1526 223 1536 235 L1536 250" strokeWidth="0.9" />
          <path d="M1548 250 L1548 218 Q1562 202 1576 218 L1576 250" strokeWidth="0.9" />
          <path d="M1588 250 L1588 235 Q1596 226 1604 235 L1604 250" strokeWidth="0.9" />
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

        /* ── No horizontal scroll bleed ── */
        #why-choose-us { max-width: 100vw; }

        /* ── On very wide screens (>1600px), scale SVG to cover width ──
           background-size:contain leaves gaps on ultra-wide; use cover
           for screens wider than the SVG's native 1600px viewBox. */
        @media (min-width: 1600px) {
          #why-choose-us > div[aria-hidden] {
            background-size: cover !important;
          }
        }
      `}</style>
    </section>
  );
}
