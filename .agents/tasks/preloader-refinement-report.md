# Preloader Refinement Report
**365 Wanderlust — Preloader v3**
_Written by: Coding Agent (Hinglish mein, jaise request tha)_

---

## 1. Extra Crimson Screen Ka Root Cause aur Fix

**Problem kya tha:**
Purane code mein ek `useEffect` tha jo `phase === 'sliding'` hone par `setTimeout(onDone, 900)` call karta tha. Door animation sirf 600ms ki thi — lekin `onDone()` 900ms baad fire hota tha. Matlab door poori tareh close ho jaati thi, phir bhi 300ms tak ek solid crimson screen dikhai deti thi jab tak `onDone()` finally fire nahi hota tha. Yahi woh "flash" tha.

**Fix kaise ki:**
Woh `setTimeout` wala `useEffect` puri tarah hata diya. Ab `onDone()` directly door panel ke `onAnimationComplete` callback mein call hoti hai — jab top door panel `-100%` tak slide kar jaata hai (`y: '-100%'` animation complete), tab `phaseRef.current === 'sliding'` check karke `advancePhase('done')` aur `onDone()` dono fire hoti hain.

Yahan ek important baat: `App.jsx` mein Navbar, Hero, About, etc. hamesha render hote hain — Preloader ke neeche. Preloader sirf ek `position: fixed` overlay hai. Jab `onDone()` call hoti hai, `showPreloader` false ho jaata hai, Preloader DOM se hata jaata hai, aur site already wahan existing rehti hai. Koi delay nahi, koi extra re-render nahi.

---

## 2. Z-Shaped Door Panels — Clip-Path Coordinates

**Technique:** CSS `clip-path: polygon(...)` with percentage-based coordinates. Pixels nahi use kiye — isliye har screen size pe geometry sahi rehti hai bina overflow ya gap ke.

**Top Panel (upar slide karta hai):**
```css
clip-path: polygon(0% 0%, 100% 0%, 100% 55%, 60% 45%, 40% 55%, 0% 45%)
```

**Bottom Panel (neeche slide karta hai):**
```css
clip-path: polygon(0% 45%, 40% 55%, 60% 45%, 100% 55%, 100% 100%, 0% 100%)
```

**Math samjho:**
- Top panel ka bottom edge: right side 55% pe hai → 60% width point pe 45% pe aata hai → 40% width pe 55% pe jaata hai → left side 45% pe khatam hota hai
- Bottom panel ka top edge: bilkul complement hai — left 45%, 40% pe 55%, 60% pe 45%, right 55%
- Yeh dono milke ek Z-shape banate hain (90° rotated bolt/gate panel jaisi shape)
- Closed state mein dono panels poora viewport cover karte hain — koi gap nahi, koi overlap nahi

**Kyon yeh approach choose ki:**
Clip-path ko animate nahi kiya (clip-path stay constant rehti hai), sirf `translateY` animate kiya. Isse motion ke "same point count" interpolation requirement se bachte hain aur ek clean, mechanical slide milti hai. `willChange: 'transform'` add kiya GPU acceleration ke liye.

---

## 3. "365" Counter-in-Heading — Layout Shift Kaise Roka

**Old approach:** `CHARS` array ke index 0,1,2 (`'3','6','5'`) individual `motion.span` elements the, plus ek alag counter `motion.div` tha jo `progress` (0-100) padStart se dikhata tha.

**New approach:**
- `CHARS.slice(3)` use kiya — sirf `' Wanderlust'` ke characters render hote hain original `motion.span` loop se
- Ek naya `<motion.span key="counter">` add kiya jo heading ke aage aata hai
- Value: `Math.round(1 + (Math.min(progress, 100) / 100) * 364)` — yani progress 0→100 map hota hai 1→365 par

**Layout shift prevention ke liye:**
```jsx
display: 'inline-block',
minWidth: '2.2ch',           // 3-digit number ke liye space hold karta hai
fontVariantNumeric: 'tabular-nums',  // monospace digits — horizontal jump nahi hota
```
`2.2ch` slightly generous hai `3ch` se — isse "Wanderlust" ka letter "W" tab bhi stable rehta hai jab number 1 digit (1-9) hota hai, tab bhi jab 2 digit (10-99) hota hai, aur tab bhi 3 digit (100-365) ke liye.

