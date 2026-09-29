"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function isCurrentSection(pathname: string, href: string) {
    if (href === "/work") return pathname === href || pathname.startsWith("/project/");
    if (href === "/writing") return pathname === href || pathname.startsWith("/blog/");
    return pathname === href;
}

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const active = isCurrentSection(usePathname(), href);
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded hover:text-slate-900 transition-colors duration-300 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${active ? "text-blue-700 underline underline-offset-8" : "text-slate-600"}`}
        >
            {children}
        </Link>
    );
};

export function Navbar() {
    const pathname = usePathname();
    const menuButton = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [headerShapeClass, setHeaderShapeClass] = useState("rounded-full");
    const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (shapeTimeoutRef.current) {
            clearTimeout(shapeTimeoutRef.current);
        }

        if (isOpen) {
            setHeaderShapeClass("rounded-xl");
        } else {
            shapeTimeoutRef.current = setTimeout(() => {
                setHeaderShapeClass("rounded-full");
            }, 300);
        }

        return () => {
            if (shapeTimeoutRef.current) {
                clearTimeout(shapeTimeoutRef.current);
            }
        };
    }, [isOpen]);

    const logoElement = (
        <Link
            href="/"
            aria-label="성찬홍 홈"
            onClick={() => setIsOpen(false)}
            className="relative w-5 h-5 flex items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
            <span className="absolute w-1.5 h-1.5 rounded-full bg-slate-500 top-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
            <span className="absolute w-1.5 h-1.5 rounded-full bg-slate-500 left-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
            <span className="absolute w-1.5 h-1.5 rounded-full bg-slate-500 right-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
            <span className="absolute w-1.5 h-1.5 rounded-full bg-slate-500 bottom-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
        </Link>
    );

    const navLinksData = [
        { label: "프로젝트", href: "/work" },
        { label: "글", href: "/writing" },
        { label: "이력서", href: "/resume" },
    ];

    return (
        <header
            onKeyDown={(event) => {
                if (event.key === "Escape" && isOpen) {
                    setIsOpen(false);
                    menuButton.current?.focus();
                }
            }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-md
                       ${headerShapeClass}
                       border border-slate-200 bg-white/90
                       w-[calc(100%-2rem)] sm:w-auto shadow-sm shadow-slate-200
                       transition-[border-radius] duration-300 ease-in-out`}
        >
            <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
                <div className="flex items-center">{logoElement}</div>

                <nav
                    aria-label="주요 메뉴"
                    className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm"
                >
                    {navLinksData.map((link) => (
                        <AnimatedNavLink key={link.href} href={link.href}>
                            {link.label}
                        </AnimatedNavLink>
                    ))}
                </nav>

                <button
                    ref={menuButton}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls="mobile-site-menu"
                    className="sm:hidden flex items-center justify-center w-8 h-8 text-slate-600 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    onClick={toggleMenu}
                    aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
                >
                    {isOpen ? (
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    )}
                </button>
            </div>

            <div
                id="mobile-site-menu"
                inert={!isOpen}
                aria-hidden={!isOpen}
                className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? "max-h-[1000px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0 pointer-events-none"}`}
            >
                <nav
                    aria-label="모바일 주요 메뉴"
                    className="flex flex-col items-center space-y-4 text-base w-full"
                >
                    {navLinksData.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-current={
                                isCurrentSection(pathname, link.href) ? "page" : undefined
                            }
                            className={`rounded hover:text-slate-900 transition-colors w-full text-center py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${isCurrentSection(pathname, link.href) ? "text-blue-700 underline underline-offset-4" : "text-slate-600"}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
