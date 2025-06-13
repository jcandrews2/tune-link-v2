// types.ts - Centralized type definitions for the application

export const AppTypes = {
  // User related types
  User: {} as {
    id?: number;
    userId: string;
    profilePicture?: string;
    token: { value: string; lastRefreshed?: number } | null;
    likedSongs: Array<{
      id?: string;
      songID?: string;
      name: string;
      artist: string;
    }>;
    dislikedSongs: Array<{
      id?: string;
      songID?: string;
      name: string;
      artist: string;
    }>;
    recommendedSongs: Array<{
      id?: string;
      songID?: string;
      name: string;
      artist: string;
    }>;
  },

  Song: {} as {
    id?: string;
    songID?: string;
    name: string;
    artist: string;
  },

  // Spotify related types
  SpotifyUser: {} as {
    id: string;
    images: Array<{
      url: string;
    }>;
    error?: any;
  },

  SpotifyPlayer: {} as {
    player: any;
    isActive: boolean;
    isPaused: boolean;
    currentTrack: any | null;
    position: number;
    deviceID: string | null;
    areRecommendationsInitialized: boolean;
    areRecommendationsLoading: boolean;
  },

  // Tokens
  Token: {} as {
    value: string;
    lastRefreshed?: number;
  },

  // Store types
  Store: {} as {
    user: any; // Reference to User type
    setUser: (updatedUser: Partial<any>) => void;
    token: any; // Reference to Token type
    setToken: (updatedToken: Partial<any>) => void;
    spotifyPlayer: any; // Reference to SpotifyPlayer type
    setSpotifyPlayer: (updatedSpotifyPlayer: Partial<any>) => void;
  },

  // Utility types
  RGB: {} as {
    r: number;
    g: number;
    b: number;
  },

  // Type helpers
  SetUser: {} as (user: Partial<any>) => void,
  SetSpotifyPlayer: {} as (player: Partial<any>) => void,
};

// Type aliases for easier usage
export type User = typeof AppTypes.User;
export type Song = typeof AppTypes.Song;
export type SpotifyUser = typeof AppTypes.SpotifyUser;
export type SpotifyPlayer = typeof AppTypes.SpotifyPlayer;
export type Token = typeof AppTypes.Token;
export type Store = typeof AppTypes.Store;
export type RGB = typeof AppTypes.RGB;
export type SetUser = typeof AppTypes.SetUser;
export type SetSpotifyPlayer = typeof AppTypes.SetSpotifyPlayer;
