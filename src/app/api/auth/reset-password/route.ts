export const runtime = "nodejs"
import { prisma } from "@/service/db"
import { hashPassword } from "@/lib/password"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password, email, code } = body as { token?: string; password?: string; email?: string; code?: string }
    if (!password) return Response.json({ error: "Password wajib." }, { status: 400 })
    let t: any = null

    if (token) {
      t = await prisma.token.findUnique({ where: { token } })
    } else if (email && code) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) return Response.json({ error: "Format email tidak valid." }, { status: 400 })
      if (!/^\d{6}$/.test(String(code))) return Response.json({ error: "Kode harus 6 digit angka." }, { status: 400 })
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return Response.json({ error: "Kode tidak valid." }, { status: 400 })
      const now = new Date()
      const candidate = await prisma.token.findFirst({
        where: { userId: user.id, type: "RESET_PASSWORD", consumedAt: null, expiresAt: { gt: now } },
        orderBy: { createdAt: "desc" },
      })
      if (!candidate || candidate.token.split(".")[0] !== String(code)) {
        return Response.json({ error: "Kode tidak valid atau kedaluwarsa." }, { status: 400 })
      }
      t = candidate
    } else {
      return Response.json({ error: "Token atau (email + kode) wajib." }, { status: 400 })
    }

    if (!t || t.type !== "RESET_PASSWORD" || t.consumedAt || t.expiresAt < new Date()) {
      return Response.json({ error: "Token tidak valid." }, { status: 400 })
    }
    const passwordHash = await hashPassword(password)
    await prisma.user.update({ where: { id: t.userId }, data: { passwordHash } })
    await prisma.token.update({ where: { id: t.id }, data: { consumedAt: new Date() } })
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: "Terjadi kesalahan." }, { status: 500 })
  }
}
