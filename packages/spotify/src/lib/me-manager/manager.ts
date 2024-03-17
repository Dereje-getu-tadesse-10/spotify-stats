import {
  SpotifyProfile,
  SpotifyPlaylist,
  SpotifyTopArtist,
  SpotifyTopTrack,
} from "@repo/types";
export class MeManager {
  private baseUrl;
  private accessToken;
  private timeRange = "long_term";

  constructor(baseUrl: string, accessToken: string, timeRange?: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    if (timeRange) {
      this.timeRange = timeRange;
    }
  }

  async getProfile(): Promise<SpotifyProfile> {
    const response = await fetch(`${this.baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const profile = (await response.json()) as SpotifyProfile;

    const formatedProfile: SpotifyProfile = {
      id: profile.id,
      display_name: profile.display_name,
      images: profile.images ? profile.images : null,
      followers: {
        total: profile.followers.total,
      },
    };

    return formatedProfile;
  }

  async getPlaylists(): Promise<SpotifyPlaylist> {
    const response = await fetch(`${this.baseUrl}/me/playlists`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = (await response.json()) as SpotifyPlaylist;

    const items = data.items.map((playlist) => {
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
      ...data,
      items: items,
    };
  }

  async getTopArtists(
    type: "artists",
    timeRange: "short_term" | "medium_term" | "long_term"
  ): Promise<SpotifyTopArtist> {
    const response = await fetch(
      `${this.baseUrl}/me/top/${type}?time_range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = (await response.json()) as SpotifyTopArtist;

    const items = data.items.map((artist) => {
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
      ...data,
      items: items,
    };
  }

  async getTopTracks(
    type: "tracks",
    timeRange: "short_term" | "medium_term" | "long_term"
  ): Promise<SpotifyTopTrack> {
    const response = await fetch(
      `${this.baseUrl}/me/top/${type}?time_range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = (await response.json()) as SpotifyTopTrack;

    const items = data.items.map((track) => {
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
      ...data,
      items: items,
    };
  }
}
