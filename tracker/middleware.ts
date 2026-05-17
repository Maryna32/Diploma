import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/my-log", "/stats", "/notifications"];
const ownProfileRoute = "/profile";
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));
  const isOwnProfile = pathname === ownProfileRoute;
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));

  if ((isProtectedRoute || isOwnProfile) && !user) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (pathname === "/auth" && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    const { data: userData } = await supabase
      .from("User")
      .select("role, bannedUntil")
      .eq("id", user.id)
      .single();

    if (userData?.bannedUntil && new Date(userData.bannedUntil) > new Date()) {
      if (userData.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/banned", request.url));
      }
    }
    if (userData?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if ((isProtectedRoute || isOwnProfile) && user) {
    const { data: userData } = await supabase
      .from("User")
      .select("bannedUntil")
      .eq("id", user.id)
      .single();

    if (userData?.bannedUntil && new Date(userData.bannedUntil) > new Date()) {
      return NextResponse.redirect(new URL("/banned", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};