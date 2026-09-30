"use client";

import { useEffect, type ReactNode } from "react";
import { stagger, useAnimate } from "framer-motion";

export default function HeroEntrance({
    children,
    className,
}: {
    children: ReactNode;
    className: string;
}) {
    const [scope, animate] = useAnimate<HTMLDivElement>();

    useEffect(() => {
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (preference.matches || !scope.current) return;

        // Keep the server-rendered content visible until animation is available.
        const entrance = animate(
            Array.from(scope.current.children),
            { opacity: [0, 1], y: [18, 0] },
            { duration: 0.65, delay: stagger(0.1), ease: [0.22, 1, 0.36, 1] },
        );
        const finish = () => entrance.complete();
        const handlePreference = () => {
            if (preference.matches) finish();
        };
        const element = scope.current;
        // Keyboard users can immediately see the CTA they focus.
        element.addEventListener("focusin", finish);
        preference.addEventListener("change", handlePreference);

        return () => {
            element.removeEventListener("focusin", finish);
            preference.removeEventListener("change", handlePreference);
            entrance.stop();
        };
    }, [animate, scope]);

    return (
        <div ref={scope} className={className}>
            {children}
        </div>
    );
}
