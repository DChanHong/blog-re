"use client";

import { useEffect, useState, RefObject } from "react";

export interface UseElementObserveOptions extends IntersectionObserverInit {
    /**
     * CSS class applied when the element is visible by the threshold.
     * Default is "scroll_fade_in" which should be defined in the caller's CSS.
     */
    visibleClassName?: string;
    /**
     * CSS class applied when the element is not yet visible.
     * Default is "opacity-0".
     */
    hiddenClassName?: string;
}

export interface UseElementObserveResult {
    /** True when the element has intersected by the configured threshold. */
    isVisible: boolean;
    /** Convenience className based on visibility. */
    className: string;
}

/**
 * useElementObserve
 *
 * Observes a target element and reports when it crosses the given threshold.
 */
export default function useElementObserve(
    targetRef: RefObject<Element | null>,
    options: UseElementObserveOptions = {},
): UseElementObserveResult {
    const {
        threshold = [0.1],
        root = null,
        rootMargin,
        visibleClassName = "scroll_fade_in",
        hiddenClassName = "opacity-0",
    } = options;

    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const observerOptions: IntersectionObserverInit = { threshold, root, rootMargin };

        const callback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (
                    entry.isIntersecting &&
                    entry.intersectionRatio >=
                        (Array.isArray(threshold) ? Math.min(...threshold) : (threshold ?? 0))
                ) {
                    setIsVisible(true);
                }
            });
        };

        const observer = new IntersectionObserver(callback, observerOptions);
        const node = targetRef.current;
        if (node) observer.observe(node);

        return () => {
            if (node) observer.unobserve(node);
            observer.disconnect();
        };
        // Intentionally not depending on options to avoid re-observing on rerenders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetRef]);

    return { isVisible, className: isVisible ? visibleClassName : hiddenClassName };
}
