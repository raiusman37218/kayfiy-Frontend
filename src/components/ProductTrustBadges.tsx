"use client";

export function DiscreetPackageIcon({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 3D Isometric Plain Box with discreet padlock */}
      <polygon
        points="32,8 56,19 32,30 8,19"
        fill="#F4EFEB"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polygon
        points="8,19 32,30 32,56 8,45"
        fill="#E8DFD8"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polygon
        points="32,30 56,19 56,45 32,56"
        fill="#DDD3CB"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Discreet Lock badge on front */}
      <rect
        x="40"
        y="35"
        width="10"
        height="8"
        rx="2"
        fill="#2B2724"
      />
      <path
        d="M42 35V32C42 30.34 43.34 29 45 29C46.66 29 48 30.34 48 32V35"
        stroke="#2B2724"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="45" cy="39" r="1" fill="#F4EFEB" />
    </svg>
  );
}

export function ExchangeBoxIcon({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 3D Isometric Cardboard Box */}
      {/* Top Face */}
      <polygon
        points="32,6 58,18 32,30 6,18"
        fill="#F4EFEB"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Left Face */}
      <polygon
        points="6,18 32,30 32,58 6,46"
        fill="#E8DFD8"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Right Face */}
      <polygon
        points="32,30 58,18 58,46 32,58"
        fill="#DDD3CB"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Tape on Top */}
      <polygon
        points="22,11.5 42,20.5 42,24.5 22,15.5"
        fill="#C4B5A5"
        stroke="#2B2724"
        strokeWidth="1.5"
      />
      {/* Side Handle Cutout */}
      <path
        d="M14 30C14 28.5 16 28 19 29C22 30 23 32 23 33.5C23 35 21 35.5 18 34.5C15 33.5 14 31.5 14 30Z"
        fill="#2B2724"
      />
      {/* Front Return Arrow Accent */}
      <path
        d="M40 44L46 38M46 38L52 44M46 38V50"
        stroke="#2B2724"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FastTruckIcon({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 3D Isometric Delivery Truck */}
      {/* Cargo Box Roof */}
      <polygon
        points="14,12 40,6 48,15 22,21"
        fill="#F4EFEB"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Cargo Box Left Side */}
      <polygon
        points="14,12 22,21 22,44 14,35"
        fill="#E8DFD8"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Cargo Box Right Side */}
      <polygon
        points="22,21 48,15 48,38 22,44"
        fill="#DDD3CB"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Cabin Roof */}
      <polygon
        points="48,18 56,24 51,28 43,22"
        fill="#F4EFEB"
        stroke="#2B2724"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Cabin Front / Hood */}
      <polygon
        points="51,28 56,24 60,34 55,38"
        fill="#E8DFD8"
        stroke="#2B2724"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Cabin Side */}
      <polygon
        points="43,22 51,28 55,38 48,34"
        fill="#DDD3CB"
        stroke="#2B2724"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Cabin Window */}
      <polygon
        points="45,24 50,28 50,33 45,29"
        fill="#2B2724"
        opacity="0.8"
      />
      {/* Front Wheel */}
      <ellipse
        cx="53"
        cy="45"
        rx="4.5"
        ry="6"
        fill="#2B2724"
      />
      <ellipse
        cx="53"
        cy="45"
        rx="2"
        ry="3"
        fill="#F4EFEB"
      />
      {/* Rear Wheel 1 */}
      <ellipse
        cx="33"
        cy="49"
        rx="4.5"
        ry="6"
        fill="#2B2724"
      />
      <ellipse
        cx="33"
        cy="49"
        rx="2"
        ry="3"
        fill="#F4EFEB"
      />
      {/* Rear Wheel 2 */}
      <ellipse
        cx="21"
        cy="46"
        rx="4"
        ry="5"
        fill="#2B2724"
      />
      {/* Speed lines */}
      <line x1="6" y1="20" x2="10" y2="20" stroke="#2B2724" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="28" x2="9" y2="28" stroke="#2B2724" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SecureCoinsIcon({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 3D Isometric Coins Stack & Shield */}
      {/* Coin Stack Behind */}
      {/* Coin 1 Bottom */}
      <path
        d="M32 38C42 38 50 33 50 27V33C50 39 42 44 32 44C22 44 14 39 14 33V27C14 33 22 38 32 38Z"
        fill="#DDD3CB"
        stroke="#2B2724"
        strokeWidth="2.2"
      />
      {/* Coin 2 Middle */}
      <path
        d="M32 29C42 29 50 24 50 18V24C50 30 42 35 32 35C22 35 14 30 14 24V18C14 24 22 29 32 29Z"
        fill="#E8DFD8"
        stroke="#2B2724"
        strokeWidth="2.2"
      />
      {/* Coin 3 Top */}
      <ellipse
        cx="32"
        cy="18"
        rx="18"
        ry="9"
        fill="#F4EFEB"
        stroke="#2B2724"
        strokeWidth="2.5"
      />
      <ellipse
        cx="32"
        cy="18"
        rx="13"
        ry="6"
        fill="none"
        stroke="#2B2724"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />
      {/* Currency / Rupee Rs / Lock mark */}
      <path
        d="M28 14H36M28 17H34M28 14V22M32 17C34 17 35 18 35 19C35 20.5 34 21 32 21M32 21L36 24"
        stroke="#2B2724"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Front Standing Coin with Shield / Checkmark */}
      <ellipse
        cx="20"
        cy="40"
        rx="10"
        ry="15"
        fill="#F4EFEB"
        stroke="#2B2724"
        strokeWidth="2.5"
      />
      <path
        d="M16 40L19 43L24 37"
        stroke="#2B2724"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function QualityMedalIcon({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 3D Isometric Medal Ribbon with Star */}
      {/* Ribbon Left */}
      <polygon
        points="22,34 16,56 24,50 30,56 26,38"
        fill="#DDD3CB"
        stroke="#2B2724"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Ribbon Right */}
      <polygon
        points="42,34 48,56 40,50 34,56 38,38"
        fill="#C4B5A5"
        stroke="#2B2724"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Medal Outer Rim */}
      <ellipse
        cx="34"
        cy="24"
        rx="17"
        ry="17"
        fill="#E8DFD8"
        stroke="#2B2724"
        strokeWidth="2.5"
      />
      {/* Medal Inner Face */}
      <ellipse
        cx="34"
        cy="24"
        rx="13"
        ry="13"
        fill="#F4EFEB"
        stroke="#2B2724"
        strokeWidth="1.8"
      />
      {/* Star in Center */}
      <polygon
        points="34,14 37.5,21 45,21.8 39.5,27 41,34.5 34,30.5 27,34.5 28.5,27 23,21.8 30.5,21"
        fill="#2B2724"
      />
    </svg>
  );
}

