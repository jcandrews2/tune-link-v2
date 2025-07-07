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
    <div className='relative w-[18.75rem] h-[18.75rem] left-1/2 -translate-x-1/2 p-[1.875rem] z-0 select-none'>
      {spotifyPlayer.isActive ? (
        <>
          <img
            src={spotifyPlayer.currentTrack?.album.images[0].url}
            className='absolute z-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-sm'
            alt='Cover'
            height={300}
            width={300}
            onLoad={handleGetImageColor}
          />
          <div
            className='absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-[25px] blur-[50px] fade-in'
            key={spotifyPlayer.animationKey}
            style={{
              width: "300px",
              height: "300px",
              backgroundColor: spotifyPlayer.dominantColor || "transparent",
            }}
          />
        </>
      ) : (
        <div className='absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-[25px] bg-gray-800 w-[300px] h-[300px]'>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Cover;
