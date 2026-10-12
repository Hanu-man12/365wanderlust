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

// ── Panoramic landmark line-art SVG ───────────────────────────
// Single continuous skyline composition, 1600×280 viewBox.
// 8 world landmarks as white outline silhouettes on crimson bg.
// Arrangement left→right:
//   Victoria Memorial (Kolkata) · Qutub Minar (Delhi) ·
//   Statue of Unity (Gujarat) · Christ the Redeemer (Brazil) ·
//   Taj Mahal · Eiffel Tower · Big Ben · Statue of Liberty
//
// Ground baseline: y=250. All structures sit on this line.
// Stroke: white, weight 1.0px uniform. Opacity wrapper: 0.10.
// No fills — outline/diagram style throughout.
// Implemented as inline SVG → data URI (no raster file, crisp at any zoom).
//
// Path geometry:
//   Each landmark is drawn as a simplified but recognisable architectural
//   silhouette using SVG path, line, rect, circle, and polygon primitives.
//   Absolute coordinates; all structures spaced and scaled to form one
//   cohesive left-to-right skyline without collision or awkward gaps.
// ─────────────────────────────────────────────────────────────

const LANDMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 280" preserveAspectRatio="xMidYMid meet">
<g fill="none" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.11">

<!-- ═══════════════════════════════════════════════════════
     1. VICTORIA MEMORIAL — Kolkata
     Large central dome flanked by smaller corner domes,
     base colonnade, wide symmetrical wings.
     x-range: 10-160
═══════════════════════════════════════════════════════ -->
<!-- Main dome -->
<path d="M85 148 Q85 100 85 95 Q73 90 65 100 Q55 88 65 75 Q75 62 85 70 Q95 62 105 75 Q115 88 105 100 Q97 90 85 95"/>
<!-- Dome lantern / finial -->
<line x1="85" y1="70" x2="85" y2="58"/>
<circle cx="85" cy="56" r="3"/>
<line x1="85" y1="53" x2="85" y2="47"/>
<!-- Drum below dome -->
<rect x="68" y="148" width="34" height="14" rx="0"/>
<!-- Colonnade base -->
<rect x="40" y="162" width="90" height="12"/>
<!-- Wide wings -->
<rect x="20" y="174" width="130" height="18"/>
<!-- Wing corner domes (small) -->
<path d="M30 174 Q30 162 30 158 Q24 155 20 160 Q16 152 20 146 Q24 140 30 145 Q36 140 40 146 Q44 152 40 160 Q36 155 30 158"/>
<line x1="30" y1="146" x2="30" y2="140"/>
<circle cx="30" cy="138" r="1.5"/>
<path d="M140 174 Q140 162 140 158 Q134 155 130 160 Q126 152 130 146 Q134 140 140 145 Q146 140 150 146 Q154 152 150 160 Q146 155 140 158"/>
<line x1="140" y1="146" x2="140" y2="140"/>
<circle cx="140" cy="138" r="1.5"/>
<!-- Base steps -->
<rect x="14" y="192" width="142" height="5"/>
<rect x="10" y="197" width="150" height="5"/>
<!-- Ground -->
<line x1="10" y1="202" x2="160" y2="202"/>

<!-- ═══════════════════════════════════════════════════════
     2. QUTUB MINAR — Delhi
     Tall tapered cylindrical tower with balcony rings,
     distinctive tapering from wide base to narrow top.
     x-range: 178-222
═══════════════════════════════════════════════════════ -->
<!-- Tower body — tapered -->
<path d="M178 250 L182 120 Q200 108 218 120 L222 250"/>
<!-- Tapering detail lines -->
<path d="M181 200 Q200 193 219 200"/>
<path d="M183 160 Q200 154 217 160"/>
<path d="M184 130 Q200 124 216 130"/>
<!-- Balcony rings (corbelled) -->
<path d="M180 218 Q200 212 220 218 L220 224 Q200 230 180 224 Z"/>
<path d="M182 175 Q200 169 218 175 L218 181 Q200 187 182 181 Z"/>
<path d="M184 143 Q200 137 216 143 L216 149 Q200 155 184 149 Z"/>
<!-- Cap / cupola -->
<path d="M193 120 Q200 104 207 120 Q200 116 193 120"/>
<line x1="200" y1="104" x2="200" y2="96"/>
<circle cx="200" cy="94" r="2"/>
<!-- Vertical fluting lines -->
<line x1="191" y1="120" x2="181" y2="250" stroke-width="0.5"/>
<line x1="200" y1="108" x2="200" y2="250" stroke-width="0.5"/>
<line x1="209" y1="120" x2="219" y2="250" stroke-width="0.5"/>
<!-- Ground -->
<line x1="172" y1="250" x2="228" y2="250"/>

