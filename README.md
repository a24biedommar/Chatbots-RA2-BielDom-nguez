# TravelBuddy

**PWA de rutes urbanes amb IA generativa.** Aplica conversacional per a crear rutes personalitzades a Barcelona utilitzant Gemini AI, amb persistència offline i visualització en mapa interactiu.

---

## Tecnologies

| Categoria | Tecnologia | Versió |
|-----------|------------|--------|
| Framework | Nuxt 3 | 3.x |
| Gestió d'estat | Pinia | 2.x |
| Mapes | Leaflet + Vue Leaflet | 4.x |
| IA | Google Gemini API | - |
| Persistència | LocalForage + IndexedDB | 1.x |
| PWA | @vite-pwa/nuxt | 0.x |

---

## Arquitectura SDD

El projecte segueix la metodologia **Spec-Driven Development (SDD)**. Tota l'especificació es troba a la carpeta `/specs`:

```
specs/001-travel-buddy-pwa/
├── tasks.md          # Checklist de tasques amb el seu estat
├── spec.md           # Especificació funcional completa
├── data-model.md     # Model de dades i contractes
├── contracts/
│   └── chat-api.md   # Contracte de l'API de xat
├── plan.md           # Pla d'implementació
└── research.md       # Recerca inicial
```

Cada contracte defineix l'estructura exacta que l'API de Gemini ha de retornar per tal que el parser del client processi la ruta correctament.

---

## Instal·lació i Setup

### 1. Clonar i instal·lar dependències

```bash
npm install
```

### 2. Configurar l'arxiu `.env`

Crear un fitxer `.env` a l'arrel del projecte amb la clau de l'API de Gemini:

```env
GEMINI_API_KEY=la_teva_clau_api_gemini_aqui
```

> **Nota:** La clau API s'injecta al servidor via `runtimeConfig` i mai s'exposa al client.

### 3. Iniciar el servidor de desenvolupament

```bash
npm run dev
```

L'aplicació estarà disponible a `http://localhost:3000`.

---

## Estructura de Carpetes

```
Chatbots-RA2-BielDom-nguez/
├── app/
│   ├── components/       # Components Vue reutilitzables (ChatWindow, RouteMap, etc.)
│   ├── composables/      # Composables reutilitzables (useModalMap, etc.)
│   ├── layouts/          # Layouts Nuxt (aplicacio.vue)
│   ├── pages/            # Pàgines de l'aplicació
│   │   ├── index.vue     # Landing page pública
│   │   └── aplicacio/    # Rutes de l'aplicació (chat, galeria)
│   ├── stores/           # Pinia stores (useTravelStore, useChatStore)
│   └── types/            # Interfaces TypeScript
├── server/
│   ├── api/              # Endpoints Nitro (POST /api/chat)
│   └── utils/            # Utilitats del servidor
├── specs/                # Especificacions SDD
├── docs/                 # Documentació del projecte
├── public/               # Actius estàtics
└── nuxt.config.ts        # Configuració de Nuxt
```

| Carpeta | Funcionalitat |
|---------|---------------|
| `app/` | Frontend Vue/Nuxt de l'aplicació |
| `server/` | Backend Nitro (proxy API, lògica del servidor) |
| `specs/` | Especificacions, contractes i planificació SDD |
| `docs/` | Documentació addicional del projecte |

---

## Estàndards de Codificació

El projecte segueix els estàndards establerts a l'assignatura:

- **Comentaris en català:** Tots els fitxers inclouen una capçalera de 4 blocs amb informació del fitxer, autor, data i propòsit.
- **Estàndard ES5 Catalan:** Utilització de `var` en lloc de `let`/`const`, i `function` en lloc de arrow functions al codi principal.
- **Normativa de comentaris:** Cada funció i component inclou comentaris descriptius en català.

---

## Scripts Disponibles

| Comanda | Descripció |
|---------|------------|
| `npm run dev` | Servidor de desenvolupament |
| `npm run build` | Construcció per a producció |
| `npm run preview` | Vista prèvia de la construcció |
| `npm run generate` | Generació estàtica (SSG) |
