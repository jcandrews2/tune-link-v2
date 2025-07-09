import React, { useState, useEffect, useRef, FC } from "react";
import useStore from "../store";
import { setTrackPosition } from "../api/spotifyApi";

const Slider: FC = () => {
  const { spotifyPlayer, setSpotifyPlayer } = useStore();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPosition, setStartPosition] = useState<string>("-:--");
  const [endPosition, setEndPosition] = useState<string>("-:--");
  const slider = useRef<HTMLInputElement>(null);

  const setSliderBackground = (
    value: number,
    min: number,
    max: number
  ): void => {
    const backgroundValue = ((value - min) / (max - min)) * 100;
    if (slider.current) {
      slider.current.style.background = `linear-gradient(to right, white 0%, white ${backgroundValue}%, darkslategrey ${backgroundValue}%, darkslategrey 100%)`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseFloat(event.target.value);
    setSpotifyPlayer({ progress: value });

    if (!spotifyPlayer.isPaused && !isDragging && spotifyPlayer.currentTrack) {
      const position = Math.round(
        (value / 100) * spotifyPlayer.currentTrack.duration_ms
      );
      setTrackPosition(position);
    }
  };

  const handleMouseDown = (): void => {
    setIsDragging(true);
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);

    if (spotifyPlayer.currentTrack) {
      const position = Math.round(
        ((spotifyPlayer.progress || 0) / 100) *
          spotifyPlayer.currentTrack.duration_ms
      );
      setTrackPosition(position);
    }
  };

  useEffect(() => {
    const progress = spotifyPlayer.progress || 0;

    if (progress >= 100) {
      setSpotifyPlayer({ progress: 0 });
      return;
    }

    setSliderBackground(progress, 0, 100);

    if (!spotifyPlayer.currentTrack) {
      return;
    }

    const position =
      (progress / 100) * (spotifyPlayer.currentTrack.duration_ms / 1000);
    setSpotifyPlayer({ position: position });
  }, [spotifyPlayer.progress]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (!spotifyPlayer.isPaused && spotifyPlayer.currentTrack) {
      interval = setInterval(() => {
        const currentProgress = spotifyPlayer.progress || 0;
        if (currentProgress >= 100) {
          setSpotifyPlayer({ progress: 0 });
          return;
        }

        const increment = 100 / (spotifyPlayer.currentTrack.duration_ms / 1000);
        const newProgress = Math.min(currentProgress + increment, 100);

        setSpotifyPlayer({ progress: newProgress });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    spotifyPlayer.isPaused,
    spotifyPlayer.currentTrack?.id,
    spotifyPlayer.progress,
  ]);

  // Track time formatting functions
  const formatStartPosition = (): string => {
    if (typeof spotifyPlayer.position !== "number") {
      return "-:--";
    }
    const minutes = Math.floor(spotifyPlayer.position / 60);
    const seconds = Math.floor(spotifyPlayer.position % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatEndPosition = (): string => {
    if (
      !spotifyPlayer.currentTrack ||
      typeof spotifyPlayer.position !== "number"
    ) {
      return "-0:00";
    }

    const remainingTime =
      spotifyPlayer.currentTrack.duration_ms / 1000 - spotifyPlayer.position;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60);
    return `-${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Update track time displays
  useEffect(() => {
    if (
      !spotifyPlayer.currentTrack ||
      typeof spotifyPlayer.position !== "number"
    ) {
      return;
    }

    const formattedStartPosition = formatStartPosition();
    const formattedEndPosition = formatEndPosition();

    setStartPosition(formattedStartPosition);
    setEndPosition(formattedEndPosition);
  }, [spotifyPlayer.position]);

  return (
    <div className='w-full'>
      <div className='cursor-pointer w-full'>
        <input
          ref={slider}
          type='range'
          step='0.01'
          min='0'
          max='100'
          value={spotifyPlayer.progress || 0}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onChange={handleInput}
          className='w-full appearance-none bg-transparent 
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
      </div>
      <div className='flex justify-between w-full opacity-55 select-none'>
        <p className='text-xs font-light text-gray-300'>{startPosition}</p>
        <p className='text-xs font-light text-gray-300'>{endPosition}</p>
      </div>
    </div>
  );
};

export default Slider;
