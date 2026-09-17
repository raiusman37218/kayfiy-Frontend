import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/PageShell";
import { createServerSupabase } from "@/lib/customerAuthServer";
import { formatPrice } from "@/lib/data";

export const metadata: Metadata = { title: "Order detail" };

type OrderItemRow = {
  id: string;
  title: string;
  quantity: number;
  unit_price_pkr: number;
  line_total_pkr: number;
  size: string | null;
  image_url: string | null;
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/account");

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("id, title, quantity, unit_price_pkr, line_total_pkr, size, image_url")
    .eq("order_id", id);

  const lines = (items || []) as OrderItemRow[];

  return (
    <main>
      <PageHeader
        title={order.order_number}
        blurb={`Placed ${new Date(order.created_at).toLocaleDateString("en-PK", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`}
        trail={[
          { label: "Account", href: "/account" },
          { label: "Orders", href: "/account/orders" },
          { label: order.order_number },
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 p-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-blush">
                    {line.image_url && (
                      <Image
                        src={line.image_url}
                        alt={line.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal">{line.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {line.size ? `Size ${line.size} · ` : ""}Qty {line.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-charcoal">
                    {formatPrice(Number(line.line_total_pkr) || 0)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-line bg-white p-5">
              <h2 className="text-xs font-bold tracking-wider text-charcoal uppercase">
                Summary
              </h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="text-charcoal">
                    {formatPrice(Number(order.subtotal_pkr) || 0)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="text-charcoal">
                    {Number(order.shipping_fee_pkr) > 0
                      ? formatPrice(Number(order.shipping_fee_pkr))
                      : "Free"}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2 font-bold">
                  <dt className="text-charcoal">Total</dt>
                  <dd className="text-charcoal">
                    {formatPrice(Number(order.total_pkr) || 0)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 text-sm">
              <h2 className="text-xs font-bold tracking-wider text-charcoal uppercase">
                Delivery
              </h2>
              <address className="mt-3 not-italic leading-relaxed text-muted">
                {order.shipping_full_name}
                <br />
                {order.shipping_line1}
                <br />
                {order.shipping_city}
                {order.shipping_postal_code ? ` ${order.shipping_postal_code}` : ""}
                <br />
                {order.shipping_phone}
              </address>
              {order.fulfillment_status && (
                <p className="mt-4 text-xs text-muted">
                  Status: <span className="font-semibold text-charcoal">{order.fulfillment_status}</span>
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
