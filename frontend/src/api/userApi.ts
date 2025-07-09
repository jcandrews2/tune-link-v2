import { endpoints } from "../config/endpoints";
import { userAxios } from "../utils/axiosUtils";
import { Song, Request, Artist } from "../types";

export async function getCurrentUser() {
  try {
    const response = await userAxios.get(endpoints.user.me);
    return response.data;
  } catch (error) {
    console.error("Error getting current user:", error);
  }
}

export async function submitMusicRequest(
  userId: string,
  request: string
): Promise<Song[]> {
  try {
    const response = await userAxios.post(
      endpoints.user.recommendations(userId),
      {
        request: request,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting music request:", error);
    throw error;
  }
}

export async function getRecommendations(userId: string): Promise<Song[]> {
  try {
    const response = await userAxios.get(
      endpoints.user.recommendations(userId)
    );
    return response.data;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    throw error;
  }
}

export async function likeTrack(userId: string, track: Song): Promise<void> {
  try {
    await userAxios.post(endpoints.user.likes(userId), track);
  } catch (error) {
    console.error("Error in handleLike:", error);
    throw error;
  }
}

export async function dislikeTrack(userId: string, track: Song): Promise<void> {
  try {
    await userAxios.post(endpoints.user.dislikes(userId), track);
  } catch (error) {
    console.error("Error in handleDislike:", error);
    throw error;
  }
}

export async function getPreviousRequests(userId: string): Promise<Request[]> {
  try {
    const response = await userAxios.get(endpoints.user.requests(userId));
    return response.data;
  } catch (error) {
    console.error("Error fetching previous requests:", error);
    throw error;
  }
}

export async function addPreviousRequest(
  userId: string,
  request: string
): Promise<void> {
  try {
    await userAxios.post(endpoints.user.requests(userId), {
      request,
    });
  } catch (error) {
    console.error("Error adding previous request:", error);
    throw error;
  }
}

export async function getLikedSongs(userId: string): Promise<Song[]> {
  try {
    const response = await userAxios.get(endpoints.user.likes(userId));
    return response.data;
  } catch (error) {
    console.error("Error getting liked songs:", error);
    throw error;
  }
}

export async function getDislikedSongs(userId: string): Promise<Song[]> {
  try {
    const response = await userAxios.get(endpoints.user.dislikes(userId));
    return response.data;
  } catch (error) {
    console.error("Error getting disliked songs:", error);
    throw error;
  }
}

export async function getTopArtists(userId: string): Promise<Artist[]> {
  try {
    const response = await userAxios.get(endpoints.user.artists(userId));
    return response.data;
  } catch (error) {
    console.error("Error getting top artists:", error);
    throw error;
  }
}
