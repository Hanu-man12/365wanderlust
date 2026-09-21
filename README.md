# 365 Wanderlust — Website

> **"Grab Your Leisure"** — Rajasthan travel marketing website  
> Built with React + Vite + Tailwind CSS. Static, single-page, no backend.

---

## 🚀 Running the Project Locally

```bash
# Install dependencies (only needed once)
npm install

# Start development server
npm run dev
# Open http://localhost:5173 in your browser

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## 📱 How to Change the WhatsApp Number

Open **`src/data/siteData.js`** and find this line near the top:

```js
whatsappNumber: '917425010750',   // ← CHANGE THIS
```

Change it to your real WhatsApp number with country code (no `+`, no spaces):
- India example: `917890387923` (91 = country code, then 10-digit number)

**That's it.** The number updates everywhere on the site automatically — navbar CTA, hero, packages, destinations, contact section, footer, and the floating button.

---

## 📧 How to Change Email / Phone

Same file — `src/data/siteData.js`:

```js
email: 'grabyourleisure365@gmail.com',   // ← change here

phones: [
  { display: '+91 74250 10750', number: '+917425010750' },
  { display: '+91 78903 87923', number: '+917890387923' },
],
```

---

## 🖼️ How to Replace Trial Images with Final Photos

All trial images are in `src/assets/trial/`. Final photos go in `src/assets/photos/`.

### Step-by-step:

1. Save your new photo in `src/assets/photos/` (e.g. `jaipur-hawa-mahal.jpg`)
2. Open `src/data/siteData.js`
3. Find the import at the top and replace the trial import:

```js
// BEFORE (trial):
import posterRajasthan1 from '../assets/trial/rajasthan-journey.jpg';

// AFTER (final photo):
import photoJaipur from '../assets/photos/jaipur-hawa-mahal.jpg';
```

4. Then find the place in siteData where it's used and swap the variable name:

```js
// BEFORE:
image: posterRajasthan1,

// AFTER:
image: photoJaipur,
```

5. Update the `imageAlt` text to describe your new photo accurately.

### Trial Image Slots & Recommended Final Photo Sizes:

| Slot | Used In | Current Trial Image | Recommended Final Photo |
|------|---------|---------------------|------------------------|
| Hero frame 1 | Hero section (small frame) | rajasthan-journey.jpg | Portrait 900×1200px — street / traveller shot |
| Hero frame 2 | Hero section (small frame) | rajasthan-where-journey.jpg | Portrait 900×1200px — landscape / architecture |
| About section | About / Our Story | rajasthan-feeling-stays.jpg | Square 1200×1200px or Portrait — team / culture shot |
| Destination: Jaipur | Destinations card | rajasthan-journey.jpg | Portrait 1200×1500px — Hawa Mahal / Pink City |
| Destination: Jodhpur | Destinations card | rajasthan-where-journey.jpg | Portrait 1200×1500px — Blue City / Mehrangarh |
| Destination: Udaipur | Destinations card | rajasthan-feeling-stays.jpg | Portrait 1200×1500px — Lake Palace / Pichola |
| Destination: Pushkar | Destinations card | pushkar-poster.jpg | Portrait 1200×1500px — Pushkar Lake / ghats |
| Destination: Thar | Destinations card | pushkar-poster.jpg | Portrait 1200×1500px — Dunes at sunset |
| Package: Pushkar | Package card | pushkar-poster.jpg | Landscape 1600×900px — desert camp at night |
| Package: Rajasthan | Package card | rajasthan-where-journey.jpg | Landscape 1600×900px — Rajasthan montage |
| Journey: Begins | Journey section | rajasthan-journey.jpg | Portrait 900×1200px — entrance / road shot |
| Journey: Story | Journey section | rajasthan-where-journey.jpg | Portrait 900×1200px — cultural scene |
| Journey: Feeling | Journey section | rajasthan-feeling-stays.jpg | Portrait 900×1200px — sunset / lake reflection |
| Gallery 1 | Gallery | rajasthan-where-journey.jpg | Landscape 1200×800px — Hawa Mahal exterior |
| Gallery 2 | Gallery | pushkar-poster.jpg | Portrait 800×1200px — Pushkar ghats |
| Gallery 3 | Gallery | rajasthan-journey.jpg | Landscape 1200×800px — desert scene |
| Gallery 4 | Gallery | rajasthan-feeling-stays.jpg | Portrait 800×1200px — folk dancer |
| Gallery 5 | Gallery | pushkar-poster.jpg | Landscape 1200×800px — Mehrangarh panorama |

> ⚠️ **Hero/background photos** must be high resolution: minimum **2400×1350px** landscape.

---

## 🌄 How to Add a Background Photo to the Hero

In `src/data/siteData.js`, find:

```js
export const hero = {
  heroImage: '',   // ← empty = beautiful CSS gradient background
  ...
}
```

To add a real hero background photo:

```js
import heroBg from '../assets/photos/hero-rajasthan-sunset.jpg';

