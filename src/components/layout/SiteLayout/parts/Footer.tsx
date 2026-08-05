"use client";

import React from "react";
import { SiVelog } from "react-icons/si";

const Footer = () => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-fit">
            <div
                className="rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 shadow-2xl backdrop-blur-3xl overflow-hidden px-6 py-2 transition-all duration-500 hover:scale-105"
                style={{
                    boxShadow: "0 0 25px rgba(139, 92, 246, 0.6), 0 0 40px rgba(124, 58, 237, 0.4)",
                }}
            >
                <div className="flex flex-wrap justify-center gap-3">
                    {/* Velog */}
                    <a
                        href="https://velog.io/@hongchee/posts"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center no-underline relative z-[1] transition-all duration-300"
                    >
                        <div
                            className="inline-flex w-9 h-9 rounded-full justify-center items-center bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-[5px] group-hover:scale-110 group-hover:bg-[#20c997] group-hover:shadow-[0_0_10px_rgba(32,201,151,0.6)]"
                            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
                        >
                            <SiVelog className="h-4 w-4 text-white" />
                        </div>
                        <span className="mt-1 text-white font-medium opacity-70 transition-all duration-300 text-[0.7rem] group-hover:opacity-100 group-hover:translate-y-[2px]">
                            Velog
                        </span>
                    </a>

                    {/* GitHub */}
                    <a
                        href="https://github.com/DChanHong"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center no-underline relative z-[1] transition-all duration-300"
                    >
                        <div
                            className="inline-flex w-9 h-9 rounded-full justify-center items-center bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-[5px] group-hover:scale-110 group-hover:bg-[#333] group-hover:shadow-[0_0_10px_rgba(51,51,51,0.6)]"
                            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </div>
                        <span className="mt-1 text-white font-medium opacity-70 transition-all duration-300 text-[0.7rem] group-hover:opacity-100 group-hover:translate-y-[2px]">
                            GitHub
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
