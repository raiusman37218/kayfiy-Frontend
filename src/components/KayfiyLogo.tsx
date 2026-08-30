"use client";

import Image from "next/image";

interface KayfiyLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function KayfiyLogo({ className = "", size = "lg" }: KayfiyLogoProps) {
  // Lady size (elegant & delicate)
  const ladySizes = {
    sm: "h-8 w-9 sm:h-9 sm:w-10",
    md: "h-9 w-10 sm:h-10 sm:w-11",
    lg: "h-10 w-11 sm:h-12 sm:w-13 lg:h-13 lg:w-15",
    xl: "h-12 w-13 sm:h-14 sm:w-15 lg:h-16 lg:w-18",
  };

  // Text size for KAYFIY (sleek, refined, not oversized)
  const textSizes = {
    sm: "h-3.5 w-24 sm:h-4 sm:w-26",
    md: "h-4 w-26 sm:h-4.5 sm:w-30",
    lg: "h-4.5 w-30 sm:h-5 sm:w-34 lg:h-5.5 lg:w-38",
    xl: "h-6 w-38 sm:h-7 sm:w-46 lg:h-8 lg:w-52",
  };

  const currentLady = ladySizes[size] || ladySizes.lg;
  const currentText = textSizes[size] || textSizes.lg;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 select-none pointer-events-none ${className}`}>
      {/* Lady silhouette outline in elegant rose pink */}
      <div className={`relative ${currentLady} shrink-0 transition-transform duration-300 group-hover:scale-105 pointer-events-none`}>
        <Image
          src="/lady-pink.png"
          alt="KAYFIY Silhouette"
          fill
          priority
          sizes="64px"
          className="object-contain pointer-events-none"
        />
      </div>

      {/* Spotless KAYFIY typography in matching elegant rose pink */}
      <div className={`relative ${currentText} shrink-0 transition-transform duration-300 group-hover:scale-102 pointer-events-none`}>
        <Image
          src="/kayfiy-text-pink.png"
          alt="KAYFIY"
          fill
          priority
          sizes="160px"
          className="object-contain pointer-events-none"
        />
      </div>
    </div>
  );
}
