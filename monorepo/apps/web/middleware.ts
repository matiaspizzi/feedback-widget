import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import type { NextMiddleware } from "next/server"

const { auth } = NextAuth(authConfig)
export default auth as NextMiddleware

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}