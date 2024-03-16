interface RefreshAccessTokenResponse {
  accessToken: string;
  tokenExpiresIn: number;
  refreshToken: string;
}

interface SpotifyTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

async function refreshAccessToken(
  refreshToken: string
): Promise<RefreshAccessTokenResponse> {
  const request = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    cache: "no-cache",
  });

  if (!request.ok) {
    // console.error(
    //   `Failed to refresh token: ${request.status} ${request.statusText}`
    // );
    throw new Error(
      `Failed to refresh token: ${request.status} ${request.statusText}`
    );
  }

  const data = (await request.json()) as SpotifyTokenResponse;
  return {
    accessToken: data.access_token,
    tokenExpiresIn: data.expires_in,
    refreshToken: data.refresh_token ? data.refresh_token : refreshToken,
  };
}

export default refreshAccessToken;
