const hardcodedSupabaseUrl = "https://rxezxgvvlaihvpfxrpkj.supabase.co";
const hardcodedSupabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZXp4Z3Z2bGFpaHZwZnhycGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NTQyOTksImV4cCI6MjA5NTIzMDI5OX0.h2PlBV75cFbwK9RmPdI-D7jY1-l5LflaV9Q80DdXfi4";
const hardcodedAppUrl = "https://ssgym.netlify.app";

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || hardcodedSupabaseUrl,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || hardcodedSupabaseAnonKey,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || hardcodedAppUrl,
  useMockAuth: process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true"
};

export function hasSupabaseEnv() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
