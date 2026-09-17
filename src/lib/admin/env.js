const FALLBACK_ENV = {
  SUPABASE_URL: "https://lavembmsofbxilinjlik.supabase.co",
  NEXT_PUBLIC_SUPABASE_URL: "https://lavembmsofbxilinjlik.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdmVtYm1zb2ZieGlsaW5qbGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5Nzg4NDIsImV4cCI6MjEwMzU1NDg0Mn0.dXIdv7LVeZy77JT56g6dfT7ksTtrZj9Qwiab9PLvvyw",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdmVtYm1zb2ZieGlsaW5qbGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5Nzg4NDIsImV4cCI6MjEwMzU1NDg0Mn0.dXIdv7LVeZy77JT56g6dfT7ksTtrZj9Qwiab9PLvvyw",
  SUPABASE_SERVICE_ROLE_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdmVtYm1zb2ZieGlsaW5qbGlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Nzk3ODg0MiwiZXhwIjoyMTAzNTU0ODQyfQ.gC6XmfG3SFQ7anfAQhcd-KszBxlTFlU2FFAQrEDRHwc",
  ADMIN_SESSION_SECRET:
    "0d9dc1a645be86ab5fa70cc132d5172be4d1cf10adeb4e1b6ec98c481ee711bf",
  ADMIN_PASSWORD: "Admin2026",
  ADMIN_EMAIL: "owner@admin.local",
  ADMIN_USERS_STORE: "supabase",
};

export function optionalEnv(name) {
  return process.env[name] || FALLBACK_ENV[name] || "";
}

export function requiredEnv(name) {
  const value = process.env[name] || FALLBACK_ENV[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function requiredAnyEnv(names) {
  for (const name of names) {
    if (process.env[name]) return process.env[name];
  }
  for (const name of names) {
    if (FALLBACK_ENV[name]) return FALLBACK_ENV[name];
  }
  throw new Error(`Missing required environment variable: ${names.join(" or ")}`);
}
