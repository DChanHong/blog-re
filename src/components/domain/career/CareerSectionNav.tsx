"use client";

import { useEffect, useState } from "react";

const sections = [
    { href: "#overview", label: "소개" },
    { href: "#experience", label: "경력" },
    { href: "#projects", label: "프로젝트" },
    { href: "#capabilities", label: "역량" },
    { href: "#education", label: "학력" },
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
            className="resume-section-nav sticky z-30 mt-6 overflow-x-auto rounded-2xl border border-border bg-raised px-2 py-2 shadow-sm backdrop-blur-sm"
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
                            className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                                activeSection === section.href.slice(1)
                                    ? "bg-sunken text-accent"
                                    : "text-secondary hover:bg-muted hover:text-ink"
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
