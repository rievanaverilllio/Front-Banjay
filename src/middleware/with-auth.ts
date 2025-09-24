import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth-token"

export function requireAuth(options?: { loginPath?: string; cookieName?: string }) {
  const loginPath = options?.loginPath ?? "/login"
  const cookieName = options?.cookieName ?? "token"

  return async function guard(req: Request) {
    try {
  const url = new URL(req.url)
  const cookieStore = await cookies()
  const hasToken = cookieStore.has(cookieName)

      if (!hasToken) {
        url.pathname = loginPath
        return Response.redirect(url, 302)
      }

      const token = cookieStore.get(cookieName)?.value
      if (!token) {
        url.pathname = loginPath
        return Response.redirect(url, 302)
      }

      try {
        const secret = process.env.AUTH_SECRET || "dev-secret"
        const payload = await verifyToken(token, secret)
        if (!payload) {
          url.pathname = loginPath
          return Response.redirect(url, 302)
        }
      } catch {
        url.pathname = loginPath
        return Response.redirect(url, 302)
      }

      return null
    } catch {
      return null
    }
  }
}
