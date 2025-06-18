import React, { useState, useEffect, useRef, FC } from "react";
import useStore from "../store";

interface SliderUIProps {
  onPositionChange: (value: number) => void;
}

const SliderUI: FC<SliderUIProps> = ({ onPositionChange }) => {
  const { spotifyPlayer } = useStore();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPosition, setStartPosition] = useState<string>("-:--");
  const [endPosition, setEndPosition] = useState<string>("-:--");
  const slider = useRef<HTMLInputElement>(null);
  const sliderContainer = useRef<HTMLDivElement>(null);

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

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderContainer.current || !slider.current) return;

    const rect = sliderContainer.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const value = (x / width) * 100;
    const clampedValue = Math.max(0, Math.min(100, value));

    onPositionChange(clampedValue);
    setSliderBackground(clampedValue, 0, 100);
    if (slider.current) {
      slider.current.value = clampedValue.toString();
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseFloat(event.target.value);
    setSliderBackground(value, 0, 100);

    onPositionChange(value);
  };

  const handleMouseDown = (): void => {
    setIsDragging(true);
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
    const value = parseFloat(slider.current?.value || "0");
    onPositionChange(value);
  };

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

  // Update slider background
  useEffect(() => {
    setSliderBackground(spotifyPlayer.progress || 0, 0, 100);
  }, [spotifyPlayer.progress]);

  return (
    <div
      className='w-full cursor-default relative'
      ref={sliderContainer}
      onClick={handleClick}
    >
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
      <div className='flex justify-between w-full opacity-55 select-none'>
        <p className='text-xs font-light text-gray-300'>{startPosition}</p>
        <p className='text-xs font-light text-gray-300'>{endPosition}</p>
      </div>
    </div>
  );
};

export default SliderUI;
