import React, { FC, useEffect, useState } from "react";
import useStore from "../store";

const TrackTime: FC = () => {
  const { spotifyPlayer } = useStore();
  const [startPosition, setStartPosition] = useState<string>("-:--");
  const [endPosition, setEndPosition] = useState<string>("-:--");

  useEffect(() => {
    if (!spotifyPlayer.currentTrack) {
      return;
    }

    const formattedStartPosition = formatStartPosition();
    const formattedEndPosition = formatEndPosition();

    setStartPosition(formattedStartPosition);
    setEndPosition(formattedEndPosition);
  }, [spotifyPlayer.position]);

  const formatStartPosition = (): string => {
    const minutes = Math.floor(spotifyPlayer.position / 60);
    const seconds = Math.floor(spotifyPlayer.position % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatEndPosition = (): string => {
    if (!spotifyPlayer.currentTrack) return "-0:00";

    const remainingTime =
      spotifyPlayer.currentTrack.duration_ms / 1000 - spotifyPlayer.position;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60);
    return `-${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className='Track-time-container w-full'>
      <div className='flex justify-between w-full pt-[0.375rem] opacity-55 select-none'>
        <p className='text-xs font-light text-gray-300'>{startPosition}</p>
        <p className='text-xs font-light text-gray-300'>{endPosition}</p>
      </div>
    </div>
  );
};

export default TrackTime;
