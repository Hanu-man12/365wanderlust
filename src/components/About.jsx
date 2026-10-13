// ============================================================
//  About / Who We Are Section
//  Clean editorial layout — three paragraphs of company copy,
//  no placeholder photo/cards.
//  Dark-mode aware via CSS custom properties + .dark class.
// ============================================================
import React from 'react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const PARAGRAPHS = [
  '365 Wanderlust is a travel planning entity focused on offbeat, adventure, leisure, cultural & sustainable tour plans which is led by professional tourism experts throughout the year.',
  'We curate top notch tour plans with efficient team effort, real time critical thinking, in-depth travel planning knowledge & joy.',
  'We are promised to deliver an unbeatable experience under ideal pricing which will be beneficial to the eco-system, local communities & to the travellers as well.',
];

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="about-section"
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Faint ornamental mandala — top-right decorative only */}
      <div aria-hidden="true" className="about-mandala" style={{
        position: 'absolute', top: '-60px', right: '-60px', opacity: 0.05, pointerEvents: 'none',
        /* Clamp size so it never causes horizontal overflow on narrow phones */
        width: 'min(320px, 55vw)',
        height: 'min(320px, 55vw)',
        overflow: 'hidden',
      }}>
        <svg width="320" height="320" viewBox="0 0 400 400">
          {[30,60,90,120,150,180].map(r => (
            <circle key={r} cx="200" cy="200" r={r} stroke="#D0112B" strokeWidth="0.8" fill="none"/>
          ))}
          {[45,135,225,315].map(a => (
            <line key={a}
              x1={200 + 180 * Math.cos(a * Math.PI/180)}
              y1={200 + 180 * Math.sin(a * Math.PI/180)}
              x2={200 + 30 * Math.cos(a * Math.PI/180)}
              y2={200 + 30 * Math.sin(a * Math.PI/180)}
              stroke="#D0112B" strokeWidth="0.6"
            />
          ))}
        </svg>
      </div>

      <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative' }}>

        {/* Section heading */}
        <Reveal>
          <SectionHeading
            label="Our Story"
            heading="Who We Are"
            align="center"
          />
        </Reveal>

        {/* Three paragraphs — centered prose block */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.6rem',
          maxWidth: '680px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          {PARAGRAPHS.map((text, i) => (
            <Reveal key={i} className={`reveal-delay-${i + 1}`}>
              <p className="about-para" style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(0.95rem, 2vw, 1.08rem)',
                lineHeight: 1.9,
                margin: 0,
              }}>
                {text}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Ornamental tagline rule */}
        <Reveal className="reveal-delay-4">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '3rem',
          }}>
            <div className="about-rule" />
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.1rem',
              fontStyle: 'italic',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--color-brand-red)',
            }}>
              Grab Your Leisure
            </span>
            <div className="about-rule" />
          </div>
        </Reveal>
      </div>

      <style>{`
        /* ── Light mode (default) ── */
        .about-section {
          background-color: var(--color-off-white);
        }
        .about-para {
          color: var(--color-dark-grey);
        }
        .about-rule {
          flex: 1;
          max-width: 80px;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--color-brand-red), transparent);
        }

        /* ── Dark mode ── */
        .dark .about-section {
          background-color: #111111;
        }
        .dark .about-para {
          color: rgba(245, 237, 216, 0.82);
        }
        .dark .about-mandala {
          opacity: 0.07;
        }
      `}</style>
    </section>
  );
}