<!-- ═══════════════════════════════════════════════════════
     3. STATUE OF UNITY — Gujarat
     Tall standing figure on a high pedestal/plinth,
     heroic proportions, slight forward lean.
     x-range: 245-295
═══════════════════════════════════════════════════════ -->
<!-- Pedestal / plinth -->
<rect x="252" y="198" width="36" height="52"/>
<rect x="248" y="194" width="44" height="8"/>
<!-- Figure torso -->
<rect x="261" y="160" width="18" height="36"/>
<!-- Figure head -->
<ellipse cx="270" cy="152" rx="8" ry="9"/>
<!-- Arms — slightly at sides -->
<line x1="261" y1="170" x2="250" y2="180"/>
<line x1="279" y1="170" x2="290" y2="180"/>
<!-- Cap/hat detail -->
<path d="M262 145 Q270 138 278 145"/>
<line x1="270" y1="143" x2="270" y2="138"/>
<!-- Legs implied by trouser lines -->
<line x1="266" y1="196" x2="263" y2="198"/>
<line x1="274" y1="196" x2="277" y2="198"/>
<!-- Plinth decorative lines -->
<line x1="252" y1="210" x2="288" y2="210"/>
<line x1="252" y1="222" x2="288" y2="222"/>
<line x1="252" y1="234" x2="288" y2="234"/>
<!-- Ground -->
<line x1="242" y1="250" x2="298" y2="250"/>

<!-- ═══════════════════════════════════════════════════════
     4. CHRIST THE REDEEMER — Rio
     Standing figure with arms wide open on a narrow pedestal,
     distinctively wide outstretched arms.
     x-range: 315-405
═══════════════════════════════════════════════════════ -->
<!-- Pedestal / plinth (Corcovado base simplified) -->
<rect x="353" y="210" width="14" height="40"/>
<rect x="346" y="205" width="28" height="8"/>
<!-- Figure body -->
<rect x="357" y="178" width="6" height="30"/>
<!-- Head -->
<circle cx="360" cy="172" r="6"/>
<!-- Outstretched arms — the signature silhouette -->
<line x1="315" y1="195" x2="405" y2="195"/>
<!-- Hands -->
<circle cx="315" cy="195" r="2"/>
<circle cx="405" cy="195" r="2"/>
<!-- Robe flow lines -->
<line x1="357" y1="190" x2="350" y2="208" stroke-width="0.6"/>
<line x1="363" y1="190" x2="370" y2="208" stroke-width="0.6"/>
<!-- Ground -->
<line x1="315" y1="250" x2="405" y2="250"/>

<!-- ═══════════════════════════════════════════════════════
     5. TAJ MAHAL
     Central onion dome, four minarets, arched iwan,
     symmetrical chattris, wide platform.
     x-range: 422-578
