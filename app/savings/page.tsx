import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, CreditCard, Target, PiggyBank, TrendingUp, Repeat } from 'lucide-react'
import { deleteSaving, addMoneyToSaving, updateInvestmentValue } from '@/app/actions/savings'
import { Saving } from '@prisma/client'
import PageWrapper from '@/app/components/PageWrapper'
import { verifySession } from '@/app/lib/auth'
import { redirect } from 'next/navigation'

export default async function SavingsPage() {
    const session = await verifySession()
    if (!session) redirect('/login')

    const savings = await prisma.saving.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: 'desc' }
    })

    // Calculate Total Net Worth
    const totalNetWorth = savings.reduce((acc, curr) => acc + curr.current, 0)

    // Group by Type
    const emergencyFunds = savings.filter(s => s.type === 'EMERGENCY')
    const investments = savings.filter(s => s.type === 'INVESTMENT')
    const goals = savings.filter(s => s.type === 'GOAL')

    return (
        <PageWrapper className="flex flex-col gap-8 py-8 pb-32 max-w-md mx-auto">
            <header className="flex items-center gap-4 px-2">
                <Link href="/" className="btn btn-outline h-10 w-10 p-0 rounded-full border-slate-200">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Assets & Savings</h1>
            </header>

            {/* Net Worth Card */}
            <section className="card bg-slate-900 border-slate-800 p-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 p-6 opacity-10 text-emerald-400">
                    <PiggyBank size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Total Net Worth</p>
                        <h2 className="text-3xl font-bold text-white tracking-tight">{formatCurrency(totalNetWorth)}</h2>
                    </div>
                </div>
            </section>

            {/* 1. EMERGENCY FUNDS */}
            {emergencyFunds.length > 0 && (
                <section className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-rose-500 uppercase tracking-wider px-1">Emergency Funds</h3>
                    {emergencyFunds.map(fund => (
                        <SavingCard key={fund.id} saving={fund} type="EMERGENCY" />
                    ))}
                </section>
            )}

            {/* 2. INVESTMENTS */}
            {investments.length > 0 && (
                <section className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-blue-500 uppercase tracking-wider px-1">Investments</h3>
                    {investments.map(inv => (
                        <InvestmentCard key={inv.id} saving={inv} />
                    ))}
                </section>
            )}

            {/* 3. GOALS */}
            {goals.length > 0 && (
                <section className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider px-1">Saving Goals</h3>
                    {goals.map(goal => (
                        <SavingCard key={goal.id} saving={goal} type="GOAL" />
                    ))}
                </section>
            )}

            {savings.length === 0 && (
                <div className="card p-12 text-center text-slate-500 border-2 border-dashed border-slate-200 bg-slate-50">
                    No assets found. Start building your wealth!
                </div>
            )}

            <Link href="/savings/new" className="fab shadow-emerald-500/30 bg-emerald-600 hover:bg-emerald-700">
                <Plus size={28} />
            </Link>
        </PageWrapper>
    )
}

function SavingCard({ saving, type }: { saving: Saving, type: string }) {
    const progress = (saving.current / saving.target) * 100
    const colorClass = type === 'EMERGENCY' ? 'bg-rose-500' : 'bg-emerald-500' // Progress bar color

    return (
        <div className="card p-4 hover:bg-slate-50 transition duration-200 group bg-white border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        {type === 'EMERGENCY' ? <CreditCard size={20} /> : <Target size={20} />}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">{saving.name}</h3>
                        <p className="text-xs text-slate-500">{formatCurrency(saving.current)} / {formatCurrency(saving.target)}</p>
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <form action={deleteSaving.bind(null, saving.id)}>
                        <button className="h-8 w-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition">
                            <Trash2 size={14} />
                        </button>
                    </form>
                </div>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                <div
                    className={`${colorClass} h-full transition-all duration-500 rounded-full`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
            </div>

            {/* Deposit Form */}
            <form action={addMoneyToSaving.bind(null, saving.id)} className="flex gap-2">
                <input
                    type="number"
                    name="amount"
                    placeholder="Deposit..."
                    className="input h-8 text-xs bg-slate-50 border-slate-200"
                    step="0.01"
                    required
                />
                <button className="btn btn-primary h-8 w-8 p-0 shrink-0">
                    <Plus size={14} />
                </button>
            </form>
        </div>
    )
}

function InvestmentCard({ saving }: { saving: Saving }) {
    // For investments, we only show current value and allow updating it (Mark-to-Market)
    // Or adding capital (Deposit). dealing with both is complex UI.
    // Let's provide "Deposit" (Buy) AND "Update Value" (Fluctuation).

    return (
        <div className="card p-4 hover:bg-slate-50 transition duration-200 group bg-white border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">{saving.name}</h3>
                        <p className="text-xs text-slate-500">Current Value</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-slate-900 text-lg">{formatCurrency(saving.current)}</p>
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <form action={deleteSaving.bind(null, saving.id)}>
                            <button className="h-8 w-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition">
                                <Trash2 size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Buy / Deposit */}
                <form action={addMoneyToSaving.bind(null, saving.id)} className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wide">Buy / Deposit</label>
                    <div className="flex gap-1">
                        <input type="number" name="amount" placeholder="0" className="input h-8 text-xs bg-slate-50 border-slate-200" required />
                        <button className="btn btn-primary h-8 w-8 p-0 shrink-0 bg-emerald-600 hover:bg-emerald-700">
                            <Plus size={14} />
                        </button>
                    </div>
                </form>

                {/* Market Update */}
                <form action={updateInvestmentValue.bind(null, saving.id)} className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wide">Update Market Value</label>
                    <div className="flex gap-1">
                        <input type="number" name="amount" placeholder="New Value" className="input h-8 text-xs bg-slate-50 border-slate-200" required />
                        <button className="btn btn-outline h-8 w-8 p-0 shrink-0 border-slate-200 hover:bg-slate-100">
                            <Repeat size={14} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
