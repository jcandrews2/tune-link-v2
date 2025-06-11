import React, { FC, useEffect } from "react";
import DislikeIcon from "../images/dislike.png";
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

const Dislike: FC = () => {
  const { profile, setProfile, spotifyPlayer, setSpotifyPlayer, token } =
    useStore() as Store;

  useEffect(() => {}, [profile, spotifyPlayer, token]);

  const handleDislike = async (): Promise<void> => {
    await saveTrack(
      false,
      profile,
      setProfile,
      spotifyPlayer,
      setSpotifyPlayer
    );
  };

  return (
    <div className="Dislike-container" onClick={handleDislike}>
      <img
        src={DislikeIcon}
        alt="Dislike"
        className="w-[2.25rem] h-auto transform active:scale-95"
      />
    </div>
  );
};

export default Dislike;
