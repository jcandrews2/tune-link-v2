declare global {
  interface Window {
    Spotify: {
      Player: any;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

declare module "*.png" {
  const value: string;
  export default value;
}

export {};
