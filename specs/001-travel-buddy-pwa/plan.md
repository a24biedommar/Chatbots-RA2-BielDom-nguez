# Implementation Plan: TravelBuddy PWA (Consolidated)

**Branch**: `001-travel-buddy-pwa` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)

## Technical Context
**Primary Dependencies**: `@vite-pwa/nuxt`, `pinia`, `localforage`, `leaflet`, `@google/generative-ai`.
**Architecture**: 
- **Landing Page**: Public instructions page at root `/`.
- **App Shell**: Protected area at `/aplicacio` with persistent `AppHeader`.
- **Chat Interface**: Full-screen view with internal scroll and bottom input.
- **Gallery**: Persistent storage view with filtering and sorting by `rating`.
- **Legacy Standards**: Strict ES5 syntax (var, traditional loops) and Catalan naming policy.

## Project Structure (Updated)
```text
app/
├── app.vue                 # MUST wrap <NuxtPage /> with <NuxtLayout> for layouts to apply
├── layouts/
│   ├── default.vue         # Landing + footer (no header)
│   └── aplicacio.vue       # Header INLINED in template (no component) + <slot />; header 72px, no fixed
├── components/
│   ├── chat/
│   │   └── ChatWindow.vue  # WhatsApp-style chat
│   ├── ui/
│   │   └── RouteHistory.vue
│   └── maps/
│       └── RouteMap.vue    # Leaflet; used on /route/[id], NOT inside modal
├── composables/
│   ├── useLocation.js
│   └── useModalMap.js      # initModalMap(containerEl, waypoints, center); destroyModalMap()
├── pages/
│   ├── index.vue
│   ├── aplicacio/
│   │   ├── chat.vue        # definePageMeta({ layout: 'aplicacio' })
│   │   └── galeria.vue
│   └── route/
│       └── [id].vue
├── stores/
│   ├── useTravelStore.js   # Persisted routes & ratings
│   └── useChatStore.js
server/
└── api/
    └── chat.js             # Gemini proxy; prompt must require waypoints: title, description, lat, lng, duration, order
```

## Implementation Pitfalls (Avoid These)

1. **Header not showing**: If `app.vue` does not wrap `<NuxtPage />` with `<NuxtLayout>`, the layout (and thus the header) never renders. If the header is a component with `position: fixed` and no wrapper with height, the parent can collapse to 0 height. Fix: use a layout that inlines the header HTML (not a separate component) with explicit height (e.g. 72px).
2. **Map not loading in modal**: Initializing Leaflet inside a Vue component that is inside a Bootstrap modal often leads to 0-size container (modal hidden at mount). Fix: do NOT use RouteMap inside the modal. Use a plain `<div ref="modalMapContainer">` and call a composable `useModalMap().initModalMap(container, waypoints, center)` in the `shown.bs.modal` event (after a short delay, e.g. 300ms). Call `destroyModalMap()` on `hidden.bs.modal`.
3. **Modal header title/X invisible**: Generic classes like `bg-emerald` may not apply (scoped or missing). Fix: use explicit classes (e.g. `ruta-modal-header` with `background-color: #10b981`, `ruta-modal-close` with `filter: brightness(0) invert(1)` for white X).
4. **"De undefined a undefined"**: API or Gemini may return waypoints with `name` instead of `title`, or `latitude`/`longitude` instead of `lat`/`lng`. Fix: normalize waypoints when creating the route from the API response (e.g. `normalizeWaypoint(raw)` mapping title/name/titol, lat/lng/latitude/longitude, duration/durada). Use the same fallbacks in templates (e.g. `wp.title || wp.name || 'Parada N'`).

## Complexity Tracking
| Violation | Why Needed | Alternative Rejected |
|-----------|------------|----------------------|
| ES5 Syntax | User Constraint | Modern JS (faster dev but fails constraint) |
| Manual Save | User Control | Auto-save (clutters gallery with junk) |
| Green Path | UX Clarity | Default Leaflet (standard blue lacks identity) |
| Map in modal via composable | Reliable render when modal visible | RouteMap component in modal (0-size / timing issues) |
| Header inlined in layout | Guaranteed dimensions | AppHeader component (fixed = 0-height parent) |
| Waypoint normalization | API may return name/titol, latitude/longitude | Assuming single schema (causes "undefined") |
