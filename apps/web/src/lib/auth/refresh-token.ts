const refreshAccessToken = async (refreshToken: string) => {
  const request = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    cache: "no-cache",
  });

  if (!request.ok) {
    console.error(
      `Failed to refresh token: ${request.status} ${request.statusText}`
    );
    throw new Error(
      `Failed to refresh token: ${request.status} ${request.statusText}`
    );
  }

  const data = await request.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token ? data.refresh_token : refreshToken,
  };
};

export default refreshAccessToken;
