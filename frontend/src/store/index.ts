import { create } from "zustand";
import { User, SpotifyPlayer, Store } from "../types";

const useStore = create<Store>((set) => ({
  user: {
    userId: "",
    profilePicture: "",
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

  spotifyPlayer: {
    player: null,
    isActive: false,
    isPaused: true,
    currentTrack: null,
    position: 0,
    deviceID: null,
  },
  setSpotifyPlayer: (updatedSpotifyPlayer) =>
    set((state) => ({
      spotifyPlayer: { ...state.spotifyPlayer, ...updatedSpotifyPlayer },
    })),
}));

export default useStore;
