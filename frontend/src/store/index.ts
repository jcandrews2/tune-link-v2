import { create } from "zustand";

// Setup Object Interfaces
interface Token {
  value: string;
  lastRefreshed: number;
}

interface User {
  userID: string;
  profilePicture: string;
  token: Token | null;
  likedSongs: any[];
  dislikedSongs: any[];
  recommendedSongs: any[];
}

interface SpotifyPlayer {
  player: any;
  isActive: boolean;
  isPaused: boolean;
  currentTrack: any | null;
  position: number;
  deviceID: string | null;
  areRecommendationsInitialized: boolean;
  areRecommendationsLoading: boolean;
}

// Setup Store Interface
interface Store {
  user: User;
  setUser: (updatedUser: Partial<User>) => void;
  token: Token;
  setToken: (updatedToken: Partial<Token>) => void;
  spotifyPlayer: SpotifyPlayer;
  setSpotifyPlayer: (updatedSpotifyPlayer: Partial<SpotifyPlayer>) => void;
}

// Make Store
const useStore = create<Store>((set) => ({
  user: {
    userID: "",
    profilePicture: "",
    token: null,
    likedSongs: [],
    dislikedSongs: [],
    recommendedSongs: [],
  },
  setUser: (updatedUser) =>
    set((state) => ({
      user: { ...state.user, ...updatedUser },
    })),

  token: {
    value: "",
    lastRefreshed: 0,
  },
  setToken: (updatedToken) => {
    set((state) => ({
      token: { ...state.token, ...updatedToken },
      user: {
        ...state.user,
        token: { ...state.token, ...updatedToken },
      },
    }));
  },

  spotifyPlayer: {
    player: null,
    isActive: false,
    isPaused: true,
    currentTrack: null,
    position: 0,
    deviceID: null,
    areRecommendationsInitialized: false,
    areRecommendationsLoading: false,
  },
  setSpotifyPlayer: (updatedSpotifyPlayer) =>
    set((state) => ({
      spotifyPlayer: { ...state.spotifyPlayer, ...updatedSpotifyPlayer },
    })),
}));

export default useStore; 