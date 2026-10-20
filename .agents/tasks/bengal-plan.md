# Implementation Plan — Bengal Destination Details Section (365 Wanderlust)

> Authoritative task: the 5 CHANGES in the brief. Plan only — do not implement.
> Plan file: `d:/365wanderlast/.agents/tasks/bengal-plan.md`

---

## Exploration findings (grounding)

- **Stack:** React 19.2 + Vite 8 + Tailwind v4. `motion@14.2.0` is the animation lib, imported as `import { motion, AnimatePresence } from 'motion/react'` (confirmed in `src/components/FanDeck.jsx` and `About.jsx`).
- **Build/verify commands:** `npm run build` (→ `vite build`; this is the project's real verification gate — the prior Explore-India report used it, ~2317 modules, 0 errors). Lint: `npm run lint` (→ `eslint .`). **No test framework exists** (no `test` script in `package.json`), so verification = `npm run build` clean + `npm run lint` clean.
- **Theme:** `html.dark` class toggled elsewhere. Pattern = a `useDarkMode()` hook with a `MutationObserver` on `document.documentElement` filtering `class` (see `About.jsx`, `Destinations.jsx`, `FanDeck.jsx` — all identical). Replicate this hook verbatim in `BengalCards.jsx`.
- **Reduced motion:** `FanDeck.jsx` has a `usePrefersReducedMotion()` hook (matchMedia). Replicate it for `prefers-reduced-motion` handling.
- **WhatsApp:** `getWhatsAppLink(message)` from `../utils/contactLinks` → `https://wa.me/917605809599?text=<encoded>`. Number lives in `siteData.js` (`contact.whatsappNumber: '917605809599'`).
- **Navbar/scroll:** `src/index.css` already sets `section[id], div[id] { scroll-margin-top: 80px; }` + `html { scroll-behavior: smooth; }`. So anchor links smooth-scroll with 80px offset.
- **FanDeck InfoPanel (current):** in `src/components/FanDeck.jsx`, `InfoPanel`'s `isAvailable` branch renders an `<>` with `h3` (name), `p` (tagline), and a flex `<div>` containing TWO `<a>` buttons: (1) "📱 Plan My Trip" (WhatsApp, `href={getWhatsAppLink(waMsg)}`) and (2) "Scroll to details ↓" (`href={scrollTarget}`). `scrollTarget = dest.id === 'rajasthan' ? '#destinations' : `#${dest.id}-destinations`` → for Bengal it is already `#bengal-destinations`.
- **Destinations.jsx (current):** renders `<FanDeck destinations={exploreIndia} />` as the last child before `</div></section>`. `GoldRule` is a LOCAL function component in this file (gold uppercase label with side rules) — reusable inline. `Reveal` (IntersectionObserver fade/slide wrapper) is imported and wraps the heading block. `isDark` from local `useDarkMode()` is in scope. **No `#bengal-destinations` anchor currently exists** in this file (must be added).
- **exploreIndia data:** `src/data/siteData.js` `exploreIndia[0]` is `{ id:'bengal', name:'Bengal', status:'available', image:'/destinations/bengal.jpeg', tagline:'Land of Culture & Rivers' }`. Do NOT touch this data.
- **Images confirmed present:** `public/destinations/barhanti.png` (604 KB) and `public/destinations/teesta.png` (667 KB) exist → served as `/destinations/barhanti.png` and `/destinations/teesta.png`. (Currently untracked by git — see Caveats.)
- **Git:** branch `main`. Two PNG images are untracked; CHANGE 5's `git add` lists only the 3 component files.
- **No AGENTS.md / CONTRIBUTING.md** in repo; README is the only guide. README states tech stack and `npm run build` as the build command.

---

## Ordered plan

- [ ] 1. **Create the `BengalCards` component** at `src/components/BengalCards.jsx` (CHANGE 3).
      A self-contained, theme-aware component exporting two 3D depth cards + a click-to-open modal. No dependency on other new files; does not break the build even though nothing imports it yet.
      **Files:** `src/components/BengalCards.jsx` (new).
      **Full component design — implement exactly this structure:**

      Imports:
      ```jsx
      import React, { useState, useEffect } from 'react';
      import { motion, AnimatePresence } from 'motion/react';
      import { getWhatsAppLink } from '../utils/contactLinks';
      ```

      Hooks (copy verbatim from `FanDeck.jsx`):
      - `useDarkMode()` — `MutationObserver` on `document.documentElement`, attributeFilter `['class']`, returns boolean `document.documentElement.classList.contains('dark')`.
      - `usePrefersReducedMotion()` — `matchMedia('(prefers-reduced-motion: reduce)')`, returns boolean.

      Card data array (module-level const `BENGAL_CARDS`), exactly two entries:
      ```js
      const BENGAL_CARDS = [
        {
          id: 'barhanti',
          image: '/destinations/barhanti.png',
          title: 'Barhanti',
          subtitle: 'Baranti',
          description: 'A serene lakeside escape nestled in the Panchet hills — where golden sunsets meet glassy water and forest silence.',
          whatsappMessage: 'Hello! I am interested in visiting Barhanti / Baranti, Bengal. Please share travel package details.',
        },
        {
          id: 'teesta',
          image: '/destinations/teesta.png',
          title: 'Teesta',
          subtitle: 'River Valley, North Bengal',
          description: 'The Teesta flows through dramatic Himalayan foothills — a journey of rushing rapids, misty valleys and mountain light.',
          whatsappMessage: 'Hello! I am interested in visiting Teesta / Teeshta, North Bengal. Please share travel package details.',
        },
      ];
      ```

      Default export `BengalCards`:
      - State: `const [selected, setSelected] = useState(null)` (null or a card object); `const isDark = useDarkMode()`; `const reducedMotion = usePrefersReducedMotion()`.
      - Container: `<div style={{ perspective: '1000px' }}>` wrapping a flex row `<div style={{ display:'flex', flexWrap:'wrap', gap:'2rem', justifyContent:'center' }}>` of `<BengalCard>` items. Pass `card`, `index`, `isDark`, `reducedMotion`, `onOpen={() => setSelected(card)}`.
      - Modal: `<AnimatePresence>{selected && (<BengalModal key={selected.id} card={selected} isDark={isDark} onClose={() => setSelected(null)} />)}</AnimatePresence>`. (`key` enables exit animation.)

      Sub-component `BengalCard({ card, index, isDark, reducedMotion, onOpen })`:
      - Local state: `const [imgError, setImgError] = useState(false)`.
      - Theme tokens: `cardBg = isDark ? '#1a1a1a' : '#ffffff'`, `titleColor = isDark ? '#F8F6F3' : '#1a1a1a'`, `descColor = isDark ? '#a0a0a0' : '#666'`.
      - Root `motion.div` with `role="button"`, `tabIndex={0}`, `aria-label={card.title}`, `onClick={onOpen}`, `onKeyDown` Enter/Space → `onOpen()`.
        - `whileHover`: reduced-motion → `{ y: -6, boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }`; else → `{ rotateY: index === 0 ? -3 : 3, y: -6, boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }`.
        - `transition={{ type: 'spring', stiffness: 300, damping: 25 }}`.
        - `style`: `width:'100%'`, `maxWidth: 420`, `height: 520`, `borderRadius: 20`, `overflow:'hidden'`, `cursor:'pointer'`, `background: cardBg`, `boxShadow: '0 20px 60px rgba(0,0,0,0.25)'`, `transformStyle: 'preserve-3d'`, `position:'relative'`.
      - Image area (top 65%): `<div style={{ position:'relative', height:'65%', width:'100%' }}>`. Inside: a crimson gradient fallback `<div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg, #c0102a 0%, #8a0c1c 100%)' }} />`; then `{!imgError && (<img src={card.image} alt={card.title} loading="lazy" onError={() => setImgError(true)} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />)}`; then a scrim `<div style={{ position:'absolute', bottom:0, left:0, right:0, height:'55%', background:`linear-gradient(to top, ${cardBg} 0%, rgba(0,0,0,0) 100%)` }} />` to blend image into the card body.
      - Content area (bottom 35%): `<div style={{ padding:'1rem 1.25rem', height:'35%', display:'flex', flexDirection:'column', justifyContent:'center', gap:'0.35rem' }}>`. Children:
        - `<h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.5rem', fontWeight:700, color:titleColor, margin:0, lineHeight:1.15 }}>{card.title}</h3>`
        - `<p style={{ fontFamily:'var(--font-sans)', fontSize:'0.72rem', fontWeight:700, color:'#D0112B', margin:0, letterSpacing:'0.05em', textTransform:'uppercase' }}>{card.subtitle}</p>`
        - `<p style={{ fontFamily:'var(--font-sans)', fontSize:'0.82rem', color:descColor, margin:0, lineHeight:1.45, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{card.description}</p>` (3-line clamp so the long description fits the 35% band; full text shows in the modal).
        - Plan My Trip `<a>`: `href={getWhatsAppLink(card.whatsappMessage)}`, `target="_blank"`, `rel="noopener noreferrer"`, `onClick={(e) => e.stopPropagation()}` (so opening WhatsApp does NOT also open the modal). Style: `display:'inline-flex'`, `alignItems:'center'`, `gap:'0.4rem'`, `background:'#25D366'`, `color:'white'`, `fontFamily:'var(--font-sans)'`, `fontWeight:700`, `fontSize:'0.78rem'`, `letterSpacing:'0.06em'`, `textTransform:'uppercase'`, `textDecoration:'none'`, `padding:'0.55rem 1.1rem'`, `borderRadius:10`, `minHeight:44`, `alignSelf:'flex-start'`, plus `onMouseOver`→`#1da851` / `onMouseOut`→`#25D366` for hover. Text: `📱 Plan My Trip`.

      Sub-component `BengalModal({ card, isDark, onClose })`:
      - Local state: `const [imgError, setImgError] = useState(false)`.
      - Tokens same as card.
      - Backdrop `motion.div`: `initial={{ opacity:0 }}`, `animate={{ opacity:1 }}`, `exit={{ opacity:0 }}`, `transition={{ duration:0.2 }}`, `onClick={onClose}`, style `position:'fixed'`, `inset:0`, `background:'rgba(0,0,0,0.7)'`, `display:'flex'`, `alignItems:'center'`, `justifyContent:'center'`, `zIndex:1000`, `padding:'1rem'`.
      - Inner `motion.div`: `initial={{ opacity:0, scale:0.95 }}`, `animate={{ opacity:1, scale:1 }}`, `exit={{ opacity:0, scale:0.95 }}`, `transition={{ duration:0.25 }}`, `onClick={(e) => e.stopPropagation()}`, style `width:'100%'`, `maxWidth:480`, `background:cardBg`, `borderRadius:20`, `overflow:'hidden'`, `position:'relative'`, `boxShadow:'0 30px 80px rgba(0,0,0,0.5)'`.
      - Close button: `<button onClick={onClose} aria-label="Close" style={{ position:'absolute', top:12, right:12, background:'none', border:'none', cursor:'pointer', fontSize:'1.4rem', color: isDark ? '#a0a0a0' : '#666', lineHeight:1, minWidth:36, minHeight:36, zIndex:2 }}>×</button>`.
      - Image: `<div style={{ position:'relative', height:260, width:'100%' }}>` with crimson gradient fallback + `{!imgError && <img ... objectFit:'cover' />}` + bottom scrim (same pattern as card).
      - Content `<div style={{ padding:'1.5rem' }}>`: `<h3>` (serif crimson `#D0112B`, fontSize `1.8rem`) → `<p>` subtitle (sans, uppercase, crimson) → `<p>` full description (sans, `descColor`, lineHeight 1.6) → larger Plan My Trip `<a>` (same green style, `fontSize:'0.95rem'`, `padding:'0.7rem 1.4rem'`, full-width optional). No `stopPropagation` needed here (modal has no card-on-open conflict).

      Responsive (mobile ≤640px): add a `useIsMobile()` hook (`window.innerWidth <= 640`, resize listener like FanDeck's `useCardSize`). Use it in the flex row container: `flexDirection: isMobile ? 'column' : 'row'`, and on each `BengalCard` set `maxWidth: isMobile ? 380 : 420`. (Pass `maxWidth` from parent via a prop, or read the hook inside `BengalCard`.) Cards stay centered; no horizontal overflow.

      Verify: `cd d:/365wanderlast && npm run build` — builds clean (0 errors, file compiles even though not yet imported). Then `npm run lint` — 0 errors.

- [ ] 2. **Remove "Plan My Trip" from the Bengal InfoPanel only** in `src/components/FanDeck.jsx` (CHANGE 1).
      In `InfoPanel({ dest, isDark, onClose })`, inside the `isAvailable ? (<> ... </>)` branch, wrap ONLY the first `<a>` (the "📱 Plan My Trip" WhatsApp button, `href={getWhatsAppLink(waMsg)}`) in a conditional so it renders for every available destination EXCEPT Bengal.
      **Files:** `src/components/FanDeck.jsx`.
      **Exact edit:** the Plan My Trip `<a>` currently sits directly inside `<div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>` as the first child, immediately before the "Scroll to details ↓" `<a>`. Replace:
      ```jsx
            <a
              href={getWhatsAppLink(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ /* …existing green button style… */ }}
              onMouseOver={e => e.currentTarget.style.background = '#1da851'}
              onMouseOut={e => e.currentTarget.style.background = '#25D366'}
            >
              📱 Plan My Trip
            </a>
      ```
      with the same element wrapped in the conditional:
      ```jsx
            {dest.id !== 'bengal' && (
              <a
                href={getWhatsAppLink(waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ /* …unchanged green button style… */ }}
                onMouseOver={e => e.currentTarget.style.background = '#1da851'}
                onMouseOut={e => e.currentTarget.style.background = '#25D366'}
              >
                📱 Plan My Trip
              </a>
            )}
      ```
      Leave the "Scroll to details ↓" `<a>` (`href={scrollTarget}`) UNCHANGED for all available cards, so Bengal shows title + tagline + "Scroll to details ↓" only; Rajasthan (and any other `available` dest) keeps both buttons. Do not touch the coming-soon branch.
      Verify: `cd d:/365wanderlast && npm run build` — 0 errors. (Logic: for `dest.id==='bengal'`, `isAvailable` is true, the Plan My Trip `<a>` is skipped, Scroll-to-details still renders.)

- [ ] 3. **Add the Bengal details section + render `BengalCards`** in `src/components/Destinations.jsx` (CHANGE 2 + CHANGE 4).
      Depends on item 1 (BengalCards must exist so the import resolves).
      **Files:** `src/components/Destinations.jsx`.
      **Edits:**
      - Add import after the `FanDeck` import near the top: `import BengalCards from './BengalCards';`
      - Immediately AFTER `<FanDeck destinations={exploreIndia} />` (currently the last element before `</div></section>`), insert the anchor + heading + component:
        ```jsx
        <FanDeck destinations={exploreIndia} />

        {/* ── Bengal destination details ── */}
        <div id="bengal-destinations" style={{ scrollMarginTop: '80px' }} />

        <Reveal>
          <div style={{ textAlign: 'center', marginTop: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            {/* subtle gold eyebrow label (existing GoldRule component) */}
            <GoldRule text="Bengal" color="#C8921A" />

            {/* serif crimson heading */}
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 700, color: '#D0112B', margin: '1rem 0 0.3rem', lineHeight: 1.1 }}>
              Bengal
            </h3>

            {/* sans muted subtitle */}
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: isDark ? '#a0a0a0' : '#666', margin: 0 }}>
              Land of Culture & Rivers
            </p>
          </div>
        </Reveal>

        <BengalCards />
        ```
      - `GoldRule` and `Reveal` are already defined/imported in this file; `isDark` is in scope from `useDarkMode()`. The `id="bengal-destinations"` div is the smooth-scroll target for FanDeck's Bengal "Scroll to details ↓" button; the inline `scrollMarginTop:'80px'` mirrors the existing `index.css` rule (redundant but explicitly requested). The eyebrow `GoldRule text="Bengal"` + serif `h3` "Bengal" is an intentional eyebrow+heading pattern; the small "Bengal" repetition is acceptable and faithful to both CHANGE 2 (serif crimson "Bengal") and CHANGE 4 (subtle GoldRule heading above).
      Verify: `cd d:/365wanderlast && npm run build` — 0 errors, `BengalCards` resolves. `npm run lint` — 0 errors. Manual: open dev server, scroll the Bengal fan card's "Scroll to details ↓" → page smooth-scrolls to the new "Bengal" heading block (offset 80px below the navbar).

- [ ] 4. **Build, then commit (do NOT push)** the three component files (CHANGE 5).
      Depends on items 1–3.
      **Files staged:** `src/components/FanDeck.jsx`, `src/components/BengalCards.jsx`, `src/components/Destinations.jsx` (exactly as the brief specifies — NOT the images; see Caveats).
      **Commands (run in order):**
      ```
      cd d:/365wanderlast
      npm run build
      git config user.name 'Hanu-man12'
      git config user.email 'shawharshit116@gmail.com'
      git add src/components/FanDeck.jsx src/components/BengalCards.jsx src/components/Destinations.jsx
      git commit -m 'feat(bengal): 3D destination cards Barhanti+Teesta, remove Plan My Trip from Bengal popup'
      ```
      Note: `git config` here sets LOCAL repo identity only (default scope with `-C`/inside repo) — reversible, not global. It is needed so the commit has an author. Do NOT run `git push`.
      Verify: `npm run build` exits 0 (clean, 0 errors/warnings). `git log -1 --stat` shows the commit with exactly the 3 staged files and the specified message; `git status` shows the two PNGs still untracked (expected) and nothing else staged.

- [ ] 5. **Write the Hinglish implementation report** to `d:/365wanderlast/.agents/tasks/bengal-cards-report.md` (HONEST NOTES).
      Depends on items 1–4.
      **File:** `d:/365wanderlast/.agents/tasks/bengal-cards-report.md` (new).
      Content (in Hinglish): list every file changed (FanDeck.jsx, BengalCards.jsx, Destinations.jsx), what each change does (Bengal popup se Plan My Trip hata diya; BengalCards me Barhanti + Teesta 3D cards + modal with Plan My Trip WhatsApp; Destinations.jsx me `#bengal-destinations` anchor + heading + `<BengalCards />` add kiya), build status (`vite build` clean, lint clean), and all caveats (see below). Note explicitly what was NOT verified in-browser (build/lint only — no automated browser test exists) and list the manual checks still pending.
      Verify: the file exists at the path and clearly states changed files + caveats.

---

## Caveats / honest notes (include in the report)

1. **Images are NOT in the commit.** CHANGE 5's `git add` lists only the 3 component files; `public/destinations/barhanti.png` and `public/destinations/teesta.png` remain untracked. They render locally/in build (served from `public/`) but will NOT ship to a deployment (e.g. Vercel) unless committed separately. Flag to user: add `git add public/destinations/barhanti.png public/destinations/teesta.png` (and recommit) before deploy if the photos must ship. The brief's `WHAT NOT TO TOUCH` excludes `siteData.js` image paths, so no data change is needed.
2. **No automated browser/E2E test exists** in this repo (no `test` script). Verification is `vite build` (compiles, 0 errors) + `eslint .` (0 errors) only. The following still require manual browser checks after implementation: (a) Bengal fan card opens its InfoPanel with title + tagline + "Scroll to details ↓" and NO "Plan My Trip"; (b) "Scroll to details ↓" smooth-scrolls to the "Bengal" heading, offset 80px below the navbar; (c) both 3D cards show the correct photos and text; (d) clicking a card opens the modal with the correct info + larger "Plan My Trip" WhatsApp link (new tab, prefilled message); (e) modal closes on backdrop click and × button; (f) Rajasthan and other available dests still show BOTH buttons; (g) light/dark theme switches correctly on cards + modal; (h) desktop = two cards side by side, mobile ≤640 = single column; (i) `prefers-reduced-motion` skips the rotateY (only the lift).
3. **`onError` fallback.** If a PNG path ever 404s, each card/modal hides the `<img>` and shows the crimson gradient background (matching the FanDeck fallback pattern) — no broken-image icon.
4. **Description line-clamp.** The card's bottom 35% band (~182px of 520px) cannot fit the full long description alongside title + subtitle + button, so the card clamps the description to 3 lines (`-webkit-line-clamp:3`). The modal shows the full text. This is a layout necessity, not a content change.
5. **Git identity.** `git config user.name/user.email` sets LOCAL repo config (reversible: `git config --unset user.name` etc.). Flagged because repo convention normally doesn't touch config; done only because the brief explicitly requests it for this commit.
6. **Scope untouched (per brief):** Navbar, Hero, About, WhyChooseUs, Contact, Footer, Preloader, `exploreIndia` data, Rajasthan InfoPanel behavior, existing card design / carousel / wave effect — none modified.

---

## Plan file path

`d:/365wanderlast/.agents/tasks/bengal-plan.md`

---

## Build evidence (implementation run — 1st iteration)

- **Build command run:** `npm run build` (→ `vite build`), from `d:/365wanderlast`.
- **Build result:** ✅ PASS — `✓ 2316 modules transformed`, `✓ built in 3.35s`, exit code 0, 0 errors / 0 warnings. Output: `dist/assets/index-BJkMN2yy.js` (463 kB / 141 kB gzip), `dist/assets/index-BAoLt-Jh.css` (17.96 kB).
- **Lint command run:** `npm run lint` (→ `eslint .`).
- **Lint result:** 32 errors, all PRE-EXISTING across 18 files NOT touched by this task (App.jsx, About.jsx, Contact.jsx, Hero.jsx, WhyChooseUs.jsx, Preloader.jsx, ThemeToggle.jsx, EnquiryForm.jsx, Footer.jsx, …). The repo was never lint-clean. The only error in a file this task touched is `BengalCards.jsx:6 'React' is defined but never used` — the identical `no-unused-vars` pattern already present in every other component file (FanDeck.jsx:6, Destinations.jsx:6, About.jsx:18, …). No NEW category of lint error was introduced; the new file matches the existing project convention.
- **Commit:** NOT made in this step (per task instruction — a later finalize step commits after `bengal-review.json` verdict APPROVED).
- **Files changed:** `src/components/FanDeck.jsx` (edit), `src/components/BengalCards.jsx` (new), `src/components/Destinations.jsx` (edit).

---

## Build evidence (review-fix run — 2nd iteration, B1 fix)

- **Review state before this run:** `bengal-review.json` verdict = `CHANGES_REQUESTED`, one blocking finding **B1** — `BengalCards.jsx` `BENGAL_CARDS` `description` fields used plan-authored prose instead of the literal text the original user request specified twice (card Description + popup bullet).
- **Fix applied:** In `src/components/BengalCards.jsx` `BENGAL_CARDS`:
  - Barhanti `description` → `'Lake, green hills, sunset.'`
  - Teesta `description` → `'Flowing river, Himalayan foothills, scenic North Bengal landscapes.'`
  Both the card (`BengalCard`, 3-line clamp) and the modal (`BengalModal`) read `card.description`, so this single array edit corrects both surfaces. No other file touched in this iteration.
- **Build command run:** `npm run build` (→ `vite build`), from `d:/365wanderlast`.
- **Build result:** ✅ PASS — `✓ 2316 modules transformed`, `✓ built in 1.76s`, exit code 0, 0 errors / 0 warnings. Output: `dist/assets/index-iRvDPUB4.js` (463 kB / 141 kB gzip), `dist/assets/index-BAoLt-Jh.css` (17.96 kB).
- **Commit:** NOT made in this step (per task instruction — finalize step commits after `bengal-review.json` verdict APPROVED).
- **Files changed this iteration:** `src/components/BengalCards.jsx` (description text fix).
