import { prisma } from "@/service/db"
import { hashPassword } from "@/lib/password"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return Response.json({ error: "Token dan password wajib." }, { status: 400 })
    const t = await prisma.token.findUnique({ where: { token } })
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