export const hero = {
  heroImage: heroBg,   // ← now uses this photo as background
  ...
}
```

The hero is designed to look **complete and beautiful without any photo**. Add the photo only when you have a high-res (2400×1350px+) landscape shot of Rajasthan.

---

## ➕ How to Add a New Destination

In `src/data/siteData.js`, add to the `destinations` array:

```js
{
  id: 'bikaner',
  name: 'Bikaner',
  subtitle: 'The Camel City',
  description: 'Your description here...',
  highlights: ['Junagarh Fort', 'Camel Research Centre', 'Karni Mata Temple'],
  image: photoVariableName,    // import the photo at the top of siteData.js
  imageAlt: 'Descriptive alt text for Bikaner photo',
  whatsappMessage: 'Hello! I am interested in a Bikaner travel package.',
},
```

---

## ➕ How to Add a Package / Update Itinerary

In `src/data/siteData.js`, add to the `packages` array. The Pushkar package has a complete example. For the Rajasthan Royal Tour package, fill in the `[ADD ...]` placeholder fields.

---

## ➕ How to Add Gallery Images

In `src/data/siteData.js`, add to the `gallery` array:

```js
{
  id: 'g6',
  image: photoVariable,
  alt: 'Descriptive alt text',
  size: 'medium',   // 'large' | 'medium' | 'small'
  rotation: '1deg',
},
```

---

## 🔒 Security Notes

- **No SMTP credentials, API keys, or secrets** are in this codebase.
- The enquiry form sends via WhatsApp — **no backend required**.
- `.env` is git-ignored. Never commit it.
- For future email integration, see Version 2 section in `.env.example`.

---

## 🌐 Deploying to Vercel

1. Push this repo to GitHub (see Git section below)
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**

### Connecting your domain (365wanderlust.com):

1. In Vercel project → **Settings → Domains**
2. Add `365wanderlust.com` and `www.365wanderlust.com`
3. Vercel will show you DNS records to add (A record or CNAME)
4. Log in to wherever you bought your domain (GoDaddy / Namecheap / etc.)
5. Go to **DNS Settings** and add the records Vercel shows you
6. Wait 24–48 hours for DNS propagation
7. Vercel automatically issues an SSL certificate (HTTPS)

> **www redirect:** Set `www.365wanderlust.com` as a redirect to `365wanderlust.com` in Vercel domain settings.

---

## 📋 Content Still Missing (Owner to Supply)

- [ ] Real WhatsApp number (replace `917425010750` in siteData.js)  
- [ ] Company story / origin paragraph (marked `[ADD COMPANY STORY...]` in siteData)
- [ ] Office / city address (marked `[ADD YOUR OFFICE...]` in siteData)
- [ ] Days 1 & 2 of Pushkar itinerary (marked as placeholder)
- [ ] Royal Rajasthan Tour package details (duration, description, highlights)
- [ ] Social media links (Instagram, Facebook, YouTube URLs)
- [ ] Final high-resolution photographs (see table above)
- [ ] Hero background photo (2400×1350px+ landscape)
- [ ] OG image for social sharing (1200×630px — place as `/public/og-image.jpg`)
- [ ] Favicon PNG files (derive from logo, place in `/public/`)

---

## 🛠️ Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS v4** (brand color tokens in `src/index.css`)
- **lucide-react** — icons
- **react-icons** — WhatsApp, Instagram, Facebook, YouTube brand icons
- No Redux, no UI kits, no heavy libraries
