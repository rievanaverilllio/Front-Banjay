export const runtime = "nodejs"
import { prisma } from "@/service/db"
import { randomBytes } from "crypto"
import { sendResetCodeEmail } from "@/lib/mailer"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return Response.json({ error: "Email wajib." }, { status: 400 })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return Response.json({ error: "Format email tidak valid." }, { status: 400 })
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // Return ok regardless to avoid user enumeration
      return Response.json({ ok: true })
    }

    // Invalidate previous reset tokens for this user
    await prisma.token.deleteMany({ where: { userId: user.id, type: "RESET_PASSWORD", consumedAt: null } })

    // Generate 6-digit code and random suffix to keep token unique
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const suffix = randomBytes(8).toString("hex")
    const token = `${code}.${suffix}`
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15)

    await prisma.token.create({ data: { type: "RESET_PASSWORD", token, userId: user.id, expiresAt } })

    // Send the 6-digit code via email
    try {
      await sendResetCodeEmail(email, code)
    } catch (err) {
      // Do not reveal email existence; still return ok to client
      console.error("Failed to send reset code email:", err)
    }

    const isProd = process.env.NODE_ENV === "production"
    return Response.json({ ok: true, ...(isProd ? {} : { code }) })
  } catch (e) {
    return Response.json({ error: "Terjadi kesalahan." }, { status: 500 })
  }
}
