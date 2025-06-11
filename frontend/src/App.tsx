import React, { useEffect, useRef, FC } from "react";
import Player from "./components/Player";
import Login from "./pages/Login";
import useStore from "./store";
import { playSpotifyTrack } from "./utils/spotify-utils";
import axios from "axios";
import { User, Song } from "./utils/user-utils";
import { Token } from "./utils/spotify-utils";

interface SpotifyUser {
  id: string;
  images: Array<{
    url: string;
  }>;
  error?: any;
}

interface BackendUser {
  id: number;
  spotifyId: string;
  profilePicture: string | null;
  likedSongs: Song[];
  dislikedSongs: Song[];
  recommendedSongs: Song[];
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

const App: FC = () => {
  const {
    spotifyPlayer,
    setSpotifyPlayer,
    user,
    setUser,
    token,
    setToken,
  } = useStore();

  const initialTrackPlayed = useRef(false);

  async function getSpotifyUserInfo(): Promise<SpotifyUser> {
    try {
      const response = await axios.get<SpotifyUser>("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return { id: "", images: [], error };
    }
  }

  async function createUser(spotifyUserData: SpotifyUser): Promise<void> {
    if (spotifyUserData.error) return;
    const newUser = {
      userID: spotifyUserData.id,
      profilePicture: spotifyUserData.images[0],
      token: token,
      likedSongs: [],
      dislikedSongs: [],
      recommendedSongs: [],
    };

    try {
      await axios.post(`http://localhost:5050/user/${spotifyUserData.id}`, {
        user: newUser
      }, {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Error creating user.", error);
    }
  }

  async function getUser(spotifyUserData: SpotifyUser): Promise<void> {
    try {
      const response = await axios.get<BackendUser>(
        `http://localhost:5050/user/${spotifyUserData.id}`
      );
      const data = response.data;

      setUser({
        userID: data.spotifyId,
        token: token,
        likedSongs: data.likedSongs || [],
        dislikedSongs: data.dislikedSongs || [],
        recommendedSongs: data.recommendedSongs || [],
      });

    } catch (error) {
      throw new Error("Error getting user");
    }
  }

  useEffect(() => {
    async function getToken(): Promise<void> {
      const response = await axios.get<{ access_token: string }>("http://localhost:5050/auth/token");
      setToken({ value: response.data.access_token });
    }

    getToken();
  }, []);

  useEffect(() => {
    async function setupUser(): Promise<void> {
      const spotifyUserData = await getSpotifyUserInfo();

      try {
        await getUser(spotifyUserData);
      } catch (error) {
        console.log("Creating new user");
        await createUser(spotifyUserData);
        await getUser(spotifyUserData);
      }
    }

    if (!token.value) {
      return;
    }

    setupUser();
  }, [token]);

  useEffect(() => {
    if (!spotifyPlayer.isActive && !initialTrackPlayed.current) {
      return;
    }

    if (!spotifyPlayer.deviceID) {
      return;
    }

    if (!spotifyPlayer.areRecommendationsInitialized) {
      return;
    }

    if (!user.recommendedSongs || user.recommendedSongs.length === 0) {
      return;
    }

    console.log("HOW DID IT GET HERE");
    playSpotifyTrack(user.recommendedSongs[0].songID, spotifyPlayer, token);
    initialTrackPlayed.current = true;
  }, [
    spotifyPlayer.isActive,
    spotifyPlayer.areRecommendationsInitialized,
    token,
    initialTrackPlayed,
  ]);

  return (
    <div className='flex flex-col items-center justify-center h-screen text-center bg-black'>
      <div className='flex flex-col object-contain w-1/2 h-screen bg-black md:w-7/10 sm:w-9/10'>
        <h1 className='m-8'>tune link</h1>
        {!token.value ? <Login /> : <Player />}
      </div>
    </div>
  );
};

export default App;
