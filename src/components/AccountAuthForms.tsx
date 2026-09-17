"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/customerAuth";

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[#7A2A3D] focus:ring-2 focus:ring-[#7A2A3D]/15 hover:border-[#D0C5C5]";

type Mode = "sign-in" | "register" | "forgot";

export default function AccountAuthForms() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    const supabase = createBrowserSupabase();

    try {
      if (mode === "sign-in") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.refresh();
        return;
      }

      if (mode === "register") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          router.refresh();
          return;
        }
        setNotice(
          "Check your inbox to confirm your email address, then sign in.",
        );
        setMode("sign-in");
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/account/reset-password` },
      );
      if (resetError) throw resetError;
      setNotice("We've sent you a password reset link.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <div className="flex gap-1 rounded-2xl border border-line bg-blush/60 p-1">
        {(["sign-in", "register"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => switchMode(option)}
            aria-pressed={mode === option}
            className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-bold tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer ${
              mode === option
                ? "bg-[#7A2A3D] text-cream shadow-md"
                : "text-charcoal hover:bg-white/50 hover:text-[#7A2A3D]"
            }`}
          >
            {option === "sign-in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      {notice && (
        <div className="mt-6 rounded-2xl border border-[#EDC9D0] bg-[#FCF0F2] px-5 py-4 text-sm text-charcoal animate-scale-in">
          {notice}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "register" && (
          <div>
            <label htmlFor="full-name" className="mb-1.5 block text-xs font-semibold text-charcoal">
              Full name
            </label>
            <input
              id="full-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={field}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-charcoal">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
        </div>

        {mode !== "forgot" && (
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-charcoal">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
            />
          </div>
        )}

        {error && <p className="text-xs font-medium text-[#7A2A3D]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#7A2A3D] px-8 py-3.5 text-xs font-bold tracking-[0.16em] text-white uppercase shadow-md transition hover:bg-[#5C1C2C] disabled:opacity-60 cursor-pointer"
        >
          {loading
            ? "Please wait..."
            : mode === "sign-in"
              ? "Sign in"
              : mode === "register"
                ? "Create account"
                : "Send reset link"}
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-muted">
        {mode === "forgot" ? (
          <button
            type="button"
            onClick={() => switchMode("sign-in")}
            className="font-semibold text-[#7A2A3D] underline-offset-4 hover:underline cursor-pointer"
          >
            Back to sign in
          </button>
        ) : (
          <button
            type="button"
            onClick={() => switchMode("forgot")}
            className="font-semibold text-[#7A2A3D] underline-offset-4 hover:underline cursor-pointer"
          >
            Forgot your password?
          </button>
        )}
      </div>
    </div>
  );
}
