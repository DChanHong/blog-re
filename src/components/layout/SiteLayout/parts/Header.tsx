"use client";

import { Navbar } from "@/components/ui/mini-navbar";

interface HeaderProps {
    /**
     * Fired when hamburger button is clicked on small screens.
     */
    onToggleSideNav: () => void;
}

/**
 * Header
 *
 * Displays site brand and primary navigation using Mini Navbar.
 */
export default function Header({ onToggleSideNav }: HeaderProps) {
    return <Navbar />;
}

