"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createRealized(formData: FormData) {
    const category = formData.get("category") as string
    const amount = parseFloat(formData.get("amount") as string)
    const source = formData.get("source") as string
    const date = new Date(formData.get("date") as string)

    const user = await prisma.user.findFirst()
    if (!user) throw new Error("No user found")

    await prisma.realizedExpense.create({
        data: {
            category,
            amount,
            source,
            date,
            userId: user.id
        }
    })

    revalidatePath("/realized")
    redirect("/realized")
}

export async function deleteRealized(id: string) {
    await prisma.realizedExpense.delete({ where: { id } })
    revalidatePath("/realized")
}
