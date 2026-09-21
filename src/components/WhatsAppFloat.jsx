// ============================================================
//  Floating WhatsApp Button — bottom-right, always visible
//  Safe from footer overlap, touch-friendly (60px target)
// ============================================================
import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { getWhatsAppLink } from '../utils/contactLinks';

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  // Only show after scrolling 300px (not needed on hero where WA button already exists)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '1.5rem',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.4), 0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 50,
        transition: 'transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.7)',
        pointerEvents: visible ? 'auto' : 'none',
        textDecoration: 'none',
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.5), 0 2px 10px rgba(0,0,0,0.25)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.4), 0 2px 8px rgba(0,0,0,0.2)';
      }}
    >
      <FaWhatsapp size={28} color="white" />
    </a>
  );
}
