"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageShell";
import { createBrowserSupabase } from "@/lib/customerAuth";

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[#7A2A3D] focus:ring-2 focus:ring-[#7A2A3D]/15 hover:border-[#D0C5C5]";

type Address = {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  postal_code: string | null;
  country: string;
  is_default: boolean;
};

const EMPTY_FORM = {
  label: "Home",
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  postal_code: "",
};

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const reload = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createBrowserSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/account");
        return;
      }
      const { data, error: loadError } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (loadError) setError(loadError.message);
      setAddresses((data || []) as Address[]);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router, refreshKey]);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const supabase = createBrowserSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/account");
      return;
    }
    const { error: insertError } = await supabase.from("addresses").insert({
      user_id: user.id,
      ...form,
      is_default: addresses.length === 0,
    });
    if (insertError) {
      setError(insertError.message);
    } else {
      setForm(EMPTY_FORM);
      reload();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const supabase = createBrowserSupabase();
    const { error: deleteError } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id);
    if (deleteError) setError(deleteError.message);
    else reload();
  };

  const handleMakeDefault = async (id: string) => {
    const supabase = createBrowserSupabase();
    await supabase.from("addresses").update({ is_default: false }).neq("id", id);
    const { error: updateError } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id);
    if (updateError) setError(updateError.message);
    else reload();
  };

  return (
    <main>
      <PageHeader
        title="Saved addresses"
        blurb="Keep your delivery details ready for a faster checkout."
        trail={[{ label: "Account", href: "/account" }, { label: "Addresses" }]}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {error && (
          <p className="mb-6 rounded-2xl border border-[#EDC9D0] bg-[#FCF0F2] px-4 py-3 text-xs text-[#7A2A3D]">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : (
          <>
            {addresses.length > 0 && (
              <ul className="mb-10 space-y-3">
                {addresses.map((address) => (
                  <li
                    key={address.id}
                    className="rounded-2xl border border-line bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 text-sm font-bold text-charcoal">
                          {address.label}
                          {address.is_default && (
                            <span className="rounded-full bg-blush px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#7A2A3D] uppercase">
                              Default
                            </span>
                          )}
                        </p>
                        <address className="mt-2 text-xs not-italic leading-relaxed text-muted">
                          {address.full_name}
                          <br />
                          {address.line1}
                          {address.line2 ? `, ${address.line2}` : ""}
                          <br />
                          {address.city}
                          {address.postal_code ? ` ${address.postal_code}` : ""}, {address.country}
                          <br />
                          {address.phone}
                        </address>
                      </div>
                      <div className="flex gap-3 text-xs">
                        {!address.is_default && (
                          <button
                            type="button"
                            onClick={() => handleMakeDefault(address.id)}
                            className="font-semibold text-[#7A2A3D] underline-offset-4 hover:underline cursor-pointer"
                          >
                            Make default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(address.id)}
                          className="font-semibold text-muted underline-offset-4 hover:text-charcoal hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAdd} className="space-y-4">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-charcoal">
                Add an address
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  placeholder="Label (Home, Office)"
                  aria-label="Label"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className={field}
                />
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  aria-label="Full name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className={field}
                />
              </div>

              <input
                type="tel"
                required
                placeholder="Phone number"
                aria-label="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={field}
              />
              <input
                type="text"
                required
                placeholder="Address"
                aria-label="Address"
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
                className={field}
              />
              <input
                type="text"
                placeholder="Apartment, suite (optional)"
                aria-label="Apartment, suite"
                value={form.line2}
                onChange={(e) => setForm({ ...form, line2: e.target.value })}
                className={field}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  placeholder="City"
                  aria-label="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className={field}
                />
                <input
                  type="text"
                  placeholder="Postcode (optional)"
                  aria-label="Postcode"
                  value={form.postal_code}
                  onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                  className={field}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#7A2A3D] px-8 py-3.5 text-xs font-bold tracking-[0.16em] text-white uppercase shadow-md transition hover:bg-[#5C1C2C] disabled:opacity-60 cursor-pointer"
              >
                {saving ? "Saving…" : "Save address"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
