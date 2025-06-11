import React, { useEffect, useState } from "react";
import useStore from "../store";

interface SpotifyPlayer {
  position: number;
  currentTrack: {
    duration_ms: number;
  } | null;
}

interface Store {
  spotifyPlayer: SpotifyPlayer;
}

const TrackTime: React.FC = () => {
  const { spotifyPlayer } = useStore() as Store;
  const [startPosition, setStartPosition] = useState<string>("0:00");
  const [endPosition, setEndPosition] = useState<string>("0:00");

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
    <div className="Track-time-container">
      <div className="flex justify-between w-[300px] pt-[0.375rem] opacity-55 select-none">
        <p className="text-xs font-light text-gray-300">{startPosition}</p>
        <p className="text-xs font-light text-gray-300">{endPosition}</p>
      </div>
    </div>
  );
};

export default TrackTime;
