# Quickstart: TravelBuddy PWA

## Prerequisites
- Node.js 20+
- Gemini API Key

## Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root:
   ```env
   GEMINI_API_KEY=your_api_key_here
   OPENWEATHER_API_KEY=your_weather_key_here
   ```

3. **Development**:
   ```bash
   npm run dev
   ```

4. **Build & PWA Test**:
   ```bash
   npm run build
   npm run preview
   ```

## Key Directories
- `server/api/`: Nitro serverless routes (Chat Proxy).
- `stores/`: Pinia stores (Persistence enabled).
- `components/`: Vue components (Map, Chat, History).
- `pages/`: Nuxt app pages.

## Verification
- Visit `localhost:3000`.
- Check browser devtools (Application -> IndexedDB) for `pinia-state`.
- Inspect Service Worker registration in Application tab.
