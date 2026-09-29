import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
    return <Link {...props} className={cn("text-link", className)} />;
}
