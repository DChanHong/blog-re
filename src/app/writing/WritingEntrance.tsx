"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { stagger, useAnimate } from "framer-motion";

/** Remains mounted across queries; only the initial successful list enters. */
export default function WritingEntrance({
    children,
    ready,
    queryKey,
}: {
    children: ReactNode;
    ready: boolean;
    queryKey: string;
}) {
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const initialQuery = useRef(queryKey);
    const consumed = useRef(false);
    useEffect(() => {
        if (queryKey !== initialQuery.current) consumed.current = true;
        if (!ready || consumed.current || !scope.current) return;
        consumed.current = true;
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (preference.matches) return;
        const element = scope.current;
        const items = Array.from(element.querySelectorAll<HTMLElement>("[data-writing-row]"));
        const entrance = animate(
            items,
            { opacity: [0, 1], y: [18, 0] },
            {
                duration: 0.65,
                delay: stagger(0.1),
                ease: [0.22, 1, 0.36, 1],
            },
        );
        const reveal = () => {
            // Complete before stopping: Motion may flush a queued frame after cleanup.
            // That frame must contain the final, readable values, not a paused midpoint.
            entrance.complete();
            items.forEach((item) => {
                item.style.opacity = "1";
                item.style.transform = "none";
            });
        };
        const preferenceChanged = () => {
            if (preference.matches) reveal();
        };
        element.addEventListener("focusin", reveal);
        preference.addEventListener("change", preferenceChanged);
        return () => {
            element.removeEventListener("focusin", reveal);
            preference.removeEventListener("change", preferenceChanged);
            reveal();
        };
    }, [animate, scope, ready, queryKey]);
    return <div ref={scope}>{children}</div>;
}
