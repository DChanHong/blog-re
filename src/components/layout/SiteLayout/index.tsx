import type { ReactNode } from "react";
import { Header, Footer } from "./parts";

export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <div className="site-shell">
            <a className="skip-link" href="#main-content">
                본문으로 바로가기
            </a>
            <Header />
            <main id="main-content" tabIndex={-1} className="site-main">
                {children}
            </main>
            <Footer />
        </div>
    );
}
