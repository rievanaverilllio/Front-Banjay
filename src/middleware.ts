import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protect admin routes: require session token and oauth_provider=google
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = req.cookies.get("token")?.value
  const provider = req.cookies.get("oauth_provider")?.value

  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  // Enforce Google-only access for admin
  if (provider !== "google") {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("error", "google_required")
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Admin routes live under the (admin) group, but the group name is not in the URL.
    "/asisten-dokumen/:path*",
    "/bantuan/:path*",
    "/buat-cepat/:path*",
    "/dashboard/:path*",
    "/data-curah-hujan/:path*",
    "/laporan-masyarakat/:path*",
    "/notifikasi/:path*",
    "/pengaturan/:path*",
    "/peta-lokasi/:path*",
    "/posko/:path*",
    "/pustaka-data/:path*",
    "/statistik/:path*",
  ],
}
