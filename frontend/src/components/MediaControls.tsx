import React, { FC } from "react";
import useStore from "../store";
import LikeIcon from "../images/like.png";
import DislikeIcon from "../images/dislike.png";
import PlayIcon from "../images/play.png";
import PauseIcon from "../images/pause.png";
import { handleLike, handleDislike } from "../utils/userUtils";

interface MediaControlsProps {
  disabled?: boolean;
}

const MediaControls: FC<MediaControlsProps> = ({ disabled = false }) => {
  const { spotifyPlayer, user, setUser } = useStore();

  const onLike = () => {
    if (disabled) return;
    handleLike(spotifyPlayer, user, setUser);
  };

  const onDislike = () => {
    if (disabled) return;
    handleDislike(spotifyPlayer, user, setUser);
  };

  const togglePlayback = (): void => {
    if (disabled) return;
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

  const buttonClasses = `flex items-center justify-center ${
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  }`;
  const imageClasses = `w-full h-auto transform ${
    disabled ? "" : "active:scale-95"
  }`;

  return (
    <div className='container mx-auto'>
      <div className='z-0 flex items-center justify-center'>
        <button
          onClick={onDislike}
          className={buttonClasses}
          data-testid='dislike-button'
          disabled={disabled}
        >
          <img
            src={DislikeIcon}
            alt='Dislike'
            className={`${imageClasses} max-w-10`}
          />
        </button>
        <button
          className={buttonClasses}
          onClick={togglePlayback}
          disabled={disabled}
        >
          {!spotifyPlayer.isPaused ? (
            <img
              src={PauseIcon}
              alt='Pause'
              className={`${imageClasses} max-w-24 px-4`}
            />
          ) : (
            <img
              src={PlayIcon}
              alt='Play'
              className={`${imageClasses} max-w-24 px-4`}
            />
          )}
        </button>
        <button
          onClick={onLike}
          className={buttonClasses}
          data-testid='like-button'
          disabled={disabled}
        >
          <img
            src={LikeIcon}
            alt='Like'
            className={`${imageClasses} max-w-10`}
          />
        </button>
      </div>
    </div>
  );
};

export default MediaControls;
