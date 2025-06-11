import React, { FC } from "react";
import SpotifyLogo from "../images/Spotify_Logo_RGB_White.png";

const Login: FC = () => {
  return (
    <div className="flex justify-center m-11">
      <a href="http://localhost:5050/auth/login" className="flex items-center">
        <h2 className="p-4 text-white">Login With Spotify</h2>
        <img
          src={SpotifyLogo}
          alt="SpotifyLogo"
          className="w-[10rem] h-auto p-4"
        />
      </a>
    </div>
  );
};

export default Login;
