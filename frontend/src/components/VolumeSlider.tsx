import React, { useEffect, useRef, FC } from "react";
import useStore from "../store";

interface VolumeSliderProps {
  disabled?: boolean;
  onVolumeChange?: (volume: number) => void;
  volume: number;
}

const VolumeSlider: FC<VolumeSliderProps> = ({
  disabled = false,
  onVolumeChange,
  volume,
}) => {
  const { spotifyPlayer } = useStore();
  const slider = useRef<HTMLInputElement>(null);

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    if (disabled) return;
    const value = parseFloat(event.target.value);
    if (spotifyPlayer.player) {
      spotifyPlayer.player.setVolume(value / 100);
    }
    onVolumeChange?.(value);
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

  useEffect(() => {
    setBackground(volume, 0, 100);
  }, [volume]);

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
    <div className='w-full cursor-default relative flex items-center'>
      <input
        ref={slider}
        type='range'
        step='1'
        min='0'
        max='100'
        value={disabled ? 0 : volume}
        onInput={handleInput}
        disabled={disabled}
        className={`${sliderBaseClasses} ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        style={{
          background: disabled
            ? "linear-gradient(to right, #111827 0%, #111827 100%)"
            : `linear-gradient(to right, white 0%, white 50%, #111827 50%, #111827 100%)`,
        }}
      />
    </div>
  );
};

export default VolumeSlider;
