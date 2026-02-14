# Pokedex

English | [Español](./docs/es/README.md)

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

## Architecture
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
