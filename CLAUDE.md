# Wandora Workspace Landing Page — Project Guide

## What is this

Internal "start page" for the Wandora team: a password-gated directory of every
platform the company uses (Almosafer Al Arabi storefront/CMS, HK Souq storefront +
vendor portals, social media accounts, finance tools, marketing tools). The whole
point is that anyone on the team can find and open the right platform in seconds —
no bookmarks, no Slack digging. Business stakeholders review the UI; smooth
find-and-launch UX is the primary success metric.

## Architecture

- **Framework / runtime:** React 18 + Vite 5 SPA, plain CSS (no Tailwind), react-router-dom v6
- **Database:** Cloudflare KV (`WORKSPACE_KV` binding) — single JSON blob `workspace_data` = `{ applications: [], categories: [] }`
- **Auth:** client-side password gates (`VITE_TEAM_PASSWORD` for the site, `VITE_CONFIG_PASSWORD` for /config); `PUT /api/data` checked server-side against `CONFIG_PASSWORD`
- **Billing:** N/A — internal tool
- **Hosting:** Cloudflare Pages, project `wandora-workspace`
- **DNS & SSL:** Cloudflare (workspace.wandora.ai)
- **External services:** none at runtime
- **Production URL:** https://workspace.wandora.ai (from `main`)
- **Staging URL:** https://uat.wandora-workspace.pages.dev (from `uat`)

## Infrastructure / deploy targets

- **Deploy command:** push to branch — `git push origin uat` → UAT, `git push origin main` → production (GitHub Actions, `.github/workflows/deploy.yml`). Manual fallback: `npm run deploy:uat` / `npm run deploy`.
- **Env var store:** GitHub Actions secrets + Cloudflare Pages env vars (see DEPLOYMENT.md)
- **KV:** Production and UAT use separate namespaces behind the same `WORKSPACE_KV` binding (prod id `9d18…`, preview id `7f96…` in wrangler.toml). UAT data edits never touch prod.
- **Health check URL:** `GET /api/data` (public, returns the workspace JSON)

## Key files map

### `src/`

- `App.jsx` / `routes/LandingPageRoutes.jsx` — router; everything lives under `/landing_page`, config at `/landing_page/config`
- `pages/LandingPage/` — the main directory page (what the business team judges)
- `pages/ConfigPage/` — admin CRUD for applications/categories (behind config password)
- `components/PasswordGate/` — localStorage-backed password gates
- `components/Layout/` — header (logo + Workspace/Settings nav) + `<Outlet/>`
- `components/AppCard/`, `components/CategorySection/` — classic card grid
- `hooks/useApplications.js`, `hooks/useCategories.js` — load/CRUD state over the API
- `services/workspaceDataService.js` — `GET/PUT /api/data`; PUT sends `X-Config-Password`
- `services/applicationService.js` — CRUD + `groupByCategory` (sorts by category priority)
- `utils/categoryUtils.js` — normalize/dedupe/sort categories
- `data/applications.json`, `data/categories.json` — seed data only (KV is source of truth; live has ~29 apps, seeds have 6)

### `functions/`

- `api/data.js` — Cloudflare Pages Function; GET returns KV (or seed), PUT validates password + shape and overwrites the blob

## Critical learnings

- Live data ≠ seed data: the deployed site has ~29 apps in 5 categories with long
  free-text descriptions, "UAT -" name prefixes, and `icon: "globe"` on nearly
  everything. Design against `GET https://workspace.wandora.ai/api/data`, not the
  seed JSON.
- `PUT /api/data` replaces the entire blob — a bad save wipes all apps. UAT KV is
  separate, so test destructive config changes on UAT first.

## Absolute rules

1. NO committing to `main` or `uat` directly. Feature branch → PR → merge to `uat`
   for business review → merge to `main` only after approval.
2. NO changes to the data shape (`applications`/`categories` fields) without
   updating both `functions/api/data.js` validation and ConfigPage forms.

## Known gotchas / env vars

- **`VITE_*` passwords are baked into the JS bundle at build time** — changing them
  in Cloudflare requires a rebuild, and they are not secret from anyone with the bundle.
- **`CONFIG_PASSWORD`** (Pages Function env) must match `VITE_CONFIG_PASSWORD` or
  every save from /config fails with 401.
- **Local dev needs two servers:** `npm run dev` alone can't reach `/api/data`
  (Vite proxies `/api` → :8788). Use `npm run dev:full`, or `dev` + `dev:api` together.

## How to run locally

```bash
npm install
cp .env.example .env         # VITE_TEAM_PASSWORD, VITE_CONFIG_PASSWORD
cp .dev.vars.example .dev.vars  # CONFIG_PASSWORD for the local Pages Function
npm run dev:full             # frontend + API + local KV at :8788
```

## Testing

No automated tests. QA is manual: run locally or on UAT and click through the
landing page (all categories render, links open, search/filter works) and the
config page (add/edit/delete an app). Use gstack `/browse` for screenshots.

---

Last updated: 2026-07-15 — owner: max
