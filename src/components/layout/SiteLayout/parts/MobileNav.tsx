"use client";

import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { BsBook } from "react-icons/bs";
import { SearchBar } from ".";

interface MobileNavProps {
    /** Whether the mobile nav is visible. */
    isOpen: boolean;
    /** Close callback for the mobile nav overlay. */
    onClose: () => void;
}

/**
 * MobileNav
 *
 * Full-screen mobile-only overlay navigation that slides from the top.
 */
export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
    return (
        <nav
            className={`block z-10 w-full fixed border-2 bg-white top-0 min-h-[100%] h-[100%] sm:hidden ${
                isOpen ? "nav_open" : "nav_closed"
            }`}
        >
            <p className="flex flex-row-reverse m-1">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-[2em] hover:bg-[#EFEFEF] rounded-xl"
                >
                    <IoClose className="w-full h-full" />
                </button>
            </p>

            <SearchBar />

            <ul>
                <li>
                    <Link
                        className="flex items-center px-6 py-2 mt-4 mx-1 hover:bg-[#EFEFEF] hover:rounded-xl"
                        href={"/"}
                        onClick={onClose}
                    >
                        <p className="w-[2rem] mr-4">
                            <AiFillHome className="w-full h-full" />
                        </p>
                        <p className="text-[1rem] text-center">Home</p>
                    </Link>
                </li>

                <li>
                    <Link
                        className="flex items-center px-6 py-2 mt-4 mx-1 hover:bg-[#EFEFEF] hover:rounded-xl"
                        href={"/blog"}
                        onClick={onClose}
                    >
                        <p className="w-[2rem] mr-4">
                            <BsBook className="w-full h-full" />
                        </p>
                        <p className="text-[1rem] text-center">Blog</p>
                    </Link>
                </li>
            </ul>

            <style jsx>{`
                .nav_open {
                    transform: translateY(0);
                    transition: transform 0.3s ease-in-out;
                }
                .nav_closed {
                    transform: translateY(-100%);
                    transition: transform 0.3s ease-in-out;
                }
            `}</style>
        </nav>
    );
}
