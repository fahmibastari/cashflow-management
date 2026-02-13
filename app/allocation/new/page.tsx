import Link from 'next/link'
import { ArrowLeft, Save, Wallet } from 'lucide-react'
import { createAllocation } from '@/app/actions/allocation'
import PageWrapper from '@/app/components/PageWrapper'

export default function NewAllocationPage() {
    return (
        <PageWrapper className="flex flex-col gap-6 py-8 pb-32 max-w-md mx-auto">
            <header className="flex items-center gap-4 px-2">
                <Link href="/allocation" className="btn btn-outline h-10 w-10 p-0 rounded-full border-slate-200">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">New Plan</h1>
            </header>

            <form action={createAllocation} className="flex flex-col gap-6">
                <div className="card p-6 flex flex-col gap-5 bg-white border-slate-200 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Category Name</label>
                        <input name="category" type="text" placeholder="e.g. Food, Transport" className="input bg-white border-slate-300 focus:border-indigo-500 text-slate-900" required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Amount per Frequency</label>
                        <div className="relative">
                            <div className="absolute left-3 top-2.5 text-slate-500">
                                <Wallet size={16} />
                            </div>
                            <input name="amount" type="number" placeholder="0" className="input pl-9 text-lg font-semibold bg-white border-slate-300 focus:border-indigo-500 text-slate-900" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-slate-700">Frequency</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME'].map((freq) => (
                                <label key={freq} className="cursor-pointer">
                                    <input type="radio" name="frequency" value={freq} className="peer sr-only" defaultChecked={freq === 'MONTHLY'} />
                                    <div className="py-2 px-3 text-center rounded-md border border-slate-200 text-sm font-medium text-slate-500 peer-checked:bg-purple-50 peer-checked:border-purple-200 peer-checked:text-purple-600 transition-all hover:bg-slate-50 lowercase first-letter:capitalize">
                                        {freq.replace('_', ' ')}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
                        <textarea name="notes" rows={3} placeholder="Plan details..." className="input bg-white border-slate-300 focus:border-indigo-500 text-slate-900 min-h-[80px]"></textarea>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-full py-6 text-base bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20">
                    <Save className="mr-2" size={18} /> Create Plan
                </button>
            </form>
        </PageWrapper>
    )
}
