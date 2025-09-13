export const openApiV1 = {
    openapi: "3.0.3",
    info: {
        title: "re-hong-blog API",
        version: "1.0.0",
        description: "API documentation for re-hong-blog",
    },
    servers: [{ url: "/" }],
    tags: [{ name: "Velog", description: "Velog crawling and posts" }],
    paths: {
        "/api/velog/crawl": {
            get: {
                summary: "Crawl velog posts and persist new ones",
                tags: ["Velog"],
                responses: {
                    "200": {
                        description: "Crawl successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        result: {
                                            type: "object",
                                            properties: {
                                                success: { type: "boolean" },
                                                message: { type: "string" },
                                            },
                                            required: ["success"],
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                inserted: { type: "integer" },
                                                scanned: { type: "integer" },
                                            },
                                            required: ["inserted", "scanned"],
                                        },
                                    },
                                    required: ["result", "data"],
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Configuration missing",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        result: {
                                            type: "object",
                                            properties: {
                                                success: { type: "boolean" },
                                                message: { type: "string" },
                                                code: { type: "string" },
                                            },
                                            required: ["success", "message"],
                                        },
                                        data: { type: "null" },
                                    },
                                    required: ["result", "data"],
                                },
                            },
                        },
                    },
                    "500": {
                        description: "Unexpected error",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        result: {
                                            type: "object",
                                            properties: {
                                                success: { type: "boolean" },
                                                message: { type: "string" },
                                                code: { type: "string" },
                                            },
                                            required: ["success", "message"],
                                        },
                                        data: { type: "null" },
                                    },
                                    required: ["result", "data"],
                                },
                            },
                        },
                    },
                },
            },
        },
    },
} as const;
