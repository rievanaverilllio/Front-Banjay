import { prisma } from "@/service/db"
import { verifyPassword } from "@/lib/password"
import { signToken } from "@/lib/auth-token"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return Response.json({ error: "Email dan password wajib." }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return Response.json({ error: "Email atau password salah." }, { status: 401 })

    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) return Response.json({ error: "Email atau password salah." }, { status: 401 })

    const role = user.role.toLowerCase() as "admin" | "user"
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 60 * 10 // 10 minutes
  const token = await signToken({ sub: user.id, email: user.email, role, iat, exp }, process.env.AUTH_SECRET || "dev-secret")

  const cookieStore = await cookies()
  cookieStore.set("token", token, { httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 10 })

    return Response.json({ id: user.id, email: user.email, name: user.name, role })
  } catch (e) {
    return Response.json({ error: "Terjadi kesalahan." }, { status: 500 })
  }
}
