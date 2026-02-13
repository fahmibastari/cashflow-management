import Link from 'next/link'
import { ArrowLeft, Save, Target } from 'lucide-react'
import { createSaving } from '@/app/actions/savings'
import PageWrapper from '@/app/components/PageWrapper'

export const dynamic = 'force-dynamic'

export default function NewSavingPage() {
    return (
        <PageWrapper className="flex flex-col gap-6 py-8 pb-32 max-w-md mx-auto">
            <header className="flex items-center gap-4 px-2">
                <Link href="/savings" className="btn btn-outline h-10 w-10 p-0 rounded-full border-slate-200">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">New Saving Goal</h1>
            </header>

            <form action={createSaving} className="flex flex-col gap-6">
                <div className="card p-6 flex flex-col gap-5 bg-white border-slate-200 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Goal Name</label>
                        <input name="name" type="text" placeholder="e.g. New Laptop, Holiday" className="input bg-white border-slate-300 focus:border-indigo-500 text-slate-900" required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Asset Type</label>
                        <select name="type" className="input bg-white border-slate-300 focus:border-indigo-500 text-slate-900" defaultValue="GOAL">
                            <option value="GOAL">Saving Goal (Stable)</option>
                            <option value="EMERGENCY">Emergency Fund (Safety)</option>
                            <option value="INVESTMENT">Investment (Fluctuating)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Target Amount</label>
                        <div className="relative">
                            <div className="absolute left-3 top-2.5 text-slate-500">
                                <Target size={16} />
                            </div>
                            <input name="target" type="number" placeholder="0" className="input pl-9 text-lg font-semibold bg-white border-slate-300 focus:border-indigo-500 text-slate-900" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Initial Deposit (Optional)</label>
                        <input name="current" type="number" placeholder="0" className="input bg-white border-slate-300 focus:border-indigo-500 text-slate-900" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Notes</label>
                        <textarea name="notes" rows={3} placeholder="Goal details..." className="input bg-white border-slate-300 focus:border-indigo-500 text-slate-900 min-h-[80px]"></textarea>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-full py-6 text-base bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                    <Save className="mr-2" size={18} /> Create Goal
                </button>
            </form>
        </PageWrapper>
    )
}
