import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Plus, Calendar } from 'lucide-react'
import PageWrapper from '@/app/components/PageWrapper'
import EmptyState from '@/app/components/EmptyState'

// Helper to group expenses by date
function groupByDate(expenses: any[]) {
    const groups: { [key: string]: any[] } = {}
    expenses.forEach(exp => {
        const dateStr = new Date(exp.date).toLocaleDateString()
        if (!groups[dateStr]) {
            groups[dateStr] = []
        }
        groups[dateStr].push(exp)
    })
    return groups
}

import { verifySession } from '@/app/lib/auth'
import { redirect } from 'next/navigation'

export default async function DailyPage() {
    const session = await verifySession()
    if (!session) redirect('/login')

    const expenses = await prisma.realizedExpense.findMany({
        where: { userId: session.userId },
        orderBy: { date: 'desc' },
        include: { plan: true }
    })

    const grouped = groupByDate(expenses)
    const dates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    return (
        <PageWrapper className="flex flex-col gap-6 py-8 pb-32 max-w-md mx-auto">
            <header className="flex items-center gap-4 px-2">
                <Link href="/" className="btn btn-outline h-10 w-10 p-0 rounded-full border-slate-200">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Daily Timeline</h1>
            </header>

            <section className="flex flex-col gap-6 relative">
                {/* Vertical Line */}
                {dates.length > 0 && (
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200 z-0"></div>
                )}

                {dates.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title="No Daily Records"
                        description="Transactions will appear here day by day."
                        actionLabel="Add Transaction"
                        actionLink="/realized/new"
                    />
                ) : (
                    dates.map(date => {
                        const dayExpenses = grouped[date]
                        const dayTotal = dayExpenses.reduce((sum: number, item: any) => sum + item.amount, 0)

                        return (
                            <div key={date} className="relative z-10 pl-10">
                                {/* Date Dot */}
                                <div className="absolute left-[13px] top-1.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></div>

                                <div className="flex justify-between items-baseline mb-3">
                                    <h3 className="text-slate-500 font-medium text-sm">{date}</h3>
                                    <span className="text-xs font-bold text-rose-500">-{formatCurrency(dayTotal)}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {dayExpenses.map((exp: any) => (
                                        <div key={exp.id} className="card p-3 flex justify-between items-center hover:bg-slate-50 transition duration-200 bg-white border-slate-100 shadow-sm">
                                            <div>
                                                <p className="font-semibold text-slate-900 text-sm">{exp.category}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {exp.plan && (
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-100">
                                                            {exp.plan.category}
                                                        </span>
                                                    )}
                                                    {exp.source && <p className="text-[10px] text-slate-400">{exp.source}</p>}
                                                </div>
                                            </div>
                                            <p className="font-mono text-sm text-slate-600">-{formatCurrency(exp.amount)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })
                )}
            </section>

            <Link href="/realized/new" className="fab shadow-rose-500/30 bg-rose-600 hover:bg-rose-700">
                <Plus size={28} />
            </Link>
        </PageWrapper>
    )
}
