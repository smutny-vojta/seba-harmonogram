import { NextRequest, NextResponse } from "next/server";
import { getCookieCache } from "better-auth/cookies";

export default async function proxy(request: NextRequest) {
  const isPath = (path: string) => request.nextUrl.pathname === path;

  // // CHECKS IF SESSION COOKIE EXISTS, THIS DOES NOT VALIDATE IT
  // // reason: to make proxy faster, validation is done in api routes
  // const sessionCookie = await getCookieCache(request);

  // if (!sessionCookie && !isPath("/")) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

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
