# 🛠️ Guía de Operaciones

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154)](https://tanstack.com/query/latest)
[![Zustand](https://img.shields.io/badge/Zustand-5-000000)](https://zustand-demo.pmnd.rs/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729b1b?logo=vitest)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-3A7D44)](https://github.com/vite-pwa/vite-plugin-pwa)
[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](../../LICENSE)

🇪🇸 Español | [🇬🇧 English](../../OPERATIONS.md)

Guía de desarrollo local, build, tests, comportamiento PWA y despliegue del proyecto Pokédex.

## 🚀 Desarrollo Local
- Requisitos: Node.js 18+ y pnpm.
- Instalar dependencias: `pnpm install`
- Arrancar en modo desarrollo: `pnpm dev`
  - Vite sirve en http://localhost:5173
- Previsualizar el build de producción: `pnpm preview`
- Ejecutar tests:
  - `pnpm test` (CI)
  - `pnpm test:watch` (modo watch local)

## 🧪 Tests
- Vitest + Testing Library
- Entorno: jsdom
- Fichero de setup: `src/shared/test/setup.ts`

## 📦 Build
- `pnpm build`
- Salida: `dist/` (assets estáticos)

## 📱 PWA
- vite-plugin-pwa con autoUpdate y Service Worker en desarrollo.
- Workbox: estrategia Network First para `https://pokeapi.co/api/v2/` con caché de respaldo.
- Probar la PWA localmente:
  1. `pnpm build`
  2. `pnpm preview`
  3. Abre en el navegador y usa “Install App”.

## 🔧 Variables de Entorno
- No se requieren variables para usar PokeAPI.

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
