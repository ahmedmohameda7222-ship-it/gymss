"use client";

import { supabase } from "@/lib/supabase/client";
import { todayIso } from "@/lib/utils";
import { egyptianFoods } from "@/data/egyptian-foods";
import { sampleExerciseVideos, sampleWorkouts } from "@/data/workouts";
import type {
  ExerciseVideo,
  FoodItem,
  FoodLog,
  OnboardingAnswers,
  ProgressEntry,
  WelcomeSettings,
  Workout,
  WorkoutSession
} from "@/types";
import { scaleFoodMacros } from "@/services/nutrition/calculations";

function mockDelay<T>(value: T) {
  return Promise.resolve(value);
}

export async function getGlobalFoods(query = "") {
  if (!supabase) {
    const normalized = query.toLowerCase();
    return mockDelay(egyptianFoods.filter((food) => food.food_name.toLowerCase().includes(normalized)));
  }

  let request = supabase.from("food_items").select("*").eq("is_global", true).order("food_name");
  if (query) request = request.ilike("food_name", `%${query}%`);
  const { data, error } = await request;
  if (error) throw error;
  return (data ?? []) as FoodItem[];
}

export async function getTodayFoodLogs(userId: string, date = todayIso()) {
  if (!supabase) return mockDelay<FoodLog[]>([]);
  const { data, error } = await supabase
    .from("food_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", date)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as FoodLog[];
}

export async function addGlobalFoodToToday({
  userId,
  food,
  quantity,
  mealType = "Meal"
}: {
  userId: string;
  food: FoodItem;
  quantity: number;
  mealType?: string;
}) {
  const macros = scaleFoodMacros(food, quantity);
  const payload = {
    user_id: userId,
    food_item_id: food.id,
    user_food_item_id: null,
    log_date: todayIso(),
    meal_type: mealType,
    food_name: food.food_name,
    serving_size: food.serving_size,
    quantity,
    calories: macros.calories,
    protein_g: macros.protein_g,
    carbs_g: macros.carbs_g,
    fat_g: macros.fat_g,
    notes: null
  };

  if (!supabase) return mockDelay(payload as FoodLog);
  const { data, error } = await supabase.from("food_logs").insert(payload).select("*").single();
  if (error) throw error;
  return data as FoodLog;
}

export async function addCustomFoodLog(payload: Omit<FoodLog, "id">) {
  if (!supabase) return mockDelay({ ...payload, id: crypto.randomUUID() } as FoodLog);
  const { data, error } = await supabase.from("food_logs").insert(payload).select("*").single();
  if (error) throw error;
  return data as FoodLog;
}

export async function updateFoodLogQuantity(log: FoodLog, quantity: number) {
  const unit = {
    calories: log.calories / log.quantity,
    protein_g: log.protein_g / log.quantity,
    carbs_g: log.carbs_g / log.quantity,
    fat_g: log.fat_g / log.quantity
  };
  const macros = scaleFoodMacros(unit, quantity);
  if (!supabase) return mockDelay({ ...log, quantity, ...macros });
  const { data, error } = await supabase
    .from("food_logs")
    .update({ quantity, ...macros })
    .eq("id", log.id)
    .select("*")
    .single();
  if (error) throw error;
  return data as FoodLog;
}

