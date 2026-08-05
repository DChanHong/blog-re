"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Section4CtaButtonProps {
  href: string;
  text: string;
  className?: string;
}

const Section4CtaButton: React.FC<Section4CtaButtonProps> = ({
  href,
  text,
  className,
}) => {
  return (
    <div className={cn("relative inline-flex items-center justify-center gap-4 group", className)}>
      <div className="absolute inset-0 duration-1000 opacity-40 transition-all bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 rounded-md blur-lg filter group-hover:opacity-70 group-hover:duration-200" />
      <Link
        href={href}
        className="group relative inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-blue-400/30"
        role="button"
      >
        {text}
        <svg
          viewBox="0 0 10 10"
          height="10"
          width="10"
          fill="none"
          className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
        >
          <path
            d="M0 5h7"
            className="transition opacity-0 group-hover:opacity-100"
          />
          <path
            d="M1 1l4 4-4 4"
            className="transition group-hover:translate-x-[3px]"
          />
        </svg>
      </Link>
    </div>
  );
};

export default Section4CtaButton;
