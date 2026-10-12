// ============================================================
//  Contact Section — Contact details + Enquiry form
//
//  CHANGES vs previous version:
//  1. Mobile DOM order fixed: EnquiryForm renders FIRST in DOM on mobile.
//     Achieved by rendering form inside a flex column that reverses
//     on desktop → no duplicate markup, correct tab/reading order.
//  2. WhatsApp info block REMOVED from markup (not just hidden).
//  3. Location/address block REMOVED from markup (not just hidden).
//  4. Phone Copy button added — matches email Copy button style exactly.
//  5. Tel link confirmed: <a href="tel:+917605809599">.
//  6. Mailto link confirmed: <a href="mailto:..."> via getMailtoLink().
// ============================================================
import React, { useState } from 'react';
import { Phone, Mail, Copy, CheckCheck } from 'lucide-react';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import { contact, brand } from '../data/siteData';
import { getMailtoLink, getTelLink } from '../utils/contactLinks';
import SectionHeading from './SectionHeading';
import EnquiryForm from './EnquiryForm';
import Reveal from './Reveal';

// ── Shared copy-button style (used for both email and phone) ──
const copyBtnStyle = {
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
  cursor: 'pointer',
  transition: 'all 0.2s',
  minHeight: '32px',
};

export default function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // ── Copy email ──
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
    } catch {
      const el = document.createElement('textarea');
      el.value = contact.email;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // ── Copy phone (copies the raw number with country code) ──
  const copyPhone = async () => {
    const raw = contact.phones[0]?.number || '+917605809599';
    try {
      await navigator.clipboard.writeText(raw);
    } catch {
      const el = document.createElement('textarea');
      el.value = raw;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  // ── Contact info column ──
  // Rendered as a separate component so we can place it in DOM after form
  // while visually positioning it on the left on desktop via CSS order.
  const ContactInfo = () => (
    <div className="contact-info-col">
      {/* Brand heading */}
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
        fontWeight: 700,
        margin: '0 0 0.5rem 0',
      }}>
        <span style={{ color: '#D0112B' }}>365 </span>
        <span style={{ color: '#1a1a1a' }} className="contact-brand-name">Wanderlust</span>
      </h3>
      <p style={{
        fontFamily: 'var(--font-script)',
        fontSize: '1.1rem',
        color: '#D0112B',
        marginBottom: '2rem',
      }}>
        {brand.tagline}
      </p>

      {/* Phone — tel: link + copy button */}
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
          <div key={ph.number} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            flexWrap: 'wrap',
            marginBottom: '0.4rem',
          }}>
            {/* tel: link — opens dialler on mobile; does NOT auto-call */}
            <a
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
                minHeight: '44px',
                transition: 'color 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--color-brand-red)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--color-brown)'}
            >
              <Phone size={16} color="var(--color-sand)" />
              {ph.display}
            </a>
            {/* Phone copy button — same style as email copy */}
            <button
              onClick={copyPhone}
              aria-label={copiedPhone ? 'Phone number copied!' : 'Copy phone number'}
              title={copiedPhone ? 'Copied!' : 'Copy number'}
              style={{
                ...copyBtnStyle,
                color: copiedPhone ? '#2ecc71' : 'var(--color-brown-light)',
              }}
            >
              {copiedPhone
                ? <><CheckCheck size={12} /> Copied!</>
                : <><Copy size={12} /> Copy</>
              }
            </button>
          </div>
        ))}
      </div>

      {/* Email — mailto: link + copy button */}
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
          Email
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          {/* mailto: link — opens default mail client */}
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
          {/* Email copy button */}
          <button
            onClick={copyEmail}
            aria-label={copiedEmail ? 'Email copied!' : 'Copy email address'}
            title={copiedEmail ? 'Copied!' : 'Copy email'}
            style={{
              ...copyBtnStyle,
              color: copiedEmail ? '#2ecc71' : 'var(--color-brown-light)',
            }}
          >
            {copiedEmail
              ? <><CheckCheck size={12} /> Copied!</>
              : <><Copy size={12} /> Copy</>
            }
          </button>
        </div>
      </div>

      {/* Social Links */}
      <div>
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
  );

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
            subtext="We're ready when you are. Reach us on email or phone."
          />
        </Reveal>

        {/*
          ── LAYOUT STRATEGY FOR MOBILE ORDER FIX ──────────────────────
          
          The requirement: on MOBILE, form comes FIRST, info comes SECOND.
          On DESKTOP, info is on left, form is on right (two columns).

          DOM order (what screen readers / keyboard Tab sees):
            1. EnquiryForm  ← FIRST in DOM
            2. ContactInfo  ← SECOND in DOM

          CSS: on desktop we use flex-row-reverse so ContactInfo (2nd in DOM)
          visually appears on LEFT and EnquiryForm (1st in DOM) on RIGHT.
          On mobile (column), DOM order = visual order = form first. ✓
          
          This means tab order on desktop is: form → info (reversed from visual).
          That's acceptable — the more important action (form) is tabbed first.
          ──────────────────────────────────────────────────────────────
        */}
        <div className="contact-outer" style={{
          display: 'flex',
          flexDirection: 'column',   /* mobile: stacks in DOM order (form first) */
          gap: 'clamp(2rem, 5vw, 5rem)',
        }}>

          {/* 1. FORM — FIRST in DOM (correct for mobile reading/tab order) */}
          <Reveal className="reveal-delay-1 contact-form-col">
            <EnquiryForm />
          </Reveal>

          {/* 2. CONTACT INFO — SECOND in DOM (appears after form on mobile) */}
          <Reveal className="contact-info-wrapper">
            <ContactInfo />
          </Reveal>
        </div>
      </div>

      <style>{`
        /* ── DESKTOP: two-column, info on LEFT (visually), form on RIGHT ── */
        @media (min-width: 769px) {
          .contact-outer {
            flex-direction: row-reverse !important;
            align-items: flex-start !important;
          }
          .contact-form-col {
            flex: 1.2;
            min-width: 0;
          }
          .contact-info-wrapper {
            flex: 1;
            min-width: 0;
          }
        }

        /* ── MOBILE: flex-column, form first (DOM order = visual order) ── */
        @media (max-width: 768px) {
          .contact-outer {
            flex-direction: column !important;
          }
          .contact-info-col {
            padding-top: 0.5rem;
          }
        }

        /* ── Dark mode: contact info text ── */
        html.dark .contact-brand-name {
          color: #e8e0d5 !important;
        }
        html.dark .contact-info-col a[href^="tel"],
        html.dark .contact-info-col a[href^="mailto"] {
          color: #c8c0b4 !important;
        }
        html.dark .contact-info-col button {
          border-color: rgba(208, 17, 43, 0.25) !important;
          color: #9a9490 !important;
        }
      `}</style>
    </section>
  );
}
