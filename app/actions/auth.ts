"use server"
// Auth actions

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { createSession, deleteSession } from "@/app/lib/auth"

export async function signup(prevState: any, formData: FormData) {
    const username = formData.get("username") as string
    const name = formData.get("name") as string
    const password = formData.get("password") as string

    if (!username || !name || !password) {
        return { error: "All fields are required." }
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { username },
    })

    if (existingUser) {
        return { error: "Username is already taken." }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
        data: {
            username,
            name,
            password: hashedPassword,
        },
    })

    // Create session
    await createSession(user.id)
    redirect("/")
}

export async function login(prevState: any, formData: FormData) {
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { username },
    })

    if (!user) {
        return { error: "Invalid username or password." }
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        return { error: "Invalid username or password." }
    }

    // Create session
    await createSession(user.id)
    redirect("/")
}

export async function logout() {
    await deleteSession()
    redirect("/login")
}
