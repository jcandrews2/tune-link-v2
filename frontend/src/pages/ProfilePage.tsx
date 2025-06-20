import React, { FC } from "react";
import useStore from "../store";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProfilePage: FC = () => {
  const { user, setUser, setSpotifyPlayer, spotifyPlayer } = useStore();
  const navigate = useNavigate();

  const logout = () => {
    if (spotifyPlayer.player) {
      spotifyPlayer.player.disconnect();
    }

    setUser({
      userId: "",
      profilePicture: "",
      likedSongs: [],
      dislikedSongs: [],
      recommendedSongs: [],
      previousRequests: [],
    });

    setSpotifyPlayer({
      player: null,
      deviceID: null,
      currentTrack: null,
      isActive: false,
      isPaused: true,
      isDragging: false,
      position: 0,
      progress: 0,
    });

    navigate("/");
  };

  return (
    <div
      id='mini-player-portal'
      className='flex flex-col items-center h-full gap-8'
    >
      <div className='w-72 h-auto rounded-full border border-gray-700'>
        {user.profilePicture ? (
          <img src={user.profilePicture} alt='Profile Picture' />
        ) : (
          <FiUser className='w-full h-full p-8' />
        )}
      </div>
      <h1 className='text-2xl font-bold'>{user.userId}</h1>
      <button
        className='bg-white px-4 py-2 rounded-full text-black'
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
