"use server"

import { saltAndHashPassword } from "@/lib/password"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { loginSchema, registerSchema } from "@repo/shared"
import { AuthState } from "./types"
import { UserService } from "@/services/user-service"
import { UserRepository } from "@/repositories"

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
      return { message: "Invalid email or password" }
    }
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
    const userRepository = new UserRepository()
    const userService = new UserService(userRepository)

    await userService.create({
      email,
      password: hashedPassword,
      name: name || null,
    })
  } catch (error: any) {
    if (error.message === "User with this email already exists") {
      return { message: "Email already exists" }
    }
    return { message: "Error creating account" }
  }

  redirect("/login")
}