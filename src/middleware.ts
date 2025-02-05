import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";

const PUBLIC_ROUTES = ["/auth/signin", "/auth/signup"];
const PROTECTED_ROUTES = ["/", "/api/notes"];

export async function middleware(request: NextRequest) {
  const token = cookies().get("token")?.value;
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname)) {
    if (token) {
      try {
        const decoded = verifyToken(token);
        if (decoded) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (error) {
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
    return NextResponse.next();
  }

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const redirectUrl = new URL("/auth/signin", request.url);
      redirectUrl.searchParams.set("message", "Login to Continue");
      return NextResponse.redirect(redirectUrl);
    }

    try {
      const decoded = verifyToken(token);
      if (!decoded) {
        const redirectUrl = new URL("/auth/signin", request.url);
        redirectUrl.searchParams.set(
          "message",
          "Invalid or expired token, Login again"
        );
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.delete("token");
        return response;
      }
    } catch (error) {
      const redirectUrl = new URL("/auth/signin", request.url);
      redirectUrl.searchParams.set(
        "message",
        "Invalid or expired token, Login again"
      );
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/api/notes", "/auth/signin", "/auth/signup"],
};
