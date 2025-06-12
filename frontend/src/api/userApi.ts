import axios from "axios";
import { endpoints } from "../config/endpoints";
import { User, Song, SetUser, SetSpotifyPlayer } from "../types";
import { playTrack } from "./spotifyApi";

/**
 * Get music recommendations for a user
 * @param user The user to get recommendations for
 * @param request Optional specific music request
 */
export async function getRecommendations(
  user: User,
  request?: string
): Promise<any> {
  if (request) {
    // When a specific request is provided, use POST
    const response = await axios.post(
      endpoints.user.recommendations(user.userID),
      { request },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token?.value}`,
        },
      }
    );
    return response.data;
  } else {
    // For automatic recommendations without specific request, use GET
    const response = await axios.get(
      endpoints.user.recommendations(user.userID),
      {
        headers: {
          Authorization: `Bearer ${user.token?.value}`,
        },
      }
    );
    return response.data;
  }
}

/**
 * Like a song for a user
 * @param user The user who likes the song
 * @param song The song to like
 */
export async function likeSong(user: User, song: any): Promise<void> {
  await axios.put(
    endpoints.user.liked(user.userID),
    { song },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token?.value}`,
      },
    }
  );
}

/**
 * Dislike a song for a user
 * @param user The user who dislikes the song
 * @param song The song to dislike
 */
export async function dislikeSong(user: User, song: any): Promise<void> {
  await axios.put(
    endpoints.user.disliked(user.userID),
    { song },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token?.value}`,
      },
    }
  );
}

/**
 * Handle liking a song
 */
async function handleLike(
  song: Song,
  newRecommendedSongs: Song[],
  user: User,
  setUser: SetUser
): Promise<void> {
  const newLikedSongs = [
    ...user.likedSongs,
    {
      songID: song.id,
      name: song.name,
      artist: song.artist,
    },
  ];
  setUser({
    likedSongs: newLikedSongs,
    recommendedSongs: newRecommendedSongs,
  });

  await likeSong(user, song);
  console.log("Liked track!");
}

/**
 * Handle disliking a song
 */
async function handleDislike(
  song: Song,
  newRecommendedSongs: Song[],
  user: User,
  setUser: SetUser
): Promise<void> {
  const newDislikedSongs = [
    ...user.dislikedSongs,
    {
      songID: song.id,
      name: song.name,
      artist: song.artist,
    },
  ];
  setUser({
    dislikedSongs: newDislikedSongs,
    recommendedSongs: newRecommendedSongs,
  });

  await dislikeSong(user, song);
  console.log("Disliked track!");
}

/**
 * Save a track (like or dislike) and handle queue updates
 */
export async function saveTrack(
  isLiked: boolean,
  user: User,
  setUser: SetUser,
  spotifyPlayer: any,
  setSpotifyPlayer: SetSpotifyPlayer
): Promise<void> {
  if (!user.recommendedSongs || user.recommendedSongs.length === 0) return;

  const song = user.recommendedSongs[0];
  const newRecommendedSongs = user.recommendedSongs.slice(1);

  console.log("Saving track:", song, newRecommendedSongs);

  if (isLiked) {
    await handleLike(song, newRecommendedSongs, user, setUser);
  } else {
    await handleDislike(song, newRecommendedSongs, user, setUser);
  }

  // Check if newRecommendedSongs[0] exists and has a songID and user has a valid token
  if (
    newRecommendedSongs.length > 0 &&
    newRecommendedSongs[0].songID &&
    user.token
  ) {
    playTrack(newRecommendedSongs[0].songID, spotifyPlayer, user.token);
  }

  await checkRecommendations(user, setUser, spotifyPlayer, setSpotifyPlayer);
}

/**
 * Check if more recommendations are needed and fetch them if necessary
 */
export async function checkRecommendations(
  user: User,
  setUser: SetUser,
  spotifyPlayer: any,
  setSpotifyPlayer: SetSpotifyPlayer
): Promise<void> {
  if (
    !spotifyPlayer.areRecommendationsLoading &&
    user.recommendedSongs.length < 5
  ) {
    setSpotifyPlayer({ areRecommendationsLoading: true });
    const newRecs = await getRecommendations(user);
    setUser({ recommendedSongs: newRecs.recommendations });
    setSpotifyPlayer({ areRecommendationsLoading: false });
  }
}
