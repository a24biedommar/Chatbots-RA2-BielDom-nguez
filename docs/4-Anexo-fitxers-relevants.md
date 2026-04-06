# 4. Annex - Fitxers Rellevants

## 4.1 Progrés del Projecte (Tasks Checklist)

### Phase 1: Setup & Standards
- [x] T001 Initialize Nuxt 3 project
- [x] T002 Install dependencies (@vite-pwa/nuxt, pinia, leaflet)
- [x] T003 Refactor code to ES5 Catalan standards (var, function)
- [x] T004 Add mandatory 4-block Catalan comment headers

### Phase 2: Application Core & Routing
- [x] T005 Create landing page without history at `/`
- [x] T006 Implement `/aplicacio` subfolder for app pages
- [x] T007 Create header with Chat, Galeria, and Sortir
- [x] T008 Wrap `<NuxtPage />` with `<NuxtLayout>`; use `definePageMeta({ layout: 'aplicacio' })`

### Phase 3: AI Chat & UI
- [x] T009 Implement full-screen chat layout in `aplicacio/chat.vue`
- [x] T010 Redesign `ChatWindow.vue` with bottom input and auto-scroll
- [x] T011 Fix IPC connection and Auto-import component issues

### Phase 4: Route Modal & Ratings
- [x] T012 Implement green polyline path in `RouteMap.vue`
- [x] T013 Add star rating system (1-5) to the route modal
- [x] T014 Change saving logic from auto-save to manual "Guardar" button
- [x] T015 Modal map: use `useModalMap.js` composable
- [x] T020 Modal header: ensure title and X are readable
- [x] T021 Normalize waypoints when receiving route from API

### Phase 5: Gallery & Polish
- [x] T016 Implement route gallery in `aplicacio/galeria.vue`
- [x] T017 Add filtering and sorting by stars in the gallery
- [x] T018 Audit ES5/Catalan compliance across all files
- [x] T019 Verify PWA installation and offline capabilities

---

## 4.2 Contracte API - Schema JSON per a Gemini

**Endpoint**: `POST /api/chat`

### Payload de Petició
```json
{
  "prompt": "Vull anar de Barcelona a Girona",
  "location": { "lat": 41.3851, "lng": 2.1734 },
  "history": [
    { "role": "user", "content": "Hola" },
    { "role": "assistant", "content": "Hola! Com puc ajudar-te?" }
  ]
}
```

### Schema de Resposta Esperat (type: "route")
```json
{
  "type": "route",
  "content": "Here is your route from Barcelona to Girona...",
  "route": {
    "title": "Ruta de Barcelona a Girona",
    "metro": "L1, L2",
    "estimatedTime": "1h 30min",
    "waypoints": [
      {
        "title": "Plaça Catalunya",
        "description": "Punt de sortida al centre de Barcelona",
        "lat": 41.3879,
        "lng": 2.1703,
        "duration": "0 min",
        "order": 0
      },
      {
        "title": "Estació de Sants",
        "description": "Estació central de trens",
        "lat": 41.3790,
        "lng": 2.1398,
        "duration": "15 min",
        "order": 1
      }
    ]
  }
}
```

### Regles de Normalització (costat client)
| Camp API | Normalitzar a | Fallback |
|----------|---------------|----------|
| `name` / `titol` | `title` | `"Waypoint sense nom"` |
| `latitude` / `longitude` | `lat` / `lng` | `null` |
| `durada` | `duration` | `"--"` |
| `description` | `description` | `""` |

---

## 4.3 Interface TypeScript - ITravelRoute

```typescript
// Fitxer: app/types/index.ts

export interface Waypoint {
  title: string;
  description: string;
  lat: number;
  lng: number;
  duration: string;
  order: number;
}

export interface Route {
  id: string;
  title: string;
  timestamp: number;
  waypoints: Waypoint[];
  weather?: any;
  metro?: string;
  estimatedTime?: string;
  rating?: number;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  route?: Route;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  routeId?: string;
}
```

---

## 4.4 Persistència IndexedDB amb LocalForage

```javascript
// Fitxer: app/stores/useTravelStore.js
import { defineStore } from 'pinia'
import localforage from 'localforage'

export const useTravelStore = defineStore('travel', {
  state: () => ({
    routes: [],
    currentRouteId: null,
    isLoaded: false
  }),
  getters: {
    getRouteById: (state) => (id) => {
      var list = state.routes
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          return list[i]
        }
      }
      return undefined
    },
    recentRoutes: (state) => {
      var copy = []
      for (var j = 0; j < state.routes.length; j++) {
        copy.push(state.routes[j])
      }
      copy.sort(function (a, b) {
        return b.timestamp - a.timestamp
      })
      return copy
    }
  },
  actions: {
    async initStore() {
      if (this.isLoaded) return
      const savedRoutes = await localforage.getItem('travel-routes')
      if (savedRoutes) {
        this.routes = savedRoutes
      }
      this.isLoaded = true
    },
    async addRoute(route) {
      this.routes.push(route)
      if (this.routes.length > 50) {
        var recent = this.recentRoutes
        var trimmed = []
        for (var k = 0; k < 50 && k < recent.length; k++) {
          trimmed.push(recent[k])
        }
        this.routes = trimmed
      }
      await this.saveToDisk()
    },
    async updateRouteRating(id, rating) {
      var rutes = this.routes
      for (var i = 0; i < rutes.length; i++) {
        if (rutes[i].id === id) {
          rutes[i].rating = rating
          break
        }
      }
      await this.saveToDisk()
    },
    async deleteRoute(id) {
      var out = []
      for (var j = 0; j < this.routes.length; j++) {
        if (this.routes[j].id !== id) {
          out.push(this.routes[j])
        }
      }
      this.routes = out
      await this.saveToDisk()
    },
    async saveToDisk() {
      await localforage.setItem('travel-routes', JSON.parse(JSON.stringify(this.routes)))
    }
  }
})
```

### Configuració LocalForage (nuxt.config.ts)
```typescript
// nuxt.config.ts - mòdul pinia-plugin-persistedstate
export default defineNuxtConfig({
  modules: [
    'pinia-plugin-persistedstate/nuxt'
  ]
})
```

### Claus IndexedDB emprades
| Clau | Contingut | Màx. registres |
|------|-----------|----------------|
| `travel-routes` | Array de `Route` | 50 |
| Pinia persist (chat) | `ChatSession` | - |

---

## 4.5 Estructura de Fitxers Clau

```
Chatbots-RA2-BielDom-nguez/
├── app/
│   ├── stores/
│   │   ├── useTravelStore.js    # Pinia store + localforage
│   │   └── useChatStore.js      # Pinia store (persist: true)
│   └── types/
│       └── index.ts             # ITravelRoute, Waypoint, Message
├── specs/001-travel-buddy-pwa/
│   ├── tasks.md                 # Checklist de tasques
│   ├── contracts/
│   │   └── chat-api.md          # Contracte API Gemini
│   └── plan.md                  # Pla d'implementació
├── server/api/
│   └── chat.post.ts             # Proxy Nitro per a Gemini
└── docs/
    └── 4-Anexo-fitxers-relevants.md
```
