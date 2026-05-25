-- S&S Gym materialize imported workout videos as browsable workouts.
-- Replace: supabase/seed/002_sample_workouts_and_videos.sql
-- Run AFTER 005_full_workout_video_import_placeholder.sql.
-- This file no longer inserts 8 sample workouts or 20 sample videos.
-- It converts the 3105 imported exercise_videos rows into rows visible in public.workouts.
-- Safe to re-run: it only inserts workouts that do not already exist for the same name + target_muscle.

begin;

insert into public.workouts (
  name,
  category,
  target_muscle,
  equipment,
  difficulty,
  sets,
  reps,
  rest_seconds,
  instructions,
  notes,
  is_global
)
select
  ev.exercise_name as name,
  coalesce(ev.category_type, 'Exercise') as category,
  coalesce(ev.category, 'General') as target_muscle,
  case
    when ev.category_type = 'Equipment' then coalesce(ev.category, 'Varies')
    else 'Varies'
  end as equipment,
  'Beginner' as difficulty,
  3 as sets,
  '8-12' as reps,
  75 as rest_seconds,
  coalesce(
    ev.instructions,
    'Open the exercise link for the original demo/instructions. Warm up first, keep each rep controlled, use a pain-free range of motion, and stop if you feel sharp or serious pain.'
  ) as instructions,
  ev.exercise_url as notes,
  true as is_global
from public.exercise_videos ev
where ev.is_global = true
  and ev.source = 'muscleandstrength_full_import_3105'
  and not exists (
    select 1
    from public.workouts w
    where lower(w.name) = lower(ev.exercise_name)
      and lower(w.target_muscle) = lower(coalesce(ev.category, 'General'))
  );

insert into public.workout_video_imports (status, imported_count, notes)
values (
  'completed',
  (select count(*) from public.exercise_videos where source = 'muscleandstrength_full_import_3105'),
  'Materialized 3105 Muscle & Strength exercise_videos rows as category-browsable workouts.'
);

commit;
