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
                parameters: [
                    {
                        in: "query",
                        name: "expected",
                        schema: { type: "integer" },
                        required: false,
                        description: "Expected total post count to help infinite scroll (e.g., 62)",
                    },
                    {
                        in: "query",
                        name: "only",
                        schema: { type: "string", enum: ["dry"] },
                        required: false,
                        description: "Use 'dry' to bypass DB and only crawl",
                    },
                ],
                responses: {
                    "200": {
                        description: "Crawl successful",
                        content: {
                            "application/json": {
                                oneOf: [
                                    {
                                        description: "Normal run",
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
                                    {
                                        description: "Dry run",
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
                                                        scanned: { type: "integer" },
                                                        sampleTitles: {
                                                            type: "array",
                                                            items: { type: "string" },
                                                        },
                                                    },
                                                    required: ["scanned"],
                                                },
                                            },
                                            required: ["result", "data"],
                                        },
                                    },
                                ],
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
        "/api/velog/tags": {
            get: {
                summary: "Fetch all distinct tags",
                tags: ["Velog"],
                responses: {
                    "200": {
                        description: "Tags fetched",
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
                                            type: "array",
                                            items: { type: "string" },
                                        },
                                    },
                                    required: ["result", "data"],
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/velog/posts": {
            get: {
                summary: "Fetch posts filtered by tags or recent posts",
                tags: ["Velog"],
                parameters: [
                    {
                        in: "query",
                        name: "recent",
                        schema: { type: "string", enum: ["true"] },
                        required: false,
                        description: "Use recent=true to fetch latest posts",
                    },
                    {
                        in: "query",
                        name: "limit",
                        schema: { type: "integer", default: 6 },
                        required: false,
                        description: "Number of recent posts to return (max 50). Default 6",
                    },
                    {
                        in: "query",
                        name: "tags",
                        schema: { type: "string" },
                        required: false,
                        description: "Comma-separated list of tags (ignored when recent=true)",
                    },
                    {
                        in: "query",
                        name: "mode",
                        schema: { type: "string", enum: ["any", "all"] },
                        required: false,
                        description: "any: overlaps, all: contains (ignored when recent=true)",
                    },
                ],
                responses: {
                    "200": {
                        description: "Posts fetched",
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
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "string", format: "uuid" },
                                                    title: { type: "string" },
                                                    img_src: { type: "string" },
                                                    created_at: {
                                                        type: "string",
                                                        format: "date-time",
                                                    },
                                                    tags: {
                                                        type: "array",
                                                        items: { type: "string" },
                                                    },
                                                    detail_link: { type: "string" },
                                                    intro: { type: "string" },
                                                    inserted_at: {
                                                        type: "string",
                                                        format: "date-time",
                                                    },
                                                },
                                            },
                                        },
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
