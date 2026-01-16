"use server"

import { prisma } from "@repo/database"
import { saltAndHashPassword } from "@/lib/password"
import { redirect } from "next/navigation"

export async function register(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password) {
    throw new Error("Missing fields")
  }

  const hashedPassword = await saltAndHashPassword(password)

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("User already exists or other error")
  }

  redirect("/login")
}
