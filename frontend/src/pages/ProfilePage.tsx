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
    <div className='flex flex-col flex-grow'>
      <div className='flex gap-4 container mx-auto relative'>
        <div id='mini-player-portal' className='w-full lg:w-1/3 mx-auto'>
          <div className='w-full h-[600px] flex flex-col items-center gap-8 p-8'>
            <div
              className={`w-68 h-auto rounded-full ${!user.profilePicture ? "border border-white border-[1px]" : ""}`}
            >
              {user.profilePicture ? (
                <img
                  className='w-full h-full rounded-full object-cover'
                  src={user.profilePicture}
                  alt='Profile Picture'
                />
              ) : (
                <FiUser className='w-full h-full p-8' />
              )}
            </div>
            <h1 className='text-2xl font-bold'>{user.userId}</h1>
            <button
              className='bg-white px-4 py-2 rounded-full text-black active:scale-95'
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
