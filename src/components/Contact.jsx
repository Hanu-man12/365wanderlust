// ============================================================
//  Contact Section — Contact details + Enquiry form
//  Same page, id="contact" (no separate route)
// ============================================================
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Copy, CheckCheck } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import { contact, brand } from '../data/siteData';
import { getWhatsAppLink, getMailtoLink, getTelLink } from '../utils/contactLinks';
import SectionHeading from './SectionHeading';
import EnquiryForm from './EnquiryForm';
import Reveal from './Reveal';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = contact.email;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-parchment"
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Reveal>
          <SectionHeading
            label="Let's Plan Your Trip"
            heading="Get In Touch"
            subtext="We're ready when you are. Reach us on WhatsApp, email, or phone."
          />
        </Reveal>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'flex-start',
        }} className="contact-grid">

          {/* Left: Contact details */}
          {/* NOTE: NOT wrapped in Reveal — brand heading must always be visible on load */}
          <div>
              {/* Heading — explicit colors, never scroll-dependent */}
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                fontWeight: 700,
                margin: '0 0 0.5rem 0',
              }}>
                {/* "365" in crimson, "Wanderlust" in dark charcoal — both always visible on cream bg */}
                <span style={{ color: '#D0112B' }}>365 </span>
                <span style={{ color: '#1a1a1a' }}>Wanderlust</span>
              </h3>
              <p style={{
                fontFamily: 'var(--font-script)',
                fontSize: '1.1rem',
                color: '#D0112B',
                marginBottom: '2rem',
              }}>
                {brand.tagline}
              </p>

              {/* WhatsApp */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-brown-light)',
                  marginBottom: '0.5rem',
                }}>
                  WhatsApp
                </p>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#128C7E',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                    minHeight: '44px',
                  }}
                  onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  <FaWhatsapp size={22} />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Phones */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-brown-light)',
                  marginBottom: '0.5rem',
                }}>
                  Phone
                </p>
                {contact.phones.map(ph => (
                  <a
                    key={ph.number}
                    href={getTelLink(ph.number)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'var(--color-brown)',
                      textDecoration: 'none',
                      marginBottom: '0.4rem',
                      minHeight: '44px',
                      transition: 'color 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--color-brand-red)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--color-brown)'}
                  >
                    <Phone size={16} color="var(--color-sand)" />
                    {ph.display}
                  </a>
                ))}
              </div>

              {/* Email with copy fallback */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-brown-light)',
                  marginBottom: '0.5rem',
                }}>
                  Email
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <a
                    href={getMailtoLink('Travel Enquiry — 365 Wanderlust')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.92rem',
                      color: 'var(--color-brown)',
                      textDecoration: 'none',
                      wordBreak: 'break-all',
                      transition: 'color 0.2s',
                      minHeight: '44px',
                    }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--color-brand-red)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--color-brown)'}
                  >
                    <Mail size={16} color="var(--color-sand)" />
                    {contact.email}
                  </a>
                  {/* Copy email fallback */}
                  <button
                    onClick={copyEmail}
                    aria-label={copied ? 'Email copied!' : 'Copy email address'}
                    title={copied ? 'Copied!' : 'Copy email'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'none',
                      border: '1px solid rgba(212,149,106,0.3)',
                      borderRadius: '3px',
                      padding: '0.3rem 0.65rem',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      color: copied ? '#2ecc71' : 'var(--color-brown-light)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      minHeight: '32px',
                    }}
                  >
                    {copied
                      ? <><CheckCheck size={12} /> Copied!</>
                      : <><Copy size={12} /> Copy</>
                    }
                  </button>
                </div>
              </div>

              {/* Address */}
              <div style={{ marginBottom: '2rem' }}>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-brown-light)',
                  marginBottom: '0.5rem',
                }}>
                  Location
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                }}>
                  <MapPin size={16} color="var(--color-sand)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    color: contact.address.startsWith('[') ? 'var(--color-brown-light)' : 'var(--color-brown)',
                    fontStyle: contact.address.startsWith('[') ? 'italic' : 'normal',
                    opacity: contact.address.startsWith('[') ? 0.6 : 1,
                    margin: 0,
                    lineHeight: 1.6,
                  }}>
                    {contact.address}
                  </p>
                </div>
              </div>

              {/* Social Links — always show FB/Instagram, show YouTube only if filled */}
              <div style={{ marginTop: '1rem' }}>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-brown-light)',
                  marginBottom: '0.8rem',
                }}>
                  Follow Us
                </p>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  {/* Instagram — renders always; clickable only when URL is filled */}
                  {contact.social.instagram ? (
                    <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer"
                      aria-label="Visit our Instagram page"
                      style={{ color: '#888480', transition: 'color 0.2s', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseOver={e => e.currentTarget.style.color = '#E1306C'}
                      onMouseOut={e => e.currentTarget.style.color = '#888480'}
                    >
                      <FaInstagram size={22} />
                    </a>
                  ) : (
                    <span aria-label="Instagram (coming soon)" style={{ color: '#ccc', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}>
                      <FaInstagram size={22} />
                    </span>
                  )}
                  {/* Facebook — renders always; clickable only when URL is filled */}
                  {contact.social.facebook ? (
                    <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer"
                      aria-label="Visit our Facebook page"
                      style={{ color: '#888480', transition: 'color 0.2s', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseOver={e => e.currentTarget.style.color = '#1877F2'}
                      onMouseOut={e => e.currentTarget.style.color = '#888480'}
                    >
                      <FaFacebook size={22} />
                    </a>
                  ) : (
                    <span aria-label="Facebook (coming soon)" style={{ color: '#ccc', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}>
                      <FaFacebook size={22} />
                    </span>
                  )}
                  {/* YouTube — only show if URL is filled */}
                  {contact.social.youtube && (
                    <a href={contact.social.youtube} target="_blank" rel="noopener noreferrer"
                      aria-label="Visit our YouTube channel"
                      style={{ color: '#888480', transition: 'color 0.2s', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseOver={e => e.currentTarget.style.color = '#FF0000'}
                      onMouseOut={e => e.currentTarget.style.color = '#888480'}
                    >
                      <FaYoutube size={22} />
                    </a>
                  )}
                </div>
              </div>
            </div>

          {/* Right: Enquiry Form */}
          <Reveal className="reveal-delay-2">
            <EnquiryForm />
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
