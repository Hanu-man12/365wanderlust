// ============================================================
//  App.jsx — Root component, assembles all sections
//  ONE page only. No React Router. Sections scroll in-page.
// ============================================================
import React from 'react';
import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import About        from './components/About';
import Destinations from './components/Destinations';
import Packages     from './components/Packages';
import WhyChooseUs  from './components/WhyChooseUs';
import Journey      from './components/Journey';
import Gallery      from './components/Gallery';
import Contact      from './components/Contact';
import Footer       from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';

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
        <Packages />
        <WhyChooseUs />
        <Journey />
        <Gallery />
        <Contact />
      </main>

      <Footer />

      {/* Floating WhatsApp button */}
      <WhatsAppFloat />
    </>
  );
}
