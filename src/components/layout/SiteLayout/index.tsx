"use client";

import React, { useState } from "react";
import { Header, MobileNav, Footer } from "./parts";

interface SiteLayoutProps {
    children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
    const [isSideNavOpen, setIsSideNavOpen] = useState<boolean>(false);

    return (
        <>
            <div className={`min-h-[100%] dark:bg-[#2e2e2e] dark:text-[#b7babe] pb-[100px]`}>
                <Header onToggleSideNav={() => setIsSideNavOpen((p) => !p)} />

                <MobileNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />

                <div className={`h-full min-h-[calc(100vh-210px)]`}>{children}</div>
            </div>

            <Footer />
        </>
    );
}
