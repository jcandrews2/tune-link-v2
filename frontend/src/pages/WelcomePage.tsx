import React, { FC } from "react";
import { endpoints } from "../config/endpoints";
import VibesbasedLogo from "../images/vibesbased-logo.jpg";
const WelcomePage: FC = () => {
  const handleLogin = () => {
    window.location.href = endpoints.auth.login;
  };

  return (
    <div className='flex flex-col items-center justify-center text-white'>
      <h1 className='text-8xl font-bold p-4'>Welcome to</h1>
      <img src={VibesbasedLogo} alt='Vibesbased Logo' className='w-64 h-auto' />
      <h2 className='text-xl mb-12 p-4 text-center text-gray-300 max-w-2xl'>
        Music discovery made easy. <br />
        Give us the vibe and we'll play you the music.
      </h2>
      <button
        onClick={() => handleLogin()}
        className='text-white py-4 px-8 rounded-full transition-all duration-300 transform bg-green-600 active:scale-95'
      >
        Connect with Spotify
      </button>
    </div>
  );
};

export default WelcomePage;
