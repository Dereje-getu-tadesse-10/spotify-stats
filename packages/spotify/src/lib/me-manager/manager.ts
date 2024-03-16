import { SpotifyProfile } from "@repo/types";
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
      images: profile.images[1] || profile.images[0] || null,
      followers: {
        total: profile.followers.total,
      },
    };

    return formatedProfile;
  }
}
