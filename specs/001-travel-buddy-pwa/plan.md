# Implementation Plan: TravelBuddy PWA

**Branch**: `001-travel-buddy-pwa` | **Date**: 2026-03-13 | **Spec**: [specs/001-travel-buddy-pwa/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-travel-buddy-pwa/spec.md`

## Summary
The TravelBuddy PWA is a mobile-first, offline-capable travel assistant. It uses Nuxt 3 as its framework and features an AI-driven chat (Gemini) that provides context-aware (location and weather) travel itineraries. To ensure reliability in areas with poor connectivity, it employs a robust offline-first architecture using `@vite-pwa/nuxt` for Service Workers and `IndexedDB` via `pinia-plugin-persistedstate` for local data persistence.

## Technical Context

**Language/Version**: TypeScript / Nuxt 3 (Vue 3)  
**Primary Dependencies**: `@vite-pwa/nuxt`, `pinia`, `pinia-plugin-persistedstate`, `localforage`, `leaflet`, `@google/generative-ai`  
**Storage**: IndexedDB (via localforage and pinia-plugin-persistedstate)  
**Testing**: Vitest (Unit), Playwright (E2E/PWA)  
**Target Platform**: PWA (Installable Web Application) / Serverless (Nitro)
**Project Type**: Web application (Nuxt 3)
**Performance Goals**: < 1s initial load, < 15s for full AI route generation, 60fps map interactions.  
**Constraints**: Offline-capable (cached assets + persisted state), Mobile-first (responsive UI), Security (server-side API keys).  
**Scale/Scope**: Initial MVP focusing on Chat, Mapping, and Offline History.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **PWA Requirement**: ✅ MET via `@vite-pwa/nuxt`.
- **Nuxt.js Requirement**: ✅ MET (Nuxt 3).
- **Mobile-First Design**: ✅ MET (UI optimized for mobile screens).
- **Offline-First Architecture**: ✅ MET (Service Workers + IndexedDB).
- **Serverless & Security**: ✅ MET (Nitro proxy for Gemini API Key protection).
- **Vue 3 Best Practices**: ✅ MET (Composition API + Pinia).

## Project Structure

### Documentation (this feature)

```text
specs/001-travel-buddy-pwa/
├── plan.md              # This file
├── research.md          # Technology choices and rationale
├── data-model.md        # Core entities and relationships
├── quickstart.md        # Setup instructions
├── contracts/           
│   └── chat-api.md      # API contract for the AI proxy
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
# Web application (Nuxt 3)
server/
├── api/
│   └── chat.ts          # Gemini AI proxy (Nitro)
└── utils/
    └── weather.ts       # Weather fetching logic

stores/
├── useTravelStore.ts    # Main state (persisted)
└── useChatStore.ts      # Chat history (persisted)

components/
├── chat/
│   └── ChatWindow.vue   # Chat interface
├── maps/
│   └── RouteMap.vue     # Leaflet map integration
└── ui/
    └── RouteHistory.vue # Saved routes list

pages/
├── index.vue            # Dashboard / History
└── chat.vue             # AI interaction screen

public/
└── manifest.webmanifest # PWA manifest

nuxt.config.ts           # PWA and module configuration
```

**Structure Decision**: Option 2 (Web application) adjusted for Nuxt 3 directory conventions.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| PWA Implementation | Core requirement for offline-first UX | Standard Web App (lacks installability and offline resilience) |
| Server Proxy | Security (Credential Protection) | Client-side Gemini SDK (exposes API keys to public) |
