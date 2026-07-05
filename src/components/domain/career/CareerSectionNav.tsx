"use client";

import { useEffect, useState } from "react";

const sections = [
    { href: "#overview", label: "Overview" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#capabilities", label: "Capabilities" },
    { href: "#education", label: "Education" },
];

export default function CareerSectionNav() {
    const [activeSection, setActiveSection] = useState("overview");

    useEffect(() => {
        const elements = sections
            .map((section) => document.querySelector<HTMLElement>(section.href))
            .filter((element): element is HTMLElement => Boolean(element));

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visibleEntry) setActiveSection(visibleEntry.target.id);
            },
            { rootMargin: "-25% 0px -60%", threshold: [0, 0.2, 0.5] },
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, []);

    return (
        <nav
            aria-label="경력 페이지 섹션"
            className="sticky top-20 z-30 mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 px-2 py-2 shadow-xl shadow-black/20 backdrop-blur-xl"
        >
            <ul className="flex min-w-max items-center gap-1">
                {sections.map((section) => (
                    <li key={section.href}>
                        <a
                            href={section.href}
                            aria-current={
                                activeSection === section.href.slice(1) ? "location" : undefined
                            }
                            onClick={() => setActiveSection(section.href.slice(1))}
                            className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                                activeSection === section.href.slice(1)
                                    ? "bg-blue-400/10 text-blue-300"
                                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                            }`}
                        >
                            {section.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
