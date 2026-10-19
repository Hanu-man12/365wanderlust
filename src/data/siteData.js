// ============================================================
//  365 WANDERLUST — Site Data (Single Source of Truth)
//  ⚠️  Change content HERE only. Never hard-code in components.
//  ⚠️  WhatsApp number: change ONCE here → updates everywhere.
// ============================================================

// ── Brand asset imports ──────────────────────────────────────
// LOGO MARK — red compass/airplane badge (no text baked in)
// Place file at: src/assets/brand/logo-mark.png
import logoMark from '../assets/brand/logo-mark.png';

// HERO BANNER — #GrabYourLeisure collage (Eiffel, Colosseum, Big Ben etc.)
// Place file at: src/assets/brand/hero-banner.jpeg
import heroBanner from '../assets/brand/hero-banner.jpeg';

// ── Trial image imports ──────────────────────────────────────
// TRIAL IMAGES — replace with final photos (see README for how-to)
import posterRajasthan1 from '../assets/trial/rajasthan-journey.jpg';
import posterRajasthan2 from '../assets/trial/rajasthan-feeling-stays.jpg';
import posterRajasthan3 from '../assets/trial/rajasthan-where-journey.jpg';
import posterPushkar    from '../assets/trial/pushkar-poster.jpg';

// ── Brand & Contact ─────────────────────────────────────────
export const brand = {
  name:    '365 Wanderlust',
  tagline: 'Grab Your Leisure',
  domain:  '365wanderlust.com',
  url:     'https://365wanderlust.com',
  // Logo mark image — red compass/airplane badge
  logo:    logoMark,
  logoAlt: '365 Wanderlust logo — red compass with airplane',
};

export const contact = {
  // ⚠️  WhatsApp: digits only, with country code. Change here → updates everywhere.
  whatsappNumber: '917605809599',   // +91 76058 09599

  whatsappDefaultMessage:
    'Hello! I am interested in your travel packages. I would like to know more.',

  phones: [
    { display: '+91 76058 09599', number: '+917605809599' },
  ],

  email: 'grabyourleisure365@gmail.com',

  // [ADD ADDRESS] — owner to supply physical address
  address: '[ADD YOUR OFFICE / CITY ADDRESS HERE]',

  // Social links — fill in your real URLs below
  // ⚠️  TO ADD YOUR LINKS: paste the real URL in the quotes below
  social: {
    // ← PASTE your Instagram URL here (e.g. 'https://instagram.com/365_wanderlust_')
    instagram: 'https://instagram.com/365_wanderlust_?rpxt=MWpmaGhtaWc5a3A3dA%3D%3D',
    // ← PASTE your Facebook URL here (e.g. 'https://facebook.com/share/199HC1pwQN/')
    facebook:  'https://www.facebook.com/share/199HC1pwQN/',
    youtube:   '', // e.g. 'https://youtube.com/@365wanderlust'
  },
};

// ── SEO ──────────────────────────────────────────────────────
export const seo = {
  title:       '365 Wanderlust — Rajasthan Travel Packages | Grab Your Leisure',
  description:
    'Explore Rajasthan with 365 Wanderlust. Curated travel experiences to Jaipur, Jodhpur, Udaipur, Pushkar and the Thar Desert. WhatsApp us to plan your journey.',
  ogImage:     '/og-image.jpg', // Place a 1200×630 image in /public/
  themeColor:  '#C8102E',
};

// ── Hero ─────────────────────────────────────────────────────
export const hero = {
  // Hero banner — #GrabYourLeisure collage image
  // Contains baked-in text — do NOT add duplicate heading on top
  heroImage: heroBanner,
  heroBannerAlt: '365 Wanderlust — #GrabYourLeisure — travel collage featuring Eiffel Tower, Colosseum, Big Ben, tropical beach and mountain destinations',
  ctaText: 'Plan My Trip',
  // heroFrames removed — banner image IS the hero visual now
};

// ── About / Our Story ────────────────────────────────────────
export const about = {
  // TRIAL IMAGE — replace with a team/company/landscape portrait photo
  image: posterRajasthan2,
  imageAlt: 'Rajasthan travel poster — The Feeling Stays',
  // [ADD COMPANY STORY] — owner to supply 2-3 paragraphs about the company origin
  storyParagraph1:
    '[ADD COMPANY STORY — e.g. how 365 Wanderlust started, who founded it, what drives the team]',
  storyParagraph2:
    'Rajasthan is more than a destination — it is a feeling. From royal palaces and vibrant streets to endless desert sunsets, every corner tells a story of heritage, culture and timeless beauty. Come for the colours, stay for the memories.',
  pullQuote:
    'Where every journey becomes a story worth telling.',
  // Script accent line
  scriptLine: 'Until the next journey...',
};

