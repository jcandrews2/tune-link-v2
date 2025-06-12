import axios from "axios";
import { endpoints } from "../config/endpoints";
import { SpotifyUser, BackendUser } from "../types";

/**
 * Get the authentication token
 */
export async function getAuthToken(): Promise<string> {
  const response = await axios.get<{ access_token: string }>(
    endpoints.auth.token
  );
  return response.data.access_token;
}

/**
 * Get Spotify user information
 * @param token The authentication token
 */
export async function getSpotifyUserInfo(token: string): Promise<SpotifyUser> {
  try {
    const response = await axios.get<SpotifyUser>(endpoints.user.profile, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return { id: "", images: [], error };
  }
}

/**
 * Create a new user in the backend
 * @param spotifyUserData Spotify user data
 * @param token Authentication token
 */
export async function createUser(
  spotifyUserData: SpotifyUser,
  token: any
): Promise<void> {
  if (spotifyUserData.error) return;

  const newUser = {
    userID: spotifyUserData.id,
    profilePicture: spotifyUserData.images[0],
    token: token,
    likedSongs: [],
    dislikedSongs: [],
    recommendedSongs: [],
  };

  try {
    await axios.post(
      endpoints.user.create(spotifyUserData.id),
      {
        user: newUser,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating user.", error);
  }
}

/**
 * Get user data from the backend
 * @param spotifyUserData Spotify user data
 * @param token Authentication token
 */
export async function getUser(
  spotifyUserData: SpotifyUser
): Promise<BackendUser> {
  const response = await axios.get<BackendUser>(
    endpoints.user.get(spotifyUserData.id)
  );
  return response.data;
}
