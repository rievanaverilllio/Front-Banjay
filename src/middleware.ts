import { NextResponse, type NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth-token"

// Protect admin routes: require session token (provider-agnostic)
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = req.cookies.get("token")?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  // verify token signature and expiry
  try {
    const secret = process.env.AUTH_SECRET || "dev-secret"
    const payload = await verifyToken(token, secret)
    if (!payload) {
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
  } catch {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
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
