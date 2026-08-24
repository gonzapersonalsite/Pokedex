# Pokédex

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154)](https://tanstack.com/query/latest)
[![Zustand](https://img.shields.io/badge/Zustand-5-000000)](https://zustand-demo.pmnd.rs/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729b1b?logo=vitest)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-3A7D44)](https://github.com/vite-pwa/vite-plugin-pwa)
[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](../../LICENSE)

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
- Instalar: `pnpm install`
- Desarrollo: `pnpm dev`
- Tests: `pnpm test`
- Compilar: `pnpm build`
- Previsualizar: `pnpm preview`

## Stack
- React 19, TypeScript, Vite
- TanStack Query, Zustand (persist), TailwindCSS, Heroicons
- Vitest, Testing Library

## Documentación
- [Guía de Arquitectura](./ARCHITECTURE.md)
- [Guía de Operaciones](./OPERATIONS.md)

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
