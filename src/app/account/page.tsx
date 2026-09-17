import type { Metadata } from "next";
import Link from "next/link";
import AccountAuthForms from "@/components/AccountAuthForms";
import SignOutButton from "@/components/SignOutButton";
import { PageHeader } from "@/components/PageShell";
import { createServerSupabase } from "@/lib/customerAuthServer";

export const metadata: Metadata = {
  title: "Account",
  description: "Track orders, save addresses and keep your size on file.",
};

const LINKS = [
  {
    href: "/account/orders",
    title: "Order history",
    blurb: "Track what you've ordered and when it's arriving.",
  },
  {
    href: "/account/addresses",
    title: "Saved addresses",
    blurb: "Keep delivery details ready for a faster checkout.",
  },
  {
    href: "/account/profile",
    title: "Profile settings",
    blurb: "Update your name, phone number and password.",
  },
  {
    href: "/wishlist",
    title: "Wishlist",
    blurb: "The pieces you've saved for later.",
  },
];

export default async function AccountPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main>
        <PageHeader
          title="Account"
          blurb="Sign in to track orders, save addresses and keep your size on file."
          trail={[{ label: "Account" }]}
        />
        <AccountAuthForms />
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.full_name || user.email;

  return (
    <main>
      <PageHeader
        title="My Account"
        blurb={`Signed in as ${displayName}`}
        trail={[{ label: "Account" }]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#7A2A3D] hover:shadow-md"
            >
              <h2 className="text-sm font-bold text-charcoal transition group-hover:text-[#7A2A3D]">
                {link.title}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {link.blurb}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
