import { GoogleGenerativeAI } from '@google/generative-ai'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const prompt = body.prompt
  const location = body.location
  const history = body.history || []

  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gemini API Key is not configured'
    })
  }

  var locationStr = 'Unknown'
  if (location && typeof location.lat === 'number' && typeof location.lng === 'number') {
    locationStr = 'lat: ' + location.lat + ', lng: ' + location.lng
  }

  const systemInstruction = `
    You are TravelBuddy, an AI travel assistant. 
    Your goal is to help users generate travel routes based on their current location and preferences.
    
    CURRENT LOCATION: ${locationStr}
    
    GUIDELINES:
    1. If the user asks for a route, ALWAYS include a clear "Start Point" and "End Point".
    2. Use the provided current location as the Start Point unless the user specifies a different origin.
    3. Ensure waypoints are logically ordered.
    Respond with a JSON object: { 
      "type": "route", 
      "content": "summary of the route", 
      "route": { 
        "title": "Ruta de [origen] a [destino]", 
        "waypoints": [
          { "title": "Name of the stop", "description": "Short description", "lat": 41.3851, "lng": 2.1734, "duration": "5 min", "order": 0 }
        ],
        "metro": "L3, L5",
        "estimatedTime": "25 min"
      } 
    }.
    Each waypoint MUST have: "title" (string), "description" (string), "lat" (number), "lng" (number), "duration" (string e.g. "5 min"), "order" (number 0,1,2...). Use real coordinates for Barcelona locations (e.g. Sagrada Familia ~ 41.4036, 2.1744).
    5. If it is just a conversation, use { "type": "text", "content": "response" }.
    
    ALWAYS respond in valid JSON format.
  `

  const genAI = new GoogleGenerativeAI(config.geminiApiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  var historyForGemini = []
  for (var i = 0; i < history.length; i++) {
    var m = history[i]
    var role
    if (m.role === 'user') {
      role = 'user'
    } else {
      role = 'model'
    }
    historyForGemini.push({
      role: role,
      parts: [{ text: m.content }]
    })
  }

  try {
    const chat = model.startChat({
      history: historyForGemini,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })

    const result = await chat.sendMessage(systemInstruction + '\n\nUser: ' + prompt)
    const responseText = result.response.text()

    return JSON.parse(responseText)
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error communicating with AI service'
    })
  }
})
