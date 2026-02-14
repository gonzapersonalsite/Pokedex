# Pokédex

Pokédex React + Vite + TypeScript con arquitectura **Feature-Sliced** y **Container/Presentational**. TanStack Query para datos, Zustand para favoritos, Tailwind + HeadlessUI + Heroicons. PWA con soporte offline.

## Demo

- **Vercel:** [Configura deploy desde GitHub](https://vercel.com/new) apuntando a este repo. Build: `npm run build`, Output: `dist`, Install: `npm ci`.

## Arquitectura

```
src/
├── app/                 # Capa de aplicación
│   ├── providers/       # QueryClient, Theme (Context)
│   ├── ErrorBoundary.tsx
│   ├── App.tsx
│   └── index.css
├── entities/            # Modelos de dominio
│   ├── pokemon/         # Tipos API + modelo (Pokemon, EvolutionNode)
│   └── type/            # TypeOption (re-export)
├── features/
│   └── pokemon/
│       ├── lib/         # pokemonApi (fetch list, details, types, evolution-chain)
│       ├── model/       # Hooks: usePokemonList, usePokemonDetails,
│       │                 # usePokemonSearch, useEvolutionTree, useTypes
│       └── ui/          # PokemonCard (Presentational), PokemonList (Container),
│                        # PokemonModal (detalle + evolución)
├── shared/
│   ├── ui/              # Button, Loader
│   ├── utils/           # cn, etc.
│   └── test/            # setup Vitest
├── pages/
│   └── PokedexPage.tsx  # Ensambla listado, búsqueda, modal, tema
├── store/
│   └── favorites.ts     # Zustand + persist (localStorage)
└── main.tsx
```

### Diagrama de flujo

```
                    ┌─────────────────┐
                    │   PokedexPage   │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │ PokemonList  │   │ SearchResult │   │ PokemonModal │
  │ (Container)  │   │ (useSearch)  │   │ (Details +   │
  └──────┬───────┘   └──────────────┘   │  Evolution)  │
         │                               └──────────────┘
         │ usePokemonList (useInfiniteQuery)
         │ useFavoritesStore
         ▼
  ┌──────────────┐     ┌──────────────┐
  │ PokemonCard  │     │  pokemonApi  │ ← pokeapi.co/v2
  │(Presentational)   │  (lib)       │
  └──────────────┘     └──────────────┘
```

- **Queries:** list (infinite), details, search, evolution chain, types.
- **Estado global:** solo Theme (Context) y Favoritos (Zustand persist).
- **Sin globals:** tipado estricto, alias `@/` para imports.

## Stack

- **React 18** + **Vite** + **TypeScript** (strict)
- **TanStack Query** – fetches (list, details, evolutions, types), infinite scroll con `useInfiniteQuery`
- **Zustand** – favoritos persistentes (localStorage)
- **Tailwind CSS** + **HeadlessUI** + **Heroicons**
- **react-window** – lista virtualizada
- **Error Boundary** + **Suspense**
- **PWA** (vite-plugin-pwa): manifest, Workbox, cache de PokeAPI para offline
- **Vitest** + **@testing-library/react** – tests por hook (usePokemonSearch, useEvolutionTree, store favoritos)

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview  # vista previa del build
npm run test     # Vitest
```

## Endpoints usados

- `GET https://pokeapi.co/api/v2/pokemon?offset=&limit=`
- `GET https://pokeapi.co/api/v2/pokemon/:id|:name`
- `GET https://pokeapi.co/api/v2/pokemon-species/:id|:name`
- `GET https://pokeapi.co/api/v2/evolution-chain/:id`
- `GET https://pokeapi.co/api/v2/type` y `GET .../type/:id|:name`

## Responsive

Diseño mobile-first; listado en 2 columnas, header sticky, modal adaptable.
