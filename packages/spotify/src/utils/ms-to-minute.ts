function formatDuration(duration_ms: number): string {
  const duration_seconds = duration_ms / 1000;

  const minutes = Math.floor(duration_seconds / 60);

  const seconds = Math.floor(duration_seconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default formatDuration;
