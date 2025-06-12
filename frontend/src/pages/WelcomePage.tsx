import React, { FC } from "react";
import SpotifyLogo from "../images/Spotify_Logo_RGB_White.png";
import { endpoints } from "../config/endpoints";

const WelcomePage: FC = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-black p-6'>
      <div className='mb-10 text-center'>
        <h1 className='text-4xl font-bold text-white mb-4'>
          Welcome to TuneLink
        </h1>
        <p className='text-xl text-gray-300'>
          Discover music tailored to your taste
        </p>
      </div>

      <div className='flex flex-col items-center'>
        <a
          href={endpoints.auth.login}
          className='inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] transition-colors text-white font-bold text-base mb-6'
        >
          LOGIN WITH SPOTIFY
        </a>

        <div className='flex items-center mt-4'>
          <img src={SpotifyLogo} alt='Spotify' className='h-8 w-auto' />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
