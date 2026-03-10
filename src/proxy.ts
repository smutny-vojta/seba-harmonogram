import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { getCookieCache } from "better-auth/cookies";

export default async function proxy(request: NextRequest) {
  const isPath = (path: string) => request.nextUrl.pathname.startsWith(path);

  // this checks if cookie exists and is valid
  // const sessionCookie = await auth.api.getSession(request);

  // checking only if cookie exists, not if it's valid
  const sessionCookie = await getCookieCache(request);
  const hasBeenVerified = sessionCookie?.user.emailVerified === true;

  if ((!sessionCookie || !hasBeenVerified) && !isPath("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie && hasBeenVerified && isPath("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
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
