import {
  dislikeTrack,
  likeTrack,
  getTopArtists,
  getLikedSongs,
  getDislikedSongs,
} from "../api/userApi";
import type { SpotifyPlayer, User } from "../types";

export const handleLike = async (
  spotifyPlayer: SpotifyPlayer,
  user: User,
  setUser: (update: Partial<User>) => void,
  setSpotifyPlayer: (update: Partial<SpotifyPlayer>) => void
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
    setSpotifyPlayer({
      currentTrack: spotifyPlayer.nextTrack,
    });

    const likedSong = user.recommendedSongs[0];

    setUser({
      recommendedSongs: user.recommendedSongs.slice(1),
    });

    await spotifyPlayer.player.nextTrack();

    await likeTrack(user.userId, likedSong);

    const [updatedLikedSongs, updatedTopArtists] = await Promise.all([
      getLikedSongs(user.userId),
      getTopArtists(user.userId),
    ]);

    setUser({
      likedSongs: updatedLikedSongs,
      topArtists: updatedTopArtists,
    });
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

    await dislikeTrack(user.userId, dislikedSong);

    const updatedDislikedSongs = await getDislikedSongs(user.userId);

    setUser({
      dislikedSongs: updatedDislikedSongs,
    });
  } catch (error) {
    console.error("Error in handleDislike:", error);
  }
};
