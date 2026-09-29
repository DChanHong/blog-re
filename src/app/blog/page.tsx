import { permanentRedirect } from "next/navigation";

interface BlogRedirectProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BlogRedirect({ searchParams }: BlogRedirectProps) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(await searchParams)) {
        if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
        else if (value !== undefined) query.append(key, value);
    }
    const suffix = query.toString();
    permanentRedirect(suffix ? `/writing?${suffix}` : "/writing");
}
