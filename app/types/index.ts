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
