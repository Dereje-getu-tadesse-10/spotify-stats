import { MeManager } from "./me-manager/manager";

export class Spotify {
  private baseUrl = "https://api.spotify.com/v1";
  private accessToken;

  public me;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.me = new MeManager(this.baseUrl, this.accessToken);
  }
}
