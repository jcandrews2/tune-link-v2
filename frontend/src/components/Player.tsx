import React, { useEffect, FC } from "react";
import PlayPause from "./PlayPause";
import Cover from "./Cover";
import Loading from "./Loading";
import Slider from "./Slider";
import TrackTime from "./TrackTime";
import useStore from "../store";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import LikeIcon from "../images/like.png";
import DislikeIcon from "../images/dislike.png";
import { endpoints } from "../config/endpoints";
import { transferPlayback } from "../api/spotifyApi";
import { saveTrack } from "../api/userApi";

declare global {
  interface Window {
    Spotify: {
      Player: new (config: any) => any;
    };
    player: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

const Player: FC = () => {
  const { token, user, spotifyPlayer, setSpotifyPlayer, setUser } = useStore();

  // Add spring animation
  const [{ x, y, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    config: { tension: 300, friction: 20 },
  }));

  const handleLike = async (): Promise<void> => {
    console.log("handleLike");
    if (!user.token?.value) return;
    await saveTrack(true, user, setUser, spotifyPlayer, setSpotifyPlayer);
  };

  const handleDislike = async (): Promise<void> => {
    console.log("handleDislike");
    if (!user.token?.value) return;
    await saveTrack(false, user, setUser, spotifyPlayer, setSpotifyPlayer);
  };

  // Add swipe gesture handler
  const bind = useDrag(
    async ({ active, movement: [mx], direction: [xDir], cancel, tap }) => {
      if (tap) return;

      // Calculate values
      const trigger = Math.abs(mx) > 100;
      const isRight = mx > 0;

      if (active && trigger && user.token?.value) {
        // If we've dragged far enough and we have a valid token, trigger like/dislike
        if (isRight) {
          await handleLike();
        } else {
          await handleDislike();
        }
        cancel();
      }

      // Animate Player Card
      api.start({
        x: active ? mx : 0,
        rotate: active ? mx / 20 : 0,
        scale: active ? 1.05 : 1,
        immediate: active,
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
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "tune link",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token.value);
        },
        volume: 0.5,
      });

      setSpotifyPlayer({ player });

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        setSpotifyPlayer({ deviceID: device_id });
        transferPlayback(token, device_id);
      });

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
          // Try to reconnect when device goes offline
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

      // Add error handling
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
          // Attempt to refresh the token
          refreshToken();
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
      // Cleanup function to disconnect player when component unmounts
      if (spotifyPlayer.player) {
        spotifyPlayer.player.disconnect();
      }
    };
  }, []);

  const reconnectPlayer = async () => {
    if (spotifyPlayer.player) {
      try {
        const connected = await spotifyPlayer.player.connect();
        if (connected) {
          console.log("Successfully reconnected to Spotify!");
          if (spotifyPlayer.deviceID) {
            transferPlayback(token, spotifyPlayer.deviceID);
          }
        }
      } catch (error) {
        console.error("Failed to reconnect:", error);
      }
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(endpoints.auth.token);
      const data = await response.json();
      if (data.access_token) {
        setSpotifyPlayer({ player: null }); // Reset player
        window.onSpotifyWebPlaybackSDKReady(); // Reinitialize with new token
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  };

  return (
    <>
      {spotifyPlayer.areRecommendationsLoading &&
      user.recommendedSongs.length <= 1 ? (
        <Loading />
      ) : (
        <div className='fixed-width-container w-[400px] min-w-[400px] flex-shrink-0 mx-auto select-none'>
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
            className='border border-gray-700 rounded-lg p-4 bg-[#121212] cursor-grab active:cursor-grabbing select-none'
          >
            <div className='relative z-10 select-none [&_*]:select-none [&_img]:pointer-events-none [&_img]:select-none'>
              <Cover />
              {spotifyPlayer.currentTrack && (
                <div className='relative p-[0.64rem] z-10'>
                  <h2 className='text-xl font-bold text-white'>
                    {spotifyPlayer.currentTrack.name}
                  </h2>
                  <h3 className='font-light text-gray-300'>
                    {spotifyPlayer.currentTrack.artists[0].name}
                  </h3>
                </div>
              )}
              <div className='flex flex-col items-center p-[0.64rem]'>
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
              {user.recommendedSongs.length === 1 && (
                <div className='text-white mt-4'>Last song!</div>
              )}
            </div>
          </animated.div>
        </div>
      )}
    </>
  );
};

export default Player;
