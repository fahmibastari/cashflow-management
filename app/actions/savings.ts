"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { verifySession } from "@/app/lib/auth"
import { SavingType } from "@prisma/client"

export async function createSaving(formData: FormData) {
    const session = await verifySession()
    if (!session?.userId) redirect('/login')

    const name = formData.get("name") as string
    const target = parseFloat(formData.get("target") as string)
    const current = parseFloat(formData.get("current") as string) || 0
    const type = formData.get("type") as SavingType || "GOAL"
    const notes = formData.get("notes") as string

    await prisma.saving.create({
        data: {
            name,
            target,
            current,
            type,
            notes,
            userId: session.userId
        }
    })

    revalidatePath("/savings")
    redirect("/savings")
}

export async function addMoneyToSaving(id: string, formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string) || 0

    const saving = await prisma.saving.findUnique({ where: { id } })
    if (!saving) return;

    // Transaction: Update Saving + Create Expense
    await prisma.$transaction([
        prisma.saving.update({
            where: { id },
            data: { current: saving.current + amount }
        }),
        prisma.realizedExpense.create({
            data: {
                amount,
                category: "Savings",
                description: `Deposit to ${saving.name}`,
                source: "Savings Transfer",
                date: new Date(),
                userId: saving.userId
            }
        })
    ])

    revalidatePath("/savings")
    revalidatePath("/") // Update dashboard balance
    revalidatePath("/daily") // Update timeline
}

export async function updateInvestmentValue(id: string, formData: FormData) {
    const newValue = parseFloat(formData.get("amount") as string) || 0

    // Just update the current value (Capital Gain/Loss), NO expense record created
    await prisma.saving.update({
        where: { id },
        data: { current: newValue }
    })

    revalidatePath("/savings")
}

export async function deleteSaving(id: string) {
    await prisma.saving.delete({ where: { id } })
    revalidatePath("/savings")
}