export default function ProductTrustBadges() {
  const badges = [
    {
      title: "Easy exchanges",
      description: "7-day returns with quick replacements or easy exchanges, no hassle.",
      icon: <ExchangeBoxIcon className="h-10 w-10 sm:h-11 sm:w-11 shrink-0" />,
    },
    {
      title: "Fast shipping",
      description: "2–4 working days nationwide delivery, free on orders over Rs. 3,500.",
      icon: <FastTruckIcon className="h-10 w-10 sm:h-11 sm:w-11 shrink-0" />,
    },
    {
      title: "Secure checkout",
      description: "Cash on delivery & verified payment options for 100% peace of mind.",
      icon: <SecureCoinsIcon className="h-10 w-10 sm:h-11 sm:w-11 shrink-0" />,
    },
    {
      title: "Quality guaranteed",
      description: "Every item is carefully inspected to meet our standards for fit & comfort.",
      icon: <QualityMedalIcon className="h-10 w-10 sm:h-11 sm:w-11 shrink-0" />,
    },
  ];

  return (
    <div className="mt-8 rounded-2xl border border-line bg-[#FCF9F3] p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 gap-y-5">
        {badges.map((badge) => (
          <div key={badge.title} className="flex items-start gap-3">
            <div className="shrink-0 pt-0.5">{badge.icon}</div>
            <div>
              <h3 className="font-sans text-xs sm:text-sm font-bold text-black tracking-tight leading-snug">
                {badge.title}
              </h3>
              <p className="mt-0.5 text-[11px] sm:text-xs text-muted leading-relaxed">
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
