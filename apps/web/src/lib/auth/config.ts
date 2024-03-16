import { NextAuthConfig } from "next-auth";
import Spotify from "next-auth/providers/spotify";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@repo/database";
import refreshAccessToken from "./refresh-token";

const scopes = [
  "user-read-email",
  "user-read-currently-playing",
  "user-top-read",
  "user-read-recently-played",
  "user-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "playlist-read-collaborative",
  "playlist-read-private",
].join(",");

const config = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: `https://accounts.spotify.com/authorize?scope=${scopes}`,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      try {
        const userAccount = await prisma.user.findUnique({
          where: { id: user.id },
          include: { accounts: true },
        });

        if (!userAccount) throw new Error("User account not found");

        const account = userAccount.accounts[0];
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = (account.expires_at! - now) / 60;
        const difference = Math.floor(
          (userAccount.accounts[0].expires_at! - now) / 60
        );

        console.log(`Token still active for ${difference} minutes.`);
        if (expiresIn <= 10) {
          console.log("Token expired, fetching new one...");
          const { accessToken, expiresIn, refreshToken } =
            await refreshAccessToken(account.refresh_token!);

          await prisma.account.update({
            where: {
              provider_providerAccountId: {
                provider: "spotify",
                providerAccountId: account.providerAccountId,
              },
            },
            data: {
              access_token: accessToken,
              expires_at: Math.floor(Date.now() / 1000 + expiresIn),
              refresh_token: refreshToken,
            },
          });

          session.access_token = accessToken;
          return session;
        } else {
          session.access_token = account.access_token;
          return session;
        }
      } catch (error) {
        console.error(`Failed to refresh session: ${error}`);
        return session;
      }
    },
  },
} satisfies NextAuthConfig;

export default config;
