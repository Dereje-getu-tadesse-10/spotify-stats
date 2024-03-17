export interface AntiHero {
  (): string;
}

export interface SpotifyProfile {
  id: string;
  display_name: string;
  images: SpotifyImage[] | null;
  followers: {
    total: number;
  };
}

export interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}

export interface SpotifyPlaylist {
  items: {
    id: string;
    name: string;
    description: string;
    external_urls: {
      spotify: string;
    };
    images: SpotifyImage[] | null;
    tracks: {
      total: number;
    };
  }[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}
