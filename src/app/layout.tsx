import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteLayout from "@/components/layout/SiteLayout";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import dynamic from "next/dynamic";

const ChatBot = dynamic(() => import("@/components/domain/chatbot"), { ssr: true });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://blog.chanhong.pro"),
    title: {
        default: "성찬홍 | 프론트엔드 엔지니어",
        template: "%s | 성찬홍",
    },
    description: "성찬홍의 이력에 대한 정보",
    openGraph: {
        title: "성찬홍 | 프론트엔드 엔지니어",
        description: "성찬홍의 이력에 대한 정보",
        url: "/",
        siteName: "성찬홍's Info",
        images: [
            {
                url: "https://blog.chanhong.pro/og_front.png",
                width: 1200,
                height: 630,
                alt: "성찬홍's Info 썸네일",
            },
        ],
        locale: "ko_KR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "성찬홍 | 프론트엔지니어",
        description: "성찬홍의 이력에 대한 정보",
        images: ["/og_front.png"],
    },
    icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ReactQueryProvider>
                    <SiteLayout>{children}</SiteLayout>
                    <ChatBot />
                </ReactQueryProvider>
            </body>
        </html>
    );
}
