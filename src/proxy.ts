import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        // checking only if cookie exists, not if it's valid
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    /*
    * Match all request paths except for the ones that start with:
    * - /api
    * - /_next/static
    * - /_next/image
    * - /favicon.ico
    */
    matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};