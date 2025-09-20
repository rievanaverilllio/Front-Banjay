import { cookies } from "next/headers"

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

      return null
    } catch {
      return null
    }
  }
}
