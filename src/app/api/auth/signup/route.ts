import { prisma } from "@/service/db"
import { hashPassword } from "@/lib/password"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) return Response.json({ error: "Email dan password wajib." }, { status: 400 })
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return Response.json({ error: "Email sudah terdaftar." }, { status: 409 })
    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({ data: { email, passwordHash, name, role: "USER" } })
    return Response.json({ id: user.id, email: user.email })
  } catch (e) {
    return Response.json({ error: "Terjadi kesalahan." }, { status: 500 })
  }
}
