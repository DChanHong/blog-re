"use client";

import Section4 from "@/components/domain/home/Section4";
import { ReactNode } from "react";

interface ClientPageProps {
    section2Slot: ReactNode;
    section3Slot: ReactNode;
}

export default function ClientPage({ section2Slot, section3Slot }: ClientPageProps) {
    return (
        <div className=" mt-[100px] pt-[50px] borderfont-sans grid grid-rows-[auto_auto_auto_auto] items-center justify-items-center min-h-screen p-0 pb-20 gap-16 sm:p-0">
            {/* <Section1 /> */}
            {section2Slot}
            <Section4 />
            {section3Slot}
        </div>
    );
}
