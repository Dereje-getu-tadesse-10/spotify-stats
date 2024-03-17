export function formatDuration(durationMs: number): string {
  const durationSeconds = durationMs / 1000;

  const minutes = Math.floor(durationSeconds / 60);

  const seconds = Math.floor(durationSeconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
