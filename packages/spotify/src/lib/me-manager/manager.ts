import {
  SpotifyProfile,
  SpotifyPlaylist,
  SpotifyTopArtist,
  SpotifyTopTrack,
} from "@repo/types";
export class MeManager {
  private baseUrl;
  private accessToken;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  private async fetchFromSpotify(
    endpoint: string,
    options?: RequestInit
  ): Promise<any> {
    const fetchOptions: RequestInit = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      ...options,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, fetchOptions);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getProfile(): Promise<SpotifyProfile> {
    const response = await this.fetchFromSpotify("/me", {
      cache: "force-cache",
    });

    const formatedProfile: SpotifyProfile = {
      id: response.id,
      display_name: response.display_name,
      images: response.images ? response.images : null,
      followers: {
        total: response.followers.total,
      },
    };

    return formatedProfile;
  }

  async getPlaylists(): Promise<SpotifyPlaylist> {
    const response = (await this.fetchFromSpotify("/me/playlists", {
      cache: "force-cache",
    })) as SpotifyPlaylist;

    const items = response.items.map((playlist) => {
      const images = playlist.images ? playlist.images : null;
      return {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        external_urls: {
          spotify: playlist.external_urls.spotify,
        },
        images: images,
        tracks: {
          total: playlist.tracks.total,
        },
      };
    });

    return {
      ...response,
      items: items,
    };
  }

  async getTopArtists(
    type: "artists",
    timeRange: "short_term" | "medium_term" | "long_term"
  ): Promise<SpotifyTopArtist> {
    const response = (await this.fetchFromSpotify(
      `/me/top/${type}?time_range=${timeRange}`,
      {
        cache: "force-cache",
      }
    )) as SpotifyTopArtist;

    const items = response.items.map((artist) => {
      const images = artist.images ? artist.images : null;
      return {
        external_urls: {
          spotify: artist.external_urls.spotify,
        },
        genres: artist.genres,
        images: images,
        name: artist.name,
        popularity: artist.popularity,
      };
    });

    return {
      ...response,
      items: items,
    };
  }

  async getTopTracks(
    type: "tracks",
    timeRange: "short_term" | "medium_term" | "long_term"
  ): Promise<SpotifyTopTrack> {
    const response = (await this.fetchFromSpotify(
      `/me/top/${type}?time_range=${timeRange}`,
      {
        cache: "force-cache",
      }
    )) as SpotifyTopTrack;

    const items = response.items.map((track) => {
      const album = track.album;
      const images = album.images ? album.images : null;
      return {
        name: track.name,
        artists: track.artists,
        album: {
          name: album.name,
          images: images,
        },
        duration_ms: track.duration_ms,
        popularity: track.popularity,
        preview_url: track.preview_url,
      };
    });

    return {
      ...response,
      items: items,
    };
  }
}
