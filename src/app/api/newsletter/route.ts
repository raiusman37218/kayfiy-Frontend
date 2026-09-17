import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });

    // 23505 = unique violation: already subscribed, which is a success for the user.
    if (error && error.code !== "23505") {
      console.warn("Newsletter subscribe error:", error.message);
      return NextResponse.json(
        { success: false, error: "Could not sign you up right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not sign you up right now." },
      { status: 500 },
    );
  }
}
