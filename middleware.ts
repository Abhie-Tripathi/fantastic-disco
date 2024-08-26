import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("token")?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }else{
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