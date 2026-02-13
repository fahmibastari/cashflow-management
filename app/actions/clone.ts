"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function cloneRevenue(id: string) {
    const original = await prisma.revenue.findUnique({ where: { id } })
    if (!original) return

    await prisma.revenue.create({
        data: {
            amount: original.amount,
            source: `${original.source} (Copy)`,
            description: original.description,
            status: 'PENDING',
            userId: original.userId,
            date: new Date() // Set to today
        }
    })
    revalidatePath("/revenue")
}

export async function cloneExpense(id: string) {
    const original = await prisma.realizedExpense.findUnique({ where: { id } })
    if (!original) return

    await prisma.realizedExpense.create({
        data: {
            amount: original.amount,
            category: original.category,
            description: original.description,
            source: original.source,
            userId: original.userId,
            planId: original.planId,
            date: new Date() // Set to today
        }
    })
    revalidatePath("/realized")
    revalidatePath("/daily")
    revalidatePath("/budget")
}
