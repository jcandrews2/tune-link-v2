import { create } from "zustand";
import { User, Token, SpotifyPlayer, Store } from "../types";

// Make Store
const useStore = create<Store>((set) => ({
  user: {
    userId: "",
    profilePicture: "",
    token: null,
    likedSongs: [],
    dislikedSongs: [],
    recommendedSongs: [],
  },
  setUser: (updatedUser) =>
    set((state) => {
      console.log("Setting user state:", {
        current: state.user,
        update: updatedUser,
      });
      return {
        user: { ...state.user, ...updatedUser },
      };
    }),

  token: {
    value: "",
    lastRefreshed: 0,
  },
  setToken: (updatedToken) => {
    set((state) => {
      console.log("Setting token:", {
        current: state.token,
        update: updatedToken,
      });
      return {
        token: { ...state.token, ...updatedToken },
        user: {
          ...state.user,
          token: { ...state.token, ...updatedToken },
        },
      };
    });
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