// ── Destinations ─────────────────────────────────────────────
// Only destinations confirmed from supplied posters. Do NOT add others.
export const destinations = [
  {
    id: 'jaipur',
    name: 'Jaipur',
    subtitle: 'The Pink City',
    description:
      'Royal forts, vibrant bazaars, and the iconic Hawa Mahal. Jaipur is where Rajasthan\'s regal history comes alive in technicolour.',
    highlights: ['Hawa Mahal', 'Amber Fort', 'City Palace', 'Jantar Mantar'],
    // TRIAL IMAGE — replace with: portrait photo of Hawa Mahal / Jaipur street, 1200×1500px
    image: posterRajasthan1,
    imageAlt: 'Hawa Mahal and the streets of Jaipur — The Pink City of Rajasthan',
    whatsappMessage: 'Hello! I am interested in a Jaipur travel package. Please share details.',
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur',
    subtitle: 'The Blue City',
    description:
      'The cobalt-blue lanes beneath the mighty Mehrangarh Fort create one of the world\'s most dramatic cityscapes.',
    highlights: ['Mehrangarh Fort', 'Blue City Walk', 'Umaid Bhawan', 'Clock Tower Market'],
    // TRIAL IMAGE — replace with: portrait photo of Blue City / Mehrangarh, 1200×1500px
    image: posterRajasthan3,
    imageAlt: 'Mehrangarh Fort and the blue-painted city of Jodhpur, Rajasthan',
    whatsappMessage: 'Hello! I am interested in a Jodhpur travel package. Please share details.',
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    subtitle: 'City of Lakes',
    description:
      'Shimmering lake palaces, sunset boat rides on Pichola, and the romance of a city that seems to float on water.',
    highlights: ['Lake Pichola', 'City Palace', 'Jag Mandir', 'Sajjangarh Monsoon Palace'],
    // TRIAL IMAGE — replace with: portrait photo of Lake Palace / Udaipur sunset, 1200×1500px
    image: posterRajasthan2,
    imageAlt: 'The City Palace and Lake Pichola at sunset — Udaipur, the City of Lakes',
    whatsappMessage: 'Hello! I am interested in a Udaipur travel package. Please share details.',
  },
  {
    id: 'pushkar',
    name: 'Pushkar',
    subtitle: 'Desert Nights, Golden Memories',
    description:
      'Sacred ghats, the ancient Brahma Temple, and the magic of the Thar desert — all in one unforgettable desert town.',
    highlights: ['Pushkar Lake', 'Brahma Temple', 'Camel Safari', 'Desert Camp', 'Pushkar Bazaar'],
    // TRIAL IMAGE — replace with: portrait photo of Pushkar Lake / ghats, 1200×1500px
    image: posterPushkar,
    imageAlt: 'Pushkar Lake with ghats and temple — Pushkar, Rajasthan desert town',
    whatsappMessage: 'Hello! I am interested in a Pushkar travel package. Please share details.',
  },
  {
    id: 'thar',
    name: 'Thar Desert',
    subtitle: 'The Great Indian Desert',
    description:
      'Camel safaris across golden sand dunes, starlit desert camps, folk music under open skies — an experience unlike any other.',
    highlights: ['Camel Safari', 'Luxury Desert Camp', 'Desert Sunrise', 'Folk Music Evening', 'Stargazing'],
    // TRIAL IMAGE — replace with: landscape photo of sand dunes at sunset, 1200×1500px
    image: posterPushkar,
    imageAlt: 'Camel caravan crossing golden Thar Desert sand dunes at sunset',
    whatsappMessage: 'Hello! I am interested in a Thar Desert safari experience. Please share details.',
  },
];

// ── Explore India ─────────────────────────────────────────────
export const exploreIndia = [
  { id: 'bengal',          name: 'Bengal',           status: 'available',    image: '/destinations/bengal.jpeg',             tagline: 'Land of Culture & Rivers' },
  { id: 'rajasthan',       name: 'Rajasthan',         status: 'available',    image: '/destinations/rajasthan.jpeg',          tagline: 'Royal Deserts & Palaces' },
  { id: 'bihar',           name: 'Bihar',             status: 'coming-soon',  image: '/destinations/bihar.jpeg',              tagline: 'Ancient Civilisations' },
  { id: 'himachal',        name: 'Himachal Pradesh',  status: 'coming-soon',  image: '/destinations/himachal-pradesh.jpeg',   tagline: 'Mountains & Pine Forests' },
  { id: 'uttarakhand',     name: 'Uttarakhand',       status: 'coming-soon',  image: '/destinations/uttarakhand.jpeg',        tagline: 'Abode of the Gods' },
  { id: 'odisha',          name: 'Odisha',            status: 'coming-soon',  image: '/destinations/odisha.jpeg',             tagline: 'Temples & Tribal Heritage' },
  { id: 'south-india',     name: 'South India',       status: 'coming-soon',  image: '/destinations/south-india.jpeg',        tagline: 'Backwaters & Temples' },
  { id: 'north-east',      name: 'North East India',  status: 'coming-soon',  image: '/destinations/north-east-india.jpeg',   tagline: 'Mystic Valleys & Tea Gardens' },
  { id: 'south-east-asia', name: 'South East Asia',   status: 'coming-soon',  image: '/destinations/south-east-asia.jpeg',    tagline: 'Exotic Shores & Temples' },
];

