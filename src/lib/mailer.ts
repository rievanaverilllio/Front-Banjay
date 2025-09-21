import "server-only"

type Transporter = any

let cachedTransporter: Transporter | null = null

async function getTransporter() {
  if (cachedTransporter) return cachedTransporter
  const nodemailer: any = (await import("nodemailer")).default
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !port || !user || !pass) {
    throw new Error("SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.")
  }

  const secure = port === 465
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
  return cachedTransporter
}

export async function sendResetCodeEmail(to: string, code: string) {
  const from = process.env.SMTP_FROM || `No-Reply <no-reply@${(process.env.SMTP_HOST || "example.com").replace(/:.*/, "")}>`
  const transporter = await getTransporter()
  const subject = "Your password reset code"
  const text = `Use this code to reset your password: ${code}. This code expires in 15 minutes.`
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>Password Reset</h2>
      <p>Use this verification code to reset your password:</p>
      <p style="font-size:24px;font-weight:bold;letter-spacing:3px">${code}</p>
      <p style="color:#555">This code expires in 15 minutes. If you did not request this, you can safely ignore this email.</p>
    </div>
  `

  await transporter.sendMail({ from, to, subject, text, html })
}
