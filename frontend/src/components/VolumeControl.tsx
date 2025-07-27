import React, { FC, useState } from "react";
import {
  IoVolumeMediumOutline,
  IoVolumeHighOutline,
  IoVolumeLowOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";
import useStore from "../store";
import VolumeSlider from "./VolumeSlider";

const VolumeControl: FC = () => {
  const { spotifyPlayer } = useStore();
  const [volume, setVolume] = useState(50);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  const VolumeIcon = () => {
    if (isMuted || volume === 0)
      return <IoVolumeMuteOutline className='w-8 h-auto text-white' />;
    if (volume < 30)
      return <IoVolumeLowOutline className='w-8 h-auto text-white' />;
    if (volume < 70)
      return <IoVolumeMediumOutline className='w-8 h-auto text-white' />;
    return <IoVolumeHighOutline className='w-8 h-auto text-white' />;
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(false);
    setPreviousVolume(newVolume);
  };

  const toggleMute = () => {
    if (!spotifyPlayer.player) return;

    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
      spotifyPlayer.player.setVolume(previousVolume / 100);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
      spotifyPlayer.player.setVolume(0);
    }
  };

  return (
    <div className='hidden md:flex items-center justify-center gap-2'>
      <button
        onClick={toggleMute}
        className='active:scale-95'
        disabled={!spotifyPlayer.player}
      >
        <VolumeIcon />
      </button>
      <div className='w-28'>
        <VolumeSlider
          disabled={!spotifyPlayer.player}
          onVolumeChange={handleVolumeChange}
          volume={volume}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
