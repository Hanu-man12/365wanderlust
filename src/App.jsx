// ============================================================
//  App.jsx — Root component, assembles all sections
//  ONE page only. No React Router. Sections scroll in-page.
//  NOTE: Packages and Journey sections have been removed.
// ============================================================
import React from 'react';
import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import About        from './components/About';
import Destinations from './components/Destinations';
import WhyChooseUs  from './components/WhyChooseUs';
import Gallery      from './components/Gallery';
import Contact      from './components/Contact';
import Footer       from './components/Footer';
import ThemeToggle  from './components/ThemeToggle';

export default function App() {
  return (
    <>
      {/* Sticky navigation */}
      <Navbar />

      {/* Main page content */}
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Destinations />
        <WhyChooseUs />
        <Gallery />
        <Contact />
      </main>

      <Footer />

      {/* Floating theme toggle (bottom-right) */}
      <ThemeToggle />
    </>
  );
}
