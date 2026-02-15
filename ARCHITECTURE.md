# 🏗️ Architecture Guide

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154)](https://tanstack.com/query/latest)
[![Zustand](https://img.shields.io/badge/Zustand-5-000000)](https://zustand-demo.pmnd.rs/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729b1b?logo=vitest)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-3A7D44)](https://github.com/vite-pwa/vite-plugin-pwa)
[![Evaluation-Only](https://img.shields.io/badge/-Evaluation--Only-red)](LICENSE)

🇬🇧 English | [🇪🇸 Español](docs/es/ARCHITECTURE.md)

This document outlines the architectural patterns, design principles, and technology choices for the Pokedex project.

## 🏗️ Architecture & Principles
- Feature-Sliced organization with clear separation of concerns.
- Composition-first UI; container/presentational split where useful.
- Readability and simplicity over abstraction; YAGNI by default.
- Stateless data fetching; client-side state scoped to UI needs.

### Frontend Architecture
- Framework: React + Vite + TypeScript.
- Styling: TailwindCSS.
- State: Zustand for lightweight global state (favorites, toast).
- Data fetching/caching: TanStack Query (PokeAPI).
- Testing: Vitest + Testing Library.
- PWA: vite-plugin-pwa with Workbox (Network First for PokeAPI).

### Project Structure
```
src/
├── app/                 # Application layer (providers, App, ErrorBoundary, global styles)
├── entities/            # Domain models (Pokemon, EvolutionNode, TypeOption)
├── features/
│   └── pokemon/         # API, hooks (list, search, details, types, evolution), UI (card, list, modal)
├── pages/
│   └── PokedexPage.tsx  # Page composition (filters, favorites, list, modal)
├── shared/              # UI primitives (Button, Loader, Toast), utils (cn, typeBadge), tests setup
├── store/               # Global stores (favorites, toast)
└── main.tsx
```

### Data & API
- External API: PokeAPI (read-only GET endpoints).
- Query Provider centralizes caching, stale time, and retries.
- This guide avoids duplicating endpoint lists; see README for example endpoints and the code in features/pokemon/lib.

### State Management
- Keep global state minimal (favorites, toasts).
- Derive everything else from server state (TanStack Query) or props.

### PWA & Caching
- Network First strategy for `https://pokeapi.co/api/v2/` with fallback cache.
- Static assets cached via Workbox defaults; see vite.config.ts for details.

## 📚 Testing
- Unit and integration tests with Vitest + Testing Library.
- JSDOM environment; test setup in `src/shared/test/setup.ts`.

## 🔒 Security & Accessibility
- No credentials or private keys; public, read-only API usage.
- Accessibility guidelines applied (combobox ARIA for search, avoid nested interactive controls).

## 🧭 Conventions
- TypeScript strict mode.
- Named exports for components and hooks.
- Utility-first CSS classes; extract shared UI to `shared/ui`.

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
