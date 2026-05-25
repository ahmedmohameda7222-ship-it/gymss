const hardcodedSupabaseUrl = "https://daohqnpwzdsoddmnnubt.supabase.co";
const hardcodedSupabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhb2hxbnB3emRzb2RkbW5udWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MzkwMjgsImV4cCI6MjA5NTMxNTAyOH0.pBo48B5Z4aFiFWmyqsuTd9AYOxkhW_4UvPV-TO63wmA";
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
