# Fitwise: full project context

> **Renamed 1 Nov 2026:** the product is now called **Vrom** everywhere a shopper sees it (header, favicon, page titles, "Ask Fitwise" → "Ask Vrom", etc.) — the code's internal names (`.btn.sun`, `CAT_META`, this file) and the rest of this historical log below still say "Fitwise" because that was the name at the time each decision was made.


Everything needed to continue this project in a new session: the brief, the decisions and why, the current state of every screen, a log of the whole conversation (each request and what came of it), the technical gotchas, and what is still open.

- **Written:** 31 Oct 2026, at the end of a long working session.
- **Companion file:** `HANDOFF.md` is the shorter, code-oriented handoff. This file is the fuller narrative. Where the two disagree, this one is newer (see "Known stale parts of HANDOFF.md" near the end).
- **State of the repo:** a git repo exists but has **no commits**. Nothing has been committed or pushed, and nothing is published.
- **How it was verified:** every change was checked in a browser at **desktop width** only. The user told me to leave mobile for now, so mobile layouts were not reviewed after the early rounds.

To start a new session, paste:

> Read `CONTEXT.md` fully, then `HANDOFF.md`. Serve the folder with `python3 -m http.server 5173` and open `prototype.html` and `index.html`. Follow "How the user wants it" strictly and don't undo anything under "Rejected". Continue from "Open items".

---

## 1. What this project is

A design-assignment proof of concept for an interview. The candidate is **Chaitanya (G Chaitanya Sai)**. The interviewer is **Vithya**, brief relayed via **Priya**.

**Brief:** design an e-commerce website for an auto-care brand selling **spare parts, tyres and tracks** for many vehicle makes and categories (cars, trucks, tractors, other vehicles). Only **three screens** are wanted: **Home, one Product Listing Page (PLP), one Product Detail Page (PDP)**. The PDP must let a user check **fitment** and find **local dealers** to buy from.

**What the interviewer cares about most is the thinking**, not just the screens: industry understanding, personas, journey mapping, information architecture, how AI / natural-language search is used, and how friendly and seamless it feels. The earlier case studies by the same author (YourDOST, Mumzworld) are a **structure reference only, never for colours or UI**.

**Thesis:** *fitment is the product.* Vehicle first, AI translates and the catalogue decides, fulfilled locally (reserve at a store, pay at the counter). North-star metric: **first-time-right fitment rate**.

"Fitwise" is a placeholder brand. All prices, part numbers, dealers and statistics in the prototype are illustrative.

### Deliverables (all open straight from the folder)

| File | What it is |
|---|---|
| `index.html` | The case study document (hand-written HTML). Research, market scan, personas, journeys, IA, AI search, annotated screens, design system, metrics, sources. Embeds the live prototype in desktop and phone frames. |
| `prototype.html` | The working prototype (Home, Listing, Product). **Generated** by `python3 src/build.py`. Needs `assets/` beside it. |
| `assets/` | `cut/` AVIF cut-outs, `photo/` JPGs, `logos/` brand PNGs, `creta360/` 36 frames, `map/coimbatore.js` map data. |
| `src/` | Source: `style.css`, `shell.html`, `data.js`, `app.js`, `build.py`, `map/` (map data scripts), `tools/cut.swift` (image cut-out tool). |
| `HANDOFF.md`, `CONTEXT.md` | Handoff notes. |

---

## 2. How to run and rebuild

```bash
cd "<this folder>"
python3 -m http.server 5173        # then open http://localhost:5173/index.html
python3 src/build.py               # regenerates prototype.html from src/
```

