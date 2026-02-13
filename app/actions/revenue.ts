"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createRevenue(formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string)
    const source = formData.get("source") as string
    const description = formData.get("description") as string
    const status = formData.get("status") as "PENDING" | "PAID_CASH" | "PAID_TF"

    // Hardcoded user for now
    const user = await prisma.user.findFirst()
    if (!user) throw new Error("No user found")

    await prisma.revenue.create({
        data: {
            amount,
            source,
            description,
            status,
            userId: user.id
        }
    })

    revalidatePath("/revenue")
    redirect("/revenue")
}

export async function deleteRevenue(id: string) {
    await prisma.revenue.delete({ where: { id } })
    revalidatePath("/revenue")
}

export async function updateRevenueStatus(id: string, status: "PENDING" | "PAID_CASH" | "PAID_TF") {
    await prisma.revenue.update({
        where: { id },
        data: { status }
    })
    revalidatePath("/revenue")
}
