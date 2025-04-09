import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.IS_LOCAL) {
    return NextResponse.next();
  }

  const key = process.env.NEXT_COOKIE_PREFIX
    ? `${process.env.NEXT_COOKIE_PREFIX}-token`
    : "dev-token";
  const cookie = request.cookies.get(key)?.value;

  const redirectParam = request.nextUrl.searchParams.get("redirect");

  if (!cookie) {
    if (redirectParam) {
      return NextResponse.redirect(
        new URL(`/signin?redirect=${redirectParam}`, request.url)
      );
    }
    return NextResponse.redirect(new URL("/signin", request.url));
  } else {
    if (request.nextUrl.pathname == "/") {
      if (redirectParam) {
        return NextResponse.redirect(
          new URL(`/internal/${redirectParam}`, request.url)
        );
      }
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
