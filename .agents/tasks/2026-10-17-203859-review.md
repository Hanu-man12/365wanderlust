# Explore India fan deck — 9 destinations, available/coming-soon states

The change adds an interactive playing-card fan deck inside the existing "Our Destinations" section. Nine Indian destinations are configured in `siteData.js`, with Bengal and Rajasthan marked available and the other seven marked coming-soon. `FanDeck.jsx` fans cards from a common bottom-center pivot using `motion/react` spring transitions, with drag, swipe, keyboard, and dot-nav interactions. The existing Destinations section is untouched except for two imports and an anchor div. The Vite build passes clean — 2317 modules, 0 errors.

**Watch for:** `zIndex` inside `motion.div`'s `animate` prop snaps rather than tweens — cards may flash to the wrong stack order mid-transition (confirmed). The Bengal "Scroll to details ↓" link scrolls to the Rajasthan destination list until Bengal-specific content is inserted below the anchor (likely — by design as a placeholder, but worth confirming intent with the owner).

**Verdict**: APPROVED

---

## High-level view

All nine destinations are present in `siteData.js` in the exact required order, with correct `status` values and image paths matching the `/destinations/<slug>.jpg` pattern.

The fan pivot geometry is correct: cards share a `bottom: 0, left: 50%` anchor with `transformOrigin: bottom center`, and the `spread`/`rot` lookup tables mirror cleanly for left and right offsets. `overflow: hidden` on the container prevents horizontal bleed. The dot nav ensures all nine cards are reachable even when edge cards are clipped at narrow viewports.

The `zIndex` field sits in the `animate` prop rather than `style`. Motion/react snaps integer z-index rather than tweening it, which can cause the wrong card to sit on top during the spring transition. Moving it to `style` fixes the ordering immediately on index change.

The `useDarkMode` MutationObserver correctly targets `attributeFilter: ['class']` on `document.documentElement`, matching the site's `html.dark` toggle. The `InfoPanel` theme-switches correctly; fan cards use fixed dark overlays and text-shadow that work in both themes.

The Bengal scroll anchor (`#bengal-destinations`) is injected above the existing Rajasthan destination list. Until Bengal content is added below it, the "Scroll to details ↓" link in the Bengal info panel drops users into the Rajasthan cards. This is a deliberate placeholder pattern documented in the implementation report, but the anchor name implies Bengal-specific content that isn't there yet.

---

<details>
<summary>Issues (3)</summary>

1. **`zIndex` not animatable in motion/react** — `zIndex` inside the `animate` prop snaps rather than tweens, so cards may briefly appear in the wrong stack order while the spring transition is in flight. Move `zIndex` out of `animate` and into the `style` prop (derived from `activeIndex` at render time) for immediate, reliable z-ordering. Confirmed — `DestCard` animate prop.

2. **Dead reduced-motion branch in `DestCard`** — The main fan path always passes `reducedMotion={false}` to `DestCard`, so the card-level branch that sets only `opacity` (and drops `rotate`/`x`/`scale`) is unreachable. If that branch were ever reached, all nine cards would stack at `rotate(0) translateX(0)` with no positional separation. The parent's early-return fallback handles reduced-motion correctly, but the dead branch in `DestCard` is a latent stacking bug. Confirmed.

3. **Bengal anchor scrolls to Rajasthan content** — `#bengal-destinations` is placed above the Rajasthan city cards (Jaipur, Jodhpur, Udaipur, Pushkar, Thar). The Bengal info panel's "Scroll to details ↓" link currently takes users to that Rajasthan list, not Bengal content. The anchor is correctly positioned as a placeholder for future Bengal content, but until that content is added, the UX is misleading. Confirm with owner whether to hide the scroll link until Bengal content is live, or keep it as-is. Likely.

</details>

---

<details>
<summary>Details</summary>

### `zIndex` in `animate` prop

```jsx
animate={reducedMotion
  ? { opacity: isActive ? 1 : 0.72 }
  : {
      rotate,
      x: translateX,
      scale: isActive ? 1.05 : 1,
      zIndex,        // ← snaps, doesn't tween
    }
}
```

During a spring transition where the active card changes and two cards cross each other's screen position, the card that should be on top may render beneath the other for the duration of the animation. The fix: remove `zIndex` from `animate`, add `zIndex` to the `style` prop so it resolves immediately when `activeIndex` changes.

### Dead `DestCard` reduced-motion branch

Every call site in the main fan path is:

```jsx
<DestCard ... reducedMotion={false} />
```

The card's internal `reducedMotion` branch — `animate={{ opacity: isActive ? 1 : 0.72 }}` — is never reached from production code. If it were, `rotate`, `x`, and `scale` would all remain at their initial values, stacking all nine cards on the same spot. The parent's early-return renders a flex list instead, which works correctly; the card-level branch should either be removed or fixed to include positional props.

### Image fallback inconsistency

The main `DestCard` uses React state (`imgError`) to unmount the `<img>` on load failure. The reduced-motion path in the parent uses `e.currentTarget.style.display = 'none'`. Both prevent broken image icons, but the DOM mutation pattern in the reduced-motion path doesn't survive React re-renders if the card's subtree is reconciled. Not a blocking issue with the current static data, but the state-based pattern from `DestCard` is the more robust approach.

</details>

---

<details>
<summary>File map</summary>

| File | What changed |
|---|---|
| `src/data/siteData.js` | New `exploreIndia` export — 9 destinations with id, name, status, image path, tagline |
| `src/components/FanDeck.jsx` | New component — fan deck with motion animations, drag/swipe/keyboard/dot nav, info panel, dark mode, responsive tiers, reduced-motion fallback |
| `src/components/Destinations.jsx` | Added `FanDeck` + `exploreIndia` imports; inserted FanDeck block with heading and `#bengal-destinations` anchor above existing destination cards |
| `public/destinations/.gitkeep` | Empty file to track the `/public/destinations/` folder in git |

Full diff: `git diff main -- src/components/FanDeck.jsx src/components/Destinations.jsx src/data/siteData.js`

</details>
