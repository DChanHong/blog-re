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
            <div
                className={`flex items-center align-item justify-evenly bg-[#F9F9F9] dark:bg-[#000] h-[100px]`}
            >
                <ul>
                    <li className={`font-bold text-[14px] xs:text-[20px]`}>성찬홍's More Info</li>
                </ul>
                <ul className={`flex space-x-4`}>
                    <li className="w-[30px] xs:w-[40px]">
                        <a
                            href={"https://velog.io/@hongchee/posts"}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <SiVelog className="w-full h-full" />
                        </a>
                    </li>

                    <li className="w-[30px] xs:w-[40px]">
                        <a
                            href={"https://github.com/DChanHong"}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGithub className="w-full h-full" />
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}
