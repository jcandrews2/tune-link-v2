import React, { useEffect, FC } from "react";
import PlayPause from "./PlayPause";
import Like from "./Like";
import Dislike from "./Dislike";
import Cover from "./Cover";
import TrackDetails from "./TrackDetails";
import Loading from "./Loading";
import Slider from "./Slider";
import TrackTime from "./TrackTime";
import useStore from "../store";
import { transferSpotifyPlayback } from "../utils/spotify-utils";

interface Token {
  value: string;
}

interface Profile {
  recommendedSongs: any[];
}

interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
}

interface SpotifyPlayer {
  player: any;
  deviceID: string;
  currentTrack: Track | null;
  isPaused: boolean;
  isActive: boolean;
  areRecommendationsLoading: boolean;
}

interface Store {
  token: Token;
  profile: Profile;
  spotifyPlayer: SpotifyPlayer;
  setSpotifyPlayer: (player: Partial<SpotifyPlayer>) => void;
}

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
  const { token, profile, spotifyPlayer, setSpotifyPlayer } = useStore() as Store;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      if (window.player) {
        window.player.disconnect();
      }
      const player = new window.Spotify.Player({
        name: "tune link",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token.value);
        },
        volume: 0.5,
      });

      setSpotifyPlayer({ player: player });

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID:", device_id);
        transferSpotifyPlayback(token, device_id);
        setSpotifyPlayer({ deviceID: device_id });
      });

      player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
        console.log("Device ID has gone offline:", device_id);
      });

      player.addListener("player_state_changed", (state: any) => {
        if (!state) {
          return;
        }

        setSpotifyPlayer({
          currentTrack: state.track_window.current_track,
          isPaused: state.paused,
        });

        player.getCurrentState().then((state: any) => {
          !state
            ? setSpotifyPlayer({ isActive: false })
            : setSpotifyPlayer({ isActive: true });
        });
      });

      player.connect();
    };
  }, []);

  return (
    <>
      {spotifyPlayer.areRecommendationsLoading &&
      profile.recommendedSongs.length === 1 ? (
        <Loading />
      ) : (
        <>
          <Cover />
          {spotifyPlayer.currentTrack && <TrackDetails />}
          <div className="flex flex-col items-center p-[0.64rem]">
            <Slider />
            <TrackTime />
          </div>
        </>
      )}
      <div className="z-0 flex items-center justify-center select-none">
        <Dislike />
        <PlayPause />
        <Like />
      </div>
    </>
  );
};

export default Player;
