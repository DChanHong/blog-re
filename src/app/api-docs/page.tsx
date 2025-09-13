"use client";

import { useEffect, useRef } from "react";

export default function ApiDocsPage() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        async function load() {
            const SwaggerUI = (await import("swagger-ui-dist/swagger-ui-es-bundle.js"))
                .default as any;

            let link = document.getElementById("swagger-ui-css") as HTMLLinkElement | null;
            if (!link) {
                link = document.createElement("link");
                link.id = "swagger-ui-css";
                link.rel = "stylesheet";
                link.href = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css";
                document.head.appendChild(link);
            }

            SwaggerUI({
                domNode: containerRef.current!,
                url: "/api-docs/v1",
                docExpansion: "none",
                deepLinking: true,
            });
        }
        load();
    }, []);

    return <div ref={containerRef} />;
}
