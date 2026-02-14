# Pokédex

🇪🇸 Español | [🇬🇧 English](../../README.md)

Pokédex moderna construida con React + Vite + TypeScript. Arquitectura por features y separación contenedor/presentacional. Datos con TanStack Query, estado con Zustand, estilos con Tailwind, iconos con Heroicons. Incluye sistema global de toasts y PWA.

## Funcionalidades
- Lista con scroll infinito y filtro por tipo.
- Favoritos: se pueden alternar en tarjetas y detalle; filtro “Favoritos” para ver solo guardados.
+- Búsqueda por nombre o ID con loader centrado.
- Modal de detalles con cadena de evolución y navegación entre evoluciones dentro del modal.
- Notificaciones toast globales (esquina superior derecha, bajo el navbar).
- Build PWA.

## Inicio rápido
- Instalar: `npm ci`
- Desarrollo: `npm run dev`
- Tests: `npm run test`
- Compilar: `npm run build`
- Previsualizar: `npm run preview`

## Stack
- React 18, TypeScript, Vite
- TanStack Query, Zustand (persist), TailwindCSS, Heroicons
- Vitest, Testing Library

## Arquitectura
```
src/
├── app/                 # Capa de aplicación (providers, App, ErrorBoundary, estilos globales)
├── entities/            # Modelos de dominio (Pokemon, EvolutionNode, TypeOption)
├── features/
│   └── pokemon/         # API, hooks (lista, búsqueda, detalles, tipos, evolución), UI (card, lista, modal)
├── pages/
│   └── PokedexPage.tsx  # Composición de página (filtros, favoritos, lista, modal)
├── shared/              # UI (Button, Loader, Toast), utils (cn, typeBadge), setup tests
├── store/               # Stores globales (favorites, toast)
└── main.tsx
```

## Endpoints (PokeAPI)
- `GET https://pokeapi.co/api/v2/pokemon?offset=&limit=`
- `GET https://pokeapi.co/api/v2/pokemon/:id|:name`
- `GET https://pokeapi.co/api/v2/pokemon-species/:id|:name`
- `GET https://pokeapi.co/api/v2/evolution-chain/:id`
- `GET https://pokeapi.co/api/v2/type`
- `GET https://pokeapi.co/api/v2/type/:id|:name`

## Accesibilidad
- Búsqueda implementada como combobox ARIA con listbox controlado.
- Tarjetas sin controles interactivos anidados.

## Responsive
Diseño mobile-first con header sticky y modal adaptable.
