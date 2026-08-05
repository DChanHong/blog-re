"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Header, Footer } from "./parts";

interface SiteLayoutProps {
    children: React.ReactNode;
}

const LAYOUT_VARIANTS: { match: (pathname: string) => boolean; rootClassName: string; contentClassName: string }[] = [];

const DEFAULT_LAYOUT_VARIANT = {
    rootClassName: "min-h-[100%] bg-gradient-to-br from-slate-50 to-blue-50",
    contentClassName: "h-full min-h-[calc(100vh-210px)] pb-32",
};

export default function SiteLayout({ children }: SiteLayoutProps) {
    const [isSideNavOpen, setIsSideNavOpen] = useState<boolean>(false);
    const pathname = usePathname();
    const layoutVariant =
        LAYOUT_VARIANTS.find((variant) => variant.match(pathname)) ?? DEFAULT_LAYOUT_VARIANT;

    return (
        <>
            <div className={layoutVariant.rootClassName}>
                <Header onToggleSideNav={() => setIsSideNavOpen((p) => !p)} />

                {/* MobileNav 제거 (Navbar 자체 내장) */}


                <div className={layoutVariant.contentClassName}>{children}</div>
            </div>

            <Footer />
        </>
    );
}
