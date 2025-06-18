import { endpoints } from "../config/endpoints";
import { SpotifyPlayer } from "../types";
import useStore from "../store";
import { spotifyAxios } from "../utils/axiosUtils";

export async function transferPlayback(deviceID: string): Promise<void> {
  try {
    const { user } = useStore.getState();
    await spotifyAxios.put(
      endpoints.player.transfer,
      {
        device_ids: [deviceID],
        play: false,
      },
      {
        headers: {
          Authorization: `Bearer ${user.spotifyAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Playback successfully transferred to the device:", deviceID);
  } catch (error) {
    console.error("Error transferring playback:", error);
  }
}

export async function playTracks(
  deviceID: string,
  trackUris: string[]
): Promise<void> {
  try {
    const { user } = useStore.getState();
    await spotifyAxios.put(
      endpoints.player.play(deviceID),
      {
        uris: trackUris,
      },
      {
        headers: {
          Authorization: `Bearer ${user.spotifyAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Successfully started playing tracks!");
  } catch (error) {
    console.error("Error playing tracks:", error);
    throw error;
  }
}

export async function setTrackPosition(position: number): Promise<void> {
  try {
    const { user } = useStore.getState();
    await spotifyAxios.put(
      endpoints.player.seek(position),
      {},
      {
        headers: {
          Authorization: `Bearer ${user.spotifyAccessToken}`,
        },
      }
    );
    console.log("Set track position!");
  } catch (error) {
    console.error("Error setting track position", error);
  }
}
