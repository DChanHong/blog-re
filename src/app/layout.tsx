import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteLayout from "@/components/layout/SiteLayout";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import dynamic from "next/dynamic";
import { WebVitals } from "@/components/analytics/WebVitals";
import { absoluteUrl, SEO_CONFIG, SITE_URL } from "@/lib/seo/config";

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
    metadataBase: SITE_URL,
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    openGraph: {
        title: SEO_CONFIG.title.default,
        description: SEO_CONFIG.description,
        url: "/",
        siteName: SEO_CONFIG.siteName,
        images: [
            {
                url: absoluteUrl(SEO_CONFIG.defaultOgImage.path),
                width: SEO_CONFIG.defaultOgImage.width,
                height: SEO_CONFIG.defaultOgImage.height,
                alt: SEO_CONFIG.defaultOgImage.alt,
            },
        ],
        locale: SEO_CONFIG.locale,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: SEO_CONFIG.title.default,
        description: SEO_CONFIG.description,
        images: [SEO_CONFIG.defaultOgImage.path],
    },
    icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ReactQueryProvider>
                    <SiteLayout>{children}</SiteLayout>
                    <ChatBot />
                    <WebVitals />
                </ReactQueryProvider>
            </body>
        </html>
    );
}
