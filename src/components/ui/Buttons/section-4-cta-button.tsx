import PrimaryButton from "@/components/ui/PrimaryButton";

interface Section4CtaButtonProps {
    href: string;
    text: string;
    className?: string;
}

export default function Section4CtaButton({ href, text, className }: Section4CtaButtonProps) {
    return (
        <PrimaryButton href={href} className={className}>
            {text}
            <span aria-hidden="true">→</span>
        </PrimaryButton>
    );
}
