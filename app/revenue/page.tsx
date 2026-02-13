import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, CheckCircle2, Smartphone, Copy, Clock, DollarSign } from 'lucide-react'
import { deleteRevenue } from '@/app/actions/revenue'
import { cloneRevenue } from '@/app/actions/clone'
import { Revenue } from '@prisma/client'
import PageWrapper from '@/app/components/PageWrapper'
import EmptyState from '@/app/components/EmptyState'

import { verifySession } from '@/app/lib/auth'
import { redirect } from 'next/navigation'

export default async function RevenuePage() {
    const session = await verifySession()
    if (!session) redirect('/login')

    const revenues: Revenue[] = await prisma.revenue.findMany({
        where: { userId: session.userId },
        orderBy: { date: 'desc' }
    })

    const total = revenues.reduce((acc: number, curr: Revenue) => acc + curr.amount, 0)
    const paid = revenues
        .filter(r => r.status !== 'PENDING')
        .reduce((acc: number, curr: Revenue) => acc + curr.amount, 0)

    return (
        <PageWrapper className="flex flex-col gap-6 py-8 pb-32 max-w-md mx-auto">
            {/* Header */}
            <header className="flex items-center gap-4 px-2">
                <Link href="/" className="btn btn-outline h-10 w-10 p-0 rounded-full border-slate-200">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Revenue</h1>
            </header>

            {/* Summary Card */}
            <section className="card bg-white border-slate-200 p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-emerald-600">
                    <DollarSign size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{formatCurrency(total)}</h2>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <p className="text-slate-500 text-xs">Realized (Paid)</p>
                            <span className="text-emerald-600 font-mono font-medium text-sm">{formatCurrency(paid)}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                                style={{ width: `${total ? (paid / total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Revenue List */}
            <section className="flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Transactions</h3>
                </div>

                {revenues.length === 0 ? (
                    <EmptyState
                        icon={DollarSign}
                        title="No Revenue Yet"
                        description="Start tracking your income sources here."
                        actionLabel="Add Revenue"
                        actionLink="/revenue/new"
                    />
                ) : (
                    revenues.map((rev: Revenue) => (
                        <RevenueItem key={rev.id} revenue={rev} />
                    ))
                )}
            </section>

            {/* FAB */}
            <Link href="/revenue/new" className="fab shadow-indigo-500/30">
                <Plus size={28} />
            </Link>
        </PageWrapper>
    )
}

function RevenueItem({ revenue }: { revenue: Revenue }) {
    return (
        <div className="card p-4 flex justify-between items-start hover:bg-slate-50 transition duration-200 group border-slate-100 bg-white shadow-sm">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900">{revenue.source}</span>
                    <StatusBadge status={revenue.status} />
                </div>
                <p className="text-xs text-slate-500">{revenue.description || 'No description'}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                    <Clock size={12} />
                    <span>{new Date(revenue.date).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-3">
                <span className="font-bold text-emerald-600 font-mono">
                    +{formatCurrency(revenue.amount)}
                </span>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <form action={cloneRevenue.bind(null, revenue.id)}>
                        <button className="h-8 w-8 flex items-center justify-center text-indigo-500 hover:bg-indigo-50 rounded-md transition" title="Clone">
                            <Copy size={14} />
                        </button>
                    </form>
                    <form action={deleteRevenue.bind(null, revenue.id)}>
                        <button className="h-8 w-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition" title="Delete">
                            <Trash2 size={14} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'PAID_CASH') {
        return <span className="badge badge-success flex items-center gap-1"><CheckCircle2 size={10} /> Cash</span>
    }
    if (status === 'PAID_TF') {
        return <span className="badge badge-default bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1"><Smartphone size={10} /> Transfer</span>
    }
    return <span className="badge badge-warning flex items-center gap-1"><Clock size={10} /> Pending</span>
}
