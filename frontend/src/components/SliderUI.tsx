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

  const setBackground = (value: number, min: number, max: number) => {
    const backgroundValue = ((value - min) / (max - min)) * 100;
    if (slider.current) {
      slider.current.style.background = `linear-gradient(to right, ${
        disabled ? "#111827" : "white"
      } 0%, ${disabled ? "#111827" : "white"} ${backgroundValue}%,
      #111827 ${backgroundValue}%, #111827 100%)`;
    }
  };

  const handleMouseDown = (): void => {
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
      position,
    });
  };

  const formatStartPosition = (): string => {
    if (typeof spotifyPlayer.position !== "number") return "-:--";
    const seconds = Math.floor(spotifyPlayer.position / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  const formatEndPosition = (): string => {
    if (!spotifyPlayer.currentTrack) return "-:--";
    const remainingMs =
      spotifyPlayer.currentTrack.duration_ms - (spotifyPlayer.position || 0);
    const seconds = Math.floor(remainingMs / 1000);
    const minutes = Math.floor(seconds / 60);
    return `-${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (
      !spotifyPlayer.currentTrack?.duration_ms ||
      typeof spotifyPlayer.progress !== "number"
    )
      return;
    setBackground(spotifyPlayer.progress, 0, 100);
  }, [spotifyPlayer.progress, spotifyPlayer.currentTrack?.duration_ms]);

  useEffect(() => {
    if (
      !spotifyPlayer.currentTrack ||
      typeof spotifyPlayer.position !== "number"
    ) {
      return;
    }
    setStartPosition(formatStartPosition());
    setEndPosition(formatEndPosition());
  }, [spotifyPlayer.position, spotifyPlayer.currentTrack?.id]);

  const sliderBaseClasses = `
    w-full appearance-none bg-transparent
    [&::-webkit-slider-runnable-track]:w-full 
    [&::-webkit-slider-thumb]:appearance-none 
    [&::-webkit-slider-thumb]:h-3 
    [&::-webkit-slider-thumb]:w-3 
    [&::-webkit-slider-thumb]:rounded-full 
    [&::-webkit-slider-thumb]:bg-white 
    [&::-webkit-slider-thumb]:mt-[-4px] 
    [&::-webkit-slider-runnable-track]:h-1 
    [&::-webkit-slider-runnable-track]:rounded-full 
    [&::-moz-range-track]:w-full 
    [&::-moz-range-track]:rounded-full
  `;

  return (
    <div className='w-full cursor-default relative'>
      <input
        ref={slider}
        type='range'
        step='0.01'
        min='0'
        max='100'
        value={disabled ? 0 : spotifyPlayer.progress || 0}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (disabled) return;
          setSpotifyPlayer({ isDraggingSlider: true });
          handleMouseDown();
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          if (disabled) return;
          setSpotifyPlayer({ isDraggingSlider: false });
          handleMouseUp();
        }}
        onInput={handleInput}
        disabled={disabled}
        className={`${sliderBaseClasses} ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        style={{
          background: disabled
            ? "linear-gradient(to right, #111827 0%, #111827 100%)"
            : "linear-gradient(to right, white 0%, #111827 0%, #111827 100%)",
        }}
      />
      <div className='flex justify-between w-full opacity-55 select-none'>
        <p className='text-xs font-light text-gray-400'>
          {disabled ? "-:--" : startPosition}
        </p>
        <p className='text-xs font-light text-gray-400'>
          {disabled ? "-:--" : endPosition}
        </p>
      </div>
    </div>
  );
};

export default SliderUI;
