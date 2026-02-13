import { prisma } from '@/lib/prisma'
import PageWrapper from '@/app/components/PageWrapper'
import EmptyState from '@/app/components/EmptyState'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Calendar, ShoppingCart, Copy, Tag } from 'lucide-react'
import { deleteRealized } from '@/app/actions/realized'
import { cloneExpense } from '@/app/actions/clone'

import { verifySession } from '@/app/lib/auth'
import { redirect } from 'next/navigation'

export default async function RealizedPage() {
    const session = await verifySession()
    if (!session) redirect('/login')

    const expenses = await prisma.realizedExpense.findMany({
        where: { userId: session.userId },
        orderBy: { date: 'desc' }
    })

    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0)

    return (
        <PageWrapper className="flex flex-col gap-6 py-8 pb-32 max-w-md mx-auto">
            <header className="flex items-center gap-4 px-2">
                <Link href="/" className="btn btn-outline h-10 w-10 p-0 rounded-full border-slate-200">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Expenses</h1>
            </header>

            {/* Summary */}
            <section className="card bg-white border-slate-200 p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-rose-600">
                    <ShoppingCart size={100} />
                </div>
                <div className="relative z-10">
                    <p className="text-slate-500 text-sm font-medium mb-1">Total Realized</p>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{formatCurrency(totalSpent)}</h2>
                </div>
            </section>

            {/* List */}
            <section className="flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">History</h3>
                </div>
                {expenses.map((exp) => (
                    <div key={exp.id} className="card p-4 flex justify-between items-start hover:bg-slate-50 transition duration-200 group bg-white border-slate-100 shadow-sm">
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 text-base">{exp.category}</h3>
                            {exp.source && <p className="text-xs text-slate-500 mt-0.5">{exp.source}</p>}

                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(exp.date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <p className="font-bold text-rose-600 font-mono">
                                -{formatCurrency(exp.amount)}
                            </p>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <form action={cloneExpense.bind(null, exp.id)}>
                                    <button className="h-8 w-8 flex items-center justify-center text-indigo-500 hover:bg-indigo-50 rounded-md transition" title="Clone">
                                        <Copy size={14} />
                                    </button>
                                </form>
                                <form action={deleteRealized.bind(null, exp.id)}>
                                    <button className="h-8 w-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition" title="Delete">
                                        <Trash2 size={14} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}
                {expenses.length === 0 && (
                    <EmptyState
                        icon={ShoppingCart}
                        title="No Expenses Logged"
                        description="Track your spending to see where your money goes."
                        actionLabel="Log Expense"
                        actionLink="/realized/new"
                    />
                )}
            </section>

            <Link href="/realized/new" className="fab shadow-rose-500/30 bg-rose-600 hover:bg-rose-700">
                <Plus size={28} />
            </Link>
        </PageWrapper>
    )
}
