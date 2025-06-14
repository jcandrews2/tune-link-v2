// types.ts - Centralized type definitions for the application

export interface Song {
  id?: string;
  songID?: string;
  name: string;
  artist: string;
}

export interface User {
  userId: string;
  profilePicture?: string;
  likedSongs: Song[];
  dislikedSongs: Song[];
  recommendedSongs: Song[];
  token?: {
    value: string;
    expiresAt: number;
  };
  spotifyAccessToken?: string;
}

export interface SpotifyUser {
  id: string;
  images: Array<{
    url: string;
  }>;
  error?: any;
}

export interface BackendUser {
  userId: string;
  profilePicture?: string;
  likedSongs: string[];
  dislikedSongs: string[];
  recommendedSongs: string[];
}

export interface SpotifyPlayer {
  player?: any;
  deviceID?: string;
  currentTrack?: any;
  isPaused?: boolean;
  position?: number;
  isActive?: boolean;
  areRecommendationsLoading?: boolean;
  areRecommendationsInitialized?: boolean;
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
