"use server"

import { prisma } from "@repo/database"
import { saltAndHashPassword } from "@/lib/password"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { loginSchema, registerSchema } from "@repo/shared"
import { AuthState } from "./types"

export async function loginAction(prevState: AuthState | null | undefined, formData: FormData): Promise<AuthState | null | undefined> {
  const rawData = Object.fromEntries(formData)
  const validatedFields = loginSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as AuthState['errors']
    }
  }

  try {
    await signIn("credentials", {
      ...validatedFields.data,
      redirect: true,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Email o contraseña incorrectos." }
    }
    // IMPORTANTE: Next.js usa errores para redireccionar. 
    // Si no relanzas el error, el redirect no funcionará.
    throw error
  }
}

export async function registerAction(prevState: AuthState | null | undefined, formData: FormData): Promise<AuthState | null | undefined> {
  const rawData = Object.fromEntries(formData)
  const validatedFields = registerSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as AuthState['errors']
    }
  }

  const { email, password, name } = validatedFields.data

  try {
    const hashedPassword = await saltAndHashPassword(password)
    await prisma.user.create({
      data: { email, password: hashedPassword, name: name || null },
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { message: "El email ya está registrado." }
    }
    return { message: "Error al crear la cuenta." }
  }

  // Redirigimos al login tras el registro exitoso
  redirect("/login")
}