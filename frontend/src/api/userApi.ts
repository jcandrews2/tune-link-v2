import { endpoints } from "../config/endpoints";
import { userAxios } from "../utils/axiosUtils";
import { Song } from "../types";

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

/**
 * Get recommendations for a user
 * @param userId The user ID
 * @returns Array of recommended songs
 */
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

// export async function getRecommendations(
//   user: User,
//   request: string
// ): Promise<any> {
//   if (request) {
//     console.log("Getting recommendations with request");
//     const response = await userAxios.post(
//       endpoints.user.recommendations(user.userId),
//       { request },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token?.value}`,
//         },
//       }
//     );
//     return response.data;
//   } else {
//     console.log("Getting recommendations without request");
//     const response = await userAxios.get(
//       endpoints.user.recommendations(user.userID),
//       {
//         headers: {
//           Authorization: `Bearer ${user.token?.value}`,
//         },
//       }
//     );
//     return response.data;
//   }
// }
