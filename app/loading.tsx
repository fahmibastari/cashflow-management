import PageWrapper from '@/app/components/PageWrapper'
import { Wallet } from 'lucide-react'

export default function Loading() {
    return (
        <PageWrapper className="flex flex-col gap-8 py-8 pb-32 max-w-md mx-auto">
            {/* Header Skeleton */}
            <header className="flex justify-between items-end px-2 animate-pulse">
                <div className="flex flex-col gap-2">
                    <div className="h-8 w-32 bg-slate-200 rounded-md"></div>
                    <div className="h-4 w-24 bg-slate-100 rounded-md"></div>
                </div>
                <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
            </header>

            {/* Balance Card Skeleton */}
            <section className="card bg-slate-100 border-slate-200 shadow-sm h-64 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    <Wallet size={48} className="opacity-20" />
                </div>
            </section>

            {/* Actions Skeleton */}
            <section className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 rounded-xl bg-slate-50 border border-slate-100 animate-pulse"></div>
                ))}
            </section>
        </PageWrapper>
    )
}
