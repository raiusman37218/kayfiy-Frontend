"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/data";
import {
  calculateBraSize,
  type BraSizeResult,
  type Unit,
} from "@/lib/braSize";

export type SizedProduct = {
  slug: string;
  name: string;
  image: string;
  price: number;
  sizes: string[];
};

type Outcome =
  | { kind: "result"; result: BraSizeResult }
  | { kind: "error"; message: string };

const UNIT_LABEL: Record<Unit, string> = { in: "inches", cm: "cm" };

const ERRORS: Record<string, string> = {
  missing: "Please fill in both measurements.",
  "bust-too-small":
    "Your bust measurement should be larger than your underbust. Measure again with the tape snug but not tight.",
  "out-of-range":
    "That looks outside our sizing range. Check the tape is in inches (or switch to cm above).",
};

const STEPS = [
  {
    n: "1",
    title: "Underbust",
    body: "Wrap the tape around your ribcage directly under your bust. Keep it snug and level all the way around.",
  },
  {
    n: "2",
    title: "Fullest bust",
    body: "Measure across the fullest part of your bust over a thin, non-padded bra. Snug, never tight.",
  },
];

export default function BraSizeCalculator({
  products = [],
}: {
  products?: SizedProduct[];
}) {
  const [unit, setUnit] = useState<Unit>("in");
  const [underbust, setUnderbust] = useState("");
  const [bust, setBust] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const result = outcome?.kind === "result" ? outcome.result : null;

  /** Bras the shop actually stocks in the calculated size. */
  const inYourSize = useMemo(() => {
    if (!result) return [];
    return products.filter((p) => p.sizes.includes(result.size));
  }, [result, products]);

  /** Fallbacks when the exact size isn't stocked. */
  const inSisterSizes = useMemo(() => {
    if (!result) return [];
    return result.sisterSizes
      .map((size) => ({
        size,
        count: products.filter((p) => p.sizes.includes(size)).length,
      }))
      .filter((entry) => entry.count > 0);
  }, [result, products]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const outcomeNow = calculateBraSize(Number(underbust), Number(bust), unit);
    setOutcome(
      outcomeNow.ok
        ? { kind: "result", result: outcomeNow.result }
        : { kind: "error", message: ERRORS[outcomeNow.error] },
    );
  };

  const handleReset = () => {
    setUnderbust("");
    setBust("");
    setOutcome(null);
  };

  const switchUnit = (next: Unit) => {
    if (next === unit) return;
    // Carry the numbers across so nothing has to be re-measured.
    const convert = (value: string) => {
      const n = Number(value);
      if (!value || Number.isNaN(n)) return value;
      const converted = next === "cm" ? n * 2.54 : n / 2.54;
      return String(Math.round(converted * 10) / 10);
    };
    setUnderbust(convert(underbust));
    setBust(convert(bust));
    setUnit(next);
    setOutcome(null);
  };

  const field =
    "w-full rounded-2xl border border-line bg-white px-4 py-3 pr-16 text-base text-charcoal outline-none transition focus:border-maroon focus:ring-2 focus:ring-maroon/15";

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
      {/* How to measure */}
      <div className="grid gap-px bg-line sm:grid-cols-2">
        {STEPS.map((step) => (
          <div key={step.n} className="bg-blush/50 p-5 sm:p-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-maroon text-[11px] font-bold text-white">
                {step.n}
              </span>
              <h3 className="font-[family-name:var(--font-heading)] text-base font-bold text-charcoal">
                {step.title}
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {step.body}
            </p>
          </div>
        ))}
      </div>

      <div className="p-5 sm:p-7">
        {/* Unit toggle */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-bold tracking-[0.14em] text-muted uppercase">
            Your measurements
          </span>
          <div
            role="group"
            aria-label="Measurement unit"
            className="flex rounded-full border border-line bg-blush/60 p-0.5"
          >
            {(["in", "cm"] as Unit[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => switchUnit(option)}
                aria-pressed={unit === option}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wide uppercase transition ${
                  unit === option
                    ? "bg-maroon text-white shadow-2xs"
                    : "text-muted hover:text-charcoal"
                }`}
              >
                {option === "in" ? "Inches" : "Cm"}
              </button>
            ))}
          </div>
        </div>

        <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          {[
            {
              id: "underbust",
              label: "Underbust",
              hint: "Right under your bust",
              value: underbust,
              set: setUnderbust,
              placeholder: unit === "in" ? "32" : "81",
            },
            {
              id: "bust",
              label: "Fullest bust",
              hint: "Across the fullest point",
              value: bust,
              set: setBust,
              placeholder: unit === "in" ? "36" : "91",
            },
          ].map((input) => (
            <div key={input.id}>
              <label
                htmlFor={input.id}
                className="text-sm font-medium text-charcoal"
              >
                {input.label}
              </label>
              <p className="text-[11px] text-muted">{input.hint}</p>
              <div className="relative mt-1.5">
                <input
                  id={input.id}
                  type="number"
                  inputMode="decimal"
                  min={unit === "in" ? 20 : 50}
                  max={unit === "in" ? 80 : 200}
                  step="0.5"
                  required
                  value={input.value}
                  onChange={(event) => input.set(event.target.value)}
                  placeholder={input.placeholder}
                  className={field}
                />
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs font-medium text-muted-soft">
                  {UNIT_LABEL[unit]}
                </span>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-full bg-maroon px-8 py-3.5 text-xs font-bold tracking-[0.16em] text-cream uppercase transition hover:bg-maroon-dark sm:flex-none sm:px-10"
            >
              Calculate my size
            </button>
            {outcome && (
              <button
                type="button"
                onClick={handleReset}
                className="cursor-pointer rounded-full border border-line px-6 py-3.5 text-xs font-bold tracking-[0.16em] text-muted uppercase transition hover:border-maroon hover:text-maroon"
              >
                Start over
              </button>
            )}
          </div>
        </form>

        {/* Outcome */}
        <div aria-live="polite">
          {outcome?.kind === "error" && (
            <p className="mt-5 rounded-2xl border border-[#EDC9D0] bg-[#FCF0F2] px-5 py-4 text-sm text-charcoal">
              {outcome.message}
            </p>
          )}

          {result && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-line">
              {/* The size */}
              <div className="bg-maroon px-6 py-7 text-center text-white">
                <p className="text-[11px] font-bold tracking-[0.2em] text-white/70 uppercase">
                  Your KAYFIY size
                </p>
                <p className="mt-1 font-[family-name:var(--font-heading)] text-6xl font-extrabold tracking-tight">
                  {result.size}
                </p>
                <p className="mt-2 text-xs text-white/75">
                  Band {result.band} · cup {result.cup}
                </p>
              </div>

              {/* How we got there */}
              <div className="grid grid-cols-3 divide-x divide-line border-b border-line bg-blush/40 text-center">
                {[
                  {
                    label: "Underbust",
                    value: `${result.underbustIn}"`,
                    note: `rounds to band ${result.band}`,
                  },
                  {
                    label: "Bust",
                    value: `${result.bustIn}"`,
                    note: "fullest point",
                  },
                  {
                    label: "Difference",
                    value: `${result.difference}"`,
                    note: `cup ${result.cup}`,
                  },
                ].map((cell) => (
                  <div key={cell.label} className="px-2 py-3.5">
                    <p className="text-[10px] font-bold tracking-[0.12em] text-muted uppercase">
                      {cell.label}
                    </p>
                    <p className="mt-1 text-base font-bold text-charcoal">
                      {cell.value}
                    </p>
                    <p className="text-[10px] text-muted">{cell.note}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                {/* Sister sizes */}
                {result.sisterSizes.length > 0 && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">
                      Sister sizes
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {result.sisterSizes.map((size) => (
                        <span
                          key={size}
                          className="rounded-full border border-line bg-blush px-3 py-1 text-xs font-bold text-charcoal"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted">
                      Same cup volume, different band. If {result.size} feels
                      tight around the ribs, try the larger band; if it rides
                      up, try the smaller one.
                    </p>
                  </div>
                )}

                {/* Availability */}
                {inYourSize.length > 0 ? (
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-charcoal">
                        {inYourSize.length}{" "}
                        {inYourSize.length === 1 ? "bra" : "bras"} available in{" "}
                        {result.size}
                      </p>
                      <Link
                        href="/collections/bras"
                        className="text-xs font-semibold text-maroon underline-offset-4 hover:underline"
                      >
                        See all bras →
                      </Link>
                    </div>

                    <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {inYourSize.slice(0, 4).map((product) => (
                        <li key={product.slug}>
                          <Link
                            href={`/products/${product.slug}`}
                            className="group block"
                          >
                            <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-blush">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(min-width: 640px) 160px, 45vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <p className="mt-2 line-clamp-2 text-xs font-medium text-charcoal transition group-hover:text-maroon">
                              {product.name}
                            </p>
                            <p className="text-xs font-bold text-maroon">
                              {formatPrice(product.price)}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#EDC9D0] bg-[#FCF0F2] p-4">
                    <p className="text-sm font-semibold text-charcoal">
                      We don&apos;t stock {result.size} right now
                    </p>
                    {inSisterSizes.length > 0 ? (
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">
                        Your sister{" "}
                        {inSisterSizes.length === 1 ? "size" : "sizes"}{" "}
                        {inSisterSizes
                          .map((entry) => `${entry.size} (${entry.count})`)
                          .join(" and ")}{" "}
                        {inSisterSizes.length === 1 ? "is" : "are"} in stock and
                        will fit the same cup volume.
                      </p>
                    ) : (
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">
                        Message us and we&apos;ll tell you the moment it&apos;s
                        back, or suggest the closest fit we carry.
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href="/collections/bras"
                        className="rounded-full bg-maroon px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-white uppercase transition hover:bg-maroon-dark"
                      >
                        Browse bras
                      </Link>
                      <Link
                        href="/pages/contact"
                        className="rounded-full border border-line px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-charcoal uppercase transition hover:border-maroon hover:text-maroon"
                      >
                        Contact us
                      </Link>
                    </div>
                  </div>
                )}

                <p className="border-t border-line pt-4 text-[11px] leading-relaxed text-muted">
                  A calculator is a starting point — cup volume feels different
                  between a padded t-shirt bra and a soft bralette. Order your
                  calculated size first; your first exchange is on us.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
