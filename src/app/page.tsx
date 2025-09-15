import { OverlayLoader, Spinner } from "@/components/ui/loader";
import Image from "next/image";
import Section1 from "@/components/domain/home/Section1";

export default function Home() {
    return (
        <div className="font-sans grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-0 pb-20 gap-16 sm:p-0">
            <Section1 />
        </div>
    );
}
