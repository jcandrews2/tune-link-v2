import axios from "axios";
import { playSpotifyTrack } from "./spotify-utils";

export interface Song {
  id: string;
  name: string;
  artist: string;
  songID?: string;
}

export interface Profile {
  userID: string;
  token: { value: string };
  likedSongs: Song[];
  dislikedSongs: Song[];
  recommendedSongs: Song[];
}

export type SetProfile = (profile: Partial<Profile>) => void;
export type SetSpotifyPlayer = (player: Partial<any>) => void;

async function getRecommendations(profile: Profile): Promise<any> {
  const response = await axios.get(
    `http://localhost:5050/user/${profile.userID}/recommendations`
  );
  return response.data;
}

async function handleLike(
  song: Song,
  newRecommendedSongs: Song[],
  profile: Profile,
  setProfile: SetProfile
): Promise<void> {
  const newLikedSongs = [
    ...profile.likedSongs,
    {
      songID: song.id,
      name: song.name,
      artist: song.artist,
    },
  ];
  setProfile({
    likedSongs: newLikedSongs,
    recommendedSongs: newRecommendedSongs,
  });

  await axios.put(
    `http://localhost:5050/user/${profile.userID}/liked`,
    { song },
    { headers: { "Content-Type": "application/json" } }
  );
  console.log("Liked track!");
}

async function handleDislike(
  song: Song,
  newRecommendedSongs: Song[],
  profile: Profile,
  setProfile: SetProfile
): Promise<void> {
  const newDislikedSongs = [
    ...profile.dislikedSongs,
    {
      songID: song.id,
      name: song.name,
      artist: song.artist,
    },
  ];
  setProfile({
    dislikedSongs: newDislikedSongs,
    recommendedSongs: newRecommendedSongs,
  });

  await axios.put(
    `http://localhost:5050/user/${profile.userID}/disliked`,
    { song },
    { headers: { "Content-Type": "application/json" } }
  );
  console.log("Disliked track!");
}

export async function saveTrack(
  isLiked: boolean,
  profile: Profile,
  setProfile: SetProfile,
  spotifyPlayer: any,
  setSpotifyPlayer: SetSpotifyPlayer
): Promise<void> {
  if (!profile.recommendedSongs || profile.recommendedSongs.length === 0)
    return;

  const song = profile.recommendedSongs[0];
  const newRecommendedSongs = profile.recommendedSongs.slice(1);

  console.log("Saving track:", song, newRecommendedSongs);

  if (isLiked) {
    await handleLike(song, newRecommendedSongs, profile, setProfile);
  } else {
    await handleDislike(song, newRecommendedSongs, profile, setProfile);
  }
  playSpotifyTrack(newRecommendedSongs[0].songID, spotifyPlayer, profile.token);

  await checkRecommendations(profile, setProfile, spotifyPlayer, setSpotifyPlayer);
}

export async function checkRecommendations(
  profile: Profile,
  setProfile: SetProfile,
  spotifyPlayer: any,
  setSpotifyPlayer: SetSpotifyPlayer
): Promise<void> {
  if (
    !spotifyPlayer.areRecommendationsLoading &&
    profile.recommendedSongs.length < 5
  ) {
    setSpotifyPlayer({ areRecommendationsLoading: true });
    const newRecs = await getRecommendations(profile);
    setProfile({ recommendedSongs: newRecs.recommendations });
    setSpotifyPlayer({ areRecommendationsLoading: false });
  }
} 