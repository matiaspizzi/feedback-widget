import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import type { NextMiddleware } from "next/server";

const { auth } = NextAuth(authConfig);

export default (async (req, ctx) => {
  const res = await (auth as NextMiddleware)(req, ctx);

  if (!res) return;

  res.headers.append("Access-Control-Allow-Credentials", "true");
  res.headers.append("Access-Control-Allow-Origin", "*");
  res.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT",
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    "x-api-key, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  return res;
}) as NextMiddleware;

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
};
