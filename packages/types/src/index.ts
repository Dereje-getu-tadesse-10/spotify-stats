export interface AntiHero {
  (): string;
}

export interface SpotifyProfile {
  id: string;
  displayName: string;
  images: SpotifyImage[];
  followers: {
    total: number;
  };
}

export interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}
