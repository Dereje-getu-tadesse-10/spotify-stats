import dayjs from "dayjs";

import type {
  SpotifyProfile,
  SpotifyPlaylist,
  SpotifyTopArtist,
  SpotifyTopTrack,
  SpotifyRecentlyPlayed,
  SpotifyCurrentlyPlaying,
} from "@repo/types";

import formatDuration from "../../utils/ms-to-minute";

export class MeManager {
  private baseUrl;
  private accessToken;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  private async fetchFromSpotify(endpoint: string, options?: RequestInit) {
    const fetchOptions: RequestInit = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      ...options,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, fetchOptions);

    if (!response.ok) {
      throw new Error(
        `${String(response.status)} ${String(response.statusText)}`
      );
    }

    return response.json();
  }

  async getProfile(): Promise<SpotifyProfile> {
    try {
      const response = (await this.fetchFromSpotify("/me", {
        cache: "force-cache",
      })) as SpotifyProfile;

      const formatedProfile = {
        id: response.id,
        display_name: response.display_name,
        images: response.images ? response.images : null,
        followers: {
          total: response.followers.total,
        },
      };

      return formatedProfile;
    } catch (error) {
      console.error(`Failed to get profile from Spotify: ${String(error)}`);
      throw new Error(`Failed to get profile from Spotify: ${String(error)}`);
    }
  }

  async getPlaylists(): Promise<SpotifyPlaylist> {
    try {
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
    } catch (error) {
      console.error(`Failed to get playlists from Spotify: ${String(error)}`);
      throw new Error(`Failed to get playlists from Spotify: ${String(error)}`);
    }
  }

  async getTopArtists(
    type: "artists",
    timeRange: "short_term" | "medium_term" | "long_term"
  ): Promise<SpotifyTopArtist> {
    try {
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
    } catch (error) {
      console.error(`Failed to get top artists from Spotify: ${String(error)}`);
      throw new Error(
        `Failed to get top artists from Spotify: ${String(error)}`
      );
    }
  }

  async getTopTracks(
    type: "tracks",
    timeRange: "short_term" | "medium_term" | "long_term"
  ): Promise<SpotifyTopTrack> {
    try {
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
    } catch (error) {
      console.error(`Failed to get top tracks from Spotify: ${String(error)}`);
      throw new Error(
        `Failed to get top tracks from Spotify: ${String(error)}`
      );
    }
  }

  async getRecentlyPlayed(): Promise<SpotifyRecentlyPlayed> {
    try {
      const response = (await this.fetchFromSpotify(
        "/me/player/recently-played",
        {
          cache: "force-cache",
        }
      )) as SpotifyRecentlyPlayed;

      const items = response.items.map((item) => {
        const album = item.track.album;
        const images = album.images ? album.images : null;
        return {
          track: {
            name: item.track.name,
            artists: item.track.artists,
            album: {
              name: album.name,
              images: images,
            },
            duration_ms: formatDuration(Number(item.track.duration_ms)),
            popularity: item.track.popularity,
            preview_url: item.track.preview_url,
          },
          played_at: dayjs(item.played_at).format("YYYY-MM-DD"),
        };
      });

      return {
        ...response,
        items: items,
      };
    } catch (error) {
      console.error(
        `Failed to get recently played from Spotify: ${String(error)}`
      );
      throw new Error(
        `Failed to get recently played from Spotify: ${String(error)}`
      );
    }
  }

  async currentPlaying(): Promise<SpotifyCurrentlyPlaying["item"] | null> {
    try {
      const response = (await this.fetchFromSpotify(
        "/me/player/currently-playing"
      )) as SpotifyCurrentlyPlaying;

      const item = {
        name: response.item.name,
        artists: response.item.artists,
        album: {
          images: response.item.album.images,
        },
        external_urls: {
          spotify: response.item.external_urls.spotify,
        },
        preview_url: response.item.preview_url,
        popularity: response.item.popularity,
      };

      return item;
    } catch (error) {
      console.error(
        `Failed to get current playing from Spotify: ${String(error)}`
      );
      return null;
    }
  }
}
