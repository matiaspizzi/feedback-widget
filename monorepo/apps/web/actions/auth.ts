"use server"

import { loginSchema, registerSchema } from "@repo/shared"
import { saltAndHashPassword } from "@lib/password"
import { isDomainError } from "@lib/errors"
import { getAuthDeps } from "@lib/deps"
import { signIn } from "@auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { AuthState } from "./types"

export async function loginAction(
  _prevState: AuthState | null | undefined,
  formData: FormData
): Promise<AuthState | null | undefined> {
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
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Invalid email or password" }
    }

    throw error
  }
}

export async function registerAction(
  _prevState: AuthState | null | undefined,
  formData: FormData
): Promise<AuthState | null | undefined> {
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
    const { userService } = getAuthDeps()

    await userService.create({
      email,
      password: hashedPassword,
      name: name || null,
    })
  } catch (error: unknown) {
    if (isDomainError(error)) {
      return { message: error.message }
    }

    return { message: "An unexpected error occurred during registration" }
  }

  redirect("/login")
}