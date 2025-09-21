export const runtime = "nodejs"
import { prisma } from "@/service/db"

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()
    if (!email || !code) return Response.json({ error: "Email dan kode wajib." }, { status: 400 })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return Response.json({ error: "Format email tidak valid." }, { status: 400 })
    if (!/^\d{6}$/.test(String(code))) return Response.json({ error: "Kode harus 6 digit angka." }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return Response.json({ error: "Kode tidak valid." }, { status: 400 })

    // Find the latest unconsumed reset token and compare the code part (before the '.')
    const tokens = await prisma.token.findMany({
      where: { userId: user.id, type: "RESET_PASSWORD", consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
      take: 3,
    })

    const match = tokens.find((t) => t.token.split(".")[0] === String(code))
    if (!match) return Response.json({ error: "Kode tidak valid atau kedaluwarsa." }, { status: 400 })

    // Return the full token to be used on actual reset
    return Response.json({ ok: true, token: match.token })
  } catch (e) {
    return Response.json({ error: "Terjadi kesalahan." }, { status: 500 })
  }
}
