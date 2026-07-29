import { createJsonLdGraph, type JsonLdSchema } from "@/lib/seo";

interface JsonLdScriptProps {
    schemas: JsonLdSchema[];
}

export function JsonLdScript({ schemas }: JsonLdScriptProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(createJsonLdGraph(schemas)).replace(/</g, "\\u003c"),
            }}
        />
    );
}
