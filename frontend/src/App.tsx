import React, { useEffect, useRef } from "react";
import Player from "./components/Player";
import Login from "./pages/Login";
import useStore from "./store";
import { playSpotifyTrack } from "./utils/spotify-utils";
import SpotifyLogo from "./images/Spotify_Logo_RGB_White.png";

function App() {
  const {
    spotifyPlayer,
    setSpotifyPlayer,
    profile,
    setProfile,
    token,
    setToken,
  } = useStore();

  const initialTrackPlayed = useRef(false);

  async function getSpotifyUserInfo() {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  async function postProfile(spotifyProfileData) {
    if (spotifyProfileData.error) return;
    const newProfile = {
      userID: spotifyProfileData.id,
      profilePicture: spotifyProfileData.images[0],
      token: token,
      likedSongs: [],
      dislikedSongs: [],
      recommendedSongs: [],
    };

    try {
      await fetch(`http://localhost:5050/user/${spotifyProfileData.id}`, {
        method: "POST",
        body: JSON.stringify({ profile: newProfile }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error creating profile.", error);
    }
  }

  async function getProfile(spotifyProfileData) {
    try {
      const response = await fetch(
        `http://localhost:5050/user/${spotifyProfileData.id}`
      );
      if (!response.ok) {
        throw new Error("Profile doesn't exist yet.");
      }
      const data = await response.json();

      setProfile({
        userID: data.userID,
        profilePicture: data.profilePicture,
        token: token,
        likedSongs: data.likedSongs,
        dislikedSongs: data.dislikedSongs,
        recommendedSongs: data.recommendedSongs,
      });

      if (response.ok) {
        setSpotifyPlayer({ areRecommendationsInitialized: true });
      }
    } catch (error) {
      throw new Error("Error getting profile");
    }
  }

  useEffect(() => {
    async function getToken() {
      const response = await fetch("http://localhost:5050/auth/token");
      const data = await response.json();
      setToken({ value: data.access_token });
    }

    getToken();
  }, []);

  useEffect(() => {
    async function setupProfile() {
      const spotifyProfileData = await getSpotifyUserInfo();

      try {
        await getProfile(spotifyProfileData);
      } catch (error) {
        await postProfile(spotifyProfileData);
        await getProfile(spotifyProfileData);
      }
    }

    if (!token.value) {
      return;
    }

    setupProfile();
  }, [token]);

  useEffect(() => {
    if (!spotifyPlayer.isActive && !initialTrackPlayed) {
      return;
    }

    if (!spotifyPlayer.deviceID) {
      return;
    }

    if (!spotifyPlayer.areRecommendationsInitialized) {
      return;
    }

    playSpotifyTrack(profile.recommendedSongs[0].songID, spotifyPlayer, token);
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
        <h1 className='z-10'>tune link</h1>
        {!token.value ? <Login /> : <Player />}
      </div>
    </div>
  );
}

export default App;
