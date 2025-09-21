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
  const appName = process.env.APP_NAME || "Banjay AI"
  const appUrl = process.env.APP_URL || "https://example.com"
  const supportEmail = (from.match(/<([^>]+)>/)?.[1] || from)
  const transporter = await getTransporter()

  const subject = `${appName} • Kode Verifikasi Reset Password`
  const preheader = `Gunakan kode ${code} untuk mengganti password akun kamu. Berlaku 15 menit.`

  const text = [
    `${appName} - Reset Password`,
    "",
    `Halo,`,
    "",
    `Kami menerima permintaan untuk mengatur ulang password akun kamu. Masukkan kode verifikasi berikut:`,
    `KODE: ${code}`,
    "",
    "Kode ini hanya berlaku selama 15 menit.",
    "Jika kamu tidak meminta penggantian password, abaikan email ini.",
    "",
    `Buka: ${appUrl}/forgot-password untuk memasukkan kode.`,
    "",
    `Salam hangat,`,
    `${appName} Team`,
  ].join("\n")

  const html = `
  <!doctype html>
  <html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <title>${subject}</title>
    <style>
      .btn{background:#111;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;display:inline-block;font-weight:600}
      .code{font-size:20px;letter-spacing:6px;background:#111;color:#fff;padding:12px 16px;border-radius:12px;display:inline-block}
      @media (prefers-color-scheme: dark){ body{background:#0b0b0b !important} }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f6f9fc">
    <!-- Preheader (hidden) -->
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;color:transparent">${preheader}</div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f9fc">
      <tr>
        <td>
          <table role="presentation" width="600" align="center" cellspacing="0" cellpadding="0" style="margin:32px auto;background:#ffffff;border-radius:16px;box-shadow:0 6px 28px rgba(16,24,40,.06);overflow:hidden">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#0f0f0f,#1f1f1f);padding:28px 32px;color:#fff">
                <div style="font-size:18px;font-weight:800;letter-spacing:.4px">${appName}</div>
                <div style="opacity:.8;font-size:12px;margin-top:4px">Keamanan akun adalah prioritas kami</div>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:28px 32px;color:#111;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif;line-height:1.6">
                <h1 style="margin:0 0 8px 0;font-size:22px">Verifikasi reset password</h1>
                <p style="margin:0 0 16px 0;color:#475467">Halo, kami menerima permintaan untuk mengatur ulang password akun kamu. Untuk melanjutkan, gunakan kode verifikasi di bawah ini pada halaman ${appName}.</p>

                <div style="text-align:center;margin:20px 0 8px 0">
                  <span class="code">${code}</span>
                </div>
                <p style="margin:0 0 16px 0;color:#475467;text-align:center">Kode ini berlaku selama <strong>15 menit</strong> dan hanya dapat digunakan satu kali.</p>

                <div style="text-align:center;margin:20px 0">
                  <a class="btn" href="${appUrl}/forgot-password" target="_blank" rel="noopener">Masukkan kode di ${appName}</a>
                </div>

                <hr style="border:none;border-top:1px solid #eef2f7;margin:20px 0" />

                <h3 style="margin:0 0 8px 0;font-size:16px">Tips keamanan cepat</h3>
                <ul style="margin:0 0 16px 18px;color:#475467">
                  <li>Jangan bagikan kode ini kepada siapa pun, termasuk pihak yang mengaku dari ${appName}.</li>
                  <li>Gunakan password unik dan kuat, minimal 8 karakter dengan kombinasi huruf, angka, dan simbol.</li>
                  <li>Jika kamu tidak meminta reset password, abaikan email ini dan pertimbangkan untuk mengubah password.</li>
                </ul>

                <p style="margin:0;color:#475467">Butuh bantuan? Balas email ini atau hubungi kami di <a href="mailto:${supportEmail}" style="color:#111;text-decoration:underline">${supportEmail}</a>.</p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#f8fafc;color:#667085;padding:18px 32px;font-size:12px">
                <div>© ${new Date().getFullYear()} ${appName}. Semua hak dilindungi.</div>
                <div style="margin-top:6px">Email ini dikirim ke ${to}. Jika ini bukan kamu, abaikan.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
    headers: {
      "X-Priority": "3",
      "X-Entity-Ref-ID": `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      "X-Mailer": `${appName} Mailer`,
    },
  })
}
