/**
 * Bra sizing maths.
 *
 * Band is the underbust measurement rounded to the nearest even inch, and the
 * cup comes from how many inches the bust stands proud of that band. This is
 * the modern (UK-style) method; the older "+4 if even, +5 if odd" rule tends to
 * hand people a band several inches too loose.
 */

export const CUPS = [
  "AA",
  "A",
  "B",
  "C",
  "D",
  "DD",
  "E",
  "F",
  "FF",
  "G",
  "GG",
  "H",
];

export type Unit = "in" | "cm";

export type BraSizeResult = {
  /** Even-numbered band, in inches. */
  band: number;
  cup: string;
  size: string;
  /** Inches the bust stands proud of the band. */
  difference: number;
  underbustIn: number;
  bustIn: number;
  /**
   * Same cup volume, different band: going down a band adds a cup letter and
   * going up a band drops one. Useful when the calculated size is sold out.
   */
  sisterSizes: string[];
};

export type BraSizeError =
  | "missing"
  | "bust-too-small"
  | "out-of-range";

const MIN_UNDERBUST_IN = 24;
const MAX_UNDERBUST_IN = 60;
const MAX_BUST_IN = 80;

export const toInches = (value: number, unit: Unit) =>
  unit === "cm" ? value / 2.54 : value;

export const fromInches = (value: number, unit: Unit) =>
  unit === "cm" ? value * 2.54 : value;

function bandFor(underbustIn: number) {
  return Math.round(underbustIn / 2) * 2;
}

function sisterSizesFor(band: number, cupIndex: number) {
  const sisters: string[] = [];
  if (band - 2 >= 26 && cupIndex + 1 < CUPS.length) {
    sisters.push(`${band - 2}${CUPS[cupIndex + 1]}`);
  }
  if (cupIndex - 1 >= 0) {
    sisters.push(`${band + 2}${CUPS[cupIndex - 1]}`);
  }
  return sisters;
}

export function calculateBraSize(
  underbust: number,
  bust: number,
  unit: Unit = "in",
): { ok: true; result: BraSizeResult } | { ok: false; error: BraSizeError } {
  if (!underbust || !bust) return { ok: false, error: "missing" };

  const underbustIn = toInches(underbust, unit);
  const bustIn = toInches(bust, unit);

  if (
    underbustIn < MIN_UNDERBUST_IN ||
    underbustIn > MAX_UNDERBUST_IN ||
    bustIn > MAX_BUST_IN
  ) {
    return { ok: false, error: "out-of-range" };
  }

  if (bustIn <= underbustIn) return { ok: false, error: "bust-too-small" };

  const band = bandFor(underbustIn);
  const difference = Math.max(0, Math.round(bustIn - band));
  const cupIndex = Math.min(difference, CUPS.length - 1);
  const cup = CUPS[cupIndex];

  return {
    ok: true,
    result: {
      band,
      cup,
      size: `${band}${cup}`,
      difference,
      underbustIn: Math.round(underbustIn * 10) / 10,
      bustIn: Math.round(bustIn * 10) / 10,
      sisterSizes: sisterSizesFor(band, cupIndex),
    },
  };
}
