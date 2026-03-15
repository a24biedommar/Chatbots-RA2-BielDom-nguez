# Contracte: API de Xat (Proxy Nitro)

**Endpoint**: `POST /api/chat`  
**Descripció**: Proxy per a Gemini AI amb context de geolocalització. La clau API es llegeix de `runtimeConfig.geminiApiKey` (per exemple `GEMINI_API_KEY` a `.env`).

## Payload de Petició

| Camp | Tipus | Descripció |
|-------|------|-------------|
| prompt | string | Missatge de l'usuari |
| location | object | Coordenades { lat, lng } (ubicació actual) |
| history | array | Array de missatges anteriors { role, content } per al context |

## Estructura de Resposta (200 OK)

| Camp | Tipus | Descripció |
|-------|------|-------------|
| type | "text" \| "route" | Tipus de contingut |
| content | string | Resposta en llenguatge natural |
| route | object (opcional) | Dades de la ruta si `type === "route"` |

**Schema de l'objecte route** (el prompt del sistema ha d'exigir aquests camps per cada waypoint):

```json
{
  "title": "Ruta de [origen] a [destino]",
  "metro": "L3, L5",
  "estimatedTime": "25 min",
  "waypoints": [
    {
      "title": "Nom de la parada",
      "description": "Descripció breu",
      "lat": 41.3851,
      "lng": 2.1734,
      "duration": "5 min",
      "order": 0
    }
  ]
}
```

**Important**: Cada waypoint ha de tenir `title`, `description`, `lat`, `lng`, `duration`, `order`. El client ha de normalitzar si l'API retorna `name`/`titol`, `latitude`/`longitude` o `durada` (veure data-model.md).

## Gestió d'Errors

| Codi | Raó | Acció |
|------|-----|-------|
| 400 | Prompt o context invàlid | Demanar millor entrada |
| 500 | Fallada API Gemini | Notificar a l'usuari |

## Seguretat
- Les claus API s'injecten des de `.env` via `process.env.GEMINI_API_KEY`.
- Cap secret s'exposa al client.
