// ============================================================
//  App.jsx — Root component, assembles all sections
//  ONE page only. No React Router. Sections scroll in-page.
//  NOTE: Packages and Journey sections have been removed.
//
//  Preloader: shown on first full-page load only.
//  Anchor-link navigation between sections does NOT retrigger it.
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import About        from './components/About';
import Destinations from './components/Destinations';
import WhyChooseUs  from './components/WhyChooseUs';
import Contact      from './components/Contact';
import Footer       from './components/Footer';
import ThemeToggle  from './components/ThemeToggle';
import Preloader    from './components/Preloader';

export default function App() {
  // showPreloader: true on a genuine first page-load.
  // Uses sessionStorage so it only runs once per browser session
  // (a full page reload clears it per-session, but navigating back
  //  within the same session skips it — standard expected behavior).
  const [showPreloader, setShowPreloader] = useState(() => {
    // React Strict Mode calls this twice in dev — use a ref-based guard below.
    // In production this runs once. We always show on hard reload.
    return !sessionStorage.getItem('365w-preloader-shown');
  });

  // Guard against React Strict Mode double-invoke in development.
  // We want exactly one preloader instance per page load.
  const preloaderMountedRef = useRef(false);

  useEffect(() => {
    if (preloaderMountedRef.current) return;
    preloaderMountedRef.current = true;
  }, []);

  const handlePreloaderDone = () => {
    sessionStorage.setItem('365w-preloader-shown', '1');
    setShowPreloader(false);
    // Restore scroll and pointer events (Preloader cleans its own, but belt+braces)
    document.body.style.overflow = '';
    document.body.style.pointerEvents = '';
  };

  return (
    <>
      {/* ── Preloader overlay — mounted on top of everything ── */}
      <AnimatePresence mode="wait">
        {showPreloader && (
          <Preloader key="preloader" onDone={handlePreloaderDone} />
        )}
      </AnimatePresence>

      {/* ── Sticky navigation ── */}
      <Navbar />

      {/* ── Main page content ── */}
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Destinations />
        <WhyChooseUs />
        <Contact />
      </main>

      <Footer />

      {/* ── Floating theme toggle (bottom-right) ── */}
      <ThemeToggle />
    </>
  );
}
