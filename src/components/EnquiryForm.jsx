// ============================================================
//  EnquiryForm — WhatsApp-based enquiry (Version 1, no backend)
//  On submit: validates fields, composes WhatsApp message,
//  opens wa.me link. No SMTP, no secrets, no backend needed.
// ============================================================
import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { destinations, packages, contact } from '../data/siteData';
import { getWhatsAppLink } from '../utils/contactLinks';

const initialState = {
  name: '',
  phone: '',
  email: '',
  destination: '',
  travelDates: '',
  travellers: '',
  message: '',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 0.9rem',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.88rem',
  color: 'var(--color-brown)',
  background: 'white',
  border: '1px solid rgba(212,149,106,0.35)',
  borderRadius: '3px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  minHeight: '44px',
};

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--color-brown-light)',
  marginBottom: '0.35rem',
};

export default function EnquiryForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // All destination options from siteData
  const destOptions = destinations.map(d => d.name);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Your name is required.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim()))
      e.phone = 'Please enter a valid phone number.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Please enter a valid email address.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => { const n = { ...er }; delete n[name]; return n; });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Compose WhatsApp message from form fields
    const lines = [
      `Hello! I would like to enquire about a Rajasthan trip.`,
      ``,
      `*Name:* ${form.name}`,
      `*Phone:* ${form.phone}`,
      form.email       ? `*Email:* ${form.email}` : null,
      form.destination ? `*Destination:* ${form.destination}` : null,
      form.travelDates ? `*Travel Dates:* ${form.travelDates}` : null,
      form.travellers  ? `*No. of Travellers:* ${form.travellers}` : null,
      form.message     ? `*Message:* ${form.message}` : null,
    ].filter(Boolean).join('\n');

    const waLink = getWhatsAppLink(lines);
    window.open(waLink, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    setForm(initialState);
  };

  const handleReset = () => setSubmitted(false);

  if (submitted) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        background: 'white',
        borderRadius: '4px',
        border: '1px solid rgba(212,149,106,0.2)',
        textAlign: 'center',
        minHeight: '300px',
      }}>
        <CheckCircle size={48} color="#C8102E" style={{ marginBottom: '1rem' }} />
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.6rem',
          color: 'var(--color-brand-maroon)',
          margin: '0 0 0.5rem 0',
        }}>
          WhatsApp is Opening!
        </h3>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          color: 'var(--color-brown-light)',
          lineHeight: 1.7,
          maxWidth: '320px',
          marginBottom: '1.5rem',
        }}>
          Your enquiry has been composed. Complete the chat on WhatsApp to connect with us directly.
        </p>
        <button
          onClick={handleReset}
          style={{
            background: 'none',
            border: '1px solid var(--color-sand)',
            borderRadius: '3px',
            padding: '0.6rem 1.4rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-brown-light)',
            cursor: 'pointer',
          }}
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Travel enquiry form"
      style={{
        background: 'white',
        borderRadius: '4px',
        border: '1px solid rgba(212,149,106,0.2)',
        padding: '2rem',
        boxShadow: '0 2px 20px rgba(28,15,10,0.06)',
      }}
    >
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.4rem',
        color: 'var(--color-brand-maroon)',
        margin: '0 0 0.3rem 0',
      }}>
        Plan Your Journey
      </h3>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.82rem',
        color: 'var(--color-brown-light)',
        marginBottom: '1.5rem',
        lineHeight: 1.6,
      }}>
        Fill in your details — we'll connect via WhatsApp instantly.
      </p>

      {/* Row: Name + Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="form-row">
        <div>
          <label htmlFor="enq-name" style={labelStyle}>
            Your Name <span style={{ color: 'var(--color-brand-red)' }}>*</span>
          </label>
          <input
            id="enq-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            autoComplete="name"
            aria-required="true"
            aria-describedby={errors.name ? 'err-name' : undefined}
            aria-invalid={!!errors.name}
            style={{
              ...inputStyle,
              borderColor: errors.name ? 'var(--color-brand-red)' : 'rgba(212,149,106,0.35)',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-sand)'; }}
            onBlur={e => { e.target.style.borderColor = errors.name ? 'var(--color-brand-red)' : 'rgba(212,149,106,0.35)'; }}
          />
          {errors.name && <p id="err-name" role="alert" style={{ color: 'var(--color-brand-red)', fontSize: '0.72rem', marginTop: '0.25rem' }}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="enq-phone" style={labelStyle}>
            Phone <span style={{ color: 'var(--color-brand-red)' }}>*</span>
          </label>
          <input
            id="enq-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            autoComplete="tel"
            aria-required="true"
            aria-describedby={errors.phone ? 'err-phone' : undefined}
            aria-invalid={!!errors.phone}
            style={{
              ...inputStyle,
              borderColor: errors.phone ? 'var(--color-brand-red)' : 'rgba(212,149,106,0.35)',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-sand)'; }}
            onBlur={e => { e.target.style.borderColor = errors.phone ? 'var(--color-brand-red)' : 'rgba(212,149,106,0.35)'; }}
          />
          {errors.phone && <p id="err-phone" role="alert" style={{ color: 'var(--color-brand-red)', fontSize: '0.72rem', marginTop: '0.25rem' }}>{errors.phone}</p>}
        </div>
      </div>

      {/* Email */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="enq-email" style={labelStyle}>Email (optional)</label>
        <input
          id="enq-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          autoComplete="email"
          aria-describedby={errors.email ? 'err-email' : undefined}
          aria-invalid={!!errors.email}
          style={{
            ...inputStyle,
            borderColor: errors.email ? 'var(--color-brand-red)' : 'rgba(212,149,106,0.35)',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--color-sand)'; }}
          onBlur={e => { e.target.style.borderColor = errors.email ? 'var(--color-brand-red)' : 'rgba(212,149,106,0.35)'; }}
        />
        {errors.email && <p id="err-email" role="alert" style={{ color: 'var(--color-brand-red)', fontSize: '0.72rem', marginTop: '0.25rem' }}>{errors.email}</p>}
      </div>

      {/* Destination */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="enq-destination" style={labelStyle}>Destination of Interest</label>
        <select
          id="enq-destination"
          name="destination"
          value={form.destination}
          onChange={handleChange}
          style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237A5C48' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.9rem center' }}
          onFocus={e => { e.target.style.borderColor = 'var(--color-sand)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(212,149,106,0.35)'; }}
        >
          <option value="">— Select a destination —</option>
          {destOptions.map(d => <option key={d} value={d}>{d}</option>)}
          <option value="Multiple / Not sure">Multiple / Not sure yet</option>
        </select>
      </div>

      {/* Row: Travel Dates + Travellers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="form-row">
        <div>
          <label htmlFor="enq-dates" style={labelStyle}>Travel Dates (optional)</label>
          <input
            id="enq-dates"
            name="travelDates"
            type="text"
            value={form.travelDates}
            onChange={handleChange}
            placeholder="e.g. Oct 15–20, 2026"
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--color-sand)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(212,149,106,0.35)'; }}
          />
        </div>
        <div>
          <label htmlFor="enq-travellers" style={labelStyle}>No. of Travellers</label>
          <select
            id="enq-travellers"
            name="travellers"
            value={form.travellers}
            onChange={handleChange}
            style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237A5C48' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.9rem center' }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-sand)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(212,149,106,0.35)'; }}
          >
            <option value="">— Select —</option>
            {['1','2','3-5','6-10','10+'].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* Message */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="enq-message" style={labelStyle}>Message (optional)</label>
        <textarea
          id="enq-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          placeholder="Any special requests, preferences, or questions..."
          style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
          onFocus={e => { e.target.style.borderColor = 'var(--color-sand)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(212,149,106,0.35)'; }}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          background: 'var(--color-brand-red)',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          padding: '0.9rem 1.5rem',
          fontFamily: 'var(--font-sans)',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          minHeight: '52px',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = '#a00d24'}
        onMouseOut={e => e.currentTarget.style.background = 'var(--color-brand-red)'}
      >
        <Send size={14} />
        Send Enquiry via WhatsApp
      </button>

      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.68rem',
        color: 'var(--color-brown-light)',
        textAlign: 'center',
        marginTop: '0.75rem',
        lineHeight: 1.5,
        opacity: 0.8,
      }}>
        This will open WhatsApp with your enquiry pre-filled. No data is stored on our servers.
      </p>

      <style>{`
        @media (max-width: 540px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}
