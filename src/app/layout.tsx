import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteLayout from "@/components/layout/SiteLayout";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import dynamic from "next/dynamic";

const ChatBot = dynamic(() => import("@/components/domain/chatbot/ChatBot"), { ssr: true });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "chanhong blog",
    description: "chanhong blog",
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