- `build.py` inlines `style.css`, the `shell.html` template (an HTML template literal; helpers `${I('icon')}`, `${PH('img')}`, `${C('img')}`) and `data.js` + `app.js`. It also adds `<script src="assets/map/coimbatore.js">`. Lucide icons load from unpkg; Inter / JetBrains Mono / Noto fonts from Google Fonts.
- `index.html` is not generated. Its prototype embeds are lazy iframes at `prototype.html?embed=1#home|plp|pdp`.
- Deep links: `#home`, `#plp`, `#pdp`, `?v=<vehicle>` (`creta`, `m575`, `signa`, `jcb`), `?cat=<brakes|tyres|tracks>`, `?p=<product id>`, `?ask=<question>`, `?embed=1`.
- **macOS gotcha:** a preview server started by a tool is blocked from reading `~/Downloads` (privacy protection). During this session a copy of the site was synced to a temporary folder and served from there on port 5174. `.claude/launch.json` still has a `fitwise-copy` entry pointing at that **temporary folder, which will not exist in a new session**. Delete that entry, or just run the command above from a normal Terminal.
- After every build the temporary copy had to be re-synced (rsync), which is easy to forget.

---

## 3. How the user wants it

The bar, in the user's words across the project: it should look like **a top-tier Indian or global e-commerce lead designer shipped it, not like AI made it**.

### Working style (learned this session)
- Gives **short, blunt directives, usually with a screenshot**. "Fix X alone" means change only X.
- Wants **consistency**: same inset, same ground line, same crop across repeated cards. Notices a few pixels of difference.
- Wants **less text and a clear hierarchy**. Called the store cards and the buy box "text heavy", "flat", "clutter".
- Prefers **real photos over illustrations**, but wants card *types* to look different from each other.
- **Desktop first.** After the early rounds: "leave mobile for now, concentrate on website".
- Accepts a recommendation when it is reasoned and short, and answers with a one-word choice ("Yes, in-stock first", "Keep photos, add contrast", "Yes, reword it").
- Asks sharp UX questions (for example whether category images should differ from product images) and expects an opinion, not a survey.

### Rejected (do not reintroduce)
- Auto-scrolling hero carousel; dusk or stock-photo hero with glass chips.
- Cobalt or blue as the dominant colour; gradient headline words; sparkle icons.
- Drawn or illustrated product art; Fluent 3D emoji icons (called "childish"); illustrations or icons in place of photos for categories (considered again this session and kept as photos).
- A floating chat bubble; a large AI chat card on Home.
- A reviewer dock and numbered "design note" pins in the prototype.
- Photo banners of street scenes as offer cards.
- A black "Find my vehicle" next to blue CTAs (inconsistent primary).
- "We never store your number" style promises the build can't keep (see section 6).
- OSM or other hosted map tiles (see section 6).

### Design system (current)
- **Colour (updated: taken from cars24.com/sell-used-cars, user request "update our color palette to this, nothing apart from that"):** brand indigo `#4736FE` (hover `#4031E5`, tint `#EEEDFF`) for every primary action, links, active states, the AI orb, offers/due-soon and the IND plate strip. Slate neutrals: text `#0F172B`, secondary `#314158`, muted `#62748E`, faint `#90A1B9`; surfaces white / `#F8FAFC` / `#F1F5F9`; borders `#E2E8F0` / `#CAD5E2`. Semantic states unchanged: fit green `#2F7A52`, check amber `#9A6A1E`, red `#C8343A`. The old ink/stone/copper palette is gone (backups of the pre-change CSS/JS were kept outside the project). The case study `index.html` section 10 (Visual language) was updated to describe this palette.
- **Buttons and links:** primary ink-solid, secondary white with ink outline, links underlined ink text. Colour carries meaning, not decoration (Baymard).
- **Type:** Inter (headlines 800, tight tracking, tabular numbers for prices), JetBrains Mono for part numbers and sizes, Noto Sans Devanagari/Tamil fallbacks. **Icons:** Lucide, 1.75 px outline. **Radii:** 10 to 20 px.
- **AI mark:** a small **ink orb** (`.orb`), identical everywhere Ask Fitwise appears (header button, "Ask about this part" row, listing "AI answer", assistant panel header). It spins only while the assistant is answering. No floating bubble.
- **Motion:** springs for confirmation, shimmer only for "working", no animation on prices or stock, reduced-motion respected.

---

## 4. Product decisions worth knowing

