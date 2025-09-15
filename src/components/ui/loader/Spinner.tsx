"use client";

import React from "react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";

export interface SpinnerProps {
    /** Visual size of the spinner. */
    size?: SpinnerSize;
    /** Additional class names to append. */
    className?: string;
    /** Accessible label text; hidden visually but available for screen readers. */
    srText?: string;
}

const sizeToClasses: Record<SpinnerSize, string> = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-4",
    xl: "w-12 h-12 border-4",
};

/**
 * Spinner
 *
 * A simple blue-themed loading spinner using TailwindCSS utilities.
 */
export default function Spinner({ size = "md", className = "", srText = "Loading" }: SpinnerProps) {
    const base = "inline-block animate-spin rounded-full border-blue-300 border-t-blue-600";
    const sizeCls = sizeToClasses[size];
    return (
        <span
            role="status"
            aria-live="polite"
            aria-label={srText}
            className="inline-flex items-center"
        >
            <span className={`${base} ${sizeCls} ${className}`} />
            <span className="sr-only">{srText}</span>
        </span>
    );
}