export async function deleteFoodLog(id: string) {
  if (!supabase) return mockDelay(true);
  const { error } = await supabase.from("food_logs").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function copyYesterdaysMeals(userId: string) {
  if (!supabase) return mockDelay<FoodLog[]>([]);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const { data, error } = await supabase.from("food_logs").select("*").eq("user_id", userId).eq("log_date", yesterday.toISOString().slice(0, 10));
  if (error) throw error;
  const copies = (data ?? []).map(({ id: _id, created_at: _created, ...log }) => ({ ...log, log_date: todayIso() }));
  if (!copies.length) return [];
  const inserted = await supabase.from("food_logs").insert(copies).select("*");
  if (inserted.error) throw inserted.error;
  return inserted.data as FoodLog[];
}

export async function getWorkouts(query = "", filters?: { category?: string; equipment?: string; difficulty?: string }) {
  if (!supabase) {
    const normalized = query.toLowerCase();
    return mockDelay(
      sampleWorkouts.filter((workout) => {
        const matchesSearch = workout.name.toLowerCase().includes(normalized) || workout.target_muscle.toLowerCase().includes(normalized);
        const matchesCategory = !filters?.category || workout.category === filters.category;
        const matchesEquipment = !filters?.equipment || workout.equipment === filters.equipment;
        const matchesDifficulty = !filters?.difficulty || workout.difficulty === filters.difficulty;
        return matchesSearch && matchesCategory && matchesEquipment && matchesDifficulty;
      })
    );
  }

  let request = supabase.from("workouts").select("*").eq("is_global", true).order("name");
  if (query) request = request.or(`name.ilike.%${query}%,target_muscle.ilike.%${query}%,equipment.ilike.%${query}%`);
  if (filters?.category) request = request.eq("category", filters.category);
  if (filters?.equipment) request = request.eq("equipment", filters.equipment);
  if (filters?.difficulty) request = request.eq("difficulty", filters.difficulty);
  const { data, error } = await request;
  if (error) throw error;
  return (data ?? []) as Workout[];
}

export async function getWorkout(id: string) {
  if (!supabase) return mockDelay(sampleWorkouts.find((workout) => workout.id === id) ?? sampleWorkouts[0]);
  const { data, error } = await supabase.from("workouts").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Workout;
}

export async function getExerciseVideos(query = "") {
  if (!supabase) return mockDelay(sampleExerciseVideos);
  let request = supabase.from("exercise_videos").select("*").order("exercise_name").limit(100);
  if (query) request = request.ilike("exercise_name", `%${query}%`);
  const { data, error } = await request;
  if (error) throw error;
  return (data ?? []) as ExerciseVideo[];
}

export async function startWorkoutSession(userId: string, workout: Workout) {
  const payload = {
    user_id: userId,
    workout_id: workout.id,
    workout_name: workout.name,
    started_at: new Date().toISOString(),
    completed_at: null,
    duration_minutes: null,
    notes: null,
    status: "started"
  };
  if (!supabase) return mockDelay({ ...payload, id: crypto.randomUUID() } as WorkoutSession);
  const { data, error } = await supabase.from("workout_sessions").insert(payload).select("*").single();
  if (error) throw error;
  return data as WorkoutSession;
}

export async function completeWorkoutSession(sessionId: string, notes: string, durationMinutes: number) {
  if (!supabase) return mockDelay(true);
  const { error } = await supabase
    .from("workout_sessions")
    .update({ status: "completed", completed_at: new Date().toISOString(), notes, duration_minutes: durationMinutes })
    .eq("id", sessionId);
  if (error) throw error;
  return true;
}

export async function getWorkoutHistory(userId: string) {
  if (!supabase) return mockDelay<WorkoutSession[]>([]);
  const { data, error } = await supabase
    .from("workout_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(10);
  if (error) throw error;
  return (data ?? []) as WorkoutSession[];
}

export async function saveOnboarding(answers: OnboardingAnswers) {
  if (!supabase) return mockDelay(answers);
  const { data, error } = await supabase.from("onboarding_answers").upsert(answers, { onConflict: "user_id" }).select("*").single();
  if (error) throw error;
  return data as OnboardingAnswers;
}

export async function getOnboarding(userId: string) {
  if (!supabase) return mockDelay<OnboardingAnswers | null>(null);
  const { data, error } = await supabase.from("onboarding_answers").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data as OnboardingAnswers | null;
}

export async function getProgressEntries(userId: string) {
  if (!supabase) return mockDelay<ProgressEntry[]>([]);
  const { data, error } = await supabase
    .from("progress_entries")
    .select("*")
    .eq("user_id", userId)
    .order("entry_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProgressEntry[];
}

export async function addProgressEntry(
  entry: Omit<ProgressEntry, "id">,
  photos?: File[],
  measurements?: Record<string, number | null>
) {
  if (!supabase) return mockDelay({ ...entry, id: crypto.randomUUID() } as ProgressEntry);
  const client = supabase;
  const { data, error } = await client.from("progress_entries").insert(entry).select("*").single();
  if (error) throw error;

  if (photos?.length) {
    await Promise.all(
      photos.map(async (photo) => {
        const path = `${entry.user_id}/${data.id}/${crypto.randomUUID()}-${photo.name}`;
        const upload = await client.storage.from("progress-photos").upload(path, photo, { upsert: false });
        if (upload.error) throw upload.error;
        const { error: photoError } = await client.from("progress_photos").insert({
          user_id: entry.user_id,
          progress_entry_id: data.id,
          storage_path: path
        });
        if (photoError) throw photoError;
      })
    );
  }

  if (measurements && Object.values(measurements).some((value) => value !== null)) {
    const { error: measurementError } = await client.from("body_measurements").insert({
      user_id: entry.user_id,
      progress_entry_id: data.id,
      measured_at: entry.entry_date,
      ...measurements
    });
    if (measurementError) throw measurementError;
  }

  return data as ProgressEntry;
}

export async function getWelcomeSettings(userId: string): Promise<WelcomeSettings> {
  const fallback: WelcomeSettings = {
    popup_enabled: true,
    show_frequency: "once_per_day",
    default_message: "Welcome back to S&S Gym. Ready for today?"
  };
  if (!supabase) return fallback;

  const [{ data: settings }, { data: custom }] = await Promise.all([
    supabase.from("admin_settings").select("value").eq("key", "welcome_settings").maybeSingle(),
    supabase.from("user_welcome_messages").select("message,popup_enabled,show_frequency").eq("user_id", userId).eq("is_active", true).maybeSingle()
  ]);

  const parsed = (settings?.value as WelcomeSettings | null) ?? fallback;
  return {
    ...parsed,
    default_message: custom?.message ?? parsed.default_message,
    popup_enabled: custom?.popup_enabled ?? parsed.popup_enabled,
    show_frequency: custom?.show_frequency ?? parsed.show_frequency
  };
}

export async function adminUpsertWelcomeMessage(payload: {
  user_id: string;
  message: string;
  popup_enabled: boolean;
  show_frequency: "every_login" | "once_per_day";
}) {
  if (!supabase) return mockDelay(payload);
  const { data, error } = await supabase.from("user_welcome_messages").upsert({ ...payload, is_active: true }, { onConflict: "user_id" }).select("*").single();
  if (error) throw error;
  return data;
}

export async function adminListUsers() {
  if (!supabase) {
    return mockDelay([
      { id: "mock-user", email: "member@ssgym.test", full_name: "S&S Gym Member", role: "admin" }
    ]);
  }
  const { data, error } = await supabase.from("profiles").select("id,email,full_name,role,created_at").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminUpdateUserRole(userId: string, role: "member" | "admin") {
  if (!supabase) return mockDelay(true);
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) throw error;
  return true;
}

export async function adminUpsertGlobalFood(food: Partial<FoodItem>) {
  if (!supabase) return mockDelay(food);
  const { data, error } = await supabase
    .from("food_items")
    .upsert({ ...food, is_global: true, is_editable_by_user: false, cuisine: food.cuisine ?? "Egyptian" })
    .select("*")
    .single();
  if (error) throw error;
  return data as FoodItem;
}

export async function adminUpsertWorkout(workout: Partial<Workout>) {
  if (!supabase) return mockDelay(workout);
  const { data, error } = await supabase.from("workouts").upsert({ ...workout, is_global: true }).select("*").single();
  if (error) throw error;
  return data as Workout;
}

export async function adminUpsertExerciseVideo(video: Partial<ExerciseVideo>) {
  if (!supabase) return mockDelay(video);
  const { data, error } = await supabase.from("exercise_videos").upsert({ ...video, is_global: true }).select("*").single();
  if (error) throw error;
  return data as ExerciseVideo;
}

export async function adminUpdateWelcomeSettings(settings: WelcomeSettings) {
  if (!supabase) return mockDelay(settings);
  const { data, error } = await supabase
    .from("admin_settings")
    .upsert({ key: "welcome_settings", value: settings }, { onConflict: "key" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function adminImportExerciseVideos(rows: Omit<ExerciseVideo, "id" | "is_global">[]) {
  if (!supabase) return mockDelay(rows.length);
  const importResult = await supabase.from("workout_video_imports").insert({ imported_count: rows.length, status: "queued" }).select("id").single();
  if (importResult.error) throw importResult.error;
  const { error } = await supabase.from("exercise_videos").upsert(
    rows.map((row) => ({
      ...row,
      is_global: true,
      source: row.source ?? "admin_import"
    })),
    { onConflict: "exercise_name,category_type,category" }
  );
  if (error) throw error;
  await supabase.from("workout_video_imports").update({ status: "completed" }).eq("id", importResult.data.id);
  return rows.length;
}
