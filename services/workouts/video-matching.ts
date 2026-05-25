import type { ExerciseVideo, Workout } from "@/types";

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/aka/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function findExerciseVideo(workout: Pick<Workout, "name" | "category" | "target_muscle">, videos: ExerciseVideo[]) {
  const workoutName = normalize(workout.name);
  const workoutCategory = normalize(workout.target_muscle || workout.category);

  return (
    videos.find((video) => normalize(video.exercise_name) === workoutName && normalize(video.category) === workoutCategory) ??
    videos.find((video) => normalize(video.exercise_name) === workoutName) ??
    videos.find((video) => workoutName.includes(normalize(video.exercise_name)) || normalize(video.exercise_name).includes(workoutName)) ??
    null
  );
}

export function isEmbeddableVideo(url: string | null | undefined) {
  if (!url) return false;
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

export function toEmbedUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  }
  return url;
}
