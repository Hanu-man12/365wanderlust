// ============================================================
//  Destinations Section
//  "Where Do You Want To Go?" — Explore India fan deck only.
//  The old editorial Rajasthan destination cards have been removed.
// ============================================================
import React from 'react';
import { exploreIndia } from '../data/siteData';
import SectionHeading from './SectionHeading';
import FanDeck from './FanDeck';
import Reveal from './Reveal';

export default function Destinations() {
  return (
    <section
      id="destinations"
      aria-labelledby="destinations-heading"
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        background: 'white',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Reveal>
          <SectionHeading
            label="Explore India"
            heading="Where Do You Want To Go?"
            subtext="Nine incredible destinations. Your next adventure starts here."
            align="center"
          />
        </Reveal>
        <FanDeck destinations={exploreIndia} />
      </div>
    </section>
  );
}
