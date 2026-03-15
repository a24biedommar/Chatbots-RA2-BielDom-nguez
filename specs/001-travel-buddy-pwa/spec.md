# Feature Specification: TravelBuddy PWA (Consolidated)

**Feature Branch**: `001-travel-buddy-pwa`  
**Created**: 2026-03-13 (Updated 2026-03-15)  
**Status**: Draft  
**Input**: User description: "Consolidated specification including PWA, AI Chat, Route Details Modal with Manual Save/Rating, Application Routing (/aplicacio), and Catalan ES5 Standards."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - AI Route Generation (Priority: P1)
As a traveler, I want to chat with an AI assistant to get personalized travel routes based on my current location and local weather.
- **Acceptance**: AI returns JSON with waypoints. Chat shows messages with a "Ver" button.

### User Story 2 - Route Details Modal & Manual Save (Priority: P1)
As a traveler, I want to see detailed specifications and a map of my route in a dedicated view, rate it with stars, and manually save it to my gallery.
- **Acceptance**: Clicking "Ver" opens a modal with a green path map (map MUST load and display tiles, markers, and polyline), transport specs, itinerary list with each stop title/duration/description, and "De [origen] a [destí]" visible (no "undefined"). Modal header shows route title and a visible close (X) button on a green background. Rating system (1-5 stars) and "Guardar" button present. Route is ONLY saved to the gallery when the "Guardar" button is pressed.

### User Story 3 - Gallery Management (Priority: P1)
As a traveler, I want to see my saved routes ordered by rating and be able to search for them.
- **Acceptance**: Gallery page (`/aplicacio/galeria`) lists routes sorted by stars (highest first). Search filter works by name.

### User Story 4 - Application Routing & Flow (Priority: P1)
As a user, I want a clear separation between the landing page and the app interface.
- **Acceptance**: Landing page contains instructions and a "Comença Ara" button that leads to `/aplicacio/galeria`. App pages (`/aplicacio/*`) show a persistent header with "Xat", "Galeria", and "Sortir" that is always visible (no 0-height or invisible header). The header must be part of the layout so it renders with correct dimensions.

### User Story 5 - Development Standards (Priority: P2)
As a maintainer, I want the codebase to follow ES5 standards and use Catalan for identifiers and comments.
- **Acceptance**: Code uses `var`, `function`, traditional loops, and Catalan naming.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: Integration with Gemini API via Nitro proxy (`server/api/chat`).
- **FR-002**: Routing structure: `/` (Landing), `/aplicacio/chat`, `/aplicacio/galeria`, `/route/:id` (optional detail page).
- **FR-003**: Header navigation visible ONLY within `/aplicacio` routes. The app shell MUST use Nuxt layouts: `app.vue` MUST wrap `<NuxtPage />` with `<NuxtLayout>` so that `definePageMeta({ layout: 'aplicacio' })` takes effect. The header MUST be rendered with explicit dimensions (e.g. inlined in the layout template or with a wrapper that has fixed height) so it is never 0-height or invisible.
- **FR-004**: Route saving MUST be manual via modal button.
- **FR-005**: Modal MUST include a star rating (1-5), a green route line on the map, and the map MUST load correctly inside the modal. Map MUST be created only when the modal is visible (e.g. on `shown.bs.modal`) using a dedicated composable that initializes Leaflet on a plain div container with fixed dimensions (500px), to avoid 0-size or timing issues. On modal close, the map instance MUST be destroyed.
- **FR-006**: Modal header (title and close X) MUST be readable: green background and white text/icon. Use explicit CSS classes (e.g. `ruta-modal-header`, `ruta-modal-close`) to guarantee contrast.
- **FR-007**: Waypoints from the API may use `title`/`name`/`titol` and `lat`/`lng` or `latitude`/`longitude`. The client MUST normalize waypoints when receiving a route (and in any map/composable) so that itinerary and "De X a Y" never show "undefined".
- **FR-008**: Chat MUST have a bottom-fixed input and automatic scroll to the latest message.
- **FR-009**: Codebase MUST use JavaScript (no TypeScript), ES5-style syntax where required (var, function, no .map/.reduce, no ternary operators if specified), and Catalan documentation/identifiers.

## Success Criteria *(mandatory)*
- **SC-001**: Users can view and save routes manually within the modal. The modal map loads and shows the route (tiles, markers, polyline) every time.
- **SC-002**: 100% of saved routes are accessible offline in the gallery.
- **SC-003**: Gallery sorts routes correctly by rating.
- **SC-004**: Header is visible on all `/aplicacio` pages (Galeria, Xat) with correct dimensions.
- **SC-005**: Modal title and close (X) button are always readable (green header, white text/icon).
- **SC-006**: Itinerary and "De X a Y" in the modal never display "undefined" (waypoints normalized).
- **SC-007**: Codebase uses JavaScript (no TypeScript) and adheres to ES5/Catalan constraints where specified.
- **SC-008**: All internal documentation and identifiers are in Catalan.
