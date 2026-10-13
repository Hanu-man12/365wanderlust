// ============================================================
//  Footer — Logo, tagline, quick links, contact, copyright
// ============================================================
import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import { brand, contact } from '../data/siteData';
import { getMailtoLink, getTelLink } from '../utils/contactLinks';

// Footer logo — uses real image from siteData.brand.logo
function FooterLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <img
        src={brand.logo}
        alt={brand.logoAlt}
        width={34}
        height={34}
        style={{ width: 34, height: 34, objectFit: 'contain', display: 'block', flexShrink: 0 }}
      />
      <div>
        <div className="brand-wordmark" style={{
          fontSize: '1rem',
          letterSpacing: '0.04em',
        }}>
          <span style={{ color: 'white' }}>365 </span>
          <span style={{ color: '#C8102E' }}>WANDERLUST</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.55rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(200,134,26,0.8)',
        }}>
          {brand.tagline}
        </div>
      </div>
    </div>
  );
}

const NAV_LINKS = [
  { label: 'Home',         href: '#home'         },
  { label: 'About',        href: '#about'        },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Contact',      href: '#contact'      },
];

const linkStyle = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.8rem',
  color: 'rgba(245,237,216,0.55)',
  textDecoration: 'none',
  transition: 'color 0.2s',
  display: 'inline-block',
  padding: '0.2rem 0',
  minHeight: '32px',
  lineHeight: '32px',
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="bg-ink"
      style={{
        padding: 'clamp(3rem, 6vw, 5rem) 1.5rem 1.5rem',
        borderTop: '1px solid rgba(200,134,26,0.15)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Main footer grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: 'clamp(2rem, 5vw, 4rem)',
          marginBottom: '3rem',
        }} className="footer-grid">

          {/* Brand column */}
          <div>
            <FooterLogo />
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.82rem',
              lineHeight: 1.75,
              color: 'rgba(245,237,216,0.5)',
              marginTop: '1rem',
              maxWidth: '280px',
            }}>
              Let's create your travel journeys filled with adventure, leisure, excitements under the assistance of the independent travelpreneures.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem' }}>
              {/* WhatsApp icon → navigates to the Contact/enquiry form section.
                  Does NOT open WhatsApp directly — that's reserved for the
                  enquiry form's own "Send Enquiry via WhatsApp" button.       */}
              <a
                href="#contact"
                aria-label="Go to trip enquiry form"
                style={{ color: 'rgba(245,237,216,0.4)', transition: 'color 0.2s', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseOver={e => e.currentTarget.style.color = '#25D366'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(245,237,216,0.4)'}
              >
                <FaWhatsapp size={18} />
              </a>
              {contact.social.instagram && (
                <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer"
                  aria-label="Instagram"
                  style={{ color: 'rgba(245,237,216,0.4)', transition: 'color 0.2s', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseOver={e => e.currentTarget.style.color = '#E1306C'}
                  onMouseOut={e => e.currentTarget.style.color = 'rgba(245,237,216,0.4)'}
                >
                  <FaInstagram size={18} />
                </a>
              )}
              {contact.social.facebook && (
                <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer"
                  aria-label="Facebook"
                  style={{ color: 'rgba(245,237,216,0.4)', transition: 'color 0.2s', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseOver={e => e.currentTarget.style.color = '#1877F2'}
                  onMouseOut={e => e.currentTarget.style.color = 'rgba(245,237,216,0.4)'}
                >
                  <FaFacebook size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(200,134,26,0.7)',
              margin: '0 0 1rem 0',
            }}>
              Explore
            </h3>
            <nav aria-label="Footer navigation">
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {NAV_LINKS.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      style={linkStyle}
                      onMouseOver={e => e.currentTarget.style.color = 'rgba(245,237,216,0.9)'}
                      onMouseOut={e => e.currentTarget.style.color = 'rgba(245,237,216,0.55)'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact info */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(200,134,26,0.7)',
              margin: '0 0 1rem 0',
            }}>
              Contact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {contact.phones.map(ph => (
                <a key={ph.number} href={getTelLink(ph.number)}
                  style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '0.5rem', lineHeight: '1.4' }}
                  onMouseOver={e => e.currentTarget.style.color = 'rgba(245,237,216,0.9)'}
                  onMouseOut={e => e.currentTarget.style.color = 'rgba(245,237,216,0.55)'}
                >
                  <Phone size={12} /> {ph.display}
                </a>
              ))}
              <a href={getMailtoLink('Travel Enquiry')}
                style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '0.5rem', lineHeight: '1.4', wordBreak: 'break-all' }}
                onMouseOver={e => e.currentTarget.style.color = 'rgba(245,237,216,0.9)'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(245,237,216,0.55)'}
              >
                <Mail size={12} /> {contact.email}
              </a>
              <a href={brand.url} target="_blank" rel="noopener noreferrer"
                style={{ ...linkStyle, lineHeight: '1.4' }}
                onMouseOver={e => e.currentTarget.style.color = 'rgba(245,237,216,0.9)'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(245,237,216,0.55)'}
              >
                {brand.domain}
              </a>
            </div>
          </div>
        </div>

        {/* Ornament divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(200,134,26,0.15)' }} />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="2" fill="rgba(200,134,26,0.4)" />
            <circle cx="8" cy="8" r="5" stroke="rgba(200,134,26,0.3)" strokeWidth="0.8" fill="none" />
          </svg>
          <div style={{ flex: 1, height: '1px', background: 'rgba(200,134,26,0.15)' }} />
        </div>

        {/* Copyright */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.72rem',
            color: 'rgba(245,237,216,0.3)',
            margin: 0,
          }}>
            © {year} {brand.name}. All rights reserved.
          </p>
          <p style={{
            fontFamily: 'var(--font-script)',
            fontSize: '0.9rem',
            color: 'rgba(200,134,26,0.35)',
            margin: 0,
          }}>
            Grab Your Leisure
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </footer>
  );
}
