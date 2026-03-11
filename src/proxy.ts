import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default async function proxy(request: NextRequest) {
  const isPath = (path: string) => request.nextUrl.pathname === path;

  // this checks if cookie exists and is valid
  const sessionCookie = await auth.api.getSession({
    headers: request.headers,
    query: {
      disableCookieCache: true,
    },
  });
  const hasBeenVerified = sessionCookie?.user.emailVerified;

  if ((!sessionCookie || !hasBeenVerified) && !isPath("/")) {
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
