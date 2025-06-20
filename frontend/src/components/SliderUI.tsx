import React, { useState, useEffect, useRef, FC } from "react";
import useStore from "../store";
import { setTrackPosition } from "../api/spotifyApi";

const SliderUI: FC = () => {
  const { spotifyPlayer, setSpotifyPlayer } = useStore();
  const [startPosition, setStartPosition] = useState<string>("-:--");
  const [endPosition, setEndPosition] = useState<string>("-:--");
  const slider = useRef<HTMLInputElement>(null);

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    console.log("handleChange", event.target.value);
    const value = parseFloat(event.target.value);
    setSpotifyPlayer({ progress: value });

    if (!spotifyPlayer.isDragging) {
      const position = Math.round(
        (value / 100) * spotifyPlayer.currentTrack.duration_ms
      );
      setTrackPosition(position);
    }
  }

  function setBackground(value: number, min: number, max: number) {
    const backgroundValue = ((value - min) / (max - min)) * 100;
    if (slider.current) {
      slider.current.style.background = `linear-gradient(to right, white 0%, white ${backgroundValue}%, darkslategrey ${backgroundValue}%, darkslategrey 100%)`;
    }
  }

  const handleMouseDown = (event: React.MouseEvent): void => {
    setSpotifyPlayer({ isDragging: true });
  };

  const handleMouseUp = (): void => {
    setSpotifyPlayer({ isDragging: false });

    const position = Math.round(
      ((spotifyPlayer.progress || 0) / 100) *
        spotifyPlayer.currentTrack.duration_ms
    );
    setTrackPosition(position);
    setSpotifyPlayer({ progress: spotifyPlayer.progress });
  };

  const formatStartPosition = (): string => {
    if (typeof spotifyPlayer.position !== "number") {
      return "-:--";
    }
    const positionInSeconds = Math.floor(spotifyPlayer.position / 1000);
    const minutes = Math.floor(positionInSeconds / 60);
    const seconds = Math.floor(positionInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatEndPosition = (): string => {
    if (
      !spotifyPlayer.currentTrack ||
      typeof spotifyPlayer.position !== "number"
    ) {
      return "-0:00";
    }

    const remainingTimeInSeconds = Math.floor(
      (spotifyPlayer.currentTrack.duration_ms - spotifyPlayer.position) / 1000
    );
    const minutes = Math.floor(remainingTimeInSeconds / 60);
    const seconds = Math.floor(remainingTimeInSeconds % 60);
    return `-${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Update the background of the slider
  useEffect(() => {
    setBackground(spotifyPlayer.progress || 0, 0, 100);
  }, [spotifyPlayer.progress]);

  // Update track time displays
  useEffect(() => {
    if (!spotifyPlayer.currentTrack) {
      return;
    }

    console.log("spotifyPlayer.position", spotifyPlayer.position);
    const formattedStartPosition = formatStartPosition();
    const formattedEndPosition = formatEndPosition();
    setStartPosition(formattedStartPosition);
    setEndPosition(formattedEndPosition);
  }, [spotifyPlayer.position]);

  return (
    <div className='w-full cursor-default relative'>
      <input
        ref={slider}
        type='range'
        step='0.01'
        min='0'
        max='100'
        value={spotifyPlayer.progress}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onInput={handleInput}
        className='w-full appearance-none bg-transparent cursor-pointer
          [&::-webkit-slider-runnable-track]:w-full 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:h-3 
          [&::-webkit-slider-thumb]:w-3 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-white 
          [&::-webkit-slider-thumb]:mt-[-4px] 
          [&::-webkit-slider-runnable-track]:h-1 
          [&::-webkit-slider-runnable-track]:rounded-full
          [&::-webkit-slider-runnable-track]:rounded-full
          [&::-moz-range-track]:w-full
          [&::-moz-range-track]:rounded-full'
      />
      <div className='flex justify-between w-full opacity-55 select-none'>
        <p className='text-xs font-light text-gray-300'>{startPosition}</p>
        <p className='text-xs font-light text-gray-300'>{endPosition}</p>
      </div>
    </div>
  );
};

export default SliderUI;
