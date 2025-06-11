import React, { useState, useEffect, useRef, FC } from "react";
import useStore from "../store";
import axios from "axios";

interface Track {
  id: string;
  duration_ms: number;
}

interface SpotifyPlayer {
  currentTrack: Track | null;
  isPaused: boolean;
  position: number;
}

interface Token {
  value: string;
}

interface Store {
  spotifyPlayer: SpotifyPlayer;
  setSpotifyPlayer: (player: Partial<SpotifyPlayer>) => void;
  token: Token;
}

const Slider: FC = () => {
  const { spotifyPlayer, setSpotifyPlayer, token } = useStore() as Store;
  const [progress, setProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const slider = useRef<HTMLInputElement>(null);

  const setTrackPosition = async (position: number): Promise<void> => {
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/seek?position_ms=${position}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
      console.log("Set track position!");
    } catch (error) {
      console.error("Error setting track position", error);
    }
  };

  const setBackground = (value: number, min: number, max: number): void => {
    const backgroundValue = ((value - min) / (max - min)) * 100;
    if (slider.current) {
      slider.current.style.background = `linear-gradient(to right, white 0%, white ${backgroundValue}%, darkslategrey ${backgroundValue}%, darkslategrey 100%)`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseFloat(event.target.value);
    setProgress(value);

    if (!spotifyPlayer.isPaused && !isDragging && spotifyPlayer.currentTrack) {
      const position = Math.round(
        (value / 100) * spotifyPlayer.currentTrack.duration_ms
      );
      setTrackPosition(position);
    }
  };

  const handleMouseDown = (): void => {
    setIsDragging(true);
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);

    if (spotifyPlayer.currentTrack) {
      const position = Math.round(
        (progress / 100) * spotifyPlayer.currentTrack.duration_ms
      );
      setTrackPosition(position);
    }
  };

  useEffect(() => {
    if (!spotifyPlayer.currentTrack) {
      return;
    }
    setProgress(0);
  }, [spotifyPlayer.currentTrack?.id]);

  const incrementSlider = (): void => {
    if (!isDragging && spotifyPlayer.currentTrack) {
      const increment = 100 / (spotifyPlayer.currentTrack.duration_ms / 1000);
      setProgress((prev) => Math.min(prev + increment, 100));
    }
  };

  useEffect(() => {
    if (progress === 100) {
      setProgress(0);
    }
    setBackground(progress, 0, 100);

    if (!spotifyPlayer.currentTrack) {
      return;
    }

    const position =
      (progress / 100) * (spotifyPlayer.currentTrack.duration_ms / 1000);
    setSpotifyPlayer({ position: position });
  }, [progress]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!spotifyPlayer.isPaused) {
      interval = setInterval(() => {
        incrementSlider();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [spotifyPlayer.isPaused, spotifyPlayer.currentTrack?.id]);

  return (
    <>
      <input
        ref={slider}
        type="range"
        step="0.01"
        min="0"
        max="100"
        value={progress}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onChange={handleInput}
      />
    </>
  );
};

export default Slider;