═══════════════════════════════════════════════════════ -->
<!-- Main onion dome -->
<path d="M500 102 Q490 82 490 70 Q490 50 500 44 Q510 38 520 44 Q530 50 530 70 Q530 82 520 102"/>
<!-- Inverted lotus at base of dome -->
<path d="M487 102 Q500 108 513 102"/>
<!-- Drum below dome -->
<rect x="488" y="108" width="24" height="12"/>
<!-- Chattris (small domed kiosks) on corners of main block -->
<path d="M456 130 Q456 122 460 119 Q464 116 468 119 Q472 122 472 130"/>
<path d="M528 130 Q528 122 532 119 Q536 116 540 119 Q544 122 544 130"/>
<!-- Central iwan (arched entrance) -->
<path d="M481 185 L481 148 Q481 128 500 128 Q519 128 519 148 L519 185"/>
<!-- Inner arch (recessed) -->
<path d="M486 185 L486 152 Q486 134 500 134 Q514 134 514 152 L514 185"/>
<!-- Main platform / plinth -->
<rect x="440" y="185" width="120" height="12"/>
<!-- Side wings/rooms -->
<rect x="422" y="160" width="36" height="37"/>
<rect x="542" y="160" width="36" height="37"/>
<!-- Arched windows on wings -->
<path d="M430 185 L430 173 Q435 167 440 173 L440 185"/>
<path d="M558 185 L558 173 Q563 167 568 173 L568 185"/>
<!-- Four minarets -->
<rect x="426" y="118" width="6" height="42"/>
<rect x="568" y="118" width="6" height="42"/>
<rect x="434" y="108" width="6" height="12"/>
<rect x="560" y="108" width="6" height="12"/>
<!-- Minaret caps -->
<path d="M424 118 Q429 110 434 118"/>
<path d="M566 118 Q571 110 576 118"/>
<line x1="429" y1="110" x2="429" y2="104"/>
<circle cx="429" cy="102" r="1.5"/>
<line x1="571" y1="110" x2="571" y2="104"/>
<circle cx="571" cy="102" r="1.5"/>
<!-- Taj finial -->
<line x1="500" y1="44" x2="500" y2="36"/>
<circle cx="500" cy="34" r="2"/>
<!-- Water channel (reflecting pool suggestion) -->
<line x1="470" y1="200" x2="530" y2="200" stroke-dasharray="4 3" stroke-width="0.6"/>
<!-- Ground -->
<line x1="422" y1="250" x2="578" y2="250"/>

<!-- ═══════════════════════════════════════════════════════
     6. EIFFEL TOWER — Paris
     Iconic lattice iron tower, four arched legs meeting
     at first platform, tapering to antenna.
     x-range: 597-683
═══════════════════════════════════════════════════════ -->
<!-- Left leg -->
<path d="M597 250 L618 184 L628 130 L637 70"/>
<!-- Right leg -->
<path d="M683 250 L662 184 L652 130 L643 70"/>
<!-- First floor platform -->
<line x1="615" y1="185" x2="665" y2="185"/>
<rect x="614" y="181" width="52" height="7"/>
<!-- Second floor platform -->
<line x1="625" y1="132" x2="655" y2="132"/>
<rect x="624" y="128" width="32" height="6"/>
<!-- Top section -->
<path d="M637 70 Q640 58 640 50 L640 30"/>
<path d="M643 70 Q640 58 640 50"/>
<!-- Antenna -->
<line x1="640" y1="30" x2="640" y2="18"/>
<circle cx="640" cy="17" r="1.5"/>
<!-- Cross-lattice details (simplified) -->
<line x1="601" y1="235" x2="617" y2="190" stroke-width="0.5"/>
<line x1="608" y1="235" x2="616" y2="210" stroke-width="0.5"/>
<line x1="679" y1="235" x2="663" y2="190" stroke-width="0.5"/>
<line x1="672" y1="235" x2="664" y2="210" stroke-width="0.5"/>
<line x1="618" y1="190" x2="622" y2="135" stroke-width="0.5"/>
<line x1="662" y1="190" x2="658" y2="135" stroke-width="0.5"/>
<!-- Arch between legs at base -->
<path d="M606 250 Q640 220 674 250" stroke-width="0.7"/>
<!-- Ground -->
<line x1="592" y1="250" x2="688" y2="250"/>

<!-- ═══════════════════════════════════════════════════════
     7. BIG BEN — London
     Tall clock tower, clock face with hands, Gothic
     spire top, Houses of Parliament wing suggestion.
     x-range: 704-770
