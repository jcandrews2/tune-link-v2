import { endpoints } from "../config/endpoints";
import { SpotifyPlayer } from "../types";
import useStore from "../store";
import { spotifyAxios } from "../utils/axiosUtils";

export async function playTrack(
  trackUri: string,
  player: SpotifyPlayer
): Promise<void> {
  if (!player.deviceID) return;

  try {
    const { user } = useStore.getState();
    await spotifyAxios.put(
      endpoints.player.play(player.deviceID),
      {
        uris: [trackUri],
      },
      {
        headers: {
          Authorization: `Bearer ${user.spotifyAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Successfully played track!");
  } catch (error) {
    console.error("Error playing track:", error);
  }
}

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
