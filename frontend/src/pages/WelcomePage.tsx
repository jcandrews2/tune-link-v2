import React, { FC } from "react";
import { endpoints } from "../config/endpoints";

const WelcomePage: FC = () => {
  const handleLogin = () => {
    window.location.href = endpoints.auth.login;
  };

  return (
    <div className='flex flex-col items-center justify-center bg-black text-white'>
      <div className='text-center px-4'>
        <h1 className='text-6xl md:text-8xl font-bold p-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300'>
          Welcome to
        </h1>
        <h1 className='font-kirang text-6xl md:text-8xl p-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500'>
          Vibesbased
        </h1>
        <h2 className='text-xl mb-12 p-4 text-center text-gray-300 max-w-2xl'>
          Music discovery made easy. <br />
          Give us the vibe and we'll play you the music.
        </h2>
        <button
          onClick={() => handleLogin()}
          className='group text-white py-4 px-8 rounded-full transition-all duration-300 transform bg-green-600'
        >
          <span className='flex items-center'>
            Connect with Spotify
            <svg
              className='w-5 h-5 ml-2 transition-transform duration-300 transform group-hover:translate-x-1'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M14 5l7 7m0 0l-7 7m7-7H3'
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
