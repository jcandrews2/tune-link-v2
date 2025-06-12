import React, { useEffect, useRef, FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ProfilePage from "./pages/ProfilePage";
import WelcomePage from "./pages/WelcomePage";
import Navbar from "./components/Navbar";
import useStore from "./store";
import { playTrack } from "./api/spotifyApi";
import {
  getAuthToken,
  getSpotifyUserInfo,
  createUser,
  getUser,
} from "./api/authApi";
import { SpotifyUser, BackendUser } from "./types";

const App: FC = () => {
  const { spotifyPlayer, setSpotifyPlayer, user, setUser, token, setToken } =
    useStore();

  const initialTrackPlayed = useRef(false);

  useEffect(() => {
    async function fetchToken(): Promise<void> {
      const accessToken = await getAuthToken();
      console.log("TOKEN", accessToken);
      setToken({ value: accessToken });
    }

    fetchToken();
  }, []);

  useEffect(() => {
    async function setupUser(): Promise<void> {
      const spotifyUserData = await getSpotifyUserInfo(token.value);

      try {
        const userData = await getUser(spotifyUserData);
        setUser({
          userID: userData.spotifyId,
          token: token,
          likedSongs: userData.likedSongs || [],
          dislikedSongs: userData.dislikedSongs || [],
          recommendedSongs: userData.recommendedSongs || [],
        });
      } catch (error) {
        console.log("Creating new user");
        await createUser(spotifyUserData, token);
        const userData = await getUser(spotifyUserData);
        setUser({
          userID: userData.spotifyId,
          token: token,
          likedSongs: userData.likedSongs || [],
          dislikedSongs: userData.dislikedSongs || [],
          recommendedSongs: userData.recommendedSongs || [],
        });
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
    playTrack(user.recommendedSongs[0].songID, spotifyPlayer, token);
    initialTrackPlayed.current = true;
  }, [
    spotifyPlayer.isActive,
    spotifyPlayer.areRecommendationsInitialized,
    token,
    initialTrackPlayed,
  ]);

  return (
    <Router>
      <div className='min-h-screen bg-black'>
        {!token.value ? (
          <WelcomePage />
        ) : (
          <>
            <Navbar />
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route
                path='/recommendations'
                element={<RecommendationsPage />}
              />
              <Route path='/profile' element={<ProfilePage />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
