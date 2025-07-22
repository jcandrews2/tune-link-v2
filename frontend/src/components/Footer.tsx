import React, { FC } from "react";
import logo from "../images/spotify-logo.png";
import VolumeControl from "./VolumeControl";

const Footer: FC = () => {
  return (
    <nav>
      <div className='container mx-auto px-4'>
        <div className='flex items-center h-20 gap-8'>
          <div className='flex items-center'>
            <img src={logo} alt='Spotify Logo' className='w-36 h-auto' />
          </div>
          {/* <p className='text-white text-sm'>
            {new Date().getFullYear()} Vibesbased.
          </p> */}
          <div className='flex-grow' />
          <VolumeControl />
        </div>
      </div>
    </nav>
  );
};

export default Footer;
