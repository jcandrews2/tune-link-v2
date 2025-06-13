import axios from "axios";
import { endpoints } from "../config/endpoints";
import { SpotifyUser } from "../types";

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
