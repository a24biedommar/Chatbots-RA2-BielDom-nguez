---
description: "Task list for TravelBuddy PWA implementation"
---

# Tasks: TravelBuddy PWA

**Input**: Design documents from `specs/001-travel-buddy-pwa/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- All paths are relative to the repository root.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Nuxt 3 project with TypeScript
- [ ] T002 [P] Install core dependencies: `@vite-pwa/nuxt`, `pinia`, `pinia-plugin-persistedstate`, `localforage`, `leaflet`, `@google/generative-ai`
- [ ] T003 Configure `nuxt.config.ts` for PWA modules and auto-imports
- [ ] T004 [P] Setup `.env` template with `GEMINI_API_KEY` and `OPENWEATHER_API_KEY`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Create base mobile-first layout in `layouts/default.vue`
- [ ] T006 [P] Setup Pinia stores with IndexedDB persistence in `stores/useTravelStore.ts` and `stores/useChatStore.ts`
- [ ] T007 Implement Gemini AI Proxy in `server/api/chat.ts` (using API Key from env)
- [ ] T008 [P] Implement weather utility in `server/utils/weather.ts`
- [ ] T009 Setup basic Vitest and Playwright configuration for testing

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - AI Route Generation (Priority: P1) 🎯 MVP

**Goal**: Enable travelers to get personalized routes via AI chat with location/weather context.

**Independent Test**: Initiate a chat, provide a destination, and verify the AI returns a JSON route that renders on the map.

### Tests for User Story 1 (Recommended)

- [ ] T010 [P] [US1] Unit test for Gemini proxy JSON parsing in `tests/unit/chat-proxy.test.ts`
- [ ] T011 [US1] Playwright E2E test for chat-to-route flow in `tests/e2e/route-generation.spec.ts`

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create `components/chat/ChatWindow.vue` with message bubble UI
- [ ] T013 [P] [US1] Create `components/maps/RouteMap.vue` using Leaflet
- [ ] T014 [US1] Implement chat interaction logic in `pages/chat.vue` (capturing geolocation)
- [ ] T015 [US1] Integrate AI-generated JSON into `useTravelStore.ts` for map rendering
- [ ] T016 [US1] Add error handling for API failures and GPS denials

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Offline Route Access (Priority: P2)

**Goal**: Ensure generated routes are saved and accessible without an internet connection.

**Independent Test**: Generate a route online, go offline, and verify the route is viewable in the history list.

### Tests for User Story 2

- [ ] T017 [US2] Playwright test for offline history access (emulating offline mode) in `tests/e2e/offline-access.spec.ts`

### Implementation for User Story 2

- [ ] T018 [P] [US2] Create `components/ui/RouteHistory.vue` for the dashboard list
- [ ] T019 [US2] Implement history dashboard in `pages/index.vue`
- [ ] T020 [US2] Configure Service Worker caching strategies in `nuxt.config.ts` for Leaflet tiles and static assets
- [ ] T021 [US2] Verify `pinia-plugin-persistedstate` correctly hydration from IndexedDB on startup

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - PWA Installation & Experience (Priority: P3)

**Goal**: Provide a native-like experience with an installation prompt and standalone mode.

**Independent Test**: Verify the "Add to Home Screen" capability and absence of browser UI when launched from home screen.

### Implementation for User Story 3

- [ ] T022 [P] [US3] Finalize `public/manifest.webmanifest` with icons and colors
- [ ] T023 [US3] Implement installation prompt logic in `components/ui/InstallPrompt.vue`
- [ ] T024 [US3] Audit mobile responsiveness and touch targets across all pages

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements and quality checks

- [ ] T025 [P] Add TSDoc/JSDoc to all stores and server utilities
- [ ] T026 Run Lighthouse PWA audit and address performance bottlenecks
- [ ] T027 Validate `quickstart.md` steps against the final implementation

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup (Phase 1)** -> **Foundational (Phase 2)**
2. **Foundational (Phase 2)** -> **User Story 1 (Phase 3)**
3. **User Story 1** is the MVP; **User Story 2** and **3** can proceed once US1 is stable.

### Parallel Opportunities
- T002 and T004 can run together.
- Once Phase 2 is done, UI components for US1 (T012, T013) can be built in parallel with tests (T010).
- US2 components (T018) can be developed while US1 is being finalized.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup and Foundational phases.
2. Build the Chat and Map integration.
3. Verify that the AI returns valid JSON and the map displays markers.

### Incremental Delivery
- **Increment 1**: Online Chat + Map (US1)
- **Increment 2**: Offline History + Persistence (US2)
- **Increment 3**: PWA Polish + Installation (US3)
