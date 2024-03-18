import type {
  SpotifyProfile,
  SpotifyPlaylist,
  SpotifyTopArtist,
  SpotifyTopTrack,
  SpotifyRecentlyPlayed,
  SpotifyCurrentlyPlaying,
} from "@repo/types";
import dayjs from "dayjs";
import { formatDuration } from "../../utils/ms-to-minute";

export class MeManager {
  private baseUrl;
  private accessToken;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  /**
   * Fetch data from spotify api
   * @param endpoint - Spotify endpoint to fetch
   * @param options - Options to fetch
   * @returns
   * - data
   * - error
   */
  private async fetchFromSpotify(
    endpoint: string,
    options?: RequestInit
  ): Promise<unknown> {
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

  /**
   * Get user's profile
   * @returns
   * - id
   * - display_name
   * - images
   * - followers
   */
  async profile(): Promise<SpotifyProfile> {
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
      throw new Error(`Failed to get profile from Spotify: ${String(error)}`);
    }
  }

  /**
   * Get user's playlists
   * @returns
   * - items: array of playlists
   * - total: total number of items
   * - limit: max number of items
   * - offset: offset
   * - next: next page
   * - previous: previous page
   */
  async playlists(): Promise<SpotifyPlaylist> {
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
          images,
          tracks: {
            total: playlist.tracks.total,
          },
        };
      });

      return {
        ...response,
        items,
      };
    } catch (error) {
      throw new Error(`Failed to get playlists from Spotify: ${String(error)}`);
    }
  }

  /**
   *
   * @param type - "tracks" | "artists"
   * @param timeRange - "short_term" | "medium_term" | "long_term"
   * @param limit - limit
   * @param offset - offset
   * @returns
   *  - items: array of tracks
   *  - total: total number of items
   *  - limit: max number of items
   *  - offset: offset
   *  - next: next page
   *  - previous: previous page
   */
  async topArtists(
    type: "artists",
    timeRange: "short_term" | "medium_term" | "long_term" = "short_term",
    limit = 20,
    offset = 0
  ): Promise<SpotifyTopArtist> {
    try {
      const response = (await this.fetchFromSpotify(
        `/me/top/${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`,
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
          images,
          name: artist.name,
          popularity: artist.popularity,
        };
      });

      return {
        ...response,
        items,
      };
    } catch (error) {
      throw new Error(
        `Failed to get top artists from Spotify: ${String(error)}`
      );
    }
  }

  /**
   * @param type - "tracks"
   * @param timeRange - "short_term" | "medium_term" | "long_term"
   * @param limit - limit
   * @param offset - offset
   * @returns
   *  - items: array of tracks
   *  - total: total number of items
   *  - limit: max number of items
   *  - offset: offset
   *  - next: next page
   *  - previous: previous page
   */
  async topTracks(
    type: "tracks",
    timeRange: "short_term" | "medium_term" | "long_term",
    limit = 20,
    offset = 0
  ): Promise<SpotifyTopTrack> {
    try {
      const response = (await this.fetchFromSpotify(
        `/me/top/${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`,
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
            images,
          },
          duration_ms: track.duration_ms,
          popularity: track.popularity,
          preview_url: track.preview_url,
        };
      });

      return {
        ...response,
        items,
      };
    } catch (error) {
      throw new Error(
        `Failed to get top tracks from Spotify: ${String(error)}`
      );
    }
  }

  /**
   * User recently played songs
   * @param before - in milliseconds
   * @param after - in milliseconds
   * @returns
   *   - items: array of recently played songs
   *   - total: total number of items
   *   - limit: max number of items
   *   - offset: offset
   *   - next: next page
   *   - previous: previous page
   */

  async recentlyPlayed(
    before?: string,
    after?: string
  ): Promise<SpotifyRecentlyPlayed> {
    try {
      let url = "/me/player/recently-played";
      const params = new URLSearchParams();
      if (before) params.append("before", before);
      if (after) params.append("after", after);
      if (params.toString()) url += `?${params.toString()}`;

      const response = (await this.fetchFromSpotify(
        url
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
              images,
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
        items,
      };
    } catch (error) {
      throw new Error(
        `Failed to get recently played from Spotify: ${String(error)}`
      );
    }
  }

  /**
   * User currently playing track
   * @returns
   *   - name
   *   - artists
   *   - album (track thumbnail)
   *   - external_urls
   *   - preview_url
   *   - popularity
   *   - is_playing
   */
  async currentPlaying(): Promise<
    | SpotifyCurrentlyPlaying["item"]
    | {
        is_playing: boolean;
      }
  > {
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
      return {
        is_playing: false,
      };
    }
  }
}
