# 🏗️ Guía de Arquitectura

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154)](https://tanstack.com/query/latest)
[![Zustand](https://img.shields.io/badge/Zustand-5-000000)](https://zustand-demo.pmnd.rs/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729b1b?logo=vitest)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-3A7D44)](https://github.com/vite-pwa/vite-plugin-pwa)
[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](../../LICENSE)

🇪🇸 Español | [🇬🇧 English](../../ARCHITECTURE.md)

Este documento resume los patrones arquitectónicos, principios de diseño y decisiones tecnológicas del proyecto Pokedex.

## 🏗️ Arquitectura y Principios
- Organización por features con clara separación de responsabilidades.
- UI por composición; división contenedor/presentacional cuando aporta.
- Legibilidad y simplicidad sobre abstracción; YAGNI por defecto.
- Peticiones sin estado; el estado cliente se limita a necesidades de UI.

### Arquitectura Frontend
- Framework: React + Vite + TypeScript.
- Estilos: TailwindCSS.
- Estado: Zustand para estado global ligero (favoritos, toast).
- Datos/caché: TanStack Query (PokeAPI).
- Tests: Vitest + Testing Library.
- PWA: vite-plugin-pwa con Workbox (Network First para PokeAPI).

### Estructura del Proyecto
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

### Datos y API
- API externa: PokeAPI (endpoints de solo lectura mediante GET).
- El Query Provider centraliza caché, tiempos de frescura y reintentos.
- Esta guía evita duplicar listados de endpoints; ver README para ejemplos y el código en `features/pokemon/lib`.

### Gestión de Estado
- Mantén el estado global al mínimo (favoritos, toasts).
- Deriva el resto del estado desde el servidor (TanStack Query) o props.

### PWA y Caché
- Estrategia Network First para `https://pokeapi.co/api/v2/` con caché de respaldo.
- Assets estáticos cacheados con Workbox; ver `vite.config.ts` para detalles.

## 📚 Tests
- Tests unitarios e integrados con Vitest + Testing Library.
- Entorno JSDOM; configuración en `src/shared/test/setup.ts`.

## 🔒 Seguridad y Accesibilidad
- Sin credenciales ni claves privadas; uso de API pública y de solo lectura.
- Accesibilidad cuidada (combobox ARIA en búsqueda, evitar controles anidados).

## 🧭 Convenciones
- TypeScript en modo estricto.
- Exportaciones con nombre para componentes y hooks.
- CSS utility-first; extraer UI compartida a `shared/ui`.

---

## 🚫 Aviso Legal

**© 2026 Gonzalo Martínez García. Todos los derechos reservados.**

Este software es **propietario** y se proporciona **exclusivamente para fines de evaluación**.
- **Queda estrictamente prohibida la copia**, modificación, distribución o uso no autorizado de este software por cualquier medio.
- **No se permite el uso personal para otros portafolios.**
- Ver el archivo [LICENSE](../../LICENSE) para los términos y condiciones completos.

---

**Desarrollado por Gonzalo Martínez García**  
*Full Stack Developer | Software Engineering & Innovation*
