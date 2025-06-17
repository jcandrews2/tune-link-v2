import React, { useEffect, FC, useRef } from "react";
import PlayPause from "./PlayPause";
import Cover from "./Cover";
import Slider from "./Slider";
import TrackTime from "./TrackTime";
import useStore from "../store";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import LikeIcon from "../images/like.png";
import DislikeIcon from "../images/dislike.png";
import { endpoints } from "../config/endpoints";
import { transferPlayback, playTracks } from "../api/spotifyApi";
import { dislikeTrack, likeTrack } from "../api/userApi";

const Player: FC = () => {
  const { user, spotifyPlayer, setSpotifyPlayer, setUser } = useStore();
  const playerInitialized = useRef(false);

  // Player card animation
  const [{ x, y, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    config: { tension: 300, friction: 20 },
  }));

  const handleLike = async (): Promise<void> => {
    console.log("handleLike");
    if (
      !spotifyPlayer.currentTrack ||
      !spotifyPlayer.player ||
      user.recommendedSongs.length === 0
    ) {
      console.error("No current track, player, or recommended songs available");
      return;
    }

    try {
      const likedSong = user.recommendedSongs[0];

      setUser({
        recommendedSongs: user.recommendedSongs.slice(1),
      });

      await spotifyPlayer.player.nextTrack();

      likeTrack(user.userId, likedSong);
    } catch (error) {
      console.error("Error in handleLike:", error);
    }
  };

  const handleDislike = async (): Promise<void> => {
    console.log("handleDislike");
    if (
      !spotifyPlayer.currentTrack ||
      !spotifyPlayer.player ||
      user.recommendedSongs.length === 0
    ) {
      console.error("No current track, player, or recommended songs available");
      return;
    }

    try {
      const dislikedSong = user.recommendedSongs[0];

      setUser({
        recommendedSongs: user.recommendedSongs.slice(1),
      });

      await spotifyPlayer.player.nextTrack();

      dislikeTrack(user.userId, dislikedSong);
    } catch (error) {
      console.error("Error in handleDislike:", error);
    }
  };

  const bind = useDrag(
    async ({ active, movement: [mx], direction: [xDir], cancel, tap }) => {
      if (tap) return;

      const trigger = Math.abs(mx) > 150;
      const isRight = mx > 0;

      if (active && trigger) {
        cancel();
        if (isRight) {
          await handleLike();
        } else {
          await handleDislike();
        }
      }

      api.start({
        x: active ? mx : 0,
        rotate: active ? mx / 20 : 0,
        scale: active ? 1.05 : 1,
        immediate: active,
        config: { tension: 300, friction: active ? 10 : 20 },
      });
    },
    {
      from: () => [x.get(), 0],
      filterTaps: true,
      bounds: { left: -200, right: 200, top: 0, bottom: 0 },
      rubberband: true,
    }
  );

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
        name: "tune link",
        getOAuthToken: (cb: (token: string) => void) => {
          if (user.spotifyAccessToken) {
            cb(user.spotifyAccessToken);
          } else {
            console.error("No token available in user state.");
          }
        },
        volume: 0.01,
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

        setSpotifyPlayer({
          currentTrack: state.track_window.current_track,
          isPaused: state.paused,
          position: state.position,
          isActive: true,
        });
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

  // Handle empty recommended songs
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

        console.log("Attempting to play with data:", {
          deviceId: spotifyPlayer.deviceID,
          spotifyUris,
          firstSong: user.recommendedSongs[0],
        });

        await playTracks(spotifyPlayer.deviceID, spotifyUris);
      } catch (err) {
        console.error("Error starting playback:", {
          error: err,
          recommendedSongs: user.recommendedSongs,
        });
      }
    };

    console.log("useEffect for recommendations triggered", {
      deviceId: spotifyPlayer.deviceID,
      recommendedSongsLength: user.recommendedSongs?.length,
      hasPlayer: !!spotifyPlayer.player,
      hasToken: !!user.spotifyAccessToken,
    });

    if (user.recommendedSongs?.length > 0) {
      console.log("Playing recommendations");
      playRecommendations();
    }
  }, [
    user.recommendedSongs,
    spotifyPlayer.deviceID,
    spotifyPlayer.player,
    user.spotifyAccessToken,
  ]);

  // Only render player if we have recommended songs
  if (user.recommendedSongs.length === 0) {
    return (
      <div className='mx-auto select-none'>
        <div className='border border-gray-700 rounded-lg p-8 bg-[#121212] text-center text-gray-400'>
          No more songs in queue.
          <br />
          Try getting new recommendations!
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='mx-auto select-none'>
        <animated.div
          {...bind()}
          style={{
            x,
            y,
            rotate,
            scale,
            touchAction: "none",
            position: "relative",
            backgroundColor: x.to((x: number) =>
              x > 0
                ? `rgba(74, 222, 128, ${Math.min(Math.abs(x) / 100, 0.4)})`
                : `rgba(248, 113, 113, ${Math.min(Math.abs(x) / 100, 0.4)})`
            ),
          }}
          className='border border-gray-700 rounded-lg p-8 bg-[#121212] cursor-grab active:cursor-grabbing select-none'
        >
          <div className='relative z-10 select-none [&_*]:select-none [&_img]:pointer-events-none [&_img]:select-none'>
            <Cover />
            {spotifyPlayer.currentTrack && (
              <div className='relative py-2 z-10 text-left'>
                <h2 className='text-xl font-bold text-white'>
                  {spotifyPlayer.currentTrack.name}
                </h2>
                <h3 className='font-light text-gray-300'>
                  {spotifyPlayer.currentTrack.artists[0].name}
                </h3>
              </div>
            )}
            <div className='flex flex-col items-start w-full  py-2'>
              <Slider />
              <TrackTime />
            </div>
            <div className='z-0 flex items-center justify-center'>
              <button
                onClick={handleDislike}
                className='Dislike-container'
                data-testid='dislike-button'
              >
                <img
                  src={DislikeIcon}
                  alt='Dislike'
                  className='w-[2.25rem] h-auto transform active:scale-95'
                />
              </button>
              <PlayPause />
              <button
                onClick={handleLike}
                className='Like-container'
                data-testid='like-button'
              >
                <img
                  src={LikeIcon}
                  alt='Like'
                  className='w-[2.25rem] h-auto transform active:scale-95'
                />
              </button>
            </div>
          </div>
        </animated.div>
      </div>
    </>
  );
};

export default Player;
