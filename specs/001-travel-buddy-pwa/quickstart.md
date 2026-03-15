# Guia Ràpida: TravelBuddy PWA

## Configuració
1. `npm install`
2. Configurar `.env` amb `GEMINI_API_KEY` (veure `.env.example`).
3. `npm run dev`

## Implementar des de zero (referència)

Per reproduir l'aplicació amb totes les funcionalitats, seguir en aquest ordre:

1. **spec.md** – Requisits funcionals (FR-001 a FR-009) i criteris d’èxit (SC-001 a SC-008).
2. **plan.md** – Estructura del projecte i secció "Implementation Pitfalls" (què evitar: header 0-height, mapa al modal amb component, etc.).
3. **tasks.md** – Tasques per fases (T001–T021); les T015, T020, T021 cobreixen mapa al modal, capçalera del modal i waypoints normalitzats.
4. **data-model.md** – Esquema de Ruta/PuntPas i taula de normalització de waypoints.
5. **contracts/chat-api.md** – Endpoint `POST /api/chat`, payload i schema de `route`/`waypoints`.
6. **research.md** – Decisions sobre layout, header, mapa al modal i llegibilitat del modal.

## Verificació del Nou Flux
- **Landing**: Comprova que el botó "Comença Ara" et porta a la galeria.
- **Navegació**: Verifica que el header (Xat, Galeria, Sortir) es veu clarament a `/aplicacio/galeria` i `/aplicacio/chat`. Si no es veu, comprova que `app.vue` té `<NuxtLayout>` al voltant de `<NuxtPage />` i que el layout `aplicacio` té el header amb alçada explícita.
- **Xat**: Envia un missatge i comprova que l'input es manté a baix i el xat fa scroll automàtic.
- **Ruta**: Clica "Ver" en una ruta. El modal ha de mostrar: (1) capçalera verda amb títol i X visibles; (2) mapa cargat a l'esquerra (teselles, marcadors, línia verda); (3) itinerari a la dreta sense "undefined"; (4) "De [origen] a [destí]" llegible. Puntua amb estrelles i prem "Guardar"; verifica que apareix a la galeria.
- **Galeria**: Obre una ruta des de la galeria; el mateix modal ha de mostrar el mapa i l'itinerari correctament. Cerca una ruta pel títol i comprova l'ordenació per puntuació.
- **Codi**: Fitxers en JavaScript (no TypeScript); `var`/`function` i català on s'especifiqui.
