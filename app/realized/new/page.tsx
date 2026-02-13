import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Save, ShoppingCart } from 'lucide-react'
import { createRealized } from '@/app/actions/realized'
import PageWrapper from '@/app/components/PageWrapper'

import { verifySession } from '@/app/lib/auth'
import { redirect } from 'next/navigation'

export default async function NewRealizedPage() {
    const session = await verifySession()
    if (!session) redirect('/login')

    const allocations = await prisma.allocationPlan.findMany({
        where: { userId: session.userId },
        orderBy: { category: 'asc' }
    })

    return (
        <PageWrapper className="flex flex-col gap-6 py-8 pb-32 max-w-md mx-auto">
            <header className="flex items-center gap-4 px-2">
                <Link href="/realized" className="btn btn-outline h-10 w-10 p-0 rounded-full border-slate-200">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Log Expense</h1>
            </header>

            <form action={createRealized} className="flex flex-col gap-6">
                <div className="card p-6 flex flex-col gap-5 bg-white border-slate-200 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Category / Plan</label>
                        <select name="category" className="input bg-white border-slate-300 focus:border-indigo-500 text-slate-900" defaultValue="">
                            <option value="" disabled>Select a Plan (Optional)</option>
                            {allocations.map((plan: any) => (
                                <option key={plan.id} value={plan.category}>
                                    {plan.category} ({plan.frequency})
                                </option>
                            ))}
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Amount Spent</label>
                        <div className="relative">
                            <div className="absolute left-3 top-2.5 text-slate-500">
                                <ShoppingCart size={16} />
                            </div>
                            <input name="amount" type="number" placeholder="0" className="input pl-9 text-lg font-semibold bg-white border-slate-300 focus:border-indigo-500 text-slate-900" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Source / Merchant</label>
                        <input name="source" type="text" placeholder="e.g. Starbucks, Indomaret" className="input bg-white border-slate-300 focus:border-indigo-500 text-slate-900" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Description</label>
                        <textarea name="description" rows={3} placeholder="Notes..." className="input bg-white border-slate-300 focus:border-indigo-500 text-slate-900 min-h-[80px]"></textarea>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-full py-6 text-base bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/20">
                    <Save className="mr-2" size={18} /> Log Expense
                </button>
            </form>
        </PageWrapper>
    )
}
