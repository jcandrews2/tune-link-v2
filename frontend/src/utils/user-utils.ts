import axios from "axios";
import { playSpotifyTrack } from "./spotify-utils";

export interface Song {
  id: string;
  name: string;
  artist: string;
  songID?: string;
}

export interface User {
  userID: string;
  token: { value: string };
  likedSongs: Song[];
  dislikedSongs: Song[];
  recommendedSongs: Song[];
}

export type SetUser = (user: Partial<User>) => void;
export type SetSpotifyPlayer = (player: Partial<any>) => void;

async function getRecommendations(user: User): Promise<any> {
  const response = await axios.get(
    `http://localhost:5050/user/${user.userID}/recommendations`
  );
  return response.data;
}

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

  await axios.put(
    `http://localhost:5050/user/${user.userID}/liked`,
    { song },
    { headers: { "Content-Type": "application/json" } }
  );
  console.log("Liked track!");
}

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

  await axios.put(
    `http://localhost:5050/user/${user.userID}/disliked`,
    { song },
    { headers: { "Content-Type": "application/json" } }
  );
  console.log("Disliked track!");
}

export async function saveTrack(
  isLiked: boolean,
  user: User,
  setUser: SetUser,
  spotifyPlayer: any,
  setSpotifyPlayer: SetSpotifyPlayer
): Promise<void> {
  if (!user.recommendedSongs || user.recommendedSongs.length === 0)
    return;

  const song = user.recommendedSongs[0];
  const newRecommendedSongs = user.recommendedSongs.slice(1);

  console.log("Saving track:", song, newRecommendedSongs);

  if (isLiked) {
    await handleLike(song, newRecommendedSongs, user, setUser);
  } else {
    await handleDislike(song, newRecommendedSongs, user, setUser);
  }
  playSpotifyTrack(newRecommendedSongs[0].songID, spotifyPlayer, user.token);

  await checkRecommendations(user, setUser, spotifyPlayer, setSpotifyPlayer);
}

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