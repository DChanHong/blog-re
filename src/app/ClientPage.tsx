"use client";

import Section4 from "@/components/domain/home/Section4";
import { ReactNode } from "react";

interface ClientPageProps {
    section2Slot: ReactNode;
    section3Slot: ReactNode;
}

import { SparklesCore } from "@/components/ui/sparkles";

export default function ClientPage({ section2Slot, section3Slot }: ClientPageProps) {
    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 bg-black">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="black"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>
            <div className="relative z-10 mt-[100px] pt-[50px] borderfont-sans grid grid-rows-[auto_auto_auto_auto] items-center justify-items-center min-h-screen p-0 pb-20 gap-16 sm:p-0 text-white">
                {/* <Section1 /> */}
                {section2Slot}
                <Section4 />
                {section3Slot}
            </div>
        </>
    );
}
