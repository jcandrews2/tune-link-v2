import React, { FC } from "react";
import PauseIcon from "../images/pause.png";
import PlayIcon from "../images/play.png";
import useStore from "../store";

const PlayPause: FC = () => {
  const { spotifyPlayer } = useStore();

  const togglePlayback = (): void => {
    if (spotifyPlayer.isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const pause = (): void => {
    spotifyPlayer.player.pause().then(() => {
      console.log("Paused track!");
    });
  };

  const resume = (): void => {
    spotifyPlayer.player.resume().then(() => {
      console.log("Resumed track!");
    });
  };

  return (
    <div className='p-2' onClick={togglePlayback}>
      {!spotifyPlayer.isPaused ? (
        <img
          src={PauseIcon}
          alt='Pause'
          className='w-[3.75rem] h-auto transform active:scale-95'
        />
      ) : (
        <img
          src={PlayIcon}
          alt='Play'
          className='w-[3.75rem] h-auto transform active:scale-95'
        />
      )}
    </div>
  );
};

export default PlayPause;
