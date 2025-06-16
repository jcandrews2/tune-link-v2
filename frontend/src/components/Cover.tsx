import React, { useEffect, useState, FC } from "react";
import Loading from "./Loading";
import useStore from "../store";
import { getDominantColor } from "../utils/playerUtils";

const Cover: FC = () => {
  const { spotifyPlayer } = useStore();
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState<number>(0);

  const handleImageLoad = async (): Promise<void> => {
    const color = await getDominantColor();
    if (color) {
      setDominantColor(color);
      setAnimationKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <div className='relative w-[18.75rem] h-[18.75rem] left-1/2 -translate-x-1/2 p-[1.875rem] z-0 select-none'>
      {spotifyPlayer.isActive ? (
        <>
          <img
            src={spotifyPlayer.currentTrack?.album.images[0].url}
            className='absolute z-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2'
            alt='Cover'
            height={300}
            width={300}
            onLoad={handleImageLoad}
          />
          <div
            className='absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-[25px] blur-[50px] fade-in'
            key={animationKey}
            style={{
              width: "300px",
              height: "300px",
              backgroundColor: dominantColor || "transparent",
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
