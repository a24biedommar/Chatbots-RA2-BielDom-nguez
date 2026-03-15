# Tasks: TravelBuddy PWA (Consolidated)

## Phase 1: Setup & Standards
- [X] T001 Initialize Nuxt 3 project
- [X] T002 Install dependencies (@vite-pwa/nuxt, pinia, leaflet)
- [X] T003 Refactor code to ES5 Catalan standards (var, function)
- [X] T004 Add mandatory 4-block Catalan comment headers

## Phase 2: Application Core & Routing
- [X] T005 Create landing page without history at `/`
- [X] T006 Implement `/aplicacio` subfolder for app pages
- [X] T007 Create header with Chat, Galeria, and Sortir (inlined in `layouts/aplicacio.vue` so it always has dimensions)
- [X] T008 In `app.vue`, wrap `<NuxtPage />` with `<NuxtLayout>` so layouts apply; use `definePageMeta({ layout: 'aplicacio' })` in chat and galeria

## Phase 3: AI Chat & UI
- [X] T009 Implement full-screen chat layout in `aplicacio/chat.vue`
- [X] T010 Redesign `ChatWindow.vue` with bottom input and auto-scroll
- [X] T011 Fix IPC connection and Auto-import component issues

## Phase 4: Route Modal & Ratings
- [X] T012 Implement green polyline path in `RouteMap.vue` for `/route/[id]`; in modal use composable instead
- [X] T013 Add star rating system (1-5) to the route modal
- [X] T014 Change saving logic from auto-save to manual "Guardar" button
- [X] T015 Modal map: use `useModalMap.js` composable; plain div `ref="modalMapContainer"` in modal; call `initModalMap(container, waypoints, center)` on `shown.bs.modal` (with delay ~300ms), `destroyModalMap()` on `hidden.bs.modal`
- [X] T020 Modal header: ensure title and X are readable (e.g. classes `ruta-modal-header` / `ruta-modal-close` with green bg and white text/icon)
- [X] T021 Normalize waypoints when receiving route from API (title/name/titol, lat/lng/latitude/longitude, duration/durada) and in itinerary/“De X a Y” use fallbacks to avoid "undefined"

## Phase 5: Gallery & Polish
- [X] T016 Implement route gallery in `aplicacio/galeria.vue`
- [X] T017 Add filtering and sorting by stars in the gallery
- [X] T018 Audit ES5/Catalan compliance across all files
- [X] T019 Verify PWA installation and offline capabilities
