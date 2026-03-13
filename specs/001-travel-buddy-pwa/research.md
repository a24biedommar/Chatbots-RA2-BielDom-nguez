# Research: TravelBuddy PWA

## Decision: PWA Framework & Management
- **Choice**: `@vite-pwa/nuxt`
- **Rationale**: Industry standard for Nuxt 3 PWA integration. Provides automatic Service Worker generation, manifest management, and easy configuration for offline caching.
- **Alternatives Considered**: Manual Service Worker implementation (rejected due to maintenance overhead).

## Decision: State Management & Persistence
- **Choice**: `Pinia` + `pinia-plugin-persistedstate` + `localforage`
- **Rationale**: Pinia is the recommended state management for Vue 3. `pinia-plugin-persistedstate` allows seamless persistence. `localforage` provides a robust asynchronous wrapper for IndexedDB, which is superior to localStorage for large/complex travel data and works well in workers.
- **Alternatives Considered**: `vuex` (deprecated for Nuxt 3), direct `IndexedDB` API (too verbose).

## Decision: AI Integration Strategy
- **Choice**: Nitro Server Proxy (`server/api/chat.ts`)
- **Rationale**: Mandatory for security (protecting Gemini API Key). Nitro routes run server-side in Nuxt, allowing us to use environment variables safely.
- **Alternatives Considered**: Client-side API calls (rejected: security risk).

## Decision: Mapping Library
- **Choice**: `Leaflet`
- **Rationale**: Lightweight, mobile-friendly, and has excellent Vue integrations. Doesn't require a proprietary API key like Google Maps for basic usage.
- **Alternatives Considered**: Google Maps (requires billing/keys), Mapbox (heavier).

## Decision: Weather & Geolocation
- **Choice**: Native Geolocation API + OpenWeatherMap (or similar)
- **Rationale**: Native API is sufficient for mobile coordinates. Weather data will be fetched server-side to keep the client light.
- **Alternatives Considered**: IP-based geolocation (less accurate).
