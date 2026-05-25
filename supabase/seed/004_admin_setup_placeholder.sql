-- Optional: make your own account an admin after registering on the deployed Netlify site.
-- Replace the email below and run this in Supabase SQL Editor.

update public.profiles
set role = 'admin'
where email = 'Ahmeedmostafaa@hotmail.com';
