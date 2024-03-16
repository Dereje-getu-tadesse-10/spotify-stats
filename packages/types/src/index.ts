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

interface FormattedPlaylistItem {
  id: string;
  name: string;
  description: string;
  external_urls: {
    spotify: string;
  };
  images: SpotifyImage | null;
  tracks: {
    total: number;
  };
}

export interface SpotifyPlaylistsResponse {
  items: FormattedPlaylistItem[];
  next: string | null;
  previous: string | null;
  offset: number;
  total: number;
}
interface SpotifyPlaylistElement {
  id: string;
  name: string;
  description: string;
  external_urls: {
    spotify: string;
  };
  images: SpotifyImage[];
  tracks: {
    total: number;
  };
}

export interface SpotifyPlaylistsApiResponse {
  items: SpotifyPlaylistElement[];
  next: string | null;
  previous: string | null;
  offset: number;
  total: number;
}
