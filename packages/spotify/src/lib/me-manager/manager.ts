import { SpotifyProfile, SpotifyPlaylist } from "@repo/types";
export class MeManager {
  private baseUrl: string;
  private accessToken: string;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
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

  async getPlaylists(): Promise<SpotifyPlaylist["items"]> {
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

    return items;
  }
}