═══════════════════════════════════════════════════════ -->
<!-- Main tower body -->
<rect x="723" y="80" width="38" height="160"/>
<!-- Gothic spire -->
<path d="M723 80 L742 28 L761 80"/>
<!-- Spire detail ribs -->
<line x1="742" y1="28" x2="742" y2="80" stroke-width="0.5"/>
<line x1="733" y1="55" x2="751" y2="55" stroke-width="0.5"/>
<!-- Clock storey (belfry) -->
<rect x="720" y="112" width="44" height="44" rx="2"/>
<!-- Clock face circle -->
<circle cx="742" cy="134" r="16"/>
<!-- Clock hands -->
<line x1="742" y1="134" x2="742" y2="122"/>
<line x1="742" y1="134" x2="752" y2="134"/>
<!-- Quarter markers on clock -->
<line x1="742" y1="120" x2="742" y2="122" stroke-width="0.6"/>
<line x1="742" y1="146" x2="742" y2="148" stroke-width="0.6"/>
<line x1="728" y1="134" x2="730" y2="134" stroke-width="0.6"/>
<line x1="754" y1="134" x2="756" y2="134" stroke-width="0.6"/>
<!-- Corner turrets -->
<rect x="718" y="90" width="8" height="90"/>
<rect x="758" y="90" width="8" height="90"/>
<path d="M718 90 L722 80 L726 90"/>
<path d="M758 90 L762 80 L766 90"/>
<!-- Base / plinth -->
<rect x="704" y="240" width="66" height="10"/>
<!-- Parliament wing suggestion (low horizontal building) -->
<rect x="704" y="210" width="20" height="30"/>
<rect x="760" y="210" width="20" height="30"/>
<line x1="704" y1="215" x2="724" y2="215" stroke-width="0.5"/>
<line x1="760" y1="215" x2="780" y2="215" stroke-width="0.5"/>
<!-- Ground -->
<line x1="700" y1="250" x2="784" y2="250"/>

<!-- ═══════════════════════════════════════════════════════
     8. STATUE OF LIBERTY — New York
     Crown with spikes, raised torch arm, flowing robe,
     high pedestal/base.
     x-range: 800-880
═══════════════════════════════════════════════════════ -->
<!-- Pedestal (two-tier) -->
<rect x="818" y="206" width="44" height="44"/>
<rect x="812" y="200" width="56" height="9"/>
<!-- Figure lower body / robe -->
<path d="M822 200 L826 155 L854 155 L858 200"/>
<!-- Robe folds -->
<line x1="830" y1="200" x2="828" y2="155" stroke-width="0.5"/>
<line x1="840" y1="200" x2="840" y2="155" stroke-width="0.5"/>
<line x1="850" y1="200" x2="852" y2="155" stroke-width="0.5"/>
<!-- Torso -->
<rect x="833" y="130" width="14" height="27"/>
<!-- Head -->
<circle cx="840" cy="123" r="8"/>
<!-- Crown spikes (7 rays) -->
<line x1="840" y1="115" x2="840" y2="104"/>
<line x1="834" y1="116" x2="829" y2="106"/>
<line x1="846" y1="116" x2="851" y2="106"/>
<line x1="832" y1="119" x2="825" y2="112"/>
<line x1="848" y1="119" x2="855" y2="112"/>
<line x1="831" y1="122" x2="823" y2="118"/>
<line x1="849" y1="122" x2="857" y2="118"/>
<!-- Right arm raised holding torch -->
<line x1="847" y1="140" x2="862" y2="115"/>
<!-- Torch -->
<path d="M858 115 L862 108 L866 115"/>
<line x1="862" y1="108" x2="862" y2="102"/>
<!-- Torch flame -->
<path d="M858 102 Q862 94 866 102 Q862 97 858 102"/>
<!-- Left arm holding tablet (downward) -->
<line x1="833" y1="140" x2="823" y2="152"/>
<rect x="818" y="150" width="7" height="11" rx="1"/>
<!-- Ground -->
<line x1="800" y1="250" x2="884" y2="250"/>

<!-- ══════════════════════════════════════════════
     GROUND BASELINE — continuous connecting line
     Ties all structures into one cohesive skyline.
══════════════════════════════════════════════ -->
<line x1="10" y1="250" x2="1600" y2="250" stroke-width="0.5" stroke-dasharray="1 0"/>

<!-- ══════════════════════════════════════════════
     DECORATIVE FILL — beyond landmark 8 to right
     Repeating small arch motifs to fill dead space
     and keep the panorama feeling continuous.
