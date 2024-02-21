import { NextResponse, NextRequest } from "next/server";

export async function GET(request) {

    const results = {
        message: "Hello World!"
    }

    return NextResponse.json(results);
}