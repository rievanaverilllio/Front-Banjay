import { prisma } from "@/service/db"
import { hashPassword } from "@/lib/password"
import { signToken } from "@/lib/auth-token"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) return Response.json({ error: "Email dan password wajib." }, { status: 400 })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return Response.json({ error: "Format email tidak valid." }, { status: 400 })
    if (typeof password !== "string" || password.length < 6) return Response.json({ error: "Password minimal 6 karakter." }, { status: 400 })

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return Response.json({ error: "Email sudah terdaftar." }, { status: 409 })
    const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({ data: { email, passwordHash, name } })

    const role = user.role.toLowerCase() as "admin" | "user"
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + 60 * 60 * 24 * 7
    const token = await signToken({ sub: user.id, email: user.email, role, iat, exp }, process.env.AUTH_SECRET || "dev-secret")

    const cookieStore = await cookies()
    cookieStore.set("token", token, { httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7 })

    return Response.json({ id: user.id, email: user.email, name: user.name, role })
  } catch (e) {
    return Response.json({ error: "Terjadi kesalahan." }, { status: 500 })
  }
}