══════════════════════════════════════════════ -->
<path d="M900 250 L900 220 Q912 205 924 220 L924 250" stroke-width="0.7"/>
<path d="M930 250 L930 230 Q938 220 946 230 L946 250" stroke-width="0.7"/>
<path d="M952 250 L952 215 Q966 198 980 215 L980 250" stroke-width="0.7"/>
<line x1="966" y1="198" x2="966" y2="190"/>
<circle cx="966" cy="188" r="2"/>
<path d="M992 250 L992 232 Q1001 222 1010 232 L1010 250" stroke-width="0.7"/>
<path d="M1020 250 L1020 220 Q1034 204 1048 220 L1048 250" stroke-width="0.7"/>
<line x1="1034" y1="204" x2="1034" y2="194"/>
<circle cx="1034" cy="192" r="1.5"/>
<path d="M1060 250 L1060 238 Q1068 228 1076 238 L1076 250" stroke-width="0.7"/>
<path d="M1085 250 L1085 222 Q1098 206 1111 222 L1111 250" stroke-width="0.7"/>
<path d="M1120 250 L1120 235 Q1129 225 1138 235 L1138 250" stroke-width="0.7"/>
<path d="M1148 250 L1148 218 Q1162 202 1176 218 L1176 250" stroke-width="0.7"/>
<line x1="1162" y1="202" x2="1162" y2="193"/>
<circle cx="1162" cy="191" r="2"/>
<path d="M1188 250 L1188 230 Q1197 220 1206 230 L1206 250" stroke-width="0.7"/>
<path d="M1216 250 L1216 220 Q1230 204 1244 220 L1244 250" stroke-width="0.7"/>
<path d="M1255 250 L1255 235 Q1263 225 1271 235 L1271 250" stroke-width="0.7"/>
<path d="M1280 250 L1280 215 Q1295 198 1310 215 L1310 250" stroke-width="0.7"/>
<line x1="1295" y1="198" x2="1295" y2="188"/>
<circle cx="1295" cy="186" r="2"/>
<path d="M1322 250 L1322 232 Q1331 222 1340 232 L1340 250" stroke-width="0.7"/>
<path d="M1352 250 L1352 220 Q1366 204 1380 220 L1380 250" stroke-width="0.7"/>
<line x1="1366" y1="204" x2="1366" y2="194"/>
<circle cx="1366" cy="192" r="1.5"/>
<path d="M1392 250 L1392 235 Q1400 225 1408 235 L1408 250" stroke-width="0.7"/>
<path d="M1418 250 L1418 222 Q1430 207 1442 222 L1442 250" stroke-width="0.7"/>
<path d="M1452 250 L1452 235 Q1460 226 1468 235 L1468 250" stroke-width="0.7"/>
<path d="M1478 250 L1478 218 Q1492 202 1506 218 L1506 250" stroke-width="0.7"/>
<path d="M1518 250 L1518 232 Q1527 222 1536 232 L1536 250" stroke-width="0.7"/>
<path d="M1548 250 L1548 220 Q1562 204 1576 220 L1576 250" stroke-width="0.7"/>
<path d="M1588 250 L1588 236 Q1596 226 1604 236 L1604 250" stroke-width="0.7"/>

</g>
</svg>`;

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

  // Encode the landmark SVG for use as a CSS background-image data URI
  const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(LANDMARK_SVG)}`;

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
      {/* ── Panoramic landmark line-art — z:0, behind all content ──
           Single cohesive skyline SVG.
           - Pinned to bottom so ground baseline aligns with section floor.
           - preserveAspectRatio=xMidYMid keeps the composition centered
             and proportional at every viewport width.
           - No repeat — the SVG viewBox (1600px wide) covers desktop;
             on narrow screens it scales down proportionally (SVG is vector).
           - opacity controlled inside the SVG group (0.11).              -->
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          // Height: enough to show the tallest landmark (Qutub/Eiffel ~250px
          // in a 280px-tall viewBox). 55% of section height works well.
          height: '55%',
          backgroundImage: `url("${svgDataUri}")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center bottom',
          // contain: show full width without cropping; scales down on narrow screens
          backgroundSize: 'contain',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

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
