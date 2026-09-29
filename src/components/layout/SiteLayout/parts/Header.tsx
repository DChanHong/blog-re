"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { personalInfoData } from "@/data/careerData";

const links = [
    { href: "/work", label: "프로젝트" },
    { href: "/writing", label: "글" },
    { href: "/resume", label: "이력서" },
];

export default function Header() {
    const pathname = usePathname();
    return (
        <header className="site-header">
            <div className="shell-container header-inner">
                <Link href="/" aria-label={personalInfoData.name + " 홈"} className="site-brand">
                    <span className="brand-symbol" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                        <span />
                    </span>
                    <span className="brand-name">{personalInfoData.name}</span>
                </Link>
                <nav aria-label="주요 메뉴" className="site-nav">
                    {links.map(({ href, label }) => {
                        const active =
                            pathname === href ||
                            (href === "/work" && pathname.startsWith("/project/")) ||
                            (href === "/writing" && pathname.startsWith("/blog/"));
                        return (
                            <Link key={href} href={href} aria-current={active ? "page" : undefined}>
                                {label}
                            </Link>
                        );
                    })}
                </nav>
                <ThemeToggle />
            </div>
        </header>
    );
}
