import {
  SpotifyProfile,
  FormattedPlaylistItem,
  SpotifyPlaylistsResponse,
  SpotifyPlaylistsApiResponse,
} from "@repo/types";
export class MeManager {
  private baseUrl: string;
  private accessToken: string;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  async getProfile() {
    const response = await fetch(`${this.baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const profile = await response.json();

    const formatedProfile: SpotifyProfile = {
      id: profile.id,
      displayName: profile.display_name,
      images: profile.images.length > 0 ? profile.images[1] : profile.images[0],
      followers: {
        total: profile.followers.total,
      },
    };

    return formatedProfile;
  }

  async getPlaylists(): Promise<SpotifyPlaylistsResponse> {
    const response = await fetch(`${this.baseUrl}/me/playlists`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const data: SpotifyPlaylistsApiResponse = await response.json();

    const items = data.items.map((playlist) => {
      const image =
        playlist.images && playlist.images[0] ? playlist.images[0] : null;
      return {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        external_urls: {
          spotify: playlist.external_urls.spotify,
        },
        images: image,
        tracks: {
          total: playlist.tracks.total,
        },
      };
    });

    return {
      ...data,
      items,
    };
  }
}
