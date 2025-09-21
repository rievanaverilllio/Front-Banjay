import { NextResponse, type NextRequest } from "next/server"

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
    "/asisten-dokumen",
    "/asisten-dokumen/:path*",
    "/bantuan",
    "/bantuan/:path*",
    "/buat-cepat",
    "/buat-cepat/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/data-curah-hujan",
    "/data-curah-hujan/:path*",
    "/laporan-masyarakat",
    "/laporan-masyarakat/:path*",
    "/notifikasi",
    "/notifikasi/:path*",
    "/pengaturan",
    "/pengaturan/:path*",
    "/peta-lokasi",
    "/peta-lokasi/:path*",
    "/posko",
    "/posko/:path*",
    "/pustaka-data",
    "/pustaka-data/:path*",
    "/statistik",
    "/statistik/:path*",
  ],
}
