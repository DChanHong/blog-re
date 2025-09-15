"use client";

import React from "react";
import Spinner, { SpinnerProps } from "./Spinner";

export interface OverlayLoaderProps {
    /** Whether to show the overlay. */
    show: boolean;
    /** Optional text displayed under the spinner. */
    label?: string;
    /** Spinner props passthrough. */
    spinnerProps?: SpinnerProps;
}

/**
 * OverlayLoader
 *
 * Full-screen translucent overlay with a centered blue spinner.
 */
export default function OverlayLoader({
    show,
    label = "Loading...",
    spinnerProps,
}: OverlayLoaderProps) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/10 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/80 dark:bg-black/60 shadow-lg">
                <Spinner size="lg" {...spinnerProps} />
                {label ? (
                    <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">{label}</p>
                ) : null}
            </div>
        </div>
    );
}
