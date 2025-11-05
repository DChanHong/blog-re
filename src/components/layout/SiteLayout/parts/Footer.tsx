"use client";

import { FaGithub } from "react-icons/fa6";
import { SiVelog } from "react-icons/si";

/**
 * Footer
 *
 * Displays external profile links.
 */
export default function Footer() {
    return (
        <footer>
            <div className="flex items-center justify-evenly bg-gradient-to-r from-gray-900 to-gray-800 h-[100px] border-t border-gray-700">
                <ul>
                    <li className="font-bold text-[25px] xs:text-[25px] text-white">
                        성찬홍's More Info
                    </li>
                </ul>
                <ul className="flex space-x-6">
                    <li className="w-[30px] xs:w-[40px]">
                        <a
                            href={"https://velog.io/@hongchee/posts"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                        >
                            <SiVelog className="w-full h-full" />
                        </a>
                    </li>

                    <li className="w-[30px] xs:w-[40px]">
                        <a
                            href={"https://github.com/DChanHong"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white transition-colors duration-300"
                        >
                            <FaGithub className="w-full h-full" />
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}
