# Vroom stats (`/track`)

A private analytics page for the Vroom case study and prototype, behind a macOS-style lock screen (password, then Touch ID on each device).

## How it fits together

- `assets/fw-track.js` runs on `index.html` (case study) and `prototype.html`. It records the source (referrer, UTM tags, ad click IDs, in-app browsers), sections read and time on each, scroll depth, every tap, prototype pages (Home, PLP, PDP) and actions (search, Ask, plate lookup, filters, cart, reserve) and page speed. Prototype actions are observed from outside `src/app.js`, so the product code is unchanged.
- `api/hit.js` stores one small JSON record per session and page in Vercel Blob, adding the visitor's state, city and PIN area from Vercel's network headers. No IP addresses or cookies are stored.
- `api/stats.js` returns the records to the signed-in dashboard; `api/auth.js` handles the password, Touch ID passkeys and lockout.
- This folder is the dashboard (React + Vite). `pnpm build` writes the static page to `../track`, which is committed so Vercel serves it as-is.

## Vercel setup (once)

1. Storage → create a **Blob** store and connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`.
2. Settings → Environment Variables:
   - `STATS_KEY`: any long random string (signs the session cookie).
   - `STATS_PASSWORD`: the lock screen password.
3. Redeploy, then open `/track` (or `/stats`).

Open any page once with `?me` to stop counting your own visits on that browser (`?notme` undoes it).

## Working on it

```bash
pnpm install
pnpm dev          # http://localhost:5173/track/?demo shows synthetic data
pnpm build        # writes ../track
```
