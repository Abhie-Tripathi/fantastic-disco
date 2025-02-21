import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.IS_LOCAL) {
    return NextResponse.next();
  }

  const key = process.env.NEXT_COOKIE_PREFIX
    ? `${process.env.NEXT_COOKIE_PREFIX}-token`
    : "dev-token";
  const cookie = request.cookies.get(key)?.value;
  
  if (!cookie) {
    return NextResponse.redirect(new URL("/signin", request.url));
  } else {
    if (request.nextUrl.pathname == "/") {
      return NextResponse.redirect(new URL("/internal", request.url));
    }
  }
  if (
    request.nextUrl.pathname === "/internal/search/events" &&
    !request.nextUrl.searchParams.has("view")
  ) {
    request.nextUrl.searchParams.set("view", "table");
    return NextResponse.redirect(request.nextUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|signin|signup|detailpage|forgot-password|reset|login|location|category|verify-otp).*)",
  ],
};
