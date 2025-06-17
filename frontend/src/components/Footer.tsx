import React, { FC } from "react";
import logo from "../images/spotify-logo.png";

const Footer: FC = () => {
  return (
    <nav className=''>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Copyright */}
          <p className='text-white'>{new Date().getFullYear()} Vibesbased.</p>

          {/* Spotify Logo */}
          <div className='flex items-center'>
            <img src={logo} alt='Spotify Logo' className='w-auto h-10' />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Footer;
