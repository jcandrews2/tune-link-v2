import React, { FC, useEffect } from "react";
import { endpoints } from "../config/endpoints";

const WelcomePage: FC = () => {
  const handleLogin = () => {
    window.location.href = endpoints.auth.login;
  };

  return (
    <div className='flex flex-col items-center min-h-screen text-white p-16'>
      <h1 className='text-8xl font-bold'>Welcome to</h1>
      <h1 className='font-kirang text-6xl font-bold p-16'>Vibesbased</h1>
      <h2 className='text-xl mb-12'>Save time finding your favorite music.</h2>
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
