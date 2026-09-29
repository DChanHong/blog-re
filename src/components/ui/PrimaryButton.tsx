import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Props =
    | ({ href: string } & Omit<ComponentProps<typeof Link>, "href">)
    | ({ href?: never } & ComponentProps<"button">);

export default function PrimaryButton(props: Props) {
    if (typeof props.href === "string") {
        const { className, ...linkProps } = props;
        return <Link {...linkProps} className={cn("primary-button", className)} />;
    }
    const { className, type = "button", ...buttonProps } = props;
    return <button {...buttonProps} type={type} className={cn("primary-button", className)} />;
}
