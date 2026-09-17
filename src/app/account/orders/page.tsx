import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/PageShell";
import { createServerSupabase } from "@/lib/customerAuthServer";
import { formatPrice } from "@/lib/data";

export const metadata: Metadata = { title: "Order history" };

type OrderRow = {
  id: string;
  order_number: string;
  created_at: string;
  total_pkr: number;
  payment_method: string | null;
  fulfillment_status: string | null;
};

export default async function OrdersPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/account");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, created_at, total_pkr, payment_method, fulfillment_status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (orders || []) as OrderRow[];

  return (
    <main>
      <PageHeader
        title="Order history"
        blurb="Every order placed while signed in to this account."
        trail={[{ label: "Account", href: "/account" }, { label: "Orders" }]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-8 text-center">
            <p className="text-sm text-muted">
              No orders yet. Orders placed as a guest won&apos;t appear here.
            </p>
            <Link
              href="/collections/all"
              className="mt-5 inline-block rounded-full bg-[#7A2A3D] px-7 py-3 text-xs font-bold tracking-[0.16em] text-white uppercase transition hover:bg-[#5C1C2C]"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-[#7A2A3D] hover:shadow-md"
                >
                  <div>
                    <p className="text-sm font-bold text-charcoal">
                      {order.order_number}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {new Date(order.created_at).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {order.payment_method ? ` · ${order.payment_method.toUpperCase()}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-charcoal">
                      {formatPrice(Number(order.total_pkr) || 0)}
                    </p>
                    {order.fulfillment_status && (
                      <p className="mt-1 text-xs text-muted">
                        {order.fulfillment_status}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
