import { Session } from "next-auth";
import { auth } from "../lib/auth/auth";
import { Spotify } from "@repo/spotify";

export default async function Page() {
  const session: Session | null = await auth();
  if (!session) return;

  const client = new Spotify(session.access_token as string);

  const user = await client.me.getPlaylists();

  console.log(user);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24 bg-red-500">
      <h1>hello</h1>
    </main>
  );
}
