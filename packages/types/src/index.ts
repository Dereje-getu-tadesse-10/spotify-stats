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

export interface SpotifyTopArtist {
  items: {
    external_urls: {
      spotify: string;
    };
    genres: string[];
    images: SpotifyImage[] | null;
    name: string;
    popularity: number;
  }[];
  total: number;
  next: string | null;
  offset: number;
  previous: string | null;
}

export interface SpotifyTopTrack {
  items: {
    name: string;
    artists: {
      name: string;
      external_urls: {
        spotify: string;
      };
    }[];
    album: {
      name: string;
      images: SpotifyImage[] | null;
    };
    duration_ms: number;
    popularity: number;
    preview_url: string | null;
  }[];
  total: number;
  next: string | null;
  offset: number;
  previous: string | null;
}

export interface SpotifyRecentlyPlayed {
  items: {
    track: {
      name: string;
      artists: {
        name: string;
        external_urls: {
          spotify: string;
        };
      }[];
      album: {
        name: string;
        images: SpotifyImage[] | null;
      };
      duration_ms: string;
      popularity: number;
      preview_url: string | null;
    };
    played_at: string;
  }[];
  next: string | null;
  cursor: {
    after: string | null;
    before: string | null;
  };
  limit: number;
}

export interface SpotifyCurrentlyPlaying {
  item: {
    name: string;
    artists: {
      name: string;
      external_urls: {
        spotify: string;
      };
    }[];
    album: {
      images: SpotifyImage[];
    };
    external_urls: {
      spotify: string;
    };
    preview_url: string | null;
    popularity: number;
  };
}
