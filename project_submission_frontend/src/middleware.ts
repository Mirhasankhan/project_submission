import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  // Protected routes: home page and all board routes
  const isProtectedRoute = pathname === "/" || pathname.startsWith("/board");

  // Auth routes for guests only: login and register
  const isAuthRoute =
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname.startsWith("/auth/login/") ||
    pathname.startsWith("/auth/register/");

  // 1. If user is not signed in / accessToken not found and tries to access home or /board/:id
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If user is logged in and tries to access login or register page
  if (token && isAuthRoute) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [   
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
