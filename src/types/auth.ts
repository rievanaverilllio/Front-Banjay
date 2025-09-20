export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}

export interface SessionTokenPayload {
  sub: string
  email: string
  role: "admin" | "user"
  iat: number
  exp: number
}

export type UserRole = "admin" | "user"
