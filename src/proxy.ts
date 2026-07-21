import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Renova a sessão e protege /admin/*. A checagem de papel admin (role) é feita
// no banco (RLS) e nas Edge Functions (assertAdmin) — aqui só exigimos sessão.
// Next 16: convenção `proxy` (antigo `middleware`).
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  if (!user && !isLogin) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/admin/login";
    return NextResponse.redirect(redirect);
  }
  if (user && isLogin) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/admin/leads";
    return NextResponse.redirect(redirect);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
