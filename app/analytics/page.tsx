import { prisma } from '@/lib/prisma'
import AnalyticsClient from './AnalyticsClient'

import { verifySession } from '@/app/lib/auth'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
    const session = await verifySession()
    if (!session) redirect('/login')

    const expenses = await prisma.realizedExpense.findMany({
        where: { userId: session.userId },
        orderBy: { date: 'asc' }
    })

    // Prepare Data for Charts

    // 1. By Category
    const byCategory: { [key: string]: number } = {}
    expenses.forEach(exp => {
        byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount
    })
    const expenseByCategory = Object.keys(byCategory).map(cat => ({
        name: cat,
        value: byCategory[cat]
    }))

    // 2. By Day
    const byDay: { [key: string]: number } = {}
    expenses.forEach(exp => {
        const dateStr = new Date(exp.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
        byDay[dateStr] = (byDay[dateStr] || 0) + exp.amount
    })
    // Get last 7 days or minimal dataset
    const expensesByDay = Object.keys(byDay).map(date => ({
        date,
        amount: byDay[date]
    }))

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0)

    const data = {
        expenseByCategory,
        expensesByDay,
        totalExpenses
    }

    return <AnalyticsClient data={data} />
}
