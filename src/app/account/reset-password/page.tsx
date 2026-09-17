"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageShell";
import { createBrowserSupabase } from "@/lib/customerAuth";

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[#7A2A3D] focus:ring-2 focus:ring-[#7A2A3D]/15 hover:border-[#D0C5C5]";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const supabase = createBrowserSupabase();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }
    router.push("/account");
  };

  return (
    <main>
      <PageHeader
        title="Set a new password"
        blurb="Choose a new password for your KAYFIY account."
        trail={[{ label: "Account", href: "/account" }, { label: "Reset password" }]}
      />

      <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-charcoal">
              New password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
            />
          </div>

          {error && <p className="text-xs font-medium text-[#7A2A3D]">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-[#7A2A3D] px-8 py-3.5 text-xs font-bold tracking-[0.16em] text-white uppercase shadow-md transition hover:bg-[#5C1C2C] disabled:opacity-60 cursor-pointer"
          >
            {saving ? "Saving…" : "Update password"}
          </button>

          <p className="text-center text-xs text-muted">
            Open this page from the reset link we emailed you.
          </p>
        </form>
      </div>
    </main>
  );
}
