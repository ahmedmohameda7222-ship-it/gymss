-- Check Muscle & Strength full workout import counts.

select count(*) as imported_exercise_videos
from public.exercise_videos
where source = 'muscleandstrength_full_import_3105';

select category_type, count(*) as rows
from public.exercise_videos
where source = 'muscleandstrength_full_import_3105'
group by category_type
order by category_type;

select count(*) as materialized_workouts
from public.workouts w
where exists (
  select 1
  from public.exercise_videos ev
  where ev.source = 'muscleandstrength_full_import_3105'
    and lower(ev.exercise_name) = lower(w.name)
    and lower(coalesce(ev.category, 'General')) = lower(w.target_muscle)
);
