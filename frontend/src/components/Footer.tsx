import React, { FC } from "react";
import logo from "../images/spotify-logo.png";
import VolumeControl from "./VolumeControl";
import { useLocation } from "react-router-dom";

const Footer: FC = () => {
  const location = useLocation();
  const isWelcomePage = location.pathname === "/welcome";

  return (
    <nav>
      <div className='container mx-auto py-2 px-4 h-12 xl:h-16'>
        <div className='flex items-center h-full'>
          <div className='flex items-center md:flex-none flex-1 md:flex-initial justify-center md:justify-start'>
            <img src={logo} alt='Spotify Logo' className='w-auto h-10' />
          </div>
          <div className='hidden md:block flex-grow' />
          {isWelcomePage ? (
            <p className='text-white text-lg'>
              {new Date().getFullYear()} Vibesbased.
            </p>
          ) : (
            <VolumeControl />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Footer;
