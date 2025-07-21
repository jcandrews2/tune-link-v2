import React, { useState, useEffect, useRef, FC } from "react";
import useStore from "../store";
import { setTrackPosition } from "../api/spotifyApi";

interface SliderUIProps {
  disabled?: boolean;
}

const SliderUI: FC<SliderUIProps> = ({ disabled = false }) => {
  const { spotifyPlayer, setSpotifyPlayer } = useStore();
  const [startPosition, setStartPosition] = useState<string>("-:--");
  const [endPosition, setEndPosition] = useState<string>("-:--");
  const slider = useRef<HTMLInputElement>(null);

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    if (disabled) return;
    const value = parseFloat(event.target.value);
    setSpotifyPlayer({
      progress: value,
      position: Math.round(
        (value / 100) * spotifyPlayer.currentTrack.duration_ms
      ),
    });
  }

  function setBackground(value: number, min: number, max: number) {
    const backgroundValue = ((value - min) / (max - min)) * 100;
    if (slider.current) {
      slider.current.style.background = `linear-gradient(to right, ${disabled ? "darkslategrey" : "white"} 0%, ${disabled ? "darkslategrey" : "white"} ${backgroundValue}%, darkslategrey ${backgroundValue}%, darkslategrey 100%)`;
    }
  }

  const handleMouseDown = (event: React.MouseEvent): void => {
    if (disabled) return;
    setSpotifyPlayer({ isDragging: true });
  };

  const handleMouseUp = (): void => {
    if (disabled) return;
    const position = Math.round(
      ((spotifyPlayer.progress || 0) / 100) *
        spotifyPlayer.currentTrack.duration_ms
    );

    setTrackPosition(position);
    setSpotifyPlayer({
      isDragging: false,
      position: position,
    });
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
    if (!spotifyPlayer.currentTrack) {
      return "-:--";
    }
    const remainingTimeMs =
      spotifyPlayer.currentTrack.duration_ms - (spotifyPlayer.position || 0);
    const remainingSeconds = Math.floor(remainingTimeMs / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.floor(remainingSeconds % 60);
    return `-${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    setBackground(spotifyPlayer.progress || 0, 0, 100);
  }, [spotifyPlayer.progress, spotifyPlayer.isDragging]);

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

  if (disabled) {
    return (
      <div className='w-full cursor-default relative'>
        <input
          type='range'
          step='0.01'
          min='0'
          max='100'
          value={0}
          disabled
          className='w-full appearance-none bg-transparent cursor-not-allowed
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
          style={{
            background:
              "linear-gradient(to right, darkslategrey 0%, darkslategrey 100%)",
          }}
        />
        <div className='flex justify-between w-full opacity-55 select-none'>
          <p className='text-xs font-light text-gray-300'>-:--</p>
          <p className='text-xs font-light text-gray-300'>-:--</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full cursor-default relative'>
      <input
        ref={slider}
        type='range'
        step='0.01'
        min='0'
        max='100'
        value={spotifyPlayer.progress || 0}
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
