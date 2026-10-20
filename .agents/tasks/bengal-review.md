# Bengal Cards — Review (2nd pass)

Scope: uncommitted diff in `d:/365wanderlast` vs. approved plan (`bengal-plan.md`) and the authoritative original user request. Prior pass filed one blocker (B1 — card/modal descriptions used plan-authored prose). This pass verifies the B1 fix and re-checks the paths it affected. Build/lint evidence read from the plan's recorded "Build evidence (review-fix run — 2nd iteration, B1 fix)"; not re-run.

## Evidence reviewed

- `git diff --stat`: only `src/components/Destinations.jsx` (39+) and `src/components/FanDeck.jsx` (indentation re-wrap of the conditional) are modified; `src/components/BengalCards.jsx` is new/untracked. No other production files touched; `src/data/siteData.js` (exploreIndia) not in the diff.
- `src/components/BengalCards.jsx` — `BENGAL_CARDS`:
  - Barhanti `description` (line ~61): `'Lake, green hills, sunset.'` ✅ (was the plan-authored prose; now the user-specified literal)
  - Teesta `description` (line ~69): `'Flowing river, Himalayan foothills, scenic North Bengal landscapes.'` ✅
  - Both `BengalCard` (3-line clamp) and `BengalModal` read `card.description`, so the single array edit corrects both surfaces. No other line in this file changed in iteration 2.
- `src/components/FanDeck.jsx` (unchanged since pass 1): `InfoPanel` `isAvailable` branch wraps the "📱 Plan My Trip" `<a>` in `{dest.id !== 'bengal' && (...)}`; "Scroll to details ↓" `<a>` (`href={scrollTarget}`, where `scrollTarget = dest.id === 'rajasthan' ? '#destinations' : \`#${dest.id}-destinations\`` → Bengal = `#bengal-destinations`) is unchanged; coming-soon branch untouched. Rajasthan (id !== 'bengal') keeps both buttons.
- `src/components/Destinations.jsx` (unchanged since pass 1): `import BengalCards from './BengalCards'` added; `<div id="bengal-destinations" style={{ scrollMarginTop: '80px' }} />` inserted immediately after `<FanDeck destinations={exploreIndia} />`; Bengal heading block (`GoldRule text="Bengal"` + serif crimson `<h3>Bengal</h3>` + subtitle "Land of Culture & Rivers") in `<Reveal>`; `<BengalCards />` rendered. `#bengal-destinations` is unique in the codebase (grep confirms single occurrence).
- Image assets: `public/destinations/barhanti.png` and `public/destinations/teesta.png` both exist → served as `/destinations/barhanti.png` and `/destinations/teesta.png` (card `image` paths match exactly).
- `src/utils/contactLinks.js` exports `getWhatsAppLink(message)` → `https://wa.me/<number>?text=<encodeURIComponent(msg)>`; import in BengalCards resolves (build confirms).
- Build evidence (plan, 2nd iteration): `npm run build` → `✓ 2316 modules transformed`, `✓ built in 1.76s`, exit 0, 0 errors/0 warnings. Lint: 32 pre-existing errors in untouched files; only new-file note is `BengalCards.jsx:6 'React' defined but never used`, matching the existing project convention — not a new defect.

## Checklist results

- FanDeck Bengal InfoPanel shows only "Scroll to details ↓" (no Plan My Trip); Rajasthan still shows both. PASS.
- BengalCards.jsx: two cards (Barhanti/Baranti, Teesta/River Valley North Bengal), correct images, titles/subtitles/descriptions/WhatsApp messages match the approved spec (descriptions now the user-specified text). PASS.
- 3D depth elements all present: `perspective:1000px` container, `whileHover` rotateY `-3`/`+3` + `y:-6`, spring `stiffness:300, damping:25`, `borderRadius:20`, height 520, maxWidth 420 desktop / 380 mobile, photo top 65% `objectFit:cover`, bottom 35% scrim + info + green `#25D366` `target="_blank"` Plan My Trip with `stopPropagation`, crimson-gradient `onError` fallback, `AnimatePresence` modal (`opacity:0,scale:0.95 → opacity:1,scale:1`, close on backdrop + ×), `useIsMobile` row/column ≤640, `usePrefersReducedMotion` skips rotateY, `useDarkMode` via `MutationObserver` on `html.dark`. PASS.
- Destinations.jsx: anchor placed right after `<FanDeck>`, Bengal heading present, BengalCards imported + rendered. PASS.
- No changes to Navbar/Hero/About/WhyChooseUs/Contact/Footer/Preloader, Rajasthan InfoPanel, carousel/wave animations, or exploreIndia data. PASS.
- Build passes; no broken image paths; imports resolve. PASS.

## Prior-finding resolution

- **B1 (descriptions):** RESOLVED. Barhanti and Teesta `description` fields in `BENGAL_CARDS` now hold the exact user-specified text; both card and modal render them. No reopen — fix verified in file.

## Observations (non-blocking, approved-per-plan)

- The `perspective:1000px` lives on the outer wrapper div whose direct child is an intermediate flex container (default `transform-style: flat`), so the foreshortening reaches that flex row, not the grandchild cards directly; the cards still receive the `rotateY`/lift/shadow hover (the listed 3D elements are all present in code). This matches the approved plan structure verbatim and is not changed here — noted only for transparency about the rendered effect, not a blocker.

## Verdict

APPROVED — B1 resolved; no blocking findings remain.
