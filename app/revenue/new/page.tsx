import Link from 'next/link'
import { ArrowLeft, Save, DollarSign } from 'lucide-react'
import { createRevenue } from '@/app/actions/revenue'
import PageWrapper from '@/app/components/PageWrapper'

export const dynamic = 'force-dynamic'

export default function NewRevenuePage() {
    return (
        <PageWrapper className="flex flex-col gap-6 py-8 pb-32 max-w-md mx-auto">
            <header className="flex items-center gap-4 px-2">
                <Link href="/revenue" className="btn btn-outline h-10 w-10 p-0 rounded-full border-slate-200">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Add Revenue</h1>
            </header>

            <form action={createRevenue} className="flex flex-col gap-6">
                <div className="card p-6 flex flex-col gap-5 bg-white border-slate-200 shadow-sm">

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Source Name</label>
                        <input name="source" type="text" placeholder="e.g. Salary, Freelance" className="input bg-white border-slate-300 focus:border-indigo-500 text-slate-900" required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Amount (IDR)</label>
                        <div className="relative">
                            <div className="absolute left-3 top-2.5 text-slate-500">
                                <DollarSign size={16} />
                            </div>
                            <input name="amount" type="number" placeholder="0" className="input pl-9 text-lg font-semibold bg-white border-slate-300 focus:border-indigo-500 text-slate-900" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Description (Optional)</label>
                        <textarea name="description" rows={3} placeholder="Notes..." className="input bg-white border-slate-300 focus:border-indigo-500 text-slate-900 min-h-[80px]"></textarea>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-slate-700">Status</label>
                        <div className="grid grid-cols-3 gap-3">
                            <label className="cursor-pointer">
                                <input type="radio" name="status" value="PENDING" className="peer sr-only" defaultChecked />
                                <div className="py-2 px-3 text-center rounded-md border border-slate-200 text-sm font-medium text-slate-500 peer-checked:bg-amber-50 peer-checked:border-amber-200 peer-checked:text-amber-600 transition-all hover:bg-slate-50">
                                    Pending
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="status" value="PAID_CASH" className="peer sr-only" />
                                <div className="py-2 px-3 text-center rounded-md border border-slate-200 text-sm font-medium text-slate-500 peer-checked:bg-emerald-50 peer-checked:border-emerald-200 peer-checked:text-emerald-600 transition-all hover:bg-slate-50">
                                    Cash
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="status" value="PAID_TF" className="peer sr-only" />
                                <div className="py-2 px-3 text-center rounded-md border border-slate-200 text-sm font-medium text-slate-500 peer-checked:bg-blue-50 peer-checked:border-blue-200 peer-checked:text-blue-600 transition-all hover:bg-slate-50">
                                    Transfer
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-full py-6 text-base shadow-lg shadow-indigo-500/20">
                    <Save className="mr-2" size={18} /> Save Revenue
                </button>
            </form>
        </PageWrapper>
    )
}
