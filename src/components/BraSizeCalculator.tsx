"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Standard band + cup derivation. Band is rounded to the nearest even inch;
 * cup letter comes from the difference between bust and band.
 */
const CUPS = ["AA", "A", "B", "C", "D", "DD", "E", "F", "FF", "G"];

function calculate(underbust: number, bust: number) {
  if (!underbust || !bust || bust <= underbust) return null;

  const band = Math.round(underbust / 2) * 2;
  const difference = Math.round(bust - band);
  if (difference < 0) return null;

  const cup = CUPS[Math.min(difference, CUPS.length - 1)];
  return { band, cup, size: `${band}${cup}` };
}

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-rose";

export default function BraSizeCalculator() {
  const [underbust, setUnderbust] = useState("");
  const [bust, setBust] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calculate>>(null);
  const [touched, setTouched] = useState(false);

  return (
    <div className="rounded-3xl bg-blush/50 p-6 sm:p-8">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          setTouched(true);
          setResult(calculate(Number(underbust), Number(bust)));
        }}
      >
        <div>
          <label htmlFor="underbust" className="text-xs text-muted">
            Underbust (inches)
          </label>
          <input
            id="underbust"
            type="number"
            min={24}
            max={60}
            step="0.5"
            required
            value={underbust}
            onChange={(event) => setUnderbust(event.target.value)}
            placeholder="e.g. 32"
            className={`mt-1 ${field}`}
          />
        </div>

        <div>
          <label htmlFor="bust" className="text-xs text-muted">
            Fullest bust (inches)
          </label>
          <input
            id="bust"
            type="number"
            min={26}
            max={70}
            step="0.5"
            required
            value={bust}
            onChange={(event) => setBust(event.target.value)}
            placeholder="e.g. 36"
            className={`mt-1 ${field}`}
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-charcoal px-8 py-3.5 text-xs tracking-[0.16em] text-cream uppercase transition hover:bg-rose sm:col-span-2"
        >
          Calculate My Size
        </button>
      </form>

      {touched && (
        <div aria-live="polite" className="mt-6">
          {result ? (
            <div className="rounded-2xl bg-cream p-6 text-center">
              <p className="text-xs tracking-[0.18em] text-muted uppercase">
                Your KAYFIY size
              </p>
              <p className="mt-2 font-serif text-5xl text-charcoal">
                {result.size}
              </p>
              <p className="mt-2 text-sm text-muted">
                Band {result.band}, cup {result.cup}. If you are between sizes,
                take the smaller band and go one cup up.
              </p>
              <Link
                href="/collections/bras"
                className="mt-5 inline-block rounded-full bg-rose px-7 py-3 text-xs tracking-[0.16em] text-white uppercase transition hover:bg-rose-dark"
              >
                Shop {result.size} Bras
              </Link>
            </div>
          ) : (
            <p className="rounded-2xl bg-cream px-5 py-4 text-sm text-charcoal">
              Those numbers do not look right — your bust measurement should be
              larger than your underbust. Measure again with the tape snug but
              not tight.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
