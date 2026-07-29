"use client";

import dynamic from "next/dynamic";

export const SparklesClient = dynamic(
    () => import("@/components/ui/sparkles").then((mod) => mod.SparklesCore),
    { ssr: false },
);
