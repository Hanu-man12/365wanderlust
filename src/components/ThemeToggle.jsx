// ============================================================
//  ThemeToggle — Floating bottom-right theme switcher
//  Light mode → shows Moon icon  → click → switches to Dark
//  Dark mode  → shows Sun icon   → click → switches to Light
//
//  Theme system:
//  - Adds/removes 'dark' class on <html> element
//  - Persists choice in localStorage under key '365w-theme'
//  - Anti-flash: index.html reads localStorage before React mounts
//    (inline script in <head>) so correct theme is applied on refresh.
//
//  Position: fixed bottom-right (same spot as old WhatsApp float)
//  Appears after scrolling 300px — same visibility logic as before.
// ============================================================
import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = '365w-theme';

export default function ThemeToggle() {
  // Read initial state from whatever class is already on <html>
  // (set by the anti-flash inline script in index.html)
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );
  const [visible, setVisible] = useState(false);

  // Show after 300px scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    // Also show immediately if already scrolled (e.g. on refresh)
    setVisible(window.scrollY > 300);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY, 'light');
    }
  };

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '1.5rem',
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        border: isDark
          ? '1.5px solid rgba(208, 17, 43, 0.45)'
          : '1.5px solid rgba(208, 17, 43, 0.35)',
        background: isDark
          ? 'rgba(30, 30, 30, 0.92)'
          : 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isDark
          ? '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(208,17,43,0.1)'
          : '0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(208,17,43,0.08)',
        zIndex: 50,
        cursor: 'pointer',
        transition: 'opacity 0.3s ease, transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.7)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = isDark
          ? '0 6px 28px rgba(0,0,0,0.6), 0 0 0 2px rgba(208,17,43,0.3)'
          : '0 6px 28px rgba(0,0,0,0.2), 0 0 0 2px rgba(208,17,43,0.2)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = isDark
          ? '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(208,17,43,0.1)'
          : '0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(208,17,43,0.08)';
      }}
      onFocus={e => {
        e.currentTarget.style.outline = '2px solid #D0112B';
        e.currentTarget.style.outlineOffset = '3px';
      }}
      onBlur={e => {
        e.currentTarget.style.outline = 'none';
      }}
    >
      {isDark
        ? <Sun  size={22} color="#D0112B" strokeWidth={2} />
        : <Moon size={22} color="#D0112B" strokeWidth={2} />
      }
    </button>
  );
}
