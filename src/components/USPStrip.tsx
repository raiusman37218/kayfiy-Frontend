import {
  DiscreetPackageIcon,
  ExchangeBoxIcon,
  FastTruckIcon,
  SecureCoinsIcon,
} from "./ProductTrustBadges";

const USPS = [
  {
    title: "100% Discreet Packaging",
    description: "Tamper-proof unbranded flyer with zero product details on the outer shipping label.",
    icon: <DiscreetPackageIcon className="h-11 w-11" />,
  },
  {
    title: "Free Delivery Nationwide",
    description: "Free express shipping across Pakistan on all orders over Rs. 3,500.",
    icon: <FastTruckIcon className="h-11 w-11" />,
  },
  {
    title: "7-Day Easy Exchange",
    description: "Hassle-free size exchange on all unworn items with tags intact.",
    icon: <ExchangeBoxIcon className="h-11 w-11" />,
  },
  {
    title: "Cash on Delivery (COD)",
    description: "Inspect & pay the courier rider at your doorstep anywhere in Pakistan.",
    icon: <SecureCoinsIcon className="h-11 w-11" />,
  },
];

export default function USPStrip() {
  return (
    <section aria-label="Why shop with KAYFIY" className="border-y border-line bg-cream">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:py-14">
        {USPS.map((usp) => (
          <div key={usp.title} className="flex items-start gap-3.5">
            <div className="shrink-0 transition-transform duration-300 hover:scale-105">{usp.icon}</div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-charcoal">
                {usp.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {usp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
