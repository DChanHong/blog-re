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
            <div className={`min-h-[100%] bg-gradient-to-br from-slate-50 to-blue-50`}>
                <Header onToggleSideNav={() => setIsSideNavOpen((p) => !p)} />

                <MobileNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />

                <div className={`h-full min-h-[calc(100vh-210px)]`}>{children}</div>
            </div>

            <Footer />
        </>
    );
}
