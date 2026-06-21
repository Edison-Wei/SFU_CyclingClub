import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
// export { auth as proxy } from "@/lib/auth"

export function proxy(request: NextRequest) {
    return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
    matcher: [
        // '/dashboard/:path*'
        // {
        //     source: '/dashboard/:path*',
        //     locale: false,
        //     has: [
        //         { type: 'header', }
        //     ]
        // }
    ]
};