import { useEffect, FC } from "react";
import useStore from "../store";

const SliderCore: FC = () => {
  const { spotifyPlayer, setSpotifyPlayer } = useStore();

  // Increment the progress of the slider every second
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (
      !spotifyPlayer.isPaused &&
      spotifyPlayer.currentTrack &&
      !spotifyPlayer.isDraggingSlider
    ) {
      interval = setInterval(() => {
        const currentProgress = spotifyPlayer.progress || 0;
        if (currentProgress >= 100) {
          setSpotifyPlayer({ progress: 0 });
          return;
        }

        const increment = 100 / (spotifyPlayer.currentTrack.duration_ms / 1000);
        const newProgress = Math.min(currentProgress + increment, 100);
        const newPosition =
          (newProgress / 100) * spotifyPlayer.currentTrack.duration_ms;

        setSpotifyPlayer({ progress: newProgress, position: newPosition });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    spotifyPlayer.isPaused,
    spotifyPlayer.currentTrack?.id,
    spotifyPlayer.progress,
    spotifyPlayer.isDraggingSlider,
  ]);

  return null;
};

export default SliderCore;
