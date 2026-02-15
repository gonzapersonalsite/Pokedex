# 🛠️ Operations Guide

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154)](https://tanstack.com/query/latest)
[![Zustand](https://img.shields.io/badge/Zustand-5-000000)](https://zustand-demo.pmnd.rs/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729b1b?logo=vitest)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-3A7D44)](https://vite-pwa-org.netlify.app/)

🇬🇧 English | [🇪🇸 Español](docs/es/OPERATIONS.md)

Covers local development, build, testing, PWA behavior, and deployment for the Pokedex project.

## 🚀 Local Development
- Prerequisites: Node.js 18+ and npm.
- Install: `npm ci`
- Start dev server: `npm run dev`
  - Vite serves at http://localhost:5173
- Preview production build: `npm run preview`
- Run tests:
  - `npm run test` (CI)
  - `npm run test:watch` (local watch mode)

## 🧪 Testing
- Vitest + Testing Library
- Environment: jsdom
- Setup file: `src/shared/test/setup.ts`

## 📦 Build
- `npm run build`
- Output: `dist/` (static assets)

## 📱 PWA
- vite-plugin-pwa with autoUpdate and dev SW enabled.
- Workbox: Network First for `https://pokeapi.co/api/v2/` with cache fallback.
- To test PWA locally: build, then `npm run preview`, and “Install App” in the browser.

## 🔧 Environment Variables
- None required for PokeAPI usage.

---

## 🚫 Legal Notice

**© 2026 Gonzalo Martínez García. All rights reserved.**

This software is **proprietary** and is provided for **evaluation purposes only**.
- **Unauthorized copying**, modification, distribution, or use of this software, via any medium, is strictly prohibited.
- **Personal use for other portfolios is not allowed.**
- See the [LICENSE](LICENSE) file for full terms and conditions.

---

**Developed by Gonzalo Martínez García**  
*Full Stack Developer | Software Engineering & Innovation*