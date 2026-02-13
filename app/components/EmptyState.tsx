import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    actionLink?: string
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionLink }: EmptyStateProps) {
    return (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 bg-slate-50/50">
            <div className="h-16 w-16 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                <Icon size={32} strokeWidth={1.5} />
            </div>
            <div className="max-w-xs">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
            {actionLabel && actionLink && (
                <Link href={actionLink} className="btn btn-outline text-indigo-600 border-indigo-200 hover:bg-indigo-50 mt-2 bg-white">
                    {actionLabel}
                </Link>
            )}
        </div>
    )
}
