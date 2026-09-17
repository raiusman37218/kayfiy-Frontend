"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

export default function NewsletterForm({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const isDark = variant === "dark";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setStatus("error");
        setMessage(data.error || "Could not sign you up right now.");
        return;
      }
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Could not sign you up right now.");
    }
  };

  if (status === "done") {
    return (
      <p
        className={`text-sm font-medium ${isDark ? "text-cream" : "text-[#7A2A3D]"}`}
      >
        ✓ You&apos;re on the list — watch your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Email address"
          className={`min-w-0 flex-1 rounded-full border px-4 py-3 text-sm outline-none transition ${
            isDark
              ? "border-cream/25 bg-white/10 text-cream placeholder:text-cream/50 focus:border-cream/60"
              : "border-line bg-white text-charcoal placeholder:text-muted-soft focus:border-[#7A2A3D]"
          }`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`shrink-0 rounded-full px-6 py-3 text-xs font-bold tracking-[0.14em] uppercase transition disabled:opacity-60 cursor-pointer ${
            isDark
              ? "bg-cream text-maroon hover:bg-white"
              : "bg-[#7A2A3D] text-white hover:bg-[#5C1C2C]"
          }`}
        >
          {status === "loading" ? "..." : "Join"}
        </button>
      </div>
      {status === "error" && (
        <p className={`mt-2 text-xs ${isDark ? "text-cream/80" : "text-[#7A2A3D]"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
