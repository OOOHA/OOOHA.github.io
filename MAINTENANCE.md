# OOOHA.github.io — Maintenance Guide

## Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Local dev server (http://localhost:5173)
npm run build      # Production build (output: dist/)
```

Push to `main` → GitHub Actions auto-deploys to GitHub Pages.

---

## Project Structure

```
src/
├── App.tsx                          # Routes (HashRouter)
├── index.css                        # Tailwind CSS v4 + app colors
├── components/
│   ├── common/
│   │   ├── AppIcon.tsx              # App icon with dark/light mode support
│   │   ├── FeatureCard.tsx          # Feature card for app pages
│   │   ├── LanguageSwitcher.tsx     # Language dropdown (10 languages)
│   │   ├── ScrollReveal.tsx         # Scroll animation wrapper
│   │   └── ThemeToggle.tsx          # Dark/light mode toggle
│   ├── feedback/
│   │   ├── FeedbackForm.tsx         # Bug report & feature request modal
│   │   └── JobOfferForm.tsx         # Job offer form modal
│   └── layout/
│       ├── Header.tsx               # Navigation bar
│       ├── Footer.tsx               # GitHub + About links
│       └── PageLayout.tsx           # Layout wrapper (Header + Outlet + Footer)
├── contexts/
│   └── ThemeContext.tsx              # Dark/light mode state
├── data/
│   └── apps.ts                      # All app metadata (single source of truth)
├── i18n/
│   ├── index.ts                     # i18next setup
│   └── locales/{lang}/common.json   # Translations (10 languages)
├── pages/
│   ├── HomePage.tsx                 # Landing page (app cards)
│   ├── AboutPage.tsx                # About + Job Offer button
│   ├── AppPage.tsx                  # Shared app detail page
│   ├── NotFoundPage.tsx             # 404
│   └── apps/
│       ├── MoziiPage.tsx            # Thin wrapper → AppPage
│       ├── MapMemoryPage.tsx
│       └── GPhonesPage.tsx
├── utils/
│   ├── constants.ts                 # Worker URL, supported languages
│   └── github.ts                    # GitHub Issue URL builder
worker/
├── index.js                         # Cloudflare Worker (feedback + job offer proxy)
├── wrangler.toml                    # Worker config
└── package.json                     # Worker dependencies
public/
└── icons/                           # App icons (PNG)
    ├── mozii.png
    ├── gphones-light.png / gphones-dark.png
    └── map-memory-light.png / map-memory-dark.png
```

---

## Common Tasks

### Update App Descriptions / Feature Text

1. Edit `src/i18n/locales/en/common.json`
2. Update the same key in all other 9 languages: `zh-TW`, `zh-CN`, `ja`, `ko`, `de`, `fr`, `es`, `ru`, `ar`
3. Keys follow pattern: `{appId}.{section}.{field}` (e.g. `mozii.features.playback.title`)

### Add a New App

1. **Data:** Add entry to `src/data/apps.ts` (follow existing pattern)
2. **Translations:** Add all keys in ALL 10 locale files under the new app ID
3. **Page:** Create `src/pages/apps/NewAppPage.tsx` (copy existing, change app ID)
4. **Route:** Add route in `src/App.tsx`
5. **Icon:** Place PNG in `public/icons/{app-id}.png`
   - For dark/light variants: `{app-id}-light.png` + `{app-id}-dark.png`
   - Set `iconPath` and `iconPathDark` in apps.ts
6. **Worker:** Add app ID to `VALID_APPS` array in `worker/index.js`
7. **Deploy Worker:** `cd worker && npx wrangler deploy`

### Add App Store Badge (When Ready)

When your app is live on the App Store:
1. Get the App Store URL for each app
2. Add `appStoreUrl?: string` field to `AppData` interface in `src/data/apps.ts`
3. Set the URL for each app in the apps array
4. In `src/pages/AppPage.tsx`, add the badge after the hero tagline:
   ```tsx
   {app.appStoreUrl && (
     <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
       <img src="/icons/app-store-badge.svg" alt={t("appStore")} className="h-12" />
     </a>
   )}
   ```
5. Download the official App Store badge SVG and place it at `public/icons/app-store-badge.svg`
   - Get it from: https://developer.apple.com/app-store/marketing/guidelines/

### Add a New Language

1. Create `src/i18n/locales/{code}/common.json` (copy from `en`, translate all values)
2. Import and register in `src/i18n/index.ts`
3. Add to `supportedLngs` array in `src/i18n/index.ts`
4. Add entry to `SUPPORTED_LANGUAGES` in `src/utils/constants.ts`

### Update App Icons

Place PNG files in `public/icons/`:
- Single icon: `{app-id}.png` → set `iconPath` in apps.ts
- Dark/light: `{app-id}-light.png` + `{app-id}-dark.png` → set both `iconPath` and `iconPathDark`
- Icons auto-fallback to Lucide icons if image fails to load

### Update About Page

- Edit `about.education` in all 10 locale files
- When you have a resume, add a download link in `src/pages/AboutPage.tsx`

---

## Cloudflare Worker (Feedback System)

The website uses a Cloudflare Worker as a serverless proxy to create GitHub Issues from feedback forms and job offers.

**URL:** Configured in `src/utils/constants.ts` → `WORKER_URL`

### Deploy Worker

```bash
cd worker
npx wrangler deploy
```

### Worker Secret

The Worker needs a GitHub Personal Access Token stored as a secret:
```bash
cd worker
npx wrangler secret put GITHUB_TOKEN
# Paste your token (needs public_repo scope)
```

### Worker Features

| Type | Source | GitHub Issue Format |
|------|--------|-------------------|
| Bug Report | App feedback form | `[Bug Report] [app] title` |
| Feature Request | App feedback form | `[Feature Request] [app] title` |
| Job Offer | About page form | `[Job Offer] name - position` |

- **Rate Limit:** 3 requests/minute per IP
- **CORS:** Only accepts requests from `oooha.github.io` and localhost dev servers
- **Labels:** Auto-applied with fallback (retries without labels if they don't exist in repo)

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 + TypeScript | UI framework |
| Vite 8 | Build tool |
| Tailwind CSS v4 | Styling (class-based dark mode via `@custom-variant`) |
| react-router-dom | Routing (HashRouter for GitHub Pages) |
| react-i18next | Internationalization (10 languages) |
| framer-motion | Animations |
| lucide-react | Icons (fallback when no custom app icon) |
| Cloudflare Workers | Serverless feedback proxy |

---

## Supported Languages

| Code | Language |
|------|----------|
| en | English |
| zh-TW | 繁體中文 |
| zh-CN | 简体中文 |
| ja | 日本語 |
| ko | 한국어 |
| de | Deutsch |
| fr | Français |
| es | Español |
| ru | Русский |
| ar | العربية |

---

## App Colors

Defined in `src/index.css` under `@theme`:

| App | Color | Variable |
|-----|-------|----------|
| mozii | `#8b5cf6` (violet) | `--color-mozii` |
| Map Memory | `#3b82f6` (blue) | `--color-mapmemory` |
| GPhones | `#10b981` (emerald) | `--color-gphones` |

---

## Deployment

- **Website:** Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages
- **Worker:** Manual deploy via `cd worker && npx wrangler deploy`
