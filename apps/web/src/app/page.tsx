import { auth } from "../lib/auth/auth";
import { SpotifyClient } from "@repo/spotify";
export default async function Page() {
  const session = await auth();
  if (!session) return null;

  const client = new SpotifyClient(session.access_token as string);

  const user = await client.me.getPlaylists();
  console.log(user);
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24 bg-red-500"></main>
  );
}
