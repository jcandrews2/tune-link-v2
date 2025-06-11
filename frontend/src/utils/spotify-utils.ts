import axios from "axios";

export interface Token {
  value: string;
}

export interface SpotifyPlayer {
  deviceID: string;
}

export async function playSpotifyTrack(
  trackID: string,
  spotifyPlayer: SpotifyPlayer,
  token: Token
): Promise<void> {
  try {
    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${spotifyPlayer.deviceID}`,
      {
        uris: [`spotify:track:${trackID}`],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    console.log("Successfully played track!");
  } catch (error) {
    console.error("Error playing the song:", error);
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