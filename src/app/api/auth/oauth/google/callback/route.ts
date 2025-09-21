import { cookies } from "next/headers"
import { prisma } from "@/service/db"
import { signToken } from "@/lib/auth-token"

export const runtime = "nodejs"

async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  })
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to exchange code")
  return res.json() as Promise<{ id_token: string; access_token: string; expires_in: number; refresh_token?: string }>
}

function decodeJwt<T>(jwt: string): T {
  const [, p] = jwt.split(".")
  const json = Buffer.from(p.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
  return JSON.parse(json)
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const state = url.searchParams.get("state")
  const code = url.searchParams.get("code")
  const error = url.searchParams.get("error")
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  const cookieStore = await cookies()
  const storedState = cookieStore.get("oauth_state")?.value
  cookieStore.set("oauth_state", "", { httpOnly: true, path: "/", maxAge: 0 })

  if (error) return Response.redirect("/login?error=access_denied", 302)
  if (!state || !storedState || state !== storedState) return Response.redirect("/login?error=state_mismatch", 302)
  if (!code || !redirectUri) return Response.redirect("/login?error=invalid_request", 302)

  try {
    const tokens = await exchangeCodeForTokens(code, redirectUri)
    type IdPayload = { sub: string; email?: string; name?: string; picture?: string; email_verified?: boolean }
    const idPayload = decodeJwt<IdPayload>(tokens.id_token)
    if (!idPayload.email) return Response.redirect("/login?error=no_email", 302)

    const email = idPayload.email.toLowerCase()
    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      user = await prisma.user.create({ data: { email, passwordHash: "google-oauth", name: idPayload.name || undefined, image: idPayload.picture || undefined } })
    }

    const role = user.role.toLowerCase() as "admin" | "user"
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + 60 * 60 * 24 * 7
    const session = await signToken({ sub: user.id, email: user.email, role, iat, exp }, process.env.AUTH_SECRET || "dev-secret")

    cookieStore.set("token", session, { httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7 })

    const dest = (process.env.POST_LOGIN_REDIRECT || "/dashboard")
    return Response.redirect(dest, 302)
  } catch (e) {
    return Response.redirect("/login?error=oauth_failed", 302)
  }
}
