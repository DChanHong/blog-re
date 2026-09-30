import type { ReactNode } from "react";
import ReferenceHome from "@/components/domain/home/ReferenceHome";

export default function ClientPage({ section3Slot }: { section3Slot: ReactNode }) {
    return <ReferenceHome writingSlot={section3Slot} />;
}
