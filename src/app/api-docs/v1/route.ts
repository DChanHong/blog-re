import { NextResponse } from "next/server";
import { openApiV1 } from "@/lib/swagger/specs/v1";

export async function GET() {
    return NextResponse.json(openApiV1);
}
