import axios from "axios";
import { endpoints } from "../config/endpoints";
import { Token, SpotifyPlayer } from "../types";

/**
 * Play a Spotify track on the user's device
 * @param trackUri The URI of the track to play
 * @param player The Spotify player instance
 * @param token The user's authentication token
 */
export async function playTrack(
  trackUri: string,
  player: SpotifyPlayer,
  token: Token
): Promise<void> {
  if (!player.deviceID) return;

  try {
    await axios.put(
      endpoints.player.play(player.deviceID),
      {
        uris: [trackUri],
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Successfully played track!");
  } catch (error) {
    console.error("Error playing track:", error);
  }
}

/**
 * Transfer playback to a specific Spotify device
 * @param token The user's authentication token
 * @param deviceID The ID of the device to transfer playback to
 */
export async function transferPlayback(
  token: Token,
  deviceID: string
): Promise<void> {
  try {
    await axios.put(
      endpoints.player.transfer,
      {
        device_ids: [deviceID],
        play: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    console.log("Playback successfully transferred to the device:", deviceID);
  } catch (error) {
    console.error("Error transferring playback:", error);
  }
}
