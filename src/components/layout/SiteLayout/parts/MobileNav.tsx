"use client";

import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { BsBook } from "react-icons/bs";

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
        <div className="sm:hidden">
            <div
                className={`fixed inset-0 z-40 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
                aria-hidden={!isOpen}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${
                        isOpen ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={onClose}
                />

                {/* Sliding panel */}
                <nav
                    className={`absolute inset-x-0 top-0 h-[85%] bg-white rounded-b-2xl shadow-2xl transform transition-transform duration-300 ${
                        isOpen ? "translate-y-0" : "-translate-y-full"
                    }`}
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Handle bar + close */}
                    <div className="flex items-center justify-between p-3">
                        {/* <div className="mx-auto h-1.5 w-10 rounded-full bg-gray-300" /> */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="ml-auto grid place-items-center w-9 h-9 rounded-lg hover:bg-gray-100 active:scale-[0.98]"
                            aria-label="Close navigation"
                        >
                            <IoClose className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Links */}
                    <ul className="mt-3 px-2 space-y-2 overflow-y-auto max-h-[calc(100%-120px)] pb-6">
                        <li>
                            <Link
                                className="flex items-center px-4 py-3 mx-1 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition"
                                href={"/"}
                                onClick={onClose}
                            >
                                <span className="w-[2rem] mr-3 text-gray-700">
                                    <AiFillHome className="w-full h-full" />
                                </span>
                                <span className="text-[1.05rem] font-medium">Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="flex items-center px-4 py-3 mx-1 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition"
                                href={"/blog"}
                                onClick={onClose}
                            >
                                <span className="w-[2rem] mr-3 text-gray-700">
                                    <BsBook className="w-full h-full" />
                                </span>
                                <span className="text-[1.05rem] font-medium">Blog</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
