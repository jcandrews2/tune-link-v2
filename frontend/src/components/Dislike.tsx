import React, { FC, useEffect } from "react";
import DislikeIcon from "../images/dislike.png";
import useStore from "../store";
import { saveTrack, User } from "../utils/user-utils";

const Dislike: FC = () => {
  const { user, setUser, spotifyPlayer, setSpotifyPlayer, token } = useStore();

  useEffect(() => {}, [user, spotifyPlayer, token]);

  const handleDislike = async (): Promise<void> => {
    await saveTrack(false, user, setUser, spotifyPlayer, setSpotifyPlayer);
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
