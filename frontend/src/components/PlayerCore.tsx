import React, { useEffect, FC, useRef } from "react";
import useStore from "../store";
import { endpoints } from "../config/endpoints";
import { transferPlayback, playTracks } from "../api/spotifyApi";
import PlayerUI from "./PlayerUI";
import SliderCore from "./SliderCore";

const PlayerCore: FC = () => {
  const { user, spotifyPlayer, setSpotifyPlayer } = useStore();
  const playerInitialized = useRef(false);
  const previousTrackId = useRef<string | null>(null);

  // Initialize Spotify Player
  useEffect(() => {
    if (playerInitialized.current || user.userId === "") {
      return;
    }

    playerInitialized.current = true;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Vibesbased",
        getOAuthToken: (cb: (token: string) => void) => {
          if (user.spotifyAccessToken) {
            cb(user.spotifyAccessToken);
          } else {
            console.error("No token available in user state.");
          }
        },
        volume: 0.5,
      });

      setSpotifyPlayer({ player });

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        setSpotifyPlayer({ deviceID: device_id });
        transferPlayback(device_id);
      });

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
          reconnectPlayer();
        }
      );

      player.addListener("player_state_changed", (state: any) => {
        if (!state) {
          return;
        }

        // Check if the track has changed
        const newTrackId = state.track_window.current_track.id;
        if (newTrackId !== previousTrackId.current) {
          previousTrackId.current = newTrackId;

          setSpotifyPlayer({
            currentTrack: state.track_window.current_track,
            nextTrack: state.track_window.next_tracks[0],
            isPaused: state.paused,
            position: state.position,
            isActive: true,
            progress: 0,
          });
        } else {
          setSpotifyPlayer({
            currentTrack: state.track_window.current_track,
            nextTrack: state.track_window.next_tracks[0],
            isPaused: state.paused,
            position: state.position,
            isActive: true,
          });
        }
      });

      player.addListener(
        "initialization_error",
        ({ message }: { message: string }) => {
          console.error("Failed to initialize:", message);
          reconnectPlayer();
        }
      );

      player.addListener(
        "authentication_error",
        ({ message }: { message: string }) => {
          console.error("Failed to authenticate:", message);
          window.location.href = endpoints.auth.login;
        }
      );

      player.addListener(
        "account_error",
        ({ message }: { message: string }) => {
          console.error("Failed to validate Spotify account:", message);
        }
      );

      player.addListener(
        "playback_error",
        ({ message }: { message: string }) => {
          console.error("Failed to perform playback:", message);
          reconnectPlayer();
        }
      );

      player.connect().then((success: boolean) => {
        if (success) {
          console.log("Successfully connected to Spotify!");
        }
      });
    };

    return () => {
      if (spotifyPlayer.player) {
        spotifyPlayer.player.disconnect();
      }
    };
  }, [user.userId]);

  // Check if the user has no recommended songs
  useEffect(() => {
    if (!spotifyPlayer.player) return;

    if (user.recommendedSongs.length === 0) {
      spotifyPlayer.player.pause();
      setSpotifyPlayer({
        currentTrack: null,
        isPaused: true,
        isActive: false,
      });
    }
  }, [user.recommendedSongs, spotifyPlayer.player]);

  const reconnectPlayer = async () => {
    if (spotifyPlayer.player) {
      try {
        const connected = await spotifyPlayer.player.connect();
        if (connected) {
          console.log("Successfully reconnected to Spotify!");
          if (spotifyPlayer.deviceID) {
            transferPlayback(spotifyPlayer.deviceID);
          }
        }
      } catch (error) {
        console.error("Failed to reconnect:", error);
      }
    }
  };

  useEffect(() => {
    const playRecommendations = async () => {
      try {
        if (!spotifyPlayer.deviceID) {
          console.error("No device ID available");
          return;
        }

        // Create array of properly formatted Spotify URIs
        const spotifyUris = user.recommendedSongs.map(
          (track) => `spotify:track:${track.spotifyId}`
        );

        await playTracks(spotifyPlayer.deviceID, spotifyUris);
      } catch (err) {
        console.error("Error starting playback:", {
          error: err,
          recommendedSongs: user.recommendedSongs,
        });
      }
    };

    if (user.recommendedSongs?.length > 0) {
      console.log("Playing recommendations", user.recommendedSongs);
      playRecommendations();
    }
  }, [
    user.recommendedSongs,
    spotifyPlayer.deviceID,
    spotifyPlayer.player,
    user.spotifyAccessToken,
  ]);

  return (
    <>
      <SliderCore />
      <PlayerUI />
    </>
  );
};

export default PlayerCore;
