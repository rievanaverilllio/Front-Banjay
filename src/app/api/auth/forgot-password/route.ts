import { prisma } from "@/service/db"
import { randomBytes } from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return Response.json({ error: "Email wajib." }, { status: 400 })
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return Response.json({ ok: true })

    const token = randomBytes(24).toString("hex")
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15)
    await prisma.token.create({ data: { type: "RESET_PASSWORD", token, userId: user.id, expiresAt } })
    // TODO: kirim email token
    return Response.json({ ok: true, token })
  } catch (e) {
    return Response.json({ error: "Terjadi kesalahan." }, { status: 500 })
  }
}