- **Hero journey:** "my steering shakes when I brake" leads to front brake discs for a **2024 Hyundai Creta SX 1.5 CRDi** (OE part `51712-C9000`). Pads appear as "frequently bought together".
- **Personas (assumption-based):** Arjun (car owner, product manager, the signed-in user), Ravi (garage mechanic), Gurpreet (farmer, tractor), Meena (fleet manager). Two-axis framing: who decides the part x cost of downtime.
- **AI placement:** in search, a contextual "Help me choose" on the listing, "Ask about this part" on the PDP, and "Customers say" review summaries. All open **one docked side panel** (bottom sheet on mobile). The assistant is **scripted** (keyword matching in `pick()`), not a live model.
- **Fitment UX:** the PLP asks **one** disambiguating question only when it changes the answer. The PDP answers fit first, in a tinted block.
- **Garage vehicles** (`VEHICLES` in `data.js`): Creta (official Hyundai 360 frames, drag to rotate), Mahindra 575 DI, Tata Signa tipper, JCB 30 Plus. Fit logic is `fitOf()`; switching vehicle re-renders everything.
- **Three catalogues, one template:** brake discs, tyres, tracks, each with its own facets.
- **Local fulfilment:** reserve at a store, pay at the counter, held for 4 hours.

---

## 5. Current state of each screen (as of this file)

