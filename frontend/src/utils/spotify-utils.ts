import axios from "axios";

export interface Token {
  value: string;
}

export interface SpotifyPlayer {
  deviceID: string | null;
}

export async function playSpotifyTrack(
  trackUri: string,
  player: SpotifyPlayer,
  token: Token
): Promise<void> {
  if (!player.deviceID) return;

  try {
    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${player.deviceID}`,
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

export async function transferSpotifyPlayback(
  token: Token,
  deviceID: string
): Promise<void> {
  try {
    await axios.put(
      "https://api.spotify.com/v1/me/player",
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