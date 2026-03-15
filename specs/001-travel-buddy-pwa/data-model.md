# Data Model: TravelBuddy PWA (Catalan ES5)

## Entitats

### Ruta (Route)
Representa un itinerari guardat generat per la IA.

| Camp | Tipus | Descripció |
|-------|------|-------------|
| id | string (UUID) | Identificador únic |
| titol | string | Nom de la ruta |
| marca_temps | number | Timestamp Unix |
| punts_pas | PuntPas[] | Llista de parades |
| rating | number | Puntuació de 1 a 5 estrelles |
| ubicacio | object | Coordenades {lat, lng} d'origen (línia verda) |
| metro | string | Línia recomanada |
| temps_estimat | string | Durada total |

### PuntPas (Waypoint)
Una parada específica o activitat dins d'una ruta.

| Camp | Tipus | Descripció |
|-------|------|-------------|
| titol | string | Nom de la parada |
| descripcio | string | Detalls |
| lat | number | Latitud |
| lng | number | Longitud |
| durada | string | Temps a la parada |
| ordre | number | Posició |

## Normalització de waypoints (punts_pas)

L'API (Gemini) pot retornar camps amb noms variables. El client ha de normalitzar sempre abans de guardar o mostrar:

| Camp en API | Alternatives acceptades | Camp normalitzat |
|-------------|--------------------------|-------------------|
| title       | name, titol              | title             |
| description | descripcio               | description       |
| lat         | latitude                 | lat               |
| lng         | longitude                | lng               |
| duration    | durada                   | duration          |
| order       | —                        | order             |

Així s'evita "undefined" a l'itinerari i a "De X a Y". La funció `normalizeWaypoint(raw, index)` ha d'aplicar-se a cada punt en rebre la ruta del xat.

## Relacions
- **Ruta** és l'entitat principal de la **Galeria**.
- **LocalForage** assegura que el camp `rating` es mantingui entre sessions.
