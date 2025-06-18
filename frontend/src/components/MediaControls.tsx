import React, { FC } from "react";
import useStore from "../store";
import LikeIcon from "../images/like.png";
import DislikeIcon from "../images/dislike.png";
import PlayIcon from "../images/play.png";
import PauseIcon from "../images/pause.png";
import { handleLike, handleDislike } from "../utils/userUtils";

const MediaControls: FC = () => {
  const { spotifyPlayer, user, setUser } = useStore();

  const onLike = () => handleLike(spotifyPlayer, user, setUser);
  const onDislike = () => handleDislike(spotifyPlayer, user, setUser);

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
    <div className='z-0 flex items-center justify-center w-full'>
      <button
        onClick={onDislike}
        className='flex items-center justify-center'
        data-testid='dislike-button'
      >
        <img
          src={DislikeIcon}
          alt='Dislike'
          className='w-full h-auto transform active:scale-95 max-w-10'
        />
      </button>
      <button
        className='flex items-center justify-center'
        onClick={togglePlayback}
      >
        {!spotifyPlayer.isPaused ? (
          <img
            src={PauseIcon}
            alt='Pause'
            className='w-full h-auto transform active:scale-95 max-w-24 px-4'
          />
        ) : (
          <img
            src={PlayIcon}
            alt='Play'
            className='w-full h-auto transform active:scale-95 max-w-24 px-4'
          />
        )}
      </button>
      <button
        onClick={onLike}
        className='flex items-center justify-center'
        data-testid='like-button'
      >
        <img
          src={LikeIcon}
          alt='Like'
          className='w-full h-auto transform active:scale-95 max-w-10'
        />
      </button>
    </div>
  );
};

export default MediaControls;
