import React, { FC, useEffect } from "react";
import LikeIcon from "../images/like.png";
import useStore from "../store";
import { saveTrack, Profile } from "../utils/profile-utils";

interface SpotifyPlayer {
  currentTrack: {
    id: string;
  } | null;
}

interface Token {
  value: string;
}

interface Store {
  profile: Profile;
  setProfile: (profile: Partial<Profile>) => void;
  spotifyPlayer: SpotifyPlayer;
  setSpotifyPlayer: (player: Partial<SpotifyPlayer>) => void;
  token: Token;
}

const Like: FC = () => {
  const { profile, setProfile, spotifyPlayer, setSpotifyPlayer, token } =
    useStore() as Store;

  useEffect(() => {}, [profile, spotifyPlayer, token]);

  const handleLike = async (): Promise<void> => {
    await saveTrack(true, profile, setProfile, spotifyPlayer, setSpotifyPlayer);
  };

  return (
    <div className="Like-container" onClick={handleLike}>
      <img
        src={LikeIcon}
        alt="Like"
        className="w-[2.25rem] h-auto transform active:scale-95"
      />
    </div>
  );
};

export default Like;
