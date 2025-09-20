import { type SessionTokenPayload } from "@/types"

function base64url(input: ArrayBuffer | string) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const b64 = typeof btoa !== "undefined" ? btoa(binary) : Buffer.from(bytes).toString("base64")
  return b64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function fromBase64url(input: string) {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4)
  const bin = typeof atob !== "undefined" ? atob(b64) : Buffer.from(b64, "base64").toString("binary")
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function importKey(secret: string) {
  const enc = new TextEncoder().encode(secret)
  return await crypto.subtle.importKey("raw", enc, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"])
}

export async function signToken(payload: SessionTokenPayload, secret: string) {
  const header = { alg: "HS256", typ: "JWT" }
  const h64 = base64url(JSON.stringify(header))
  const p64 = base64url(JSON.stringify(payload))
  const data = `${h64}.${p64}`
  const key = await importKey(secret)
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))
  const s64 = base64url(sig)
  return `${data}.${s64}`
}

export async function verifyToken(token: string, secret: string): Promise<SessionTokenPayload | null> {
  const [h, p, s] = token.split(".")
  if (!h || !p || !s) return null
  const data = `${h}.${p}`
  const key = await importKey(secret)
  const sig = fromBase64url(s)
  const ok = await crypto.subtle.verify("HMAC", key, sig, new TextEncoder().encode(data))
  if (!ok) return null
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64url(p))) as SessionTokenPayload
    if (payload.exp && Date.now() / 1000 > payload.exp) return null
    return payload
  } catch {
    return null
  }
}
