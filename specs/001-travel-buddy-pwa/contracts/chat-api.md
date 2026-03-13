# Contract: Chat API (Nitro Proxy)

**Endpoint**: `POST /api/chat`  
**Description**: Proxy for Gemini AI with geolocation and weather context.

## Request Payload

| Field | Type | Description |
|-------|------|-------------|
| prompt | string | User input message |
| location | object | { lat, lng } coordinates |
| history | array | Previous chat history turns |

## Response Structure (200 OK)

The response MUST be a valid JSON object representing the AI's answer or route generation.

| Field | Type | Description |
|-------|------|-------------|
| type | "text" \| "route" | Type of response content |
| content | string | AI's natural language response |
| route | object (optional) | Full route data if `type === "route"` |

**Route Object Schema**:
```json
{
  "title": "A Day in [City]",
  "waypoints": [
    {
      "title": "Stop Name",
      "description": "Why visit",
      "lat": 0.0,
      "lng": 0.0,
      "duration": "1h"
    }
  ]
}
```

## Error Handling

| Code | Reason | Action |
|------|--------|--------|
| 400 | Invalid prompt or context | Prompt for better input |
| 500 | Gemini API Failure | Notify user, suggest viewing history |
| 503 | Weather API Failure | Process with generic context |

## Security
- API keys MUST be injected from `.env` via `process.env.GEMINI_API_KEY`.
- No client-side exposure of secrets.
