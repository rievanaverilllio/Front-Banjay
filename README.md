## Banjay AI — Frontend (Next.js App Router)

Next.js 15 + TypeScript + Prisma + Postgres with custom auth (JWT cookie), Forgot Password via 6‑digit OTP email, and Google OAuth login.

### Requirements
- Node.js 18+ (or 20+)
- PostgreSQL 14+ (local or remote)
- SMTP account (Mailtrap, Gmail App Password, Resend, etc.)
- Google OAuth 2.0 credentials (OAuth Client ID)

### Quick Start
1) Install deps
```powershell
npm install
```

2) Copy env and fill values
```powershell
Copy-Item .env.example .env -ErrorAction SilentlyContinue
# or create .env and paste the variables below
```

Required `.env` keys:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/banjay?schema=public

# Use ONE strong secret only (remove duplicates)
AUTH_SECRET=replace-with-a-long-random-hex

# SMTP (example: Mailtrap)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=xxxx
SMTP_PASS=xxxx
SMTP_FROM="Banjay AI <no-reply@banjay.ai>"

# Google OAuth
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/oauth/google/callback

# Post-login destination
POST_LOGIN_REDIRECT=/dashboard
```

3) Setup database
```powershell
npx prisma migrate dev
npx prisma db seed  # if seed.js exists
npx prisma studio   # optional, inspect data
```

4) Run dev server
```powershell
npm run dev
```
Visit http://localhost:3000

---

## Features
- JWT session cookie `token` after signup/login/OAuth
- Forgot Password with 6‑digit OTP (expires in 15 minutes)
- Reset password via email+code or token
- Google OAuth2 login flow

## Auth Endpoints
- `POST /api/auth/signup` — create account, sets cookie
- `POST /api/auth/login` — email+password, sets cookie
- `POST /api/auth/forgot-password` — request 6‑digit code
- `POST /api/auth/forgot-password/verify` — verify code
- `POST /api/auth/reset-password` — reset using `{ email, code, password }` or `{ token, password }`
- `GET /api/auth/oauth/google` — start Google OAuth
- `GET /api/auth/oauth/google/callback` — complete OAuth and set cookie

## Google OAuth Setup
1) In Google Cloud Console → OAuth consent screen: set up app and scopes (openid, email, profile)
2) Credentials → Create OAuth client ID (Web application)
	 - Authorized redirect URI: `http://localhost:3000/api/auth/oauth/google/callback`
3) Put `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` in `.env`
4) On the login page, “Sign in with Google” navigates to `/api/auth/oauth/google`

If callback fails, you will be sent to `/login?error=...`. Check your terminal logs for details.

## SMTP / OTP Email
This project sends a branded OTP email for password resets.
- Configure SMTP values in `.env`.
- Mailtrap is recommended for local testing.
- Gmail requires an App Password (2FA on, app password created).

## Common Issues
- Multiple AUTH_SECRET entries in `.env`: keep only ONE.
- Redirect mismatch: `GOOGLE_REDIRECT_URI` in `.env` must exactly match Google Console.
- Cookies blocked: ensure browser allows cookies for `localhost`.
- Node runtime: routes using Node features declare `export const runtime = "nodejs"`.

## Project Scripts
```jsonc
// package.json (selected)
{
	"scripts": {
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"lint": "next lint",
		"prisma:migrate": "prisma migrate dev",
		"prisma:studio": "prisma studio"
	}
}
```

## Tech Stack
- Next.js App Router, TypeScript
- Prisma ORM + PostgreSQL
- Custom HMAC JWT (WebCrypto)
- Nodemailer (dynamic import) for SMTP email

## License
Private/internal project unless specified otherwise.
