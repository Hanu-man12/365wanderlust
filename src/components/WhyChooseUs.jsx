// ============================================================
//  Why Choose Us — Dark ink section, icon grid
//  Only qualitative, genuine points — no fake statistics
// ============================================================
import React from 'react';
import { Compass, Heart, Users, MapPin, Star, Shield } from 'lucide-react';
import { whyChooseUs } from '../data/siteData';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const ICON_MAP = { Compass, Heart, Users, MapPin, Star, Shield };

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-heading"
      className="bg-ink"
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative faint camel silhouette line */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Cpath d='M10 50 Q20 20 35 30 Q40 10 50 25 Q55 15 65 30 L70 50 Z' fill='%23D4956A'/%3E%3Ccircle cx='45' cy='22' r='6' fill='%23D4956A'/%3E%3Cpath d='M100 50 Q110 20 125 30 Q130 10 140 25 Q145 15 155 30 L160 50 Z' fill='%23D4956A'/%3E%3Ccircle cx='135' cy='22' r='6' fill='%23D4956A'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'bottom',
        backgroundSize: '300px 60px',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <SectionHeading
            label="Why Travel With Us"
            heading="Our Approach"
            subtext="We believe great travel is about depth, not distance."
            theme="dark"
          />
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
        }}>
          {whyChooseUs.map((item, i) => {
            const IconComponent = ICON_MAP[item.icon];
            return (
              <Reveal key={item.title} className={`reveal-delay-${(i % 4) + 1}`}>
                <div style={{
                  padding: '2rem',
                  background: 'rgba(245,237,216,0.04)',
                  border: '1px solid rgba(200,134,26,0.15)',
                  borderRadius: '4px',
                  transition: 'background 0.3s, border-color 0.3s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'rgba(245,237,216,0.07)';
                  e.currentTarget.style.borderColor = 'rgba(200,134,26,0.3)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'rgba(245,237,216,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(200,134,26,0.15)';
                }}
                >
                  {/* Icon */}
                  {IconComponent && (
                    <div style={{
                      width: '44px', height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(200,16,46,0.15)',
                      border: '1px solid rgba(200,16,46,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.2rem',
                    }}>
                      <IconComponent size={18} color="#C8102E" aria-hidden="true" />
                    </div>
                  )}

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--color-cream)',
                    margin: '0 0 0.6rem 0',
                  }}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.88rem',
                    lineHeight: 1.75,
                    color: 'rgba(245,237,216,0.65)',
                    margin: 0,
                  }}>
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
