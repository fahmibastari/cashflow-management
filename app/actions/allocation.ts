"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { verifySession } from "@/app/lib/auth"

export async function createAllocation(formData: FormData) {
    const session = await verifySession()
    if (!session || !session.userId) redirect('/login')

    const category = formData.get("category") as string
    const amount = parseFloat(formData.get("amount") as string)
    const frequency = formData.get("frequency") as "DAILY" | "WEEKLY" | "MONTHLY" | "ONE_TIME"
    const notes = formData.get("notes") as string

    // Create allocation linked to session userId
    await prisma.allocationPlan.create({
        data: {
            category,
            amount,
            frequency,
            notes,
            userId: session.userId
        }
    })

    revalidatePath("/allocation")
    redirect("/allocation")
}

export async function deleteAllocation(id: string) {
    await prisma.allocationPlan.delete({ where: { id } })
    revalidatePath("/allocation")
}
