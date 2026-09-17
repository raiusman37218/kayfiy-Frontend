"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageShell";
import { createBrowserSupabase } from "@/lib/customerAuth";

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[#7A2A3D] focus:ring-2 focus:ring-[#7A2A3D]/15 hover:border-[#D0C5C5]";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/account");
        return;
      }
      setEmail(user.email || "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();
      setFullName(profile?.full_name || "");
      setPhone(profile?.phone || "");
      setLoading(false);
    }
    load();
  }, [router]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const supabase = createBrowserSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/account");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName, phone, updated_at: new Date().toISOString() });

    if (profileError) {
      setError(profileError.message);
      setSaving(false);
      return;
    }

    if (newPassword) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (passwordError) {
        setError(passwordError.message);
        setSaving(false);
        return;
      }
      setNewPassword("");
    }

    setNotice("Your profile has been updated.");
    setSaving(false);
  };

  return (
    <main>
      <PageHeader
        title="Profile settings"
        blurb="Update your name, phone number and password."
        trail={[{ label: "Account", href: "/account" }, { label: "Profile" }]}
      />

      <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-charcoal">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className={`${field} cursor-not-allowed opacity-60`}
              />
            </div>

            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-charcoal">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={field}
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-charcoal">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={field}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-charcoal">
                New password <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="password"
                type="password"
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className={field}
              />
            </div>

            {error && <p className="text-xs font-medium text-[#7A2A3D]">{error}</p>}
            {notice && (
              <p className="rounded-2xl border border-[#EDC9D0] bg-[#FCF0F2] px-4 py-3 text-xs text-charcoal">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-[#7A2A3D] px-8 py-3.5 text-xs font-bold tracking-[0.16em] text-white uppercase shadow-md transition hover:bg-[#5C1C2C] disabled:opacity-60 cursor-pointer"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
