import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Repeat, Wallet } from 'lucide-react'
import { deleteAllocation } from '@/app/actions/allocation'
import { AllocationPlan } from '@prisma/client'
import PageWrapper from '@/app/components/PageWrapper'
import EmptyState from '@/app/components/EmptyState'

function calculateMonthly(amount: number, frequency: string): number {
    switch (frequency) {
        case 'DAILY': return amount * 30;
        case 'WEEKLY': return amount * 4;
        case 'MONTHLY': return amount;
        case 'ONE_TIME': return amount;
        default: return 0;
    }
}

import { verifySession } from '@/app/lib/auth'
import { redirect } from 'next/navigation'

export default async function AllocationPage() {
    const session = await verifySession()
    if (!session) redirect('/login')

    const allocations: AllocationPlan[] = await prisma.allocationPlan.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: 'desc' }
    })

    const totalMonthlyPlan = allocations.reduce((acc: number, curr: AllocationPlan) => {
        return acc + calculateMonthly(curr.amount, curr.frequency)
    }, 0)

    return (
        <PageWrapper className="flex flex-col gap-6 py-8 pb-32 max-w-md mx-auto">
            <header className="flex items-center gap-4 px-2">
                <Link href="/" className="btn btn-outline h-10 w-10 p-0 rounded-full border-slate-200">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Allocation Plan</h1>
            </header>

            {/* Summary */}
            <section className="card bg-purple-50 border-purple-200 p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-6 opacity-10 text-purple-600">
                    <Wallet size={100} />
                </div>
                <div className="relative z-10">
                    <p className="text-purple-700 text-sm font-medium mb-1">Total Budget (Monthly)</p>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{formatCurrency(totalMonthlyPlan)}</h2>
                    <p className="text-xs text-purple-600/80 mt-2 max-w-[80%]">Estimated monthly spending based on your current plans.</p>
                </div>
            </section>

            {/* List */}
            <section className="flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Plans</h3>
                </div>

                {allocations.map((plan: AllocationPlan) => (
                    <div key={plan.id} className="card p-4 flex justify-between items-center hover:bg-slate-50 transition duration-200 group bg-white border-slate-100 shadow-sm">
                        <div>
                            <h3 className="font-semibold text-slate-900 text-base">{plan.category}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium flex items-center gap-1 border border-slate-200">
                                    <Repeat size={10} /> {plan.frequency}
                                </span>
                                <span>{formatCurrency(plan.amount)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <p className="font-bold text-purple-600 font-mono">
                                {formatCurrency(calculateMonthly(plan.amount, plan.frequency))}
                                <span className="text-xs text-slate-400 block font-sans font-normal text-right">/mo</span>
                            </p>
                            <form action={deleteAllocation.bind(null, plan.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="h-8 w-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition">
                                    <Trash2 size={14} />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
                {allocations.length === 0 && (
                    <EmptyState
                        icon={Wallet}
                        title="No Allocation Plans"
                        description="Create a budget plan to track your spending limits."
                        actionLabel="Create Plan"
                        actionLink="/allocation/new"
                    />
                )}
            </section>

            <Link href="/allocation/new" className="fab shadow-purple-500/30 bg-purple-600 hover:bg-purple-700">
                <Plus size={28} />
            </Link>
        </PageWrapper>
    )
}