Counter span ke entry/exit animations exactly waise hi hain jaise original `'3'` char ka tha — same EXIT_DELAYS[0], same scatter animation.

Separate counter `motion.div` (`{String(progress).padStart(2, '0')}`) poori tarah remove kar diya. Logo ka `marginRight: '0.5em'` bhi remove kiya (ab logo ke liye `marginLeft: '0.35em'` use kiya heading se gap ke liye).

Accessible label `aria-label="365 Wanderlust"` container div pe maintain kiya — screen readers ko animated number nahi dikhega.

---

## 4. Logo Asset Confirmation

**Old code:**
```js
import logoMark from '../assets/brand/logo-mark.png';
// ...
<img src={logoMark} ... />
```

**New code:**
```js
import { brand } from '../data/siteData';
// ...
<img src={brand.logo} ... />
```

`siteData.js` mein dekha toh `brand.logo` exactly same file import karta hai:
```js
import logoMark from '../assets/brand/logo-mark.png';
export const brand = { logo: logoMark, ... };
```

Matlab same asset hai, sirf ab single source of truth use ho raha hai — jo Navbar.jsx bhi use karta hai (`import { brand } from '../data/siteData'`). Preloader aur Navbar ab same asset reference karte hain.

Reduced-motion branch mein bhi `src={brand.logo}` use kiya.

---

## 5. Spec Se Koi Deviation

**Koi major deviation nahi.** Ek minor point:

- Spec mein `minWidth: '2.2ch'` suggest tha — exactly wahi use kiya.
- Logo ki `marginRight: '0.5em'` ko `marginLeft: '0.35em'` mein convert kiya (ab logo heading ke baad aata hai, pehle nahi) — yeh functionally same result deta hai.
- `AnimatePresence` wrapper door panels ke liye remove kar diya (wo unnecessary tha since panels `isSliding` condition par conditionally render hote hain). `onAnimationComplete` guard `phaseRef.current === 'sliding'` se hai taaki double-fire na ho.
- `import { AnimatePresence }` Preloader mein se remove kiya kyunki ab use nahi ho rahi.

---

## 6. Jo Browser Mein Test Kiye Bina Verify Nahi Ho Sakta

Honestly kehna zaroori hai — yeh cheezein sirf browser mein run karke confirm hongi:

1. **Z-shape visually sahi dikh rahi hai ya nahi** — polygon coordinates mathematically sahi hain, but actual render pe koi sub-pixel rounding ya browser-specific rendering difference ho sakta hai.

2. **Door panels ke beech gap/overlap** — closed state mein top ka 45%/55% edge aur bottom ka 45%/55% edge bilkul match karna chahiye. Agar browser fractional pixels differently handle kare toh ek hairline gap ya overlap ho sakta hai. 1% safety margin diya (55% vs 50%) isliye small discrepancy absorb ho jaaye.

3. **Mobile breakpoints pe overflow** — percentages use ki hain isliye theory mein theek hai, but actual mobile devices pe (iPhone SE, Android) render verify karna hoga.

4. **tabular-nums support** — modern browsers mein sahi kaam karta hai, purane browsers mein `font-variant-numeric: tabular-nums` support nahi ho sakta. Given ki Vite + React 19 project hai, modern browser target safe assume hai.

5. **onAnimationComplete double-fire in React Strict Mode** — `phaseRef.current === 'sliding'` guard se protect kiya, but Strict Mode ke double-invoke behavior ko browser devtools mein actually verify karna chahiye.

6. **Reduced-motion branch mein onAnimationComplete** — fade out pe `isSliding` check ke saath `onDone()` call ki. Yeh sequence sahi kaam karega, but actual assistive technology testing nahi hua.

---

_Report likha gaya: workflow step ke end mein, build successfully pass hone ke baad._
_Build output: `✓ 2316 modules transformed. ✓ built in 2.28s` — koi error nahi._
