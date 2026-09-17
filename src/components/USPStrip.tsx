import {
  ExchangeBoxIcon,
  FastTruckIcon,
  SecureCoinsIcon,
} from "./ProductTrustBadges";

function PremiumFabricIcon({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Isometric stack of folded fabric */}
      <polygon
        points="32,10 54,20 32,30 10,20"
        fill="#F4EFEB"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polygon
        points="10,20 32,30 32,38 10,28"
        fill="#E8DFD8"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polygon
        points="32,30 54,20 54,28 32,38"
        fill="#DDD3CB"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polygon
        points="10,32 32,42 32,50 10,40"
        fill="#E8DFD8"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polygon
        points="32,42 54,32 54,40 32,50"
        fill="#DDD3CB"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Soft-weave accent */}
      <path
        d="M18 24.5C22 26.5 26 28 30 29.5"
        stroke="#2B2724"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
    </svg>
  );
}

const USPS = [
  {
    title: "Premium Fabric",
    description: "Breathable cotton-modal blends, soft on the skin all day.",
    icon: <PremiumFabricIcon className="h-11 w-11" />,
  },
  {
    title: "Free Delivery",
    description: "Free nationwide on every order over Rs. 3,500.",
    icon: <FastTruckIcon className="h-11 w-11" />,
  },
  {
    title: "Easy Returns",
    description: "7-day size exchange on unworn items with tags.",
    icon: <ExchangeBoxIcon className="h-11 w-11" />,
  },
  {
    title: "Cash on Delivery",
    description: "Pay the rider when your parcel arrives, anywhere in Pakistan.",
    icon: <SecureCoinsIcon className="h-11 w-11" />,
  },
];

export default function USPStrip() {
  return (
    <section aria-label="Why shop with KAYFIY" className="border-y border-line bg-cream">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:py-14">
        {USPS.map((usp) => (
          <div key={usp.title} className="flex items-start gap-3.5">
            <div className="shrink-0">{usp.icon}</div>
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
