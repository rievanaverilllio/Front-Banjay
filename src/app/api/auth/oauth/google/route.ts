import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

function randomState(len = 24) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let out = ""
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const redirectUri = process.env.GOOGLE_REDIRECT_URI
  const clientId = process.env.GOOGLE_CLIENT_ID
  const scope = [
    "openid",
    "email",
    "profile",
  ].join(" ")
  if (!redirectUri || !clientId) {
    return Response.json({ error: "Google OAuth not configured" }, { status: 500 })
  }
  const state = randomState()

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    access_type: "offline",
    include_granted_scopes: "true",
    scope,
    state,
    prompt: "select_account",
  })
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  const res = NextResponse.redirect(authUrl, 302)
  res.cookies.set("oauth_state", state, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 600 })
  return res
}
