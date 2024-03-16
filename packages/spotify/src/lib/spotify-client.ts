import { MeManager } from "./me-manager/manager";

export class SpotifyClient {
  private baseUrl: string = "https://api.spotify.com/v1";
  private accessToken: string;
  public me: MeManager;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.me = new MeManager(this.baseUrl, this.accessToken);
  }
}