// ── Travel Packages ──────────────────────────────────────────
export const packages = [
  {
    id: 'pushkar-desert',
    name: 'Pushkar Desert Experience',
    destination: 'Pushkar & Thar Desert',
    duration: '4 Days / 3 Nights',
    // TRIAL IMAGE — replace with: landscape photo of desert camp at night, 1600×900px
    image: posterPushkar,
    imageAlt: 'Pushkar Desert Nights package — luxury desert camp and camel safari poster',
    description:
      'Experience the sacred town of Pushkar by day and the magic of a luxury desert camp by night. From ancient temples and vibrant markets to camel safaris and folk music under the stars — this is Rajasthan at its most authentic.',
    highlights: [
      'Pushkar Lake & sacred ghats visit',
      'Brahma Temple darshan',
      'Vibrant Pushkar bazaar walk',
      'Camel safari across sand dunes',
      'Luxury desert camp stay',
      'Traditional Rajasthani folk music & cultural evening',
      'Dinner under the stars',
      'Desert sunrise experience',
    ],
    itinerary: [
      {
        day: 1,
        title: '[ADD DAY 1 TITLE]',
        // Days 1 & 2 were not supplied — do NOT invent them
        activities: ['[ADD DAY 1 ACTIVITIES — owner to supply]'],
        note: 'PLACEHOLDER — Owner to provide Day 1 itinerary',
      },
      {
        day: 2,
        title: '[ADD DAY 2 TITLE]',
        activities: ['[ADD DAY 2 ACTIVITIES — owner to supply]'],
        note: 'PLACEHOLDER — Owner to provide Day 2 itinerary',
      },
      {
        day: 3,
        title: 'Pushkar Exploration & Desert Camp',
        activities: [
          'Arrive in Pushkar & hotel/camp check-in',
          'Explore Pushkar Lake & sacred ghats',
          'Visit Brahma Temple',
          'Walk through the vibrant local market',
          'Transfer towards the desert camping area',
          'Check-in to a luxury desert camp',
          'Sunset over the sand dunes',
          'Camel safari / desert experience',
          'Traditional Rajasthani folk music & cultural evening',
          'Dinner under the stars',
          'Overnight stay in desert camp',
        ],
      },
      {
        day: 4,
        title: 'Sunrise & Departure',
        activities: [
          'Early morning desert sunrise',
          'Breakfast at the camp',
          'Leisure time & photography',
          'Enjoy the peaceful desert surroundings',
          'Check-out',
          'Departure from Pushkar with unforgettable desert memories',
        ],
      },
    ],
    // Leave price empty → renders as "Price on request"
    price: '',
    ctaMessage:
      'Hello! I am interested in the Pushkar Desert Experience (4 Days/3 Nights) package. Please share the details and pricing.',
    featured: true,
  },
  {
    id: 'rajasthan-royal',
    name: 'Royal Rajasthan Tour',
    destination: 'Jaipur · Jodhpur · Udaipur',
    duration: '[ADD DURATION]',
    // TRIAL IMAGE — replace with: landscape photo of Rajasthan montage, 1600×900px
    image: posterRajasthan3,
    imageAlt: 'Royal Rajasthan Tour — Jaipur, Jodhpur and Udaipur travel package poster',
    description:
      '[ADD PACKAGE DESCRIPTION — Owner to supply details for the Rajasthan circuit tour]',
    highlights: [
      '[ADD HIGHLIGHT 1]',
      '[ADD HIGHLIGHT 2]',
      '[ADD HIGHLIGHT 3]',
      '[ADD HIGHLIGHT 4]',
    ],
    itinerary: [],
    price: '',
    ctaMessage:
      'Hello! I am interested in the Royal Rajasthan Tour package. Please share the details and pricing.',
    featured: false,
  },
];

