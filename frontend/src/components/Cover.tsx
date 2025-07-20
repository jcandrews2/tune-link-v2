import React, { useEffect, useState, FC } from "react";
import Loading from "./Loading";
import useStore from "../store";
import { getDominantColor } from "../utils/playerUtils";

const Cover: FC = () => {
  const { spotifyPlayer, setSpotifyPlayer } = useStore();

  const handleGetImageColor = async (): Promise<void> => {
    const color = await getDominantColor();
    if (color) {
      setSpotifyPlayer({
        dominantColor: color,
        animationKey: (spotifyPlayer.animationKey ?? 0) + 1,
      });
    }
  };

  return (
    <div className='relative w-full aspect-square z-0 select-none'>
      {spotifyPlayer.isActive ? (
        <>
          <img
            src={spotifyPlayer.currentTrack?.album.images[0].url}
            className='absolute z-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-sm w-full h-full'
            alt='Cover'
            onLoad={handleGetImageColor}
          />
          <div
            className='absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-sm blur-[50px] animate-fadeIn w-full h-full'
            key={spotifyPlayer.animationKey}
            style={{
              backgroundColor: spotifyPlayer.dominantColor || "transparent",
            }}
          />
        </>
      ) : (
        <div className='absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-sm bg-gray-900/50 w-full h-full'>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Cover;
