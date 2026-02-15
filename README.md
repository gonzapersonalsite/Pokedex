# Pokedex

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154)](https://tanstack.com/query/latest)
[![Zustand](https://img.shields.io/badge/Zustand-5-000000)](https://zustand-demo.pmnd.rs/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729b1b?logo=vitest)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-3A7D44)](https://vite-pwa-org.netlify.app/)

🇬🇧 English | [🇪🇸 Español](docs/es/README.md)

Modern Pokédex built with React + Vite + TypeScript. It uses Feature-Sliced architecture and a container/presentational split. Data fetching with TanStack Query, state with Zustand, styling with Tailwind, icons with Heroicons. Includes a global toast system and a PWA.

## Features
- Infinite scroll list with type filter.
- Favorites: toggle in cards and details, and a “Favorites” filter to list only your saved Pokémon.
- Search by name or ID with centered loading feedback.
- Details modal with evolution chain and intra-modal navigation by clicking evolutions.
- Global toast notifications (top-right, below the navbar).
- PWA build.

## Getting Started
- Install: `npm ci`
- Dev: `npm run dev`
- Test: `npm run test`
- Build: `npm run build`
- Preview: `npm run preview`

## Tech Stack
- React 18, TypeScript, Vite
- TanStack Query, Zustand (persist), TailwindCSS, Heroicons
- Vitest, Testing Library

## Documentation
- [Architecture Guide](ARCHITECTURE.md)
- [Operations Guide](OPERATIONS.md)

## API Endpoints (PokeAPI)
- `GET https://pokeapi.co/api/v2/pokemon?offset=&limit=`
- `GET https://pokeapi.co/api/v2/pokemon/:id|:name`
- `GET https://pokeapi.co/api/v2/pokemon-species/:id|:name`
- `GET https://pokeapi.co/api/v2/evolution-chain/:id`
- `GET https://pokeapi.co/api/v2/type`
- `GET https://pokeapi.co/api/v2/type/:id|:name`

## Accessibility
- Search input implemented as a proper ARIA combobox with a controlled listbox.
- Cards avoid nested interactive controls.

## Responsive
Mobile-first layout with sticky header and adaptive modal.

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