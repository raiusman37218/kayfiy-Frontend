import { createBrowserClient } from "@supabase/ssr";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://lavembmsofbxilinjlik.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdmVtYm1zb2ZieGlsaW5qbGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5Nzg4NDIsImV4cCI6MjEwMzU1NDg0Mn0.dXIdv7LVeZy77JT56g6dfT7ksTtrZj9Qwiab9PLvvyw";

/** Browser-side Supabase client with a persisted auth session (cookie-backed). */
export function createBrowserSupabase() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};