// ── Why Choose Us ────────────────────────────────────────────
// Only genuine, qualitative points — no fake stats
export const whyChooseUs = [
  {
    icon: 'Compass',
    title: 'Curated Experiences',
    description:
      'Every itinerary is thoughtfully crafted to balance iconic landmarks with authentic local moments you won\'t find in a guidebook.',
  },
  {
    icon: 'Heart',
    title: 'Leisure First',
    description:
      'We believe travel should feel effortless. Our trips are paced for genuine rest, exploration and discovery — never rushed.',
  },
  {
    icon: 'Users',
    title: 'Personal Assistance',
    description:
      'From your first enquiry to your journey home, we\'re available on WhatsApp for real, human support at every step.',
  },
  {
    icon: 'MapPin',
    title: 'Deep Local Knowledge',
    description:
      'Rajasthan is our home ground. We know the hidden lanes of Jodhpur, the quietest ghats of Pushkar, the best desert camp spots.',
  },
  {
    icon: 'Star',
    title: 'Cultural Immersion',
    description:
      'Folk music evenings, local market walks, heritage stays — we design experiences that connect you with the soul of Rajasthan.',
  },
  {
    icon: 'Shield',
    title: 'Reliable & Transparent',
    description:
      'No hidden costs, no last-minute surprises. We communicate clearly so you travel with complete peace of mind.',
  },
];

// ── Journey / Story Section ──────────────────────────────────
// Narrative from the supplied posters — used as live HTML text
export const journey = [
  {
    id: 'begins',
    label: 'The Journey Begins',
    heading: 'The Journey Begins',
    body: 'The moment you enter Rajasthan, everything feels different. The colours become brighter, the architecture feels timeless, and every road seems to lead toward another story. This is where the journey begins.',
    // TRIAL IMAGE — replace with: portrait/landscape of Rajasthan road / entrance, 900×1200px
    image: posterRajasthan1,
    imageAlt: 'Traveller entering Rajasthan — the journey begins, Hawa Mahal and Jodhpur fort visible',
    rotation: '-2deg',
  },
  {
    id: 'story',
    label: 'Every Journey, A Story',
    heading: 'Where Every Journey Becomes A Story',
    body: 'Rajasthan is more than a destination — it is a feeling. From royal palaces and vibrant streets to endless desert sunsets, every corner tells a story of heritage, culture and timeless beauty. Come for the colours, stay for the memories.',
    // TRIAL IMAGE — replace with: landscape of Rajasthan montage / cultural scene, 900×1200px
    image: posterRajasthan3,
    imageAlt: 'Rajasthan travel collage — royal palaces, desert camel safaris, vibrant bazaars',
    rotation: '1.5deg',
  },
  {
    id: 'feeling',
    label: 'The Feeling Stays',
    heading: 'The Feeling Stays',
    body: 'And then comes the moment you realise Rajasthan was never just a trip. It was the sunset by the lake, the laughter in colourful streets, the silence of the desert and the stories you carried back home. Some journeys end. The feeling stays.',
    scriptLine: 'Until the next journey...',
    // TRIAL IMAGE — replace with: portrait of sunset / lake palace / reflective moment, 900×1200px
    image: posterRajasthan2,
    imageAlt: 'Rajasthan The Feeling Stays poster — sunset over lake, folk dancer, desert camel riders',
    rotation: '-1.5deg',
  },
];

// ── Gallery ──────────────────────────────────────────────────
// Data-driven gallery — add/remove/swap images here only
export const gallery = [
  {
    id: 'g1',
    // TRIAL IMAGE — replace with: landscape photo of Hawa Mahal exterior, 1200×800px
    image: posterRajasthan3,
    alt: 'Rajasthan travel collage — Hawa Mahal, Blue City Jodhpur, Lake Palace Udaipur',
    size: 'large',    // large | medium | small (controls gallery layout weighting)
    rotation: '-1deg',
  },
  {
    id: 'g2',
    // TRIAL IMAGE — replace with: portrait photo of Pushkar Lake ghats, 800×1200px
    image: posterPushkar,
    alt: 'Pushkar Lake and sacred ghats with temples — Pushkar Desert Nights package poster',
    size: 'medium',
    rotation: '2deg',
  },
  {
    id: 'g3',
    // TRIAL IMAGE — replace with: landscape photo of desert camp at night, 1200×800px
    image: posterRajasthan1,
    alt: 'Rajasthan journey poster — The Journey Begins, Jaipur and Jodhpur landmarks',
    size: 'medium',
    rotation: '-2deg',
  },
  {
    id: 'g4',
    // TRIAL IMAGE — replace with: portrait of Rajasthani folk dancer, 800×1200px
    image: posterRajasthan2,
    alt: 'Rajasthan The Feeling Stays poster — camel safari, folk dance, lake palace sunset',
    size: 'small',
    rotation: '1.5deg',
  },
  {
    id: 'g5',
    // TRIAL IMAGE — replace with: landscape of Mehrangarh Fort panorama, 1200×800px
    image: posterPushkar,
    alt: 'Pushkar Desert Experience — camel safari, desert camp, folk culture and sunrise',
    size: 'small',
    rotation: '-1.5deg',
  },
];
