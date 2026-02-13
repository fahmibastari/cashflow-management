import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react'
import PageWrapper from '@/app/components/PageWrapper'
import EmptyState from '@/app/components/EmptyState'

import { verifySession } from '@/app/lib/auth'
import { redirect } from 'next/navigation'

export default async function BudgetPage() {
    const session = await verifySession()
    if (!session) redirect('/login')

    // Fetch Allocations (Budget)
    const allocations = await prisma.allocationPlan.findMany({
        where: { userId: session.userId }
    })

    // Fetch Realized Expenses (Actual) - THIS MONTH ONLY
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const expenses = await prisma.realizedExpense.findMany({
        where: {
            userId: session.userId,
            date: {
                gte: startOfMonth,
                lte: endOfMonth
            }
        }
    })

    // Group Expenses by Category
    const expenseByCategory: { [key: string]: number } = {}
    expenses.forEach(exp => {
        const category = exp.category
        expenseByCategory[category] = (expenseByCategory[category] || 0) + exp.amount
    })

    // Calculate Status for each Budget
    const budgetStatus = allocations.map(plan => {
        const actual = expenseByCategory[plan.category] || 0
        // Calculate monthly equivalent for display if needed
        let monthlyBudget = plan.amount
        if (plan.frequency === 'WEEKLY') monthlyBudget = plan.amount * 4
        if (plan.frequency === 'DAILY') monthlyBudget = plan.amount * 30

        const percent = Math.min((actual / monthlyBudget) * 100, 100)
        const isOverBudget = actual > monthlyBudget

        return {
            ...plan,
            monthlyBudget,
            actual,
            percent,
            isOverBudget
        }
    })

    // Sort: Overbudget first, then by percent used
    budgetStatus.sort((a, b) => b.percent - a.percent)

    return (
        <PageWrapper className="flex flex-col gap-6 py-8 pb-32 max-w-md mx-auto">
            <header className="flex items-center gap-4 px-2">
                <Link href="/" className="btn btn-outline h-10 w-10 p-0 rounded-full border-slate-200">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Budget Analysis</h1>
            </header>

            <section className="flex flex-col gap-4">
                {budgetStatus.map(item => (
                    <div key={item.id} className={`card p-5 border-l-4 ${item.isOverBudget ? 'border-l-rose-500' : 'border-l-emerald-500'} bg-white border-y-slate-200 border-r-slate-200 shadow-sm`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-slate-900">{item.category}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 uppercase tracking-wide">
                                    {item.frequency} Plan
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold font-mono ${item.isOverBudget ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {formatCurrency(item.actual)}
                                    <span className="text-xs text-slate-400 font-sans font-normal opacity-75"> / {formatCurrency(item.monthlyBudget)}</span>
                                </p>
                            </div>
                        </div>

                        <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
                            <div
                                className={`absolute top-0 left-0 h-full transition-all duration-500 ${item.isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                style={{ width: `${item.percent}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between items-center mt-3 text-xs">
                            <span className="text-slate-400">
                                {item.isOverBudget ? (
                                    <span className="flex items-center gap-1 text-rose-500 font-medium"><AlertCircle size={12} /> Over Budget</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-emerald-500 font-medium"><CheckCircle2 size={12} /> On Track</span>
                                )}
                            </span>
                            <span className="text-slate-500 font-medium">
                                {Math.round((item.actual / item.monthlyBudget) * 100)}% Used
                            </span>
                        </div>
                    </div>
                ))}

                {budgetStatus.length === 0 && (
                    <EmptyState
                        icon={TrendingDown}
                        title="No Budget Plans"
                        description="Set allocation plans to track your spending limits."
                        actionLabel="Create Budget"
                        actionLink="/allocation/new"
                    />
                )}
            </section>
        </PageWrapper>
    )
}
