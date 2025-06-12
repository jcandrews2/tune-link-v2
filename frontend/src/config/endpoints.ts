// Base URLs
const BASE_URL = 'http://localhost:5050';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

// Endpoint configuration object
export const endpoints = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    token: `${BASE_URL}/auth/token`,
    callback: `${BASE_URL}/auth/callback`,
  },
  user: {
    profile: `${SPOTIFY_API_URL}/me`,
    create: (id: string) => `${BASE_URL}/user/${id}`,
    get: (id: string) => `${BASE_URL}/user/${id}`,
    recommendations: (id: string) => `${BASE_URL}/user/${id}/recommendations`,
    liked: (id: string) => `${BASE_URL}/user/${id}/liked`,
    disliked: (id: string) => `${BASE_URL}/user/${id}/disliked`,
    musicRequest: (id: string) => `${BASE_URL}/user/${id}/music-request`,
  },
  player: {
    play: (deviceId: string) => `${SPOTIFY_API_URL}/me/player/play?device_id=${deviceId}`,
    seek: (positionMs: number) => `${SPOTIFY_API_URL}/me/player/seek?position_ms=${positionMs}`,
    transfer: `${SPOTIFY_API_URL}/me/player`,
  },
} as const;

// Type for the endpoints object
export type Endpoints = typeof endpoints;

// Environment-specific configuration
export const getBaseUrl = () => {
  return import.meta.env.VITE_API_URL || BASE_URL;
}; 