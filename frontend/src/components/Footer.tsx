import React, { FC } from "react";
import logo from "../images/spotify-logo.png";
import VolumeControl from "./VolumeControl";
import { useLocation } from "react-router-dom";

const Footer: FC = () => {
  const location = useLocation();
  const isWelcomePage = location.pathname === "/welcome";

  return (
    <nav>
      <div className='container mx-auto px-4'>
        <div className='flex items-center h-20 gap-8'>
          <div className='flex items-center'>
            <img src={logo} alt='Spotify Logo' className='w-auto h-10' />
          </div>
          <div className='flex-grow' />
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