### Home
1. **Header:** signed-in profile (Arjun), garage switcher, command-palette search with parsed-intent chips, ink-orb "Ask Fitwise" button.
2. **Hero finder:** vehicle-type tabs; a CRED-style number-plate field (IND strip in plate blue); "Find parts". Below it: a **purpose line** ("We use your number to look up the make, model and variant from the registration record."), a **shortcut chip** "Use my Creta · TN 09 BX 4821" (the signed-in user's own saved vehicle for the selected type; none for bikes), then a divider and **"No number handy? Pick your brand"** with a logo row. Tapping a brand moves to model and year; "Use number plate instead" appears only inside that step.
3. **Garage vehicle card:** one large card (Creta has the official 360° render, drag to rotate) on a **showroom stage**: soft light, a floor, and a ground line at 76% of stage height. Every vehicle is fitted into the same box and stood on the line; the contact shadow is sized to the vehicle and sits under the wheels (see `placeCar`, `STAGE`).
4. **Shop parts for your Creta:** **pill chips** (category = navigation, not a product): small round photo, name, "N fit your Creta", chevron. Categories without a listing have no chevron.
5. **Offers for you:** three tinted promo cards. Third is "Farm tyres, fitted at your field" with a supplied red-rim farm-wheel photo.
6. **Shop by vehicle:** six tiles. Each is a facing-left three-quarter render over a slanted light band. Every vehicle starts **36 px** from the left (`--vl`), sits on the same ground line (8 px from the bottom), is capped at 136 px tall and 214 px wide, and the rear slides past the right edge (19 to 27% cropped). The excavator and the auto-rickshaw get an extra rightward nudge (`--dx`). Hover slides the vehicle slightly. Below 1200 px the tiles go three across and the vehicle is right-anchored.
7. **Bestsellers rail:** product cards (the only cards with price, rating, fit badge and Add).
8. **Local map section:** a self-drawn map (see section 6).

### Product listing (PLP)
- Amber fit strip when fit depends on the one question (wheel size 16 or 17 inch for discs and tyres, 80 or 84 links for tracks). Singular and plural copy correct. Facets list only values relevant to the vehicle. Per-category help card (brake inspection, free tyre-size check, on-site tyre check, on-site undercarriage check). Collapsed "Help me choose" AI answer.
- **Wheel size is one shared answer** for discs and tyres (`S.ans.wheel`); tracks use `S.ans.links`.

### Product detail (PDP) buy box
Order, top to bottom: **identity** (brand and tier, title, one-line spec, rating and part number) then **fit verdict** (tinted card: green with a tick, amber with a question, red with a way out; evidence is one plain line; "Also fits N other vehicles" collapsible) then **price** (one muted tax line, one offer line) then **how do you want it** (a three-way switch: Pick up today, Delivery, Get it fitted, with one line of detail) then **one primary button** with the quantity beside it, "or add to cart" as a text link, one reassurance line, then a quiet **"Ask about this part"** row.
- **Fit gating:** if fit is uncertain the primary button is **disabled** and reads "Confirm fit to continue" (the mobile bar too). If the part is wrong for the vehicle, quantity, delivery and add-to-cart disappear and the button becomes "See parts that fit".
- Below the box: **Stores near you**, bought together, details, compatibility, reviews, Q&A. Content (specs, reviews, Q&A, chips, compatibility, gallery, labour costs) varies by part kind: brake disc, car tyre (16 or 17 inch), tractor tyre, truck tyre, track.

### PDP "Stores near you"
- **Store cards:** two lines by default (name and price; distance, area and availability with a dot, plus "Closes 7 PM" only when closing). Only the selected card opens to show rating, hours, "can fit it", one Reserve button and call / WhatsApp / directions icon buttons. One open at a time. "Verified" is a tick; only the Fitwise hub has a text label.
- **Order:** in-stock first, nearest within each group (tab "Nearest in stock"); other sorts also push out-of-stock stores last. The top card is open until the shopper picks one, and a pick survives re-sorting (`S.picked`).
- **Map:** numbered pins match the list numbers; selecting a store (from the list or a pin) opens the same card and draws a dotted route from "You · 641018"; zoom and "show all" controls; legend. Heavy parts (tractor and truck tyres, tracks) use farm, truck and earthmover dealers instead of car-spares shops (`DEALERS_HEAVY`).

### Assistant panel
Scripted scenarios: `brake`, `tractor`, `track`, `fit17`, `pads`, `time`, `service`, `tsize`, `links`, `life`, `pair`, `truck`. PDP suggestions follow the product kind (`CHIPS`). Streams reasoning steps then an answer.

### Case study (`index.html`)
Sections 02 to 08 (industry, market scan, personas, journeys, IA, AI search) plus annotated screens, design system, metrics, sources. This session rewrote the annotations for the finder, the buy box, the store cards, the map, the wheel-size question, the AI mark and accessibility, and fixed factual claims (section 7).

---

## 6. Important technical decisions and why

### The map is drawn by the prototype, not loaded from a tile server
- **What went wrong:** the first map used OpenStreetMap raster tiles. The user's browser showed "Access blocked: app is not following the tile usage policy". OSM's public tile server blocks pages that load many tiles or load them with no referrer (for example a page opened from a file). CARTO's free tiles now return "API KEY REQUIRED". So hosted tiles are unreliable for a demo.
- **Fix:** `assets/map/coimbatore.js` (248 KB) holds roads, rail, water and parks for central Coimbatore, fetched **once** from the Overpass API and simplified. `baseMap()` in `app.js` draws it as SVG in the app's colours, with major road names and neighbourhood labels. No network needed.
- **Regenerating:** three queries are in `src/map/q_major.txt`, `q_water.txt`, `q_minor.txt`; save results as `major.json`, `water.json`, `minor.json` next to `src/map/convert.py`, then run `python3 src/map/convert.py <output folder>`. Overpass was at capacity and needed several mirrors (`overpass.kumi.systems`, `overpass.private.coffee`, `overpass-api.de`); expect to retry.
- **Coordinates are real:** each dealer has `lat` and `lon`; `ME` is PIN 641018 (central Coimbatore, around the bus stand and Race Course). Distances are computed with haversine, so list and map always agree. Some neighbourhood **label positions are approximations**.
- **Limits:** data covers central Coimbatore only; small streets cover a slightly smaller area than main roads; the map is a one-time snapshot.
- **Mobile:** below 520 px the map is "compact" (selected store as a card along the bottom). Not reviewed.

### Plate lookup copy must not over-promise
- "We never store your number" was removed. In India, apps resolve a registration number against the national **VAHAN** registry, typically through a licensed data provider, so the number **leaves the app**, and signed-in apps usually keep the vehicle in the garage. Promising non-storage is a claim a real build probably cannot keep.
- The finder now states the **purpose** only. The found card says where details came from: "saved in your garage" for the user's own vehicle, "from the registration record" for any other number (in the prototype every other number still returns the demo vehicle of that type).
- This is recorded as an open question for the build (section 10).

### The "one question" fitment model
- The 2024 Creta SX **manual** runs 16-inch wheels (205/65 R16) and the automatic / SX(O) 17-inch (215/60 R17), per Autocar India. **Caveat:** sources conflict. Most list the SX as 17-inch without qualification; Autocar India limits 17-inch to automatics. The prototype follows the Autocar split because it is the most specific. **Verify on a real spec sheet before presenting.**
- Products carry `wheel` (16 or 17) or `links` (80 or 84); `fitOf()` uses the shared answers. Variant parts are amber until answered (discs d8; tyres t10, t11; tracks k4).

### Class-name collisions (hit twice)
- The store card class is `.scard` because the header already uses `.sc` when scrolled. An earlier hero carousel `.slide` vs slide-to-confirm `.slide` collision also broke the hero (the control is now `.slider`).

### Image cut-outs
- Many supplied photos have a **fake checkerboard baked into the pixels** (no real transparency). Tool: `src/tools/cut.swift`, using macOS Vision `VNGenerateForegroundInstanceMaskRequest`. Compile with `swiftc -O src/tools/cut.swift -o cut`; run `./cut <in> <out.png> <lift|keep>` (`lift` removes the background, `keep` trusts existing alpha); it crops tightly to the subject.
- Then `sips -Z 900 in.png --out out.png` and `sips -s format avif -s formatOptions 72 out.png --out name.avif`.
- **Edge clean-up** (needed for the JCB, done in browser canvas): the Vision mask can be coarse and carry a ~10 px band of the original background. Remove light low-saturation pixels within ~11 px of the mask edge (then ~3 px), drop specks, fill pin-holes, majority-filter the outline, erode 1 px, feather ~1 px, and replace edge colours with colours from inside the subject. **Keep the band narrow**: a wider band ate the "30 PLUS" decal and track links.
- **Wheels with spokes** (Royal Enfield): the checkerboard also shows between spokes. Clear light neutral pixels inside the wheel areas that are at least 3 px from any dark pixel, with exclusions for the fork, fender and silencer.
- **Browser cache trap:** reusing a filename left a stale image on screen. Give a replaced image a **new filename** (that is why the Construction tile uses `v-mini-excavator.avif`).

### Shadows
- A CSS `drop-shadow` on the whole silhouette smears grey under any part held in the air (the excavator's raised arm). The Construction tile uses `.vt.ground` for a contact shadow under the tracks only.

---

## 7. Fact-check of the case study (done this session)

A background agent checked market and competitor claims in `index.html`. Outcome:
- **Confirmed:** ACMA FY25 aftermarket about ₹99,948 crore (about $11.8 B, up about 6% on the year); TMA domestic tractor sales 2025 about 10.9 lakh (1,090,281, up 19.8%, the first year over a million).
- **Corrected:** the counterfeit range now says "fake parts in the aftermarket", labelled "ACMA and press estimates, 2012 to 2017" (36% ACMA-Nielsen 2012, 40% Business Standard 2014, 5% ACMA "Road Ahead" 2017). "16 component libraries" is 15. A part-number example mixed a pad prefix with a disc number (`58101-C9A00` to `51712-C9000`); now consistent and marked illustrative. "Jio Copilot on Fynd stores" had no source; now "Retail assistants such as Jio Copilot".
- **Softened (judgements, not facts):** Cars24 / Spinny / CRED pattern claims, the Baymard carousel wording, "OEM catalogues: no prices or stock" and "tyre sites show addresses not stock", RockAuto quality tiers relabelled for India. A tractor-size example notes 14.9-28 as an alternative to 13.6-28.
- **Still to confirm on the live sites before presenting:** Boodmo's OE-to-aftermarket cross-reference, RockAuto's tier names, CRED's plate input.
- New sources were added to the case study's source list.

---

## 8. Accessibility (done this session)

- Helper grey darkened for AA contrast (prototype `#6B6F76`, case study `#6B6B6B`).
- Search is a combobox: `/` or Cmd/Ctrl+K opens it, arrow keys and Home/End move through results, `aria-activedescendant`, Enter opens, Escape closes.
- Search, the assistant and drawers are modal dialogs: focus moves in, Tab stays inside, Escape returns focus to the opener (`remember` / `restore`).
- Switches have `role=switch`; icon-only buttons are labelled; toasts and fit boxes are status or live regions; the delivery switch uses `aria-pressed`.
- Colour is never the only signal (icon and sentence accompany each state).

---

## 9. Conversation log (this session, in order)

Each entry: what the user asked, then what happened.

1. **"read the entire claude context of this project... read handoff.md"** → Read `HANDOFF.md` and the source; summarised the project and open items. Noted two small stale items (a style comment, an empty logo map in `build.py`).
2. **"yesh you can start with" + four items** (review tyres/tracks PLP and PDP including empty states and the 80 vs 84 question; update the case study; check competitor and market claims and soften the Cars24/Spinny colour claim; accessibility pass). → Found the Creta wheel-size mismatch and built the shared wheel/links model; per-kind PDP content; dealers for heavy parts; new assistant answers; a fact-check agent; case study rewrites; accessibility work (section 8).
3. **Mid-turn, two images: "have the orb in the primary color... use orb in the ask fitwise section"** → Orb became ink everywhere, including the header button and the panel header; it now spins only while answering.
4. **"Not now"** (to a mobile-check offer), then **"Map doesn't match, make it visually better & good"** → Rebuilt the map with real coordinates, numbered pins matching the list, a route, zoom controls.
5. **"leave mobile for now, concentrate on website"** → Stopped mobile work; all later checks are desktop.
6. **Screenshot of the Creta garage card: "UI is bad - fix the shadow & image place & everything... refer similar brand"** → Built the showroom stage: one ground line, vehicle sized and placed per asset, contact shadow under the wheels that follows the Creta's rotation angle.
7. **"Yes, fix JCB edges"** → Cleaned the JCB cut-out (halo band, specks, outline, colour fringe).
8. **Mid-turn question: should category images differ from product images, illustration or icons or a mix?** → Recommended keeping photos but making the three card types differ in form (pill chips for categories, large tinted tiles for vehicles, product cards with price, rating and Add). User replied **"Keep photos, add contrast"** → Category tiles became pill chips.
9. **Screenshot "Access blocked" + "fix the map"** → Diagnosed OSM blocking, replaced tiles with the self-drawn SVG map from bundled OSM data (section 6).
10. **Six vehicle images: "use these images for the respected categories in Shop by vehicle... aligned & half slide in angle"** → Cut them out (the tractor had a baked checkerboard) and built the angled slide-in tiles.
11. **Screenshot of the SUV card: "fix this card & suv card alone"** → Thar render is far wider than the others and overflowed both edges; gave that tile its own scale and slide-in distance.
12. **Royal Enfield image: "USE THIS IN THE TWO WHEEL CARD"** → Cut it out, including clearing the checkerboard between the spokes; placed in Two-wheelers.
13. **Mid-turn: spacing inconsistency (left gaps of SUV and two-wheeler too small, construction too large)** → Switched all tiles to left-anchoring at a fixed 36 px inset with a shared ground line.
14. **Screenshot of Construction: "FIX THE CONSTRUCTION CARD IMAGE ALONE"** → The grey smear came from the silhouette drop-shadow under the raised arm; replaced with a contact shadow under the tracks.
15. **Mid-turn, screenshot of store cards: "TOO TEXT HEAVY & CLUTTER, THINK ABOUT THE IA"** → Ranked the information by what decides a store choice; rebuilt as two-line cards with one expanded.
16. **"Yes, in-stock first"** → In-stock stores sort first, nearest within each group; top card opens by default; tab renamed "Nearest in stock".
17. **Wheel photo: "use this image for the Tractor tyres, fitted on your farm card"** → Cut out and placed. I flagged that it is a small 4.00-8 wheel while the copy said rear tractor tyres. User: **"Yes, reword it"** → Copy became "Farm tyres, fitted at your field".
18. **SDJK excavator image: "use this image in construction card"** → Cut out and placed; moved the shadow under the tracks; used a new filename to defeat caching.
19. **Two screenshots: "make this construction image and the three-wheeler move slightly towards right... only part of the vehicle visible"** → Added a per-tile rightward nudge so every tile crops a similar share of its vehicle.
20. **Two screenshots of the buy box: "fix the information architecture... everything feels flat... prioritise"** → Audited and rebuilt the buy box in decision order (section 5), with fit gating.
21. **Pasted critique of the finder** (see section 11) and "only promise that the number isn't stored if that's technically true" → Removed the storage promise, made the shortcut "Use my Creta", merged the two brand paths.
22. **"Create a md file of all context including all the chat and context"** → This file.

---

## 10. Open items

1. **Mobile review.** Deferred by the user. Check at least: the amber fit strip and in-box question, the buy box (the in-box CTA is hidden on small screens in favour of the bottom bar), the compact map card, vehicle tiles, store cards, the finder footer.
2. **Verify before presenting:** the 2024 Creta SX wheel sizes on a real spec sheet (sources conflict); Boodmo cross-reference, RockAuto tiers, CRED's plate input.
3. **Licences and credits for supplied images.** The six shop-by-vehicle renders (Mahindra Thar ROXX, Royal Enfield Classic, Eicher Pro 5016, Sonalika DI 450, SDJK mini excavator, TVS King) and the farm-wheel photo came from the user, from makers' sites or from unknown sources. Treat them as third-party and **license or replace before any public launch**. Credits for these are in the case study footer and `HANDOFF.md` (corrected at the end of this session: they had still named the Ather Rizta scooter, which the Royal Enfield replaced).
4. **Clean up:** the `fitwise-copy` entry in `.claude/launch.json`; the unused images `assets/cut/v-excavator.avif` (old Kubota) and `v-scooter.avif` (Ather Rizta); the stale parts of `HANDOFF.md` (below).
5. **Real data and model:** replace the scripted assistant and illustrative catalogue if this ever becomes a build.
6. **Plate lookup in a real build:** which registry or provider, what is kept and for how long, what consent and notice the DPDP Act 2023 requires. The prototype copy deliberately makes no storage promise.
7. **Optional polish:** Hindi and Tamil copy (the language button is decorative); map label positions; wider map data coverage.
8. **Publishing:** the user said "not yet". If asked later, any static host works (Netlify, Vercel, GitHub Pages); upload the folder as is.
9. **Nothing is committed.** Consider making a first commit once the user is happy.

### Questions the document raises for the interview
What happens to a registration number? Brand model (manufacturer vs marketplace)? What fitment data exists and who maintains it? Dealer-network exclusivity and who owns the customer after a counter sale? B2C vs B2B mix? Which vehicle category leads? How far should AI go (suggest vs diagnose with a partner garage)?

---

## 11. The user's own words worth keeping

Early feedback, distilled from `HANDOFF.md` (earlier sessions): first pass rejected as cluttered and "AI-looking"; wanted real images "assuming it is the real product" and Indian vehicles; "don't make [the AI] floating just because I said it; research how commerce products do it"; hero "too much blue", "not real product vibe / feels vibe-coded"; "there is no difference between products and categories now"; 3D emoji icons "childish"; toasts "worst".

This session, verbatim or near-verbatim:
- "have the orb in the primary color & maintain the same consistency wherever the orb is been used"
- "Map doesn't match, make it visually better & good"
- "leave mobile for now, concentrate on website"
- "UI is bad - fix the shadow & image place & everything coz this placement looks weired - you can also refer similar brand use this on their website"
- "Keep photos, add contrast"
- "make the placement as aligned & half slide in angle so UI wise it looks good"
- "THIS CARDS ARE TOO TEXT HEAVY & CLUTTER, THINK ABOUT THE IA"
- On the buy box: "everything feels like a flat one, like everything's are together. I have to put some effort as a user... it's not prioritized information"
- On the vehicle tiles: "it feels like complete vehicle is being visible. It shouldn't be that way, right? You can refer the other cards how it is."

**The finder critique the user pasted:**

> 1. "We never store your number" + "Try TN 09 BX 4821". These two elements aren't necessarily contradictory, but the relationship isn't clear. A user might wonder: If you don't store my number, why are you asking for it? Is TN 09 BX 4821 an actual vehicle number? Does clicking it enter someone else's vehicle details?
> 2. You already have: "Don't know the number? Choose brand and model" and "Or choose your brand". Both communicate almost the same thing.
>
> Also, only promise that the number isn't stored if that's technically true, right, how it would work in current industry.

---

## 12. Gotchas for the next session

- **Lazy images:** Home lazy-loads images; when screenshotting, force `loading=eager` first.
- **Fade-in screenshots:** pages fade in (`fadeUp`); a screenshot taken immediately shows a washed-out page. Wait about 2 seconds.
- **Hidden browser pane:** when the preview pane is hidden, scripts that decode images hang and time out. Bring the tab to the front before running them.
- **Pane width:** the preview pane can silently return to a phone width; set the viewport explicitly before desktop checks.
- **Image cache:** a replaced image needs a new filename (section 6).
- **Image wells** need an explicit grid track (`grid-template-rows:100%`) or percentage-sized images collapse.
- **Full-size Creta hero** is a **PNG** on purpose: the AVIF decoded as fully transparent in one browser.
- **`.btn.sun`** is a legacy name for the ink primary button.
- The reserve drawer still uses the old `.store` styles; the store list uses `.scard`.
- **`.me` is the map's "You · 641018" dot only.** The compatibility table's highlighted row used the same class and rendered as a floating circle; it is now `.mine` (`tr.mine td` in CSS, `COMPAT` rows and the row template in `app.js`). The leftover blue `.me::after` ping from the old tile map was removed.
- Scratchpad files from this session (the temporary site copy, raw Overpass JSON, pre-change backups of `app.js` and `style.css`, the upload helper) live in a temporary folder and are **not** part of the project.

### Known stale parts of HANDOFF.md
- Section 6 still says `DEALERS` map positions are pixel `x/y` on a tile mosaic. They are now `lat/lon`, and the map is drawn from `assets/map/coimbatore.js`.
- Section 9 "Open items" is partly superseded by section 10 here.
- Section 7 mentions "the macOS Vision tool described in section 7" twice; the tool source is now at `src/tools/cut.swift` and described in section 6 here.

---

## 13. File map (where things live)

- `src/data.js`: `VEHICLES`, `GARAGE`, `PRODUCTS` (discs d1 to d9, car tyres t1 to t6 at 16 inch, t10 and t11 at 17 inch, tractor tyres t7 and t8, truck tyre t9, tracks k1 to k4), `DEALERS` s1 to s5, `DEALERS_HEAVY` h1 to h4, `ME`, `kmTo()`, `FACETS`, `CAT_META`, `fmt()`.
- `src/app.js` (main functions): state `S`; `fitOf`, `askOf`, `askHTML`; router `go/toPLP/toPDP`; header; garage; Home (`renderHome`, `renderLogos`, `renderSaved`, `findVehicle`, `placeCar`, `STAGE`, tile array in `#vtiles`); map (`mapPrep`, `baseMap`, `mountMap`, `selectPin`); search palette (`parseQ`, `renderCmd`, `markSel`); assistant (`SCN`, `pick`, `runAI`); PLP (`renderPLP`, `facetsHTML`, `HELP`); PDP (`renderPDP`, `kindOf`, `ALSO`, `COMPAT`, `CHIPS`, `REV`, `QA`, `pickStore`, `ctaLabel`, `ctaOf`, `openReserve`).
- `src/shell.html`: header, Home markup (hero finder, offers), footer, overlays.
- `src/style.css`: everything; sections commented. CSS breakpoints at 1200, 960 and 620 px (the map's compact mode at 520 px is decided in JS).
- `src/map/`: `convert.py` and the three Overpass queries. `src/tools/cut.swift`: the cut-out tool.
- `assets/cut/v-*.avif`, `offer-tractor-wheel.avif`: the supplied vehicle and offer images. `assets/map/coimbatore.js`: map data.
