import React, { useEffect, FC } from "react";
import useStore from "../store";

const SliderCore: FC = () => {
  const { spotifyPlayer, setSpotifyPlayer } = useStore();

  useEffect(() => {
    const progress = spotifyPlayer.progress || 0;

    if (progress >= 100) {
      setSpotifyPlayer({ progress: 0 });
      return;
    }

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

  return null;
};

export default SliderCore;
