import React, { FC, useEffect } from "react";
import LikeIcon from "../images/like.png";
import useStore from "../store";
import { saveTrack, User } from "../utils/user-utils";


const Like: FC = () => {
  const { user, setUser, spotifyPlayer, setSpotifyPlayer, token } = useStore();

  useEffect(() => {}, [user, spotifyPlayer, token]);

  const handleLike = async (): Promise<void> => {
    await saveTrack(true, user, setUser, spotifyPlayer, setSpotifyPlayer);
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
