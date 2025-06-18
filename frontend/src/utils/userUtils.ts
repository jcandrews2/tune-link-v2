import { dislikeTrack, likeTrack } from "../api/userApi";
import { SpotifyPlayer, User } from "../types/store";

export const handleLike = async (
  spotifyPlayer: SpotifyPlayer,
  user: User,
  setUser: (update: Partial<User>) => void
): Promise<void> => {
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

export const handleDislike = async (
  spotifyPlayer: SpotifyPlayer,
  user: User,
  setUser: (update: Partial<User>) => void
): Promise<void> => {
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
