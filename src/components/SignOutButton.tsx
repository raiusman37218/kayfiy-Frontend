"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/customerAuth";

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={
        className ||
        "rounded-full border border-line px-5 py-2.5 text-xs font-bold tracking-[0.14em] text-charcoal uppercase transition hover:border-charcoal hover:bg-blush cursor-pointer"
      }
    >
      Sign out
    </button>
  );
}
