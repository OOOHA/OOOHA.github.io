# OOOHA.github.io — Project Guide

## Overview

This is the official website for OOOHA's iOS apps (mozii, Map Memory, GPhones), built with React + TypeScript + Vite + Tailwind CSS v4. It's a static site deployed to GitHub Pages.

## Tech Stack

- **React 19** + **TypeScript** — UI framework
- **Vite 8** — Build tool
- **Tailwind CSS v4** — Styling (using `@tailwindcss/postcss`)
- **react-router-dom** — Routing (HashRouter for GitHub Pages)
- **react-i18next** — Internationalization (6 languages)
- **framer-motion** — Animations
- **lucide-react** — Icons (fallback when no custom app icon)

## Key Architecture

- **App data** is centralized in `src/data/apps.ts` — all app metadata in one place
- **Translations** are in `src/i18n/locales/{lang}/common.json` — one file per language
- **Pages** use a shared `AppPage` component — individual app pages are thin wrappers
- **Dark mode** uses Tailwind's class-based strategy via `@custom-variant` in CSS
- **GitHub Issues** integration uses URL query params (no server needed)

## Common Tasks

### Modify app descriptions or feature text

1. Edit the English translation: `src/i18n/locales/en/common.json`
2. Update all other languages: `src/i18n/locales/{zh-TW,zh-CN,ja,ko,de}/common.json`
3. Translation keys are structured as `{appId}.{section}.{field}`

### Add a new app

1. Add app data to `src/data/apps.ts` (follow existing pattern)
2. Add translation keys in ALL 6 locale files
3. Create `src/pages/apps/NewAppPage.tsx` (copy existing, change app ID)
4. Add route in `src/App.tsx`
5. Place app icon PNG in `public/icons/{app-id}.png`

### Add a new language

1. Create `src/i18n/locales/{code}/common.json` (copy from `en`)
2. Import and register in `src/i18n/index.ts`
3. Add entry to `SUPPORTED_LANGUAGES` in `src/utils/constants.ts`

### Update app icons

Place PNG files in `public/icons/` with these names:
- `mozii.png`
- `map-memory.png`
- `gphones.png`

Icons auto-fallback to Lucide icons if the image file is missing.

## Project Structure

```
src/
├── App.tsx                    # Routes (HashRouter)
├── index.css                  # Tailwind + dark mode config
├── components/
│   ├── common/                # Reusable: AppIcon, FeatureCard, ScrollReveal, ThemeToggle, LanguageSwitcher
│   ├── feedback/              # BugReportButton, FeatureRequestButton
│   └── layout/                # Header, Footer, PageLayout
├── contexts/ThemeContext.tsx   # Dark/light mode state
├── data/apps.ts               # Centralized app definitions
├── i18n/
│   ├── index.ts               # i18next setup
│   └── locales/{lang}/        # Translation files
├── pages/
│   ├── HomePage.tsx            # Landing page
│   ├── AppPage.tsx             # Shared app detail layout
│   ├── apps/                   # Thin wrappers per app
│   └── NotFoundPage.tsx
└── utils/
    ├── constants.ts            # Repo info, supported languages
    └── github.ts               # GitHub Issue URL builder
```

## Build & Deploy

- `npm run dev` — Local dev server
- `npm run build` — Production build to `dist/`
- Push to `main` branch → GitHub Actions auto-deploys to GitHub Pages
