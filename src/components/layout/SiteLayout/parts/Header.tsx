"use client";

import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";

interface HeaderProps {
    /**
     * Fired when hamburger button is clicked on small screens.
     */
    onToggleSideNav: () => void;
}

/**
 * Header
 *
 * Displays site brand and primary navigation. On small screens, it shows
 * a hamburger button to toggle the mobile navigation overlay.
 */
export default function Header({ onToggleSideNav }: HeaderProps) {
    return (
        <header className={`fixed h-[100px] top-0 w-full z-10 bg-black text-white`}>
            <div
                className={`mx-[30px] sm:mx-[50px] relative flex h-full items-center gap-[10px] sm:gap-[50px] justify-between sm:justify-normal`}
            >
                <h1 className={`font-bold text-[25px] `}>
                    <Link href={"/"}>
                        <span className="text-container">Chanhong Studio</span>
                    </Link>
                </h1>
                <p className={`font-semibold text-[25px] hidden sm:block`}>
                    <Link href={"/blog"}>
                        <span className="text-container">Blog</span>
                    </Link>
                </p>
                <button
                    type={"button"}
                    onClick={onToggleSideNav}
                    className="w-[2rem] sm:hidden cursor-pointer"
                >
                    <GiHamburgerMenu size={32} className="underline_on_hover" />
                </button>
            </div>
            <style jsx>{`
                .underline_on_hover {
                    position: relative;
                    text-decoration: none;
                    cursor: pointer;
                    color: inherit;
                    width: 100%;
                    height: 100%;
                }
                .underline_on_hover::before {
                    content: "";
                    position: absolute;
                    width: 0%;
                    height: 3px;
                    bottom: -7px;
                    left: 0;
                    background-color: #fff;
                    transition: width 0.3s ease-in-out;
                }
                .underline_on_hover:hover::before {
                    width: 100%;
                    transition: width 0.2s ease-in-out;
                }
                .text-container {
                    position: relative;
                }
                .text-container::before {
                    content: "";
                    position: absolute;
                    bottom: -30%;
                    left: 0;
                    width: 0;
                    height: 4px;
                    background-color: white;
                    transition: width 0.3s ease;
                }
                .text-container:hover::before {
                    width: 100%;
                }
            `}</style>
        </header>
    );
}
