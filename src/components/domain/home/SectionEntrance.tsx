"use client";

import { useEffect, type ReactNode } from "react";
import { stagger, useAnimate } from "framer-motion";

export default function SectionEntrance({
    children,
    className,
}: {
    children: ReactNode;
    className: string;
}) {
    const [scope, animate] = useAnimate<HTMLDivElement>();

    useEffect(() => {
        const element = scope.current;
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (!element || preference.matches || !("IntersectionObserver" in window)) return;

        const groups = Array.from(element.querySelectorAll<HTMLElement>("[data-entrance]"));
        const items = groups.flatMap((group) => Array.from(group.children) as HTMLElement[]);
        const animations: ReturnType<typeof animate>[] = [];
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    observer.unobserve(entry.target);
                    const group = entry.target as HTMLElement;
                    const isCards = group.dataset.entrance === "cards";
                    animations.push(
                        animate(
                            Array.from(group.children),
                            isCards
                                ? { opacity: [0, 1], x: [-24, 0] }
                                : { opacity: [0, 1], y: [18, 0] },
                            {
                                duration: 0.65,
                                delay: stagger(isCards ? 0.16 : 0.1),
                                ease: [0.22, 1, 0.36, 1],
                            },
                        ),
                    );
                }
            },
            { rootMargin: "0px 0px -40px 0px", threshold: 0 },
        );

        // Only hide after hydration; server-rendered content remains readable without JS.
        items.forEach((item) => {
            item.style.opacity = "0";
        });
        groups.forEach((group) => observer.observe(group));

        const reveal = () => {
            observer.disconnect();
            animations.forEach((animation) => animation.stop());
            items.forEach((item) => {
                item.style.removeProperty("opacity");
                item.style.removeProperty("transform");
            });
        };
        const handlePreference = () => {
            if (preference.matches) reveal();
        };
        element.addEventListener("focusin", reveal);
        preference.addEventListener("change", handlePreference);

        return () => {
            element.removeEventListener("focusin", reveal);
            preference.removeEventListener("change", handlePreference);
            reveal();
        };
    }, [animate, scope]);

    return (
        <div ref={scope} className={className}>
            {children}
        </div>
    );
}
