import React, { FC, useEffect } from "react";
import { endpoints } from "../config/endpoints";

const WelcomePage: FC = () => {
  const handleLogin = () => {
    window.location.href = endpoints.auth.login;
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white'>
      <h1 className='text-6xl font-bold mb-8'>tune link</h1>
      <p className='text-xl mb-12'>Discover music you'll love.</p>
      <button
        onClick={() => handleLogin()}
        className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300'
      >
        Connect with Spotify
      </button>
    </div>
  );
};

export default WelcomePage;
