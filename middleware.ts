import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const key = (process.env.NEXT_COOKIE_PREFIX ? `${process.env.NEXT_COOKIE_PREFIX}-` : '') + 'token';
  const cookie = request.cookies.get(key)?.value;
  if (!cookie) {
    console.log("directing to signin")
    return NextResponse.redirect(new URL("/signin", request.url));
  }else{
    console.log("directing to signin")
    if(request.nextUrl.pathname == '/'){
      return NextResponse.redirect(new URL("/internal", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|signin|signup|detailpage|forgot-password|reset|internal/trackers/).*)",
  ],
};