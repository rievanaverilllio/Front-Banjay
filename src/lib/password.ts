import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string) {
  // Support legacy sha256-prefixed hashes created in prisma/seed.js
  if (typeof hash === "string" && hash.startsWith("sha256:")) {
    const legacy = hash.slice("sha256:".length)
    const inputHash = crypto.createHash("sha256").update(password).digest("hex")
    return crypto.timingSafeEqual(Buffer.from(inputHash, "hex"), Buffer.from(legacy, "hex"))
  }

  // Fallback to bcrypt for normal stored hashes
  return bcrypt.compare(password, hash)
}
