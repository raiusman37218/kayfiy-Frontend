"use client";

import { useState } from "react";

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-rose";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="rounded-3xl bg-blush/60 px-6 py-8 text-center text-sm text-charcoal">
        Thanks for writing in — we reply within one working day, Monday to
        Saturday.
      </p>
    );
  }

  return (
    <form
      className="grid gap-4 rounded-3xl bg-blush/50 p-6 sm:grid-cols-2 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <div>
        <label htmlFor="contact-name" className="text-xs text-muted">
          Name
        </label>
        <input id="contact-name" required className={`mt-1 ${field}`} />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-xs text-muted">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          className={`mt-1 ${field}`}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="contact-order" className="text-xs text-muted">
          Order number (optional)
        </label>
        <input id="contact-order" className={`mt-1 ${field}`} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="contact-message" className="text-xs text-muted">
          How can we help?
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          className={`mt-1 ${field}`}
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-charcoal px-8 py-3.5 text-xs tracking-[0.16em] text-cream uppercase transition hover:bg-rose sm:col-span-2"
      >
        Send Message
      </button>
    </form>
  );
}
