-- S&S Gym starter workouts and video sources.
-- Run after Egyptian food seed.
-- The app is ready for the full 3000+ video table through exercise_videos and workout_video_imports.

insert into public.workouts (name, category, target_muscle, equipment, difficulty, sets, reps, rest_seconds, instructions, notes, is_global)
values
('Barbell Back Squat','Strength','Quads','Barbell','Intermediate',4,'6-10',120,'Set the bar across your upper back, brace your core, sit between your hips, keep knees tracking over toes, then drive through the floor to stand tall.','Use safety pins and start light.',true),
('Dumbbell Bench Press','Strength','Chest','Dumbbell','Beginner',3,'8-12',90,'Lie flat on a bench, keep feet planted, lower the dumbbells with control, pause near chest level, then press up without locking aggressively.','Keep shoulders down and back.',true),
('Seated Cable Row','Strength','Middle Back','Cable','Beginner',3,'10-12',75,'Sit tall, brace your core, pull the handle toward your lower ribs, squeeze shoulder blades gently, then return with control.','Avoid leaning back to finish reps.',true),
('Lat Pull Down','Strength','Lats','Cable','Beginner',3,'8-12',75,'Hold the bar slightly wider than shoulders, keep chest tall, pull elbows down toward ribs, then return slowly to the top.','Do not pull behind the neck.',true),
('Standing Dumbbell Shoulder Press','Strength','Shoulders','Dumbbell','Intermediate',3,'8-10',90,'Stand tall with ribs down, start dumbbells near shoulders, press overhead in a smooth path, then lower under control.','Avoid over-arching your lower back.',true),
('Plank','Core','Abs','Bodyweight','Beginner',3,'30-60 seconds',60,'Place elbows under shoulders, keep a straight line from head to heels, squeeze glutes lightly, and breathe steadily.','Stop before your hips sag.',true),
('Romanian Deadlift','Strength','Hamstrings','Barbell','Intermediate',3,'8-10',120,'Brace, push hips back, keep the bar close to your legs, lower until hamstrings stretch, then drive hips forward to stand.','Keep your spine neutral.',true),
('Cable Crunch','Core','Abs','Cable','Beginner',3,'10-15',60,'Kneel facing the cable, hold the rope near your temples, curl ribs toward hips, pause, then return slowly.','Move through your spine, not your hips only.',true);

insert into public.exercise_videos (exercise_name, category_type, category, exercise_url, video_url, instructions, source, is_global)
values
('Military Press (AKA Overhead Press)','Muscle Group','Shoulders','https://www.muscleandstrength.com/exercises/military-press.html',null,'Brace your core, press overhead with control, and lower slowly.','user_provided_workout_video_table',true),
('Dumbbell Deadlift','Muscle Group','Hamstrings','https://www.muscleandstrength.com/exercises/dumbbell-deadlift.html',null,'Hinge at your hips, keep the dumbbells close, and stand by driving hips forward.','user_provided_workout_video_table',true),
('Arnold Press','Muscle Group','Shoulders','https://www.muscleandstrength.com/exercises/seated-arnold-press.html',null,'Rotate smoothly from palms-in to overhead press while keeping ribs controlled.','user_provided_workout_video_table',true),
('Dumbbell Laterial Raises','Muscle Group','Shoulders','https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html',null,'Raise dumbbells to shoulder height with soft elbows and controlled tempo.','user_provided_workout_video_table',true),
('Bent Over Rows','Muscle Group','Middle Back','https://www.muscleandstrength.com/exercises/bent-over-barbell-row.html',null,'Hinge, brace, pull toward your lower ribs, and avoid jerking the bar.','user_provided_workout_video_table',true),
('Dumbbell Pullover','Muscle Group','Lats','https://www.muscleandstrength.com/exercises/dumbbell-pullover.html',null,'Lower the dumbbell behind your head with control and pull back using lats and chest.','user_provided_workout_video_table',true),
('Stiff Leg Deadlift (AKA Romanian Deadlift)','Muscle Group','Hamstrings','https://www.muscleandstrength.com/exercises/stiff-leg-deadlift-aka-romanian-deadlift.html',null,'Keep a neutral spine, hinge at the hips, and move through hamstring tension.','user_provided_workout_video_table',true),
('Lying Floor Leg Raise','Muscle Group','Abs','https://www.muscleandstrength.com/exercises/lying-floor-leg-raise.html',null,'Keep your low back controlled and raise/lower legs slowly.','user_provided_workout_video_table',true),
('Weighted Crunch','Muscle Group','Abs','https://www.muscleandstrength.com/exercises/weighted-crunch.html',null,'Curl ribs toward hips and avoid pulling on the neck.','user_provided_workout_video_table',true),
('Sit Up','Muscle Group','Abs','https://www.muscleandstrength.com/exercises/sit-up.html',null,'Move smoothly through your trunk and keep feet anchored only if comfortable.','user_provided_workout_video_table',true),
('Cable Crunch','Muscle Group','Abs','https://www.muscleandstrength.com/exercises/cable-crunch.html',null,'Curl down through your spine with the rope near your head.','user_provided_workout_video_table',true),
('Plank','Muscle Group','Abs','https://www.muscleandstrength.com/exercises/hover.html',null,'Hold a straight line from head to heels and breathe steadily.','user_provided_workout_video_table',true),
('Hanging Leg Raise','Muscle Group','Abs','https://www.muscleandstrength.com/exercises/hanging-leg-raise.html',null,'Control your swing and lift legs using your core.','user_provided_workout_video_table',true),
('Incline Dumbbell Curl','Muscle Group','Biceps','https://www.muscleandstrength.com/exercises/incline-dumbbell-curl.html',null,'Keep upper arms back and curl through a controlled range.','user_provided_workout_video_table',true),
('Standing Barbell Curl','Muscle Group','Biceps','https://www.muscleandstrength.com/exercises/standing-barbell-curl.html',null,'Keep elbows near your sides and avoid swinging.','user_provided_workout_video_table',true),
('Seated Calf Raise','Muscle Group','Calves','https://www.muscleandstrength.com/exercises/seated-calf-raise.html',null,'Pause at the top and lower into a comfortable stretch.','user_provided_workout_video_table',true),
('Dumbbell Bench Press','Muscle Group','Chest','https://www.muscleandstrength.com/exercises/dumbbell-bench-press.html',null,'Lower with control, keep shoulder blades set, and press smoothly.','user_provided_workout_video_table',true),
('Barbell Back Squat','Muscle Group','Quads','https://www.muscleandstrength.com/exercises/squat.html',null,'Brace, squat to a safe depth, and drive through the floor.','user_provided_workout_video_table',true),
('Lat Pull Down','Muscle Group','Lats','https://www.muscleandstrength.com/exercises/lat-pull-down.html',null,'Pull elbows down toward your ribs and return slowly.','user_provided_workout_video_table',true),
('Seated Cable Row','Muscle Group','Middle Back','https://www.muscleandstrength.com/exercises/seated-row.html',null,'Sit tall, row toward lower ribs, and squeeze shoulder blades gently.','user_provided_workout_video_table',true)
on conflict (exercise_name, category_type, category) do update
set exercise_url = excluded.exercise_url,
    video_url = excluded.video_url,
    instructions = excluded.instructions,
    source = excluded.source,
    updated_at = now();
