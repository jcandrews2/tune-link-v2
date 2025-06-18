// types.ts - Centralized type definitions for the application
export interface Request {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface User {
  userId: string;
  profilePicture?: string;
  likedSongs: Song[];
  dislikedSongs: Song[];
  recommendedSongs: Song[];
  previousRequests: Request[];
  token?: {
    value: string;
    expiresAt: number;
  };
  spotifyAccessToken?: string;
}
export interface SpotifyPlayer {
  player?: any;
  deviceID?: any;
  currentTrack?: any;
  isPaused?: boolean;
  position?: number;
  isActive?: boolean;
  areRecommendationsLoading?: boolean;
  areRecommendationsInitialized?: boolean;
  progress?: number;
}

export interface Store {
  user: User;
  setUser: (updatedUser: Partial<User>) => void;
  spotifyPlayer: SpotifyPlayer;
  setSpotifyPlayer: (updatedSpotifyPlayer: Partial<SpotifyPlayer>) => void;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export type SetUser = (user: Partial<User>) => void;
export type SetSpotifyPlayer = (player: Partial<SpotifyPlayer>) => void;

declare global {
  interface Window {
    Spotify: {
      Player: any;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}
