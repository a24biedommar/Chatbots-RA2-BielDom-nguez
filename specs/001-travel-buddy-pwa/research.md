# Research: TravelBuddy PWA (Consolidated)

## Decision: PWA Framework & Management
- **Choice**: `@vite-pwa/nuxt`
- **Rationale**: Industry standard for Nuxt 3 PWA integration. Provides automatic Service Worker generation, manifest management, and easy configuration for offline caching.
- **Alternatives Considered**: Manual Service Worker implementation (rejected due to maintenance overhead).

## Decision: State Management & Persistence
- **Choice**: `Pinia` + `pinia-plugin-persistedstate` + `localforage`
- **Rationale**: Pinia is the recommended state management for Vue 3. `pinia-plugin-persistedstate` allows seamless persistence. `localforage` provides a robust asynchronous wrapper for IndexedDB, which is superior to localStorage for large/complex travel data and works well in workers.
- **Alternatives Considered**: `vuex` (deprecated for Nuxt 3), direct `IndexedDB` API (too verbose).

## Decision: AI Integration Strategy
- **Choice**: Nitro Server Proxy (`server/api/xat.ts`)
- **Rationale**: Mandatory for security (protecting Gemini API Key). Nitro routes run server-side in Nuxt, allowing us to use environment variables safely. Names translated to Catalan to meet project standards.
- **Alternatives Considered**: Client-side API calls (rejected: security risk).

## Decision: Mapping Library
- **Choice**: `Leaflet`
- **Rationale**: Lightweight, mobile-friendly, and has excellent Vue integrations. Doesn't require a proprietary API key like Google Maps for basic usage.
- **Alternatives Considered**: Google Maps (requires billing/keys), Mapbox (heavier).

## Decision: ES5 Catalan Standards Implementation
- **Choice**: Manual Source Code Restriction
- **Rationale**: The user requirements for `var`, `function()`, no arrow functions, no `.map`, and Catalan identifiers are strict stylistic and architectural constraints. While modern build tools (Vite) can transpile modern JS to ES5, the *source code* itself must adhere to these legacy patterns for developer/maintainer consistency as requested.
- **Enforcement**: Mandatory code reviews and strict adherence during implementation phase.

## Decision: UI Architecture (Modal Centralization)
- **Choice**: Single-Column Chat + Route Detail Modal
- **Rationale**: To remove clutter from the main chat interface. The side map is removed in favor of a full-context modal triggered by a "Ver" button on route messages.
- **Alternatives Considered**: Persistent Side Map (rejected for mobile-first de-cluttering).

## Decision: Layout and Header Visibility
- **Choice**: `app.vue` must wrap `<NuxtPage />` with `<NuxtLayout>`. The header for `/aplicacio` is inlined in `layouts/aplicacio.vue` (not a separate component) with explicit height (e.g. 72px) and no `position: fixed` on the inner nav, so the layout block always has dimensions.
- **Rationale**: Without `<NuxtLayout>`, `definePageMeta({ layout: 'aplicacio' })` has no effect and the header never renders. Using a component with `position: fixed` for the nav can make the parent collapse to 0 height in some environments, so the header is inlined in the layout template.

## Decision: Map Inside Modal
- **Choice**: Do not use the `RouteMap` component inside the Bootstrap modal. Use a composable `useModalMap()` that creates a Leaflet map on a plain `<div ref="modalMapContainer">` when the modal is shown (`shown.bs.modal`), and destroys it on `hidden.bs.modal`. Container has fixed dimensions (e.g. 500px).
- **Rationale**: When the map component mounts, the modal is often still hidden or animating, so the container has 0 or wrong size and Leaflet fails to render. Creating the map imperatively only after the modal is visible guarantees a valid container size. Reusing the same div and init/destroy avoids lifecycle issues.

## Decision: Modal Header Readability
- **Choice**: Use explicit CSS classes for the modal header (e.g. `ruta-modal-header` with `background-color: #10b981`, `ruta-modal-close` with `filter: brightness(0) invert(1)` for a white X) so the title and close button are always readable regardless of global or scoped style order.
- **Rationale**: Generic utility classes like `bg-emerald` or `btn-close-white` may not apply (e.g. missing in scope or overridden), leading to white text on white background.
