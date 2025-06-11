import { create } from "zustand";

interface Token {
  value: string;
  lastRefreshed: number;
}

interface Profile {
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

interface Store {
  profile: Profile;
  setProfile: (updatedProfile: Partial<Profile>) => void;
  token: Token;
  setToken: (updatedToken: Partial<Token>) => void;
  spotifyPlayer: SpotifyPlayer;
  setSpotifyPlayer: (updatedSpotifyPlayer: Partial<SpotifyPlayer>) => void;
}

const useStore = create<Store>((set) => ({
  profile: {
    userID: "",
    profilePicture: "",
    token: null,
    likedSongs: [],
    dislikedSongs: [],
    recommendedSongs: [],
  },
  setProfile: (updatedProfile) =>
    set((state) => ({
      profile: { ...state.profile, ...updatedProfile },
    })),

  token: {
    value: "",
    lastRefreshed: 0,
  },
  setToken: (updatedToken) => {
    set((state) => ({
      token: { ...state.token, ...updatedToken },
      profile: {
        ...state.profile,
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