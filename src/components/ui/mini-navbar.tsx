"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    return (
        <Link
            href={href}
            className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium"
        >
            {children}
        </Link>
    );
};

export function Navbar() {
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
        <Link href="/" className="relative w-5 h-5 flex items-center justify-center">
            <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 top-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
            <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 left-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
            <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 right-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
            <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 bottom-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
        </Link>
    );

    const navLinksData = [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/career" },
    ];

    return (
        <header
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-md
                       ${headerShapeClass}
                       border border-[#333] bg-[#1f1f1f80]
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-300 ease-in-out`}
        >
            <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
                <div className="flex items-center">{logoElement}</div>

                <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
                    {navLinksData.map((link) => (
                        <AnimatedNavLink key={link.href} href={link.href}>
                            {link.label}
                        </AnimatedNavLink>
                    ))}
                </nav>

                <button
                    className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none"
                    onClick={toggleMenu}
                    aria-label={isOpen ? "Close Menu" : "Open Menu"}
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
                className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? "max-h-[1000px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0 pointer-events-none"}`}
            >
                <nav className="flex flex-col items-center space-y-4 text-base w-full">
                    {navLinksData.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-gray-300 hover:text-white transition-colors w-full text-center py-2"
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
