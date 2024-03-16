import { antiHero } from "@repo/spotify";
export default function Page(): JSX.Element {
  const response = antiHero();

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24 bg-red-500">
      <h1>{response}</h1>
    </main>
  );
}
